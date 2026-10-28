"""
Pydantic schemas for Company data
"""
from pydantic import BaseModel, Field, EmailStr, HttpUrl
from typing import Optional, List, Dict, Any, Union
from datetime import date, datetime
from enum import Enum


# Enums for standardized values
class CompanySize(str, Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ENTERPRISE = "enterprise"


class CompanyType(str, Enum):
    LLC = "llc"
    JOINT_STOCK = "joint_stock"
    SOLE_PROPRIETORSHIP = "sole_proprietorship"
    PARTNERSHIP = "partnership"
    GOVERNMENT = "government"


class OwnershipType(str, Enum):
    SAUDI = "saudi"
    FOREIGN = "foreign"
    JOINT_VENTURE = "joint_venture"
    GOVERNMENT = "government"


class DataQuality(str, Enum):
    VERIFIED = "verified"
    UNVERIFIED = "unverified"
    ESTIMATED = "estimated"


class IndustryCategory(str, Enum):
    MEDICINE = "medicine"
    ENGINEERING = "engineering"
    CONTRACTING = "contracting"
    RESTAURANTS = "restaurants"
    SPORTS = "sports"
    GENERAL = "general"


class DigitalMaturity(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    LEADER = "leader"


class ProjectStatus(str, Enum):
    PLANNED = "planned"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# Base schemas
class IndustryBase(BaseModel):
    name_ar: str = Field(..., description="Arabic name of the industry")
    name_en: str = Field(..., description="English name of the industry")
    description: Optional[str] = Field(None, description="Description of the industry")
    category: IndustryCategory = Field(..., description="Main category of the industry")
    icon: Optional[str] = Field(None, description="Icon name for UI")
    color: Optional[str] = Field(None, description="Color code for UI")


class IndustryCreate(IndustryBase):
    pass


class IndustryUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    category: Optional[IndustryCategory] = None
    icon: Optional[str] = None
    color: Optional[str] = None


class Industry(IndustryBase):
    id: int
    created_at: date
    updated_at: date
    
    class Config:
        from_attributes = True


# Company schemas
class CompanyBase(BaseModel):
    name_ar: str = Field(..., description="Arabic name of the company")
    name_en: Optional[str] = Field(None, description="English name of the company")
    trade_name: Optional[str] = Field(None, description="Trade or brand name")
    
    # Registration
    cr_number: Optional[str] = Field(None, description="Commercial Registration number")
    tax_number: Optional[str] = Field(None, description="VAT/Tax number")
    establishment_date: Optional[date] = Field(None, description="Date of establishment")
    
    # Industry
    industry_id: int = Field(..., description="ID of the industry")
    sub_industry: Optional[str] = Field(None, description="Sub-industry classification")
    
    # Location
    city: str = Field(..., description="City where company is located")
    region: str = Field(..., description="Region (e.g., Riyadh, Jeddah, Dammam)")
    district: Optional[str] = Field(None, description="District or neighborhood")
    address: Optional[str] = Field(None, description="Full address")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")
    
    # Contact
    phone: Optional[str] = Field(None, description="Phone number")
    mobile: Optional[str] = Field(None, description="Mobile number")
    email: Optional[EmailStr] = Field(None, description="Email address")
    website: Optional[HttpUrl] = Field(None, description="Website URL")
    
    # Company profile
    company_size: Optional[CompanySize] = Field(None, description="Size of the company")
    company_type: Optional[CompanyType] = Field(None, description="Legal type of company")
    ownership: Optional[OwnershipType] = Field(None, description="Ownership type")
    
    # Financial
    estimated_revenue: Optional[float] = Field(None, description="Estimated annual revenue in SAR")
    employee_count: Optional[int] = Field(None, description="Number of employees")
    
    # Industry-specific data
    industry_specific_data: Optional[Dict[str, Any]] = Field(None, description="Industry-specific fields")
    
    # Description
    description: Optional[str] = Field(None, description="Company description")
    services: Optional[str] = Field(None, description="Services offered")
    products: Optional[str] = Field(None, description="Products offered")
    
    # Technology adoption
    has_website: bool = Field(False, description="Has a website")
    has_crm: bool = Field(False, description="Has CRM system")
    has_erp: bool = Field(False, description="Has ERP system")
    has_marketing_automation: bool = Field(False, description="Has marketing automation")
    has_ai_solutions: bool = Field(False, description="Has AI solutions")
    
    # Challenges and needs
    challenges: Optional[List[str]] = Field(None, description="List of challenges faced")
    automation_needs: Optional[List[str]] = Field(None, description="List of automation needs")
    
    # Data metadata
    data_source: Optional[str] = Field(None, description="Source of the data")
    data_quality: Optional[DataQuality] = Field(None, description="Quality of the data")
    verified: bool = Field(False, description="Is the data verified")
    verification_date: Optional[date] = Field(None, description="Date of verification")
    
    # Ratings
    rating: Optional[float] = Field(None, description="Overall rating (1-5)")
    review_count: int = Field(0, description="Number of reviews")
    
    # Social media
    social_media: Optional[Dict[str, str]] = Field(None, description="Social media links")


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    trade_name: Optional[str] = None
    cr_number: Optional[str] = None
    tax_number: Optional[str] = None
    establishment_date: Optional[date] = None
    industry_id: Optional[int] = None
    sub_industry: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[HttpUrl] = None
    company_size: Optional[CompanySize] = None
    company_type: Optional[CompanyType] = None
    ownership: Optional[OwnershipType] = None
    estimated_revenue: Optional[float] = None
    employee_count: Optional[int] = None
    industry_specific_data: Optional[Dict[str, Any]] = None
    description: Optional[str] = None
    services: Optional[str] = None
    products: Optional[str] = None
    has_website: Optional[bool] = None
    has_crm: Optional[bool] = None
    has_erp: Optional[bool] = None
    has_marketing_automation: Optional[bool] = None
    has_ai_solutions: Optional[bool] = None
    challenges: Optional[List[str]] = None
    automation_needs: Optional[List[str]] = None
    data_source: Optional[str] = None
    data_quality: Optional[DataQuality] = None
    verified: Optional[bool] = None
    verification_date: Optional[date] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    social_media: Optional[Dict[str, str]] = None


class Company(CompanyBase):
    id: int
    is_active: bool = True
    created_at: date
    last_updated: date
    
    # Industry info
    industry: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class CompanyListResponse(BaseModel):
    companies: List[Company]
    total: int
    page: int
    page_size: int
    total_pages: int


# Contact schemas
class CompanyContactBase(BaseModel):
    name: str = Field(..., description="Contact person name")
    position: Optional[str] = Field(None, description="Job position")
    department: Optional[str] = Field(None, description="Department")
    email: Optional[EmailStr] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    mobile: Optional[str] = Field(None, description="Mobile number")
    linkedin: Optional[HttpUrl] = Field(None, description="LinkedIn profile")
    notes: Optional[str] = Field(None, description="Additional notes")


class CompanyContactCreate(CompanyContactBase):
    pass


class CompanyContact(CompanyContactBase):
    id: int
    company_id: int
    created_at: date
    
    class Config:
        from_attributes = True


# Project schemas
class CompanyProjectBase(BaseModel):
    name: str = Field(..., description="Project name")
    description: Optional[str] = Field(None, description="Project description")
    project_type: Optional[str] = Field(None, description="Type of project")
    status: Optional[ProjectStatus] = Field(None, description="Project status")
    start_date: Optional[date] = Field(None, description="Start date")
    completion_date: Optional[date] = Field(None, description="Completion date")
    budget: Optional[float] = Field(None, description="Project budget in SAR")
    location: Optional[str] = Field(None, description="Project location")
    client: Optional[str] = Field(None, description="Client name")


class CompanyProjectCreate(CompanyProjectBase):
    pass


class CompanyProject(CompanyProjectBase):
    id: int
    company_id: int
    created_at: date
    
    class Config:
        from_attributes = True


# Analytics schemas
class CompanyAnalyticsBase(BaseModel):
    # Growth metrics
    revenue_growth: Optional[float] = Field(None, description="Revenue growth percentage")
    employee_growth: Optional[float] = Field(None, description="Employee growth percentage")
    market_share: Optional[float] = Field(None, description="Market share percentage")
    
    # Digital presence
    website_traffic: Optional[int] = Field(None, description="Monthly website traffic")
    social_media_followers: Optional[int] = Field(None, description="Social media followers count")
    online_reputation_score: Optional[float] = Field(None, description="Online reputation score (1-100)")
    
    # Financial health
    profitability: Optional[float] = Field(None, description="Profitability percentage")
    liquidity_ratio: Optional[float] = Field(None, description="Liquidity ratio")
    debt_to_equity: Optional[float] = Field(None, description="Debt to equity ratio")
    
    # Technology adoption
    tech_adoption_score: Optional[float] = Field(None, description="Technology adoption score (1-100)")
    digital_maturity: Optional[DigitalMaturity] = Field(None, description="Digital maturity level")
    
    # Marketing effectiveness
    marketing_roi: Optional[float] = Field(None, description="Marketing ROI percentage")
    lead_conversion_rate: Optional[float] = Field(None, description="Lead conversion rate percentage")
    customer_satisfaction: Optional[float] = Field(None, description="Customer satisfaction score (1-5)")
    
    # Competitive analysis
    competitors: Optional[List[int]] = Field(None, description="List of competitor company IDs")
    competitive_advantage: Optional[str] = Field(None, description="Competitive advantage description")
    
    # Industry-specific metrics
    industry_metrics: Optional[Dict[str, Any]] = Field(None, description="Industry-specific metrics")
    
    # Period
    period: Optional[str] = Field(None, description="Analytics period (monthly, quarterly, yearly)")
    period_start: Optional[date] = Field(None, description="Period start date")
    period_end: Optional[date] = Field(None, description="Period end date")


class CompanyAnalyticsCreate(CompanyAnalyticsBase):
    pass


class CompanyAnalytics(CompanyAnalyticsBase):
    id: int
    company_id: int
    created_at: date
    
    class Config:
        from_attributes = True


# Industry-specific schemas
class MedicineCompanyBase(BaseModel):
    # Specialization
    specializations: Optional[List[str]] = Field(None, description="Medical specializations")
    medical_fields: Optional[List[str]] = Field(None, description="Medical fields (hospitals, clinics, etc.)")
    
    # Certifications
    has_moh_approval: bool = Field(False, description="Has Ministry of Health approval")
    has_iso_certification: bool = Field(False, description="Has ISO certification")
    has_jci_accreditation: bool = Field(False, description="Has JCI accreditation")
    certifications: Optional[List[str]] = Field(None, description="List of certifications")
    
    # Services
    offers_telemedicine: bool = Field(False, description="Offers telemedicine services")
    offers_home_care: bool = Field(False, description="Offers home care services")
    has_emergency_services: bool = Field(False, description="Has emergency services")
    bed_capacity: Optional[int] = Field(None, description="Total bed capacity")
    
    # Technology
    has_ehr_system: bool = Field(False, description="Has Electronic Health Records system")
    has_lab_management: bool = Field(False, description="Has lab management system")
    has_radiology_system: bool = Field(False, description="Has radiology system")
    has_pacs: bool = Field(False, description="Has PACS system")
    
    # Patients
    annual_patient_volume: Optional[int] = Field(None, description="Annual patient volume")
    average_patient_satisfaction: Optional[float] = Field(None, description="Average patient satisfaction (1-5)")


class MedicineCompanyCreate(MedicineCompanyBase):
    pass


class MedicineCompany(MedicineCompanyBase):
    id: int
    company_id: int
    created_at: date
    
    class Config:
        from_attributes = True


class EngineeringCompanyBase(BaseModel):
    # Engineering disciplines
    disciplines: Optional[List[str]] = Field(None, description="Engineering disciplines")
    
    # Certifications
    has_saudi_council_license: bool = Field(False, description="Has Saudi Council of Engineers license")
    has_iso_9001: bool = Field(False, description="Has ISO 9001 certification")
    has_oshas_18001: bool = Field(False, description="Has OHSAS 18001 certification")
    certifications: Optional[List[str]] = Field(None, description="List of certifications")
    
    # Services
    offers_design: bool = Field(False, description="Offers design services")
    offers_consulting: bool = Field(False, description="Offers consulting services")
    offers_supervision: bool = Field(False, description="Offers supervision services")
    offers_project_management: bool = Field(False, description="Offers project management services")
    
    # Software
    software_tools: Optional[List[str]] = Field(None, description="Software tools used")
    
    # Portfolio
    completed_projects_count: int = Field(0, description="Number of completed projects")
    ongoing_projects_count: int = Field(0, description="Number of ongoing projects")


class EngineeringCompanyCreate(EngineeringCompanyBase):
    pass


class EngineeringCompany(EngineeringCompanyBase):
    id: int
    company_id: int
    created_at: date
    
    class Config:
        from_attributes = True


class ContractingCompanyBase(BaseModel):
    # Classification
    classification: Optional[str] = Field(None, description="Contracting classification")
    grade: Optional[str] = Field(None, description="Contracting grade (A, B, C, etc.)")
    
    # Certifications
    has_contractors_classification: bool = Field(False, description="Has contractors classification")
    has_saudi_contractors_authority: bool = Field(False, description="Has Saudi Contractors Authority approval")
    certifications: Optional[List[str]] = Field(None, description="List of certifications")
    
    # Capabilities
    max_project_value: Optional[float] = Field(None, description="Maximum project value capacity in SAR")
    can_handle_government_projects: bool = Field(False, description="Can handle government projects")
    can_handle_international_projects: bool = Field(False, description="Can handle international projects")
    
    # Equipment
    owns_equipment: bool = Field(False, description="Owns construction equipment")
    equipment_list: Optional[List[str]] = Field(None, description="List of owned equipment")
    
    # Safety
    safety_rating: Optional[float] = Field(None, description="Safety rating (1-5)")
    has_safety_certifications: bool = Field(False, description="Has safety certifications")


class ContractingCompanyCreate(ContractingCompanyBase):
    pass


class ContractingCompany(ContractingCompanyBase):
    id: int
    company_id: int
    created_at: date
    
    class Config:
        from_attributes = True


class RestaurantCompanyBase(BaseModel):
    # Cuisine and type
    cuisine_types: Optional[List[str]] = Field(None, description="Types of cuisine offered")
    restaurant_type: Optional[str] = Field(None, description="Restaurant type (fine_dining, casual, etc.)")
    
    # Certifications
    has_food_safety_certification: bool = Field(False, description="Has food safety certification")
    has_halal_certification: bool = Field(False, description="Has halal certification")
    certifications: Optional[List[str]] = Field(None, description="List of certifications")
    
    # Operations
    has_delivery: bool = Field(False, description="Offers delivery service")
    has_takeaway: bool = Field(False, description="Offers takeaway service")
    has_reservations: bool = Field(False, description="Accepts reservations")
    has_catering: bool = Field(False, description="Offers catering service")
    
    # Technology
    has_pos_system: bool = Field(False, description="Has POS system")
    has_online_ordering: bool = Field(False, description="Has online ordering system")
    has_inventory_management: bool = Field(False, description="Has inventory management system")
    
    # Capacity
    seating_capacity: Optional[int] = Field(None, description="Seating capacity")
    daily_customers: Optional[int] = Field(None, description="Average daily customers")
    
    # Ratings
    food_rating: Optional[float] = Field(None, description="Food rating (1-5)")
    service_rating: Optional[float] = Field(None, description="Service rating (1-5)")
    cleanliness_rating: Optional[float] = Field(None, description="Cleanliness rating (1-5)")
    
    # Menu
    has_digital_menu: bool = Field(False, description="Has digital menu")
    menu_items_count: Optional[int] = Field(None, description="Number of menu items")
    average_price_range: Optional[str] = Field(None, description="Price range (low, medium, high, premium)")


class RestaurantCompanyCreate(RestaurantCompanyBase):
    pass


class RestaurantCompany(RestaurantCompanyBase):
    id: int
    company_id: int
    created_at: date
    
    class Config:
        from_attributes = True


class SportsCompanyBase(BaseModel):
    # Sports types
    sports_types: Optional[List[str]] = Field(None, description="Types of sports offered")
    facility_type: Optional[str] = Field(None, description="Facility type (gym, stadium, etc.)")
    
    # Certifications
    has_sports_authority_approval: bool = Field(False, description="Has sports authority approval")
    has_international_standards: bool = Field(False, description="Has international standards certification")
    certifications: Optional[List[str]] = Field(None, description="List of certifications")
    
    # Facilities
    has_gym: bool = Field(False, description="Has gym facility")
    has_swimming_pool: bool = Field(False, description="Has swimming pool")
    has_sports_hall: bool = Field(False, description="Has sports hall")
    has_outdoor_fields: bool = Field(False, description="Has outdoor fields")
    
    # Membership
    membership_count: Optional[int] = Field(None, description="Number of members")
    membership_fee_range: Optional[str] = Field(None, description="Membership fee range")
    
    # Technology
    has_member_management: bool = Field(False, description="Has member management system")
    has_booking_system: bool = Field(False, description="Has booking system")
    has_fitness_tracking: bool = Field(False, description="Has fitness tracking system")
    
    # Events
    hosts_events: bool = Field(False, description="Hosts events")
    events_per_year: Optional[int] = Field(None, description="Number of events per year")


class SportsCompanyCreate(SportsCompanyBase):
    pass


class SportsCompany(SportsCompanyBase):
    id: int
    company_id: int
    created_at: date
    
    class Config:
        from_attributes = True
