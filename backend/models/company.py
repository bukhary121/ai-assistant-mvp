"""
Company data model for Saudi Arabian businesses
"""
from sqlalchemy import Column, Integer, String, Text, Float, Date, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime


class Industry(Base):
    """Industry categories for Saudi Arabian companies"""
    __tablename__ = "industries"
    
    id = Column(Integer, primary_key=True, index=True)
    name_ar = Column(String(100), nullable=False)  # Arabic name
    name_en = Column(String(100), nullable=False)  # English name
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)  # medicine, engineering, restaurants, contracting, sports, etc.
    icon = Column(String(50), nullable=True)
    color = Column(String(20), nullable=True)
    created_at = Column(Date, default=datetime.now)
    updated_at = Column(Date, default=datetime.now, onupdate=datetime.now)
    
    # Relationship to companies
    companies = relationship("Company", back_populates="industry")


class Company(Base):
    """Saudi Arabian company data"""
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic information
    name_ar = Column(String(200), nullable=False)  # Arabic name
    name_en = Column(String(200), nullable=True)   # English name
    trade_name = Column(String(200), nullable=True)  # Trade/brand name
    
    # Registration details
    cr_number = Column(String(50), unique=True, nullable=True)  # Commercial Registration
    tax_number = Column(String(50), nullable=True)  # VAT/Tax number
    establishment_date = Column(Date, nullable=True)
    
    # Industry classification
    industry_id = Column(Integer, ForeignKey('industries.id'), nullable=False)
    industry = relationship("Industry", back_populates="companies")
    sub_industry = Column(String(100), nullable=True)
    
    # Location
    city = Column(String(100), nullable=False)
    region = Column(String(100), nullable=False)  # Saudi regions: Riyadh, Jeddah, Dammam, etc.
    district = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Contact information
    phone = Column(String(50), nullable=True)
    mobile = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    website = Column(String(200), nullable=True)
    
    # Company size and type
    company_size = Column(String(50), nullable=True)  # small, medium, large, enterprise
    company_type = Column(String(50), nullable=True)  # llc, joint_stock, sole_proprietorship, etc.
    ownership = Column(String(50), nullable=True)  # saudi, foreign, joint_venture, government
    
    # Financial data (optional)
    estimated_revenue = Column(Float, nullable=True)  # in SAR
    employee_count = Column(Integer, nullable=True)
    
    # Industry-specific fields (JSON for flexibility)
    industry_specific_data = Column(JSON, nullable=True)
    
    # Business description
    description = Column(Text, nullable=True)
    services = Column(Text, nullable=True)
    products = Column(Text, nullable=True)
    
    # Marketing and automation needs
    has_website = Column(Boolean, default=False)
    has_crm = Column(Boolean, default=False)
    has_erp = Column(Boolean, default=False)
    has_marketing_automation = Column(Boolean, default=False)
    has_ai_solutions = Column(Boolean, default=False)
    
    # Problems and challenges (for analysis)
    challenges = Column(JSON, nullable=True)  # Array of challenge strings
    automation_needs = Column(JSON, nullable=True)  # Array of automation needs
    
    # Data collection metadata
    data_source = Column(String(100), nullable=True)
    data_quality = Column(String(20), nullable=True)  # verified, unverified, estimated
    last_updated = Column(Date, default=datetime.now, onupdate=datetime.now)
    verified = Column(Boolean, default=False)
    verification_date = Column(Date, nullable=True)
    
    # Ratings and reviews
    rating = Column(Float, nullable=True)  # 1-5 stars
    review_count = Column(Integer, default=0)
    
    # Social media
    social_media = Column(JSON, nullable=True)  # {"twitter": "@handle", "linkedin": "url", ...}
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(Date, default=datetime.now)
    
    # Relationships
    contacts = relationship("CompanyContact", back_populates="company")
    projects = relationship("CompanyProject", back_populates="company")
    analytics = relationship("CompanyAnalytics", back_populates="company")


class CompanyContact(Base):
    """Contact persons within companies"""
    __tablename__ = "company_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    
    name = Column(String(100), nullable=False)
    position = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    mobile = Column(String(50), nullable=True)
    linkedin = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)
    
    company = relationship("Company", back_populates="contacts")
    created_at = Column(Date, default=datetime.now)


class CompanyProject(Base):
    """Projects executed by companies (especially for contracting/engineering)"""
    __tablename__ = "company_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    project_type = Column(String(100), nullable=True)
    status = Column(String(50), nullable=True)  # completed, ongoing, planned
    start_date = Column(Date, nullable=True)
    completion_date = Column(Date, nullable=True)
    budget = Column(Float, nullable=True)  # in SAR
    location = Column(String(200), nullable=True)
    client = Column(String(200), nullable=True)
    
    company = relationship("Company", back_populates="projects")
    created_at = Column(Date, default=datetime.now)


class CompanyAnalytics(Base):
    """Analytics and metrics for companies"""
    __tablename__ = "company_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    
    # Growth metrics
    revenue_growth = Column(Float, nullable=True)  # percentage
    employee_growth = Column(Float, nullable=True)  # percentage
    market_share = Column(Float, nullable=True)  # percentage
    
    # Digital presence
    website_traffic = Column(Integer, nullable=True)
    social_media_followers = Column(Integer, nullable=True)
    online_reputation_score = Column(Float, nullable=True)  # 1-100
    
    # Financial health
    profitability = Column(Float, nullable=True)  # percentage
    liquidity_ratio = Column(Float, nullable=True)
    debt_to_equity = Column(Float, nullable=True)
    
    # Technology adoption
    tech_adoption_score = Column(Float, nullable=True)  # 1-100
    digital_maturity = Column(String(50), nullable=True)  # beginner, intermediate, advanced, leader
    
    # Marketing effectiveness
    marketing_roi = Column(Float, nullable=True)  # percentage
    lead_conversion_rate = Column(Float, nullable=True)  # percentage
    customer_satisfaction = Column(Float, nullable=True)  # 1-5
    
    # Competitive analysis
    competitors = Column(JSON, nullable=True)  # Array of competitor IDs
    competitive_advantage = Column(Text, nullable=True)
    
    # Industry-specific metrics
    industry_metrics = Column(JSON, nullable=True)
    
    company = relationship("Company", back_populates="analytics")
    period = Column(String(20), nullable=True)  # monthly, quarterly, yearly
    period_start = Column(Date, nullable=True)
    period_end = Column(Date, nullable=True)
    created_at = Column(Date, default=datetime.now)


# Industry-specific models
class MedicineCompany(Base):
    """Extended data for medicine/healthcare companies"""
    __tablename__ = "medicine_companies"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), unique=True, nullable=False)
    
    # Specialization
    specializations = Column(JSON, nullable=True)  # Array of specializations
    medical_fields = Column(JSON, nullable=True)  # Array: hospitals, clinics, pharmacies, labs, etc.
    
    # Certifications
    has_moh_approval = Column(Boolean, default=False)  # Ministry of Health
    has_iso_certification = Column(Boolean, default=False)
    has_jci_accreditation = Column(Boolean, default=False)
    certifications = Column(JSON, nullable=True)
    
    # Services
    offers_telemedicine = Column(Boolean, default=False)
    offers_home_care = Column(Boolean, default=False)
    has_emergency_services = Column(Boolean, default=False)
    bed_capacity = Column(Integer, nullable=True)
    
    # Technology
    has_ehr_system = Column(Boolean, default=False)  # Electronic Health Records
    has_lab_management = Column(Boolean, default=False)
    has_radiology_system = Column(Boolean, default=False)
    has_pacs = Column(Boolean, default=False)
    
    # Patients
    annual_patient_volume = Column(Integer, nullable=True)
    average_patient_satisfaction = Column(Float, nullable=True)
    
    company = relationship("Company")
    created_at = Column(Date, default=datetime.now)


class EngineeringCompany(Base):
    """Extended data for engineering companies"""
    __tablename__ = "engineering_companies"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), unique=True, nullable=False)
    
    # Engineering disciplines
    disciplines = Column(JSON, nullable=True)  # civil, mechanical, electrical, etc.
    
    # Certifications and licenses
    has_saudi_council_license = Column(Boolean, default=False)
    has_iso_9001 = Column(Boolean, default=False)
    has_oshas_18001 = Column(Boolean, default=False)
    certifications = Column(JSON, nullable=True)
    
    # Services
    offers_design = Column(Boolean, default=False)
    offers_consulting = Column(Boolean, default=False)
    offers_supervision = Column(Boolean, default=False)
    offers_project_management = Column(Boolean, default=False)
    
    # Software used
    software_tools = Column(JSON, nullable=True)  # AutoCAD, Revit, BIM, etc.
    
    # Project portfolio
    completed_projects_count = Column(Integer, default=0)
    ongoing_projects_count = Column(Integer, default=0)
    
    company = relationship("Company")
    created_at = Column(Date, default=datetime.now)


class ContractingCompany(Base):
    """Extended data for contracting companies"""
    __tablename__ = "contracting_companies"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), unique=True, nullable=False)
    
    # Contracting classification
    classification = Column(String(50), nullable=True)  # general, specialized, etc.
    grade = Column(String(20), nullable=True)  # A, B, C, etc.
    
    # Certifications
    has_contractors_classification = Column(Boolean, default=False)
    has_saudi_contractors_authority = Column(Boolean, default=False)
    certifications = Column(JSON, nullable=True)
    
    # Capabilities
    max_project_value = Column(Float, nullable=True)  # in SAR
    can_handle_government_projects = Column(Boolean, default=False)
    can_handle_international_projects = Column(Boolean, default=False)
    
    # Equipment
    owns_equipment = Column(Boolean, default=False)
    equipment_list = Column(JSON, nullable=True)
    
    # Safety
    safety_rating = Column(Float, nullable=True)
    has_safety_certifications = Column(Boolean, default=False)
    
    company = relationship("Company")
    created_at = Column(Date, default=datetime.now)


class RestaurantCompany(Base):
    """Extended data for restaurants and food businesses"""
    __tablename__ = "restaurant_companies"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), unique=True, nullable=False)
    
    # Cuisine and type
    cuisine_types = Column(JSON, nullable=True)  # Array of cuisines
    restaurant_type = Column(String(50), nullable=True)  # fine_dining, casual, fast_food, cafe, etc.
    
    # Certifications
    has_food_safety_certification = Column(Boolean, default=False)
    has_halal_certification = Column(Boolean, default=False)
    certifications = Column(JSON, nullable=True)
    
    # Operations
    has_delivery = Column(Boolean, default=False)
    has_takeaway = Column(Boolean, default=False)
    has_reservations = Column(Boolean, default=False)
    has_catering = Column(Boolean, default=False)
    
    # Technology
    has_pos_system = Column(Boolean, default=False)
    has_online_ordering = Column(Boolean, default=False)
    has_inventory_management = Column(Boolean, default=False)
    
    # Capacity
    seating_capacity = Column(Integer, nullable=True)
    daily_customers = Column(Integer, nullable=True)
    
    # Ratings
    food_rating = Column(Float, nullable=True)
    service_rating = Column(Float, nullable=True)
    cleanliness_rating = Column(Float, nullable=True)
    
    # Menu
    has_digital_menu = Column(Boolean, default=False)
    menu_items_count = Column(Integer, nullable=True)
    average_price_range = Column(String(50), nullable=True)  # low, medium, high, premium
    
    company = relationship("Company")
    created_at = Column(Date, default=datetime.now)


class SportsCompany(Base):
    """Extended data for sports companies and facilities"""
    __tablename__ = "sports_companies"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), unique=True, nullable=False)
    
    # Sports types
    sports_types = Column(JSON, nullable=True)  # Array: football, basketball, fitness, etc.
    facility_type = Column(String(100), nullable=True)  # gym, stadium, club, academy, etc.
    
    # Certifications
    has_sports_authority_approval = Column(Boolean, default=False)
    has_international_standards = Column(Boolean, default=False)
    certifications = Column(JSON, nullable=True)
    
    # Facilities
    has_gym = Column(Boolean, default=False)
    has_swimming_pool = Column(Boolean, default=False)
    has_sports_hall = Column(Boolean, default=False)
    has_outdoor_fields = Column(Boolean, default=False)
    
    # Membership
    membership_count = Column(Integer, nullable=True)
    membership_fee_range = Column(String(50), nullable=True)
    
    # Technology
    has_member_management = Column(Boolean, default=False)
    has_booking_system = Column(Boolean, default=False)
    has_fitness_tracking = Column(Boolean, default=False)
    
    # Events
    hosts_events = Column(Boolean, default=False)
    events_per_year = Column(Integer, nullable=True)
    
    company = relationship("Company")
    created_at Column(Date, default=datetime.now)
