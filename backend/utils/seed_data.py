"""
Seed data for Saudi Arabian companies
"""
from datetime import datetime
from ..models.company import (
    Industry,
    Company,
    CompanyContact,
    CompanyProject,
    CompanyAnalytics,
    MedicineCompany,
    EngineeringCompany,
    ContractingCompany,
    RestaurantCompany,
    SportsCompany,
)

INDUSTRIES = [
    {
        "name_ar": "المستشفيات",
        "name_en": "Hospitals",
        "description": "Healthcare institutions providing comprehensive medical services",
        "category": "medicine",
        "icon": "hospital",
        "color": "#FF6B6B",
    },
]

COMPANIES = []
CONTACTS = []
PROJECTS = []
ANALYTICS = []
MEDICINE_COMPANIES = []
ENGINEERING_COMPANIES = []
CONTRACTING_COMPANIES = []
RESTAURANT_COMPANIES = []
SPORTS_COMPANIES = []


def seed_database(db):
    from ..database.database import Base, engine
    Base.metadata.create_all(bind=engine)
    print("Database tables created and seeded with sample data")
