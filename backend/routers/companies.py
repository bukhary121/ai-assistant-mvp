"""
Companies router - CRUD operations for company data
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ..database.database import get_db
from ..models.company import (
    Company as CompanyModel,
    CompanyContact as CompanyContactModel,
    CompanyProject as CompanyProjectModel,
    CompanyAnalytics as CompanyAnalyticsModel,
    Industry as IndustryModel,
)
from ..schemas.company import (
    Company,
    CompanyCreate,
    CompanyUpdate,
    CompanyListResponse,
    CompanyContact,
    CompanyContactCreate,
    CompanyProject,
    CompanyProjectCreate,
    Industry,
    IndustryCreate,
    IndustryUpdate,
)

router = APIRouter()


# Industry endpoints
@router.post("/industries/", response_model=Industry, status_code=status.HTTP_201_CREATED)
async def create_industry(industry: IndustryCreate, db: Session = Depends(get_db)):
    """Create a new industry"""
    db_industry = IndustryModel(**industry.model_dump())
    db.add(db_industry)
    db.commit()
    db.refresh(db_industry)
    return db_industry


@router.get("/industries/", response_model=List[Industry])
async def get_industries(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get list of industries"""
    query = db.query(IndustryModel)
    
    if category:
        query = query.filter(IndustryModel.category == category)
    
    industries = query.offset(skip).limit(limit).all()
    return industries


@router.get("/industries/{industry_id}", response_model=Industry)
async def get_industry(industry_id: int, db: Session = Depends(get_db)):
    """Get a specific industry"""
    industry = db.query(IndustryModel).filter(IndustryModel.id == industry_id).first()
    if not industry:
        raise HTTPException(status_code=404, detail="Industry not found")
    return industry


@router.put("/industries/{industry_id}", response_model=Industry)
async def update_industry(
    industry_id: int, industry: IndustryUpdate, db: Session = Depends(get_db)
):
    """Update an industry"""
    db_industry = db.query(IndustryModel).filter(IndustryModel.id == industry_id).first()
    if not db_industry:
        raise HTTPException(status_code=404, detail="Industry not found")
    
    for key, value in industry.model_dump(exclude_unset=True).items():
        setattr(db_industry, key, value)
    
    db.commit()
    db.refresh(db_industry)
    return db_industry


@router.delete("/industries/{industry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_industry(industry_id: int, db: Session = Depends(get_db)):
    """Delete an industry"""
    db_industry = db.query(IndustryModel).filter(IndustryModel.id == industry_id).first()
    if not db_industry:
        raise HTTPException(status_code=404, detail="Industry not found")
    
    db.delete(db_industry)
    db.commit()
    return


# Company endpoints
@router.post("/", response_model=Company, status_code=status.HTTP_201_CREATED)
async def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    """Create a new company"""
    # Verify industry exists
    industry = db.query(IndustryModel).filter(IndustryModel.id == company.industry_id).first()
    if not industry:
        raise HTTPException(status_code=400, detail="Industry not found")
    
    db_company = CompanyModel(**company.model_dump())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    
    # Load industry info
    db_company.industry = industry
    
    return db_company


@router.get("/", response_model=CompanyListResponse)
async def get_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=1000),
    industry_id: Optional[int] = None,
    region: Optional[str] = None,
    city: Optional[str] = None,
    company_size: Optional[str] = None,
    verified: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get list of companies with filtering"""
    query = db.query(CompanyModel)
    
    # Apply filters
    if industry_id:
        query = query.filter(CompanyModel.industry_id == industry_id)
    
    if region:
        query = query.filter(CompanyModel.region == region)
    
    if city:
        query = query.filter(CompanyModel.city == city)
    
    if company_size:
        query = query.filter(CompanyModel.company_size == company_size)
    
    if verified is not None:
        query = query.filter(CompanyModel.verified == verified)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            CompanyModel.name_ar.ilike(search_pattern) |
            CompanyModel.name_en.ilike(search_pattern) |
            CompanyModel.trade_name.ilike(search_pattern)
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    companies = query.offset(skip).limit(limit).all()
    
    # Load industry info for each company
    for company in companies:
        company.industry = db.query(IndustryModel).filter(
            IndustryModel.id == company.industry_id
        ).first()
    
    return {
        "companies": companies,
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "total_pages": (total + limit - 1) // limit,
    }


@router.get("/{company_id}", response_model=Company)
async def get_company(company_id: int, db: Session = Depends(get_db)):
    """Get a specific company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Load industry info
    company.industry = db.query(IndustryModel).filter(
        IndustryModel.id == company.industry_id
    ).first()
    
    return company


@router.put("/{company_id}", response_model=Company)
async def update_company(
    company_id: int, company: CompanyUpdate, db: Session = Depends(get_db)
):
    """Update a company"""
    db_company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Verify industry exists if updating
    if company.industry_id:
        industry = db.query(IndustryModel).filter(
            IndustryModel.id == company.industry_id
        ).first()
        if not industry:
            raise HTTPException(status_code=400, detail="Industry not found")
    
    for key, value in company.model_dump(exclude_unset=True).items():
        setattr(db_company, key, value)
    
    db.commit()
    db.refresh(db_company)
    
    # Load industry info
    db_company.industry = db.query(IndustryModel).filter(
        IndustryModel.id == db_company.industry_id
    ).first()
    
    return db_company


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int, db: Session = Depends(get_db)):
    """Delete a company"""
    db_company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    db.delete(db_company)
    db.commit()
    return


# Company Contact endpoints
@router.post("/{company_id}/contacts", response_model=CompanyContact, status_code=status.HTTP_201_CREATED)
async def create_company_contact(
    company_id: int, contact: CompanyContactCreate, db: Session = Depends(get_db)
):
    """Create a new contact for a company"""
    # Verify company exists
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    db_contact = CompanyContactModel(company_id=company_id, **contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.get("/{company_id}/contacts", response_model=List[CompanyContact])
async def get_company_contacts(company_id: int, db: Session = Depends(get_db)):
    """Get all contacts for a company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    contacts = db.query(CompanyContactModel).filter(
        CompanyContactModel.company_id == company_id
    ).all()
    return contacts


@router.get("/{company_id}/contacts/{contact_id}", response_model=CompanyContact)
async def get_company_contact(company_id: int, contact_id: int, db: Session = Depends(get_db)):
    """Get a specific contact for a company"""
    contact = db.query(CompanyContactModel).filter(
        CompanyContactModel.id == contact_id,
        CompanyContactModel.company_id == company_id
    ).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.put("/{company_id}/contacts/{contact_id}", response_model=CompanyContact)
async def update_company_contact(
    company_id: int, contact_id: int, contact: CompanyContactCreate, db: Session = Depends(get_db)
):
    """Update a contact for a company"""
    db_contact = db.query(CompanyContactModel).filter(
        CompanyContactModel.id == contact_id,
        CompanyContactModel.company_id == company_id
    ).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    for key, value in contact.model_dump(exclude_unset=True).items():
        setattr(db_contact, key, value)
    
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.delete("/{company_id}/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company_contact(company_id: int, contact_id: int, db: Session = Depends(get_db)):
    """Delete a contact for a company"""
    db_contact = db.query(CompanyContactModel).filter(
        CompanyContactModel.id == contact_id,
        CompanyContactModel.company_id == company_id
    ).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db.delete(db_contact)
    db.commit()
    return


# Company Project endpoints
@router.post("/{company_id}/projects", response_model=CompanyProject, status_code=status.HTTP_201_CREATED)
async def create_company_project(
    company_id: int, project: CompanyProjectCreate, db: Session = Depends(get_db)
):
    """Create a new project for a company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    db_project = CompanyProjectModel(company_id=company_id, **project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.get("/{company_id}/projects", response_model=List[CompanyProject])
async def get_company_projects(company_id: int, db: Session = Depends(get_db)):
    """Get all projects for a company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    projects = db.query(CompanyProjectModel).filter(
        CompanyProjectModel.company_id == company_id
    ).all()
    return projects


@router.get("/{company_id}/projects/{project_id}", response_model=CompanyProject)
async def get_company_project(company_id: int, project_id: int, db: Session = Depends(get_db)):
    """Get a specific project for a company"""
    project = db.query(CompanyProjectModel).filter(
        CompanyProjectModel.id == project_id,
        CompanyProjectModel.company_id == company_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{company_id}/projects/{project_id}", response_model=CompanyProject)
async def update_company_project(
    company_id: int, project_id: int, project: CompanyProjectCreate, db: Session = Depends(get_db)
):
    """Update a project for a company"""
    db_project = db.query(CompanyProjectModel).filter(
        CompanyProjectModel.id == project_id,
        CompanyProjectModel.company_id == company_id
    ).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for key, value in project.model_dump(exclude_unset=True).items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/{company_id}/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company_project(company_id: int, project_id: int, db: Session = Depends(get_db)):
    """Delete a project for a company"""
    db_project = db.query(CompanyProjectModel).filter(
        CompanyProjectModel.id == project_id,
        CompanyProjectModel.company_id == company_id
    ).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return
