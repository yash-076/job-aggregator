from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.alert_model import UserAlert
from app.models.user_model import User
from app.api.schemas import AlertCreate, AlertUpdate, AlertResponse
from app.api.auth_dependencies import get_current_user

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("", response_model=AlertResponse, status_code=201)
async def create_alert(
    alert_data: AlertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AlertResponse:
    """
    Create a new job alert for the authenticated user.
    Max 5 alerts per email.
    """
    # Verify the email matches the authenticated user
    if alert_data.email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create alerts for your own email"
        )
    
    # Check existing alerts for this email
    existing_count = db.query(UserAlert).filter_by(email=current_user.email).count()
    if existing_count >= 5:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum 5 alerts allowed per email. Current count: {existing_count}"
        )

    db_alert = UserAlert(
        email=current_user.email,
        name=alert_data.name,
        filters=alert_data.filters.model_dump(exclude_none=True),
        is_active=True,
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    
    return AlertResponse.model_validate(db_alert)


@router.get("", response_model=List[AlertResponse])
async def list_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[AlertResponse]:
    """
    Get all alerts for the authenticated user.
    Users can only view their own alerts.
    """
    alerts = db.query(UserAlert).filter_by(email=current_user.email).all()
    return [AlertResponse.model_validate(alert) for alert in alerts]


@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AlertResponse:
    """
    Get a specific alert by ID.
    Users can only view their own alerts.
    """
    alert = db.query(UserAlert).filter_by(id=alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    # Verify the alert belongs to the current user
    if alert.email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this alert"
        )
    
    return AlertResponse.model_validate(alert)


@router.put("/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_id: int,
    alert_data: AlertUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AlertResponse:
    """
    Update an existing alert.
    Users can only update their own alerts.
    """
    alert = db.query(UserAlert).filter_by(id=alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    # Verify the alert belongs to the current user
    if alert.email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this alert"
        )
    
    # Update fields if provided
    if alert_data.name is not None:
        alert.name = alert_data.name
    if alert_data.filters is not None:
        alert.filters = alert_data.filters.model_dump(exclude_none=True)
    if alert_data.is_active is not None:
        alert.is_active = alert_data.is_active
    
    db.commit()
    db.refresh(alert)
    
    return AlertResponse.model_validate(alert)


@router.delete("/{alert_id}", status_code=204)
async def delete_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete an alert.
    Users can only delete their own alerts.
    """
    alert = db.query(UserAlert).filter_by(id=alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    # Verify the alert belongs to the current user
    if alert.email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this alert"
        )
    
    db.delete(alert)
    db.commit()
