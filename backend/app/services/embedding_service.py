"""
Client for the embedding microservice.

Provides methods to generate vector embeddings for text using
the hosted embedding model. Used for semantic job matching.
"""

import logging
from typing import List, Optional
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# Timeout: 30s connect, 120s read (batch embedding can be slow)
TIMEOUT = httpx.Timeout(connect=30.0, read=120.0, write=30.0, pool=30.0)


class EmbeddingService:
    """
    Client for the embedding microservice.
    
    Endpoints:
      POST /embed        -> single text  -> single embedding vector
      POST /embed-batch  -> list of texts -> list of embedding vectors
    """

    def __init__(self):
        self.base_url = settings.embedding_service_url.rstrip("/")
        self.api_key = settings.embedding_api_key
        self.batch_size = settings.embedding_batch_size

    def _headers(self) -> dict:
        """Build request headers with API key."""
        return {
            "Content-Type": "application/json",
            "X-API-Key": self.api_key,
        }

    async def embed(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for a single text.
        
        Args:
            text: The text to embed (e.g., resume text).
        
        Returns:
            List of floats (embedding vector), or None if the service is unavailable.
        """
        if not text or not text.strip():
            logger.warning("Empty text provided to embed()")
            return None

        try:
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                response = await client.post(
                    f"{self.base_url}/embed",
                    headers=self._headers(),
                    json={"text": text},
                )
                response.raise_for_status()
                data = response.json()
                return data.get("embedding")

        except httpx.TimeoutException:
            logger.error("Embedding service timed out for embed()")
            return None
        except httpx.HTTPStatusError as e:
            logger.error(f"Embedding service HTTP error: {e.response.status_code} - {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"Embedding service error: {e}")
            return None

    async def embed_batch(self, texts: List[str]) -> Optional[List[List[float]]]:
        """
        Generate embeddings for multiple texts in one call.
        Automatically chunks into batches of self.batch_size.
        
        Args:
            texts: List of texts to embed (e.g., job title + description).
        
        Returns:
            List of embedding vectors (same order as input), 
            or None if the service is unavailable.
        """
        if not texts:
            return []

        all_embeddings: List[List[float]] = []

        try:
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                # Process in batches
                for i in range(0, len(texts), self.batch_size):
                    batch = texts[i : i + self.batch_size]
                    
                    response = await client.post(
                        f"{self.base_url}/embed-batch",
                        headers=self._headers(),
                        json={"texts": batch},
                    )
                    response.raise_for_status()
                    data = response.json()
                    
                    embeddings = data.get("embeddings", [])
                    if len(embeddings) != len(batch):
                        logger.error(
                            f"Embedding count mismatch: sent {len(batch)}, got {len(embeddings)}"
                        )
                        return None
                    
                    all_embeddings.extend(embeddings)

            return all_embeddings

        except httpx.TimeoutException:
            logger.error("Embedding service timed out for embed_batch()")
            return None
        except httpx.HTTPStatusError as e:
            logger.error(f"Embedding service HTTP error: {e.response.status_code} - {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"Embedding service error: {e}")
            return None

    @staticmethod
    def build_job_text(title: str, description: str) -> str:
        """
        Build the text string to embed for a job.
        Combines title + description for richer semantic matching.
        """
        parts = []
        if title:
            parts.append(title.strip())
        if description:
            parts.append(description.strip())
        return " ".join(parts)
