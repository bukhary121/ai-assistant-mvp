"""
Industries router - Operations for industry-specific data
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from ..database.database import get_db
from ..models.company import (
    Company as CompanyModel,
    MedicineCompany as MedicineCompanyModel,
    EngineeringCompany as EngineeringCompanyModel,
    ContractingCompany as ContractingCompanyModel,
    RestaurantCompany as RestaurantCompanyModel,
    SportsCompany as SportsCompanyModel,
)
from ..schemas.company import (
    MedicineCompany,
    MedicineCompanyCreate,
    EngineeringCompany,
    EngineeringCompanyCreate,
    ContractingCompany,
    ContractingCompanyCreate,
    RestaurantCompany,
    RestaurantCompanyCreate,
    SportsCompany,
    SportsCompanyCreate,
)

router = APIRouter()


# Medicine Companies
@router.post("/medicine/", response_model=MedicineCompany, status_code=status.HTTP_201_CREATED)
async def create_medicine_company(
    company_id: int, medicine_data: MedicineCompanyCreate, db: Session = Depends(get_db)
):
    """Create medicine-specific data for a company"""
    # Verify company exists
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Check if already exists
    existing = db.query(MedicineCompanyModel).filter(
        MedicineCompanyModel.company_id == company_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="Medicine data already exists for this company"
        )
    
    db_medicine = MedicineCompanyModel(
        company_id=company_id, **medicine_data.model_dump()
    )
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine


@router.get("/medicine/{company_id}", response_model=MedicineCompany)
async def get_medicine_company(company_id: int, db: Session = Depends(get_db)):
    """Get medicine-specific data for a company"""
    medicine_data = db.query(MedicineCompanyModel).filter(
        MedicineCompanyModel.company_id == company_id
    ).first()
    if not medicine_data:
        raise HTTPException(status_code=404, detail="Medicine data not found")
    return medicine_data


@router.put("/medicine/{company_id}", response_model=MedicineCompany)
async def update_medicine_company(
    company_id: int, medicine_data: MedicineCompanyCreate, db: Session = Depends(get_db)
):
    """Update medicine-specific data for a company"""
    db_medicine = db.query(MedicineCompanyModel).filter(
        MedicineCompanyModel.company_id == company_id
    ).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Medicine data not found")
    
    for key, value in medicine_data.model_dump(exclude_unset=True).items():
        setattr(db_medicine, key, value)
    
    db.commit()
    db.refresh(db_medicine)
    return db_medicine


@router.get("/medicine/", response_model=List[MedicineCompany])
async def get_all_medicine_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """Get all companies with medicine data"""
    medicine_companies = db.query(MedicineCompanyModel).offset(skip).limit(limit).all()
    return medicine_companies


# Engineering Companies
@router.post("/engineering/", response_model=EngineeringCompany, status_code=status.HTTP_201_CREATED)
async def create_engineering_company(
    company_id: int, engineering_data: EngineeringCompanyCreate, db: Session = Depends(get_db)
):
    """Create engineering-specific data for a company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    existing = db.query(EngineeringCompanyModel).filter(
        EngineeringCompanyModel.company_id == company_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="Engineering data already exists for this company"
        )
    
    db_engineering = EngineeringCompanyModel(
        company_id=company_id, **engineering_data.model_dump()
    )
    db.add(db_engineering)
    db.commit()
    db.refresh(db_engineering)
    return db_engineering


@router.get("/engineering/{company_id}", response_model=EngineeringCompany)
async def get_engineering_company(company_id: int, db: Session = Depends(get_db)):
    """Get engineering-specific data for a company"""
    engineering_data = db.query(EngineeringCompanyModel).filter(
        EngineeringCompanyModel.company_id == company_id
    ).first()
    if not engineering_data:
        raise HTTPException(status_code=404, detail="Engineering data not found")
    return engineering_data


@router.put("/engineering/{company_id}", response_model=EngineeringCompany)
async def update_engineering_company(
    company_id: int, engineering_data: EngineeringCompanyCreate, db: Session = Depends(get_db)
):
    """Update engineering-specific data for a company"""
    db_engineering = db.query(EngineeringCompanyModel).filter(
        EngineeringCompanyModel.company_id == company_id
    ).first()
    if not db_engineering:
        raise HTTPException(status_code=404, detail="Engineering data not found")
    
    for key, value in engineering_data.model_dump(exclude_unset=True).items():
        setattr(db_engineering, key, value)
    
    db.commit()
    db.refresh(db_engineering)
    return db_engineering


@router.get("/engineering/", response_model=List[EngineeringCompany])
async def get_all_engineering_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """Get all companies with engineering data"""
    engineering_companies = db.query(EngineeringCompanyModel).offset(skip).limit(limit).all()
    return engineering_companies


# Contracting Companies
@router.post("/contracting/", response_model=ContractingCompany, status_code=status.HTTP_201_CREATED)
async def create_contracting_company(
    company_id: int, contracting_data: ContractingCompanyCreate, db: Session = Depends(get_db)
):
    """Create contracting-specific data for a company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    existing = db.query(ContractingCompanyModel).filter(
        ContractingCompanyModel.company_id == company_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="Contracting data already exists for this company"
        )
    
    db_contracting = ContractingCompanyModel(
        company_id=company_id, **contracting_data.model_dump()
    )
    db.add(db_contracting)
    db.commit()
    db.refresh(db_contracting)
    return db_contracting


@router.get("/contracting/{company_id}", response_model=ContractingCompany)
async def get_contracting_company(company_id: int, db: Session = Depends(get_db)):
    """Get contracting-specific data for a company"""
    contracting_data = db.query(ContractingCompanyModel).filter(
        ContractingCompanyModel.company_id == company_id
    ).first()
    if not contracting_data:
        raise HTTPException(status_code=404, detail="Contracting data not found")
    return contracting_data


@router.put("/contracting/{company_id}", response_model=ContractingCompany)
async def update_contracting_company(
    company_id: int, contracting_data: ContractingCompanyCreate, db: Session = Depends(get_db)
):
    """Update contracting-specific data for a company"""
    db_contracting = db.query(ContractingCompanyModel).filter(
        ContractingCompanyModel.company_id == company_id
    ).first()
    if not db_contracting:
        raise HTTPException(status_code=404, detail="Contracting data not found")
    
    for key, value in contracting_data.model_dump(exclude_unset=True).items():
        setattr(db_contracting, key, value)
    
    db.commit()
    db.refresh(db_contracting)
    return db_contracting


@router.get("/contracting/", response_model=List[ContractingCompany])
async def get_all_contracting_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """Get all companies with contracting data"""
    contracting_companies = db.query(ContractingCompanyModel).offset(skip).limit(limit).all()
    return contracting_companies


# Restaurant Companies
@router.post("/restaurants/", response_model=RestaurantCompany, status_code=status.HTTP_201_CREATED)
async def create_restaurant_company(
    company_id: int, restaurant_data: RestaurantCompanyCreate, db: Session = Depends(get_db)
):
    """Create restaurant-specific data for a company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    existing = db.query(RestaurantCompanyModel).filter(
        RestaurantCompanyModel.company_id == company_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="Restaurant data already exists for this company"
        )
    
    db_restaurant = RestaurantCompanyModel(
        company_id=company_id, **restaurant_data.model_dump()
    )
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


@router.get("/restaurants/{company_id}", response_model=RestaurantCompany)
async def get_restaurant_company(company_id: int, db: Session = Depends(get_db)):
    """Get restaurant-specific data for a company"""
    restaurant_data = db.query(RestaurantCompanyModel).filter(
        RestaurantCompanyModel.company_id == company_id
    ).first()
    if not restaurant_data:
        raise HTTPException(status_code=404, detail="Restaurant data not found")
    return restaurant_data


@router.put("/restaurants/{company_id}", response_model=RestaurantCompany)
async def update_restaurant_company(
    company_id: int, restaurant_data: RestaurantCompanyCreate, db: Session = Depends(get_db)
):
    """Update restaurant-specific data for a company"""
    db_restaurant = db.query(RestaurantCompanyModel).filter(
        RestaurantCompanyModel.company_id == company_id
    ).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant data not found")
    
    for key, value in restaurant_data.model_dump(exclude_unset=True).items():
        setattr(db_restaurant, key, value)
    
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


@router.get("/restaurants/", response_model=List[RestaurantCompany])
async def get_all_restaurant_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """Get all companies with restaurant data"""
    restaurant_companies = db.query(RestaurantCompanyModel).offset(skip).limit(limit).all()
    return restaurant_companies


# Sports Companies
@router.post("/sports/", response_model=SportsCompany, status_code=status.HTTP_201_CREATED)
async def create_sports_company(
    company_id: int, sports_data: SportsCompanyCreate, db: Session = Depends(get_db)
):
    """Create sports-specific data for a company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    existing = db.query(SportsCompanyModel).filter(
        SportsCompanyModel.company_id == company_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="Sports data already exists for this company"
        )
    
    db_sports = SportsCompanyModel(
        company_id=company_id, **sports_data.model_dump()
    )
    db.add(db_sports)
    db.commit()
    db.refresh(db_sports)
    return db_sports


@router.get("/sports/{company_id}", response_model=SportsCompany)
async def get_sports_company(company_id: int, db: Session = Depends(get_db)):
    """Get sports-specific data for a company"""
    sports_data = db.query(SportsCompanyModel).filter(
        SportsCompanyModel.company_id == company_id
    ).first()
    if not sports_data:
        raise HTTPException(status_code=404, detail="Sports data not found")
    return sports_data


@router.put("/sports/{company_id}", response_model=SportsCompany)
async def update_sports_company(
    company_id: int, sports_data: SportsCompanyCreate, db: Session = Depends(get_db)
):
    """Update sports-specific data for a company"""
    db_sports = db.query(SportsCompanyModel).filter(
        SportsCompanyModel.company_id == company_id
    ).first()
    if not db_sports:
        raise HTTPException(status_code=404, detail="Sports data not found")
    
    for key, value in sports_data.model_dump(exclude_unset=True).items():
        setattr(db_sports, key, value)
    
    db.commit()
    db.refresh(db_sports)
    return db_sports


@router.get("/sports/", response_model=List[SportsCompany])
async def get_all_sports_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """Get all companies with sports data"""
    sports_companies = db.query(SportsCompanyModel).offset(skip).limit(limit).all()
    return sports_companies


# Industry statistics
@router.get("/statistics", response_model=Dict[str, Any])
async def get_industry_statistics(db: Session = Depends(get_db)):
    """Get statistics across all industries"""
    stats = {
        "total_companies": 0,
        "by_industry": {},
        "by_region": {},
        "by_size": {},
        "technology_adoption": {},
    }
    
    # Total companies
    stats["total_companies"] = db.query(CompanyModel).count()
    
    # By industry
    industry_counts = db.query(
        CompanyModel.industry_id,
        IndustryModel.name_en
    ).join(IndustryModel).group_by(CompanyModel.industry_id, IndustryModel.name_en).all()
    
    for industry_id, industry_name in industry_counts:
        count = db.query(CompanyModel).filter(
            CompanyModel.industry_id == industry_id
        ).count()
        stats["by_industry"][industry_name] = count
    
    # By region
    region_counts = db.query(CompanyModel.region).group_by(CompanyModel.region).all()
    for region, in region_counts:
        count = db.query(CompanyModel).filter(
            CompanyModel.region == region
        ).count()
        stats["by_region"][region] = count
    
    # By size
    size_counts = db.query(CompanyModel.company_size).group_by(
        CompanyModel.company_size
    ).all()
    for size, in size_counts:
        count = db.query(CompanyModel).filter(
            CompanyModel.company_size == size
        ).count()
        stats["by_size"][size] = count
    
    # Technology adoption
    tech_fields = ["has_website", "has_crm", "has_erp", "has_marketing_automation", "has_ai_solutions"]
    for field in tech_fields:
        count = db.query(CompanyModel).filter(getattr(CompanyModel, field) == True).count()
        stats["technology_adoption"][field] = count
    
    # Verified vs unverified
    verified_count = db.query(CompanyModel).filter(CompanyModel.verified == True).count()
    stats["verified_companies"] = verified_count
    stats["unverified_companies"] = stats["total_companies"] - verified_count
    
    return stats
