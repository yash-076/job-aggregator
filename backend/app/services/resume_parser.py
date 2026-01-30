import logging
import re
from typing import Set
import pdfplumber

logger = logging.getLogger(__name__)


class ResumeParser:
    """
    Extract text from PDF resumes using pdfplumber.
    """

    @staticmethod
    def extract_text(pdf_path: str) -> str:
        """
        Extract all text from a PDF resume.
        Returns cleaned text string.
        """
        try:
            text_parts = []
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
            
            full_text = "\n".join(text_parts)
            return ResumeParser._clean_text(full_text)
        
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            return ""

    @staticmethod
    def extract_text_from_bytes(pdf_bytes: bytes) -> str:
        """
        Extract text from PDF file bytes (for API upload).
        """
        try:
            import io
            text_parts = []
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
            
            full_text = "\n".join(text_parts)
            return ResumeParser._clean_text(full_text)
        
        except Exception as e:
            logger.error(f"Error extracting text from PDF bytes: {e}")
            return ""

    @staticmethod
    def _clean_text(text: str) -> str:
        """
        Clean extracted text: normalize whitespace, remove extra newlines.
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep alphanumeric and basic punctuation
        text = re.sub(r'[^\w\s\.,;:\-\+\#]', '', text)
        return text.strip()

    @staticmethod
    def extract_keywords(text: str) -> Set[str]:
        """
        Extract meaningful keywords from text (simple tokenization).
        Returns set of lowercase words, excluding common stopwords.
        """
        stopwords = {
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'have', 'had', 'were', 'been', 'this',
        }
        
        # Tokenize: split on whitespace and punctuation
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Filter: length > 2, not stopwords, alphanumeric
        keywords = {
            word for word in words
            if len(word) > 2 and word not in stopwords and word.isalnum()
        }
        
        return keywords
