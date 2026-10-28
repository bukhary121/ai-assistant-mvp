"""
Dashboard router - Endpoints for dashboard-specific data and widgets
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import date, timedelta

from ..database.database import get_db
from ..models.company import (
    Company as CompanyModel,
    CompanyAnalytics as CompanyAnalyticsModel,
    Industry as IndustryModel,
    MedicineCompany as MedicineCompanyModel,
    EngineeringCompany as EngineeringCompanyModel,
    ContractingCompany as ContractingCompanyModel,
    RestaurantCompany as RestaurantCompanyModel,
    SportsCompany as SportsCompanyModel,
)

router = APIRouter()


@router.get("/summary", response_model=Dict[str, Any])
async def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary with key metrics"""
    summary = {
        "total_companies": 0,
        "verified_companies": 0,
        "total_revenue": 0,
        "total_employees": 0,
        "industry_distribution": [],
        "regional_distribution": [],
        "technology_adoption": {},
        "recent_activity": [],
        "quick_stats": {},
    }
    
    # Total companies
    summary["total_companies"] = db.query(CompanyModel).count()
    
    # Verified companies
    summary["verified_companies"] = db.query(CompanyModel).filter(
        CompanyModel.verified == True
    ).count()
    
    # Total revenue and employees
    companies = db.query(CompanyModel).all()
    summary["total_revenue"] = sum(c.estimated_revenue or 0 for c in companies)
    summary["total_employees"] = sum(c.employee_count or 0 for c in companies)
    
    # Industry distribution
    industry_counts = db.query(
        IndustryModel.name_en,
        IndustryModel.category
    ).join(CompanyModel).group_by(IndustryModel.name_en, IndustryModel.category).all()
    
    for name, category in industry_counts:
        count = db.query(CompanyModel).join(IndustryModel).filter(
            IndustryModel.name_en == name
        ).count()
        summary["industry_distribution"].append({
            "name": name,
            "category": category,
            "count": count,
        })
    
    # Regional distribution
    regions = db.query(CompanyModel.region).group_by(CompanyModel.region).all()
    for region, in regions:
        count = db.query(CompanyModel).filter(
            CompanyModel.region == region
        ).count()
        summary["regional_distribution"].append({
            "region": region,
            "count": count,
        })
    
    # Technology adoption
    tech_fields = ["has_website", "has_crm", "has_erp", "has_marketing_automation", "has_ai_solutions"]
    for field in tech_fields:
        count = db.query(CompanyModel).filter(getattr(CompanyModel, field) == True).count()
        summary["technology_adoption"][field] = count
    
    # Recent activity (last 10 verified companies)
    recent_companies = db.query(CompanyModel).filter(
        CompanyModel.verified == True
    ).order_by(CompanyModel.verification_date.desc()).limit(10).all()
    
    for company in recent_companies:
        industry = db.query(IndustryModel).filter(
            IndustryModel.id == company.industry_id
        ).first()
        summary["recent_activity"].append({
            "id": company.id,
            "name": company.name_ar,
            "industry": industry.name_en if industry else "Unknown",
            "region": company.region,
            "verification_date": company.verification_date,
        })
    
    # Quick stats
    avg_revenue = sum(c.estimated_revenue or 0 for c in companies) / len(companies) if companies else 0
    avg_employees = sum(c.employee_count or 0 for c in companies) / len(companies) if companies else 0
    
    summary["quick_stats"] = {
        "average_revenue": round(avg_revenue, 2),
        "average_employees": round(avg_employees, 2),
        "verification_rate": round(
            (summary["verified_companies"] / summary["total_companies"] * 100) 
            if summary["total_companies"] > 0 else 0, 2
        ),
        "tech_adoption_rate": round(
            sum(summary["technology_adoption"].values()) / len(tech_fields) / summary["total_companies"] * 100
            if summary["total_companies"] > 0 else 0, 2
        ),
    }
    
    return summary


@router.get("/kpis", response_model=Dict[str, Any])
async def get_dashboard_kpis(db: Session = Depends(get_db)):
    """Get Key Performance Indicators for dashboard"""
    kpis = {
        "company_growth": {},
        "technology_penetration": {},
        "industry_health": {},
        "regional_insights": {},
    }
    
    # Company growth KPIs
    total_companies = db.query(CompanyModel).count()
    verified_companies = db.query(CompanyModel).filter(
        CompanyModel.verified == True
    ).count()
    
    kpis["company_growth"] = {
        "total_companies": total_companies,
        "verified_companies": verified_companies,
        "verification_rate": round((verified_companies / total_companies * 100) if total_companies > 0 else 0, 2),
        "growth_potential": round((100 - (verified_companies / total_companies * 100)) if total_companies > 0 else 0, 2),
    }
    
    # Technology penetration KPIs
    tech_adoption = {}
    tech_fields = ["has_website", "has_crm", "has_erp", "has_marketing_automation", "has_ai_solutions"]
    
    for field in tech_fields:
        count = db.query(CompanyModel).filter(getattr(CompanyModel, field) == True).count()
        tech_adoption[field] = {
            "count": count,
            "penetration": round((count / total_companies * 100) if total_companies > 0 else 0, 2),
        }
    
    kpis["technology_penetration"] = tech_adoption
    
    # Industry health KPIs
    industries = db.query(IndustryModel).all()
    industry_health = []
    
    for industry in industries:
        companies = db.query(CompanyModel).filter(
            CompanyModel.industry_id == industry.id
        ).all()
        
        if companies:
            avg_revenue = sum(c.estimated_revenue or 0 for c in companies) / len(companies)
            avg_employees = sum(c.employee_count or 0 for c in companies) / len(companies)
            tech_score = sum([
                1 for c in companies if c.has_website or c.has_crm or c.has_erp
            ]) / len(companies) * 100
            
            industry_health.append({
                "name": industry.name_en,
                "category": industry.category,
                "company_count": len(companies),
                "average_revenue": round(avg_revenue, 2),
                "average_employees": round(avg_employees, 2),
                "tech_adoption_score": round(tech_score, 2),
                "health_score": round(
                    (min(len(companies) / 10, 1) * 0.3 + 
                     min(avg_revenue / 10000000, 1) * 0.3 + 
                     tech_score / 100 * 0.4) * 100, 2
                ),
            })
    
    kpis["industry_health"] = sorted(
        industry_health, key=lambda x: x["health_score"], reverse=True
    )
    
    # Regional insights KPIs
    regions = db.query(CompanyModel.region).group_by(CompanyModel.region).all()
    regional_insights = []
    
    for region, in regions:
        companies = db.query(CompanyModel).filter(
            CompanyModel.region == region
        ).all()
        
        total_revenue = sum(c.estimated_revenue or 0 for c in companies)
        total_employees = sum(c.employee_count or 0 for c in companies)
        verified_count = sum(1 for c in companies if c.verified)
        
        regional_insights.append({
            "region": region,
            "company_count": len(companies),
            "total_revenue": round(total_revenue, 2),
            "total_employees": total_employees,
            "verification_rate": round((verified_count / len(companies) * 100) if companies else 0, 2),
            "density": round(len(companies) / max(1, len(regions)), 2),
        })
    
    kpis["regional_insights"] = sorted(
        regional_insights, key=lambda x: x["company_count"], reverse=True
    )
    
    return kpis


@router.get("/widgets/industry-breakdown", response_model=Dict[str, Any])
async def get_industry_breakdown_widget(db: Session = Depends(get_db)):
    """Get data for industry breakdown widget"""
    industries = db.query(IndustryModel).all()
    
    data = {
        "labels": [],
        "datasets": [{
            "label": "Companies by Industry",
            "data": [],
            "backgroundColor": [],
        }],
    }
    
    colors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
        "#FF9F40", "#FF6384", "#C9CBCF", "#4BC0C0", "#FF6384",
    ]
    
    for i, industry in enumerate(industries):
        count = db.query(CompanyModel).filter(
            CompanyModel.industry_id == industry.id
        ).count()
        
        if count > 0:
            data["labels"].append(industry.name_en)
            data["datasets"][0]["data"].append(count)
            data["datasets"][0]["backgroundColor"].append(colors[i % len(colors)])
    
    return data


@router.get("/widgets/regional-distribution", response_model=Dict[str, Any])
async def get_regional_distribution_widget(db: Session = Depends(get_db)):
    """Get data for regional distribution widget"""
    regions = db.query(CompanyModel.region).group_by(CompanyModel.region).all()
    
    data = {
        "labels": [],
        "datasets": [{
            "label": "Companies by Region",
            "data": [],
            "backgroundColor": "rgba(54, 162, 235, 0.5)",
            "borderColor": "rgba(54, 162, 235, 1)",
        }],
    }
    
    for region, in regions:
        count = db.query(CompanyModel).filter(
            CompanyModel.region == region
        ).count()
        data["labels"].append(region)
        data["datasets"][0]["data"].append(count)
    
    return data


@router.get("/widgets/technology-adoption", response_model=Dict[str, Any])
async def get_technology_adoption_widget(db: Session = Depends(get_db)):
    """Get data for technology adoption widget"""
    tech_fields = [
        ("has_website", "Website", "#FF6384"),
        ("has_crm", "CRM System", "#36A2EB"),
        ("has_erp", "ERP System", "#FFCE56"),
        ("has_marketing_automation", "Marketing Automation", "#4BC0C0"),
        ("has_ai_solutions", "AI Solutions", "#9966FF"),
    ]
    
    total_companies = db.query(CompanyModel).count()
    
    data = {
        "labels": [],
        "datasets": [{
            "label": "Technology Adoption Rate (%)",
            "data": [],
            "backgroundColor": [],
        }],
    }
    
    for field, label, color in tech_fields:
        count = db.query(CompanyModel).filter(getattr(CompanyModel, field) == True).count()
        percentage = round((count / total_companies * 100) if total_companies > 0 else 0, 2)
        
        data["labels"].append(label)
        data["datasets"][0]["data"].append(percentage)
        data["datasets"][0]["backgroundColor"].append(color)
    
    return data


@router.get("/widgets/company-size-distribution", response_model=Dict[str, Any])
async def get_company_size_distribution_widget(db: Session = Depends(get_db)):
    """Get data for company size distribution widget"""
    sizes = ["small", "medium", "large", "enterprise"]
    
    data = {
        "labels": sizes,
        "datasets": [{
            "label": "Companies by Size",
            "data": [],
            "backgroundColor": ["#FFCE56", "#4BC0C0", "#36A2EB", "#9966FF"],
        }],
    }
    
    for size in sizes:
        count = db.query(CompanyModel).filter(
            CompanyModel.company_size == size
        ).count()
        data["datasets"][0]["data"].append(count)
    
    return data


@router.get("/widgets/growth-trends", response_model=Dict[str, Any])
async def get_growth_trends_widget(db: Session = Depends(get_db)):
    """Get data for growth trends widget"""
    # Get analytics data for the last 6 periods
    analytics = db.query(CompanyAnalyticsModel).order_by(
        CompanyAnalyticsModel.period_start.desc()
    ).limit(6).all()
    
    data = {
        "labels": [],
        "datasets": [
            {
                "label": "Revenue Growth (%)",
                "data": [],
                "borderColor": "#FF6384",
                "fill": False,
            },
            {
                "label": "Employee Growth (%)",
                "data": [],
                "borderColor": "#36A2EB",
                "fill": False,
            },
        ],
    }
    
    for a in reversed(analytics):
        data["labels"].append(a.period or f"Period {a.id}")
        data["datasets"][0]["data"].append(a.revenue_growth or 0)
        data["datasets"][1]["data"].append(a.employee_growth or 0)
    
    return data


@router.get("/widgets/verification-status", response_model=Dict[str, Any])
async def get_verification_status_widget(db: Session = Depends(get_db)):
    """Get data for verification status widget"""
    verified = db.query(CompanyModel).filter(CompanyModel.verified == True).count()
    unverified = db.query(CompanyModel).filter(CompanyModel.verified == False).count()
    
    data = {
        "labels": ["Verified", "Unverified"],
        "datasets": [{
            "label": "Verification Status",
            "data": [verified, unverified],
            "backgroundColor": ["#4BC0C0", "#FFCE56"],
        }],
    }
    
    return data


@router.get("/widgets/industry-specific", response_model=Dict[str, Any])
async def get_industry_specific_widget(
    industry_category: str = Query(..., description="Industry category: medicine, engineering, contracting, restaurants, sports"),
    db: Session = Depends(get_db),
):
    """Get industry-specific widget data"""
    industry_models = {
        "medicine": MedicineCompanyModel,
        "engineering": EngineeringCompanyModel,
        "contracting": ContractingCompanyModel,
        "restaurants": RestaurantCompanyModel,
        "sports": SportsCompanyModel,
    }
    
    if industry_category not in industry_models:
        raise HTTPException(status_code=400, detail="Invalid industry category")
    
    model = industry_models[industry_category]
    items = db.query(model).all()
    
    data = {
        "category": industry_category,
        "total": len(items),
        "key_metrics": {},
    }
    
    if industry_category == "medicine":
        data["key_metrics"] = {
            "has_moh_approval": sum(1 for i in items if i.has_moh_approval),
            "has_telemedicine": sum(1 for i in items if i.offers_telemedicine),
            "has_ehr_system": sum(1 for i in items if i.has_ehr_system),
            "total_bed_capacity": sum(i.bed_capacity or 0 for i in items),
        }
    
    elif industry_category == "engineering":
        data["key_metrics"] = {
            "has_saudi_council_license": sum(1 for i in items if i.has_saudi_council_license),
            "has_iso_9001": sum(1 for i in items if i.has_iso_9001),
            "offers_design": sum(1 for i in items if i.offers_design),
            "total_projects": sum(i.completed_projects_count + i.ongoing_projects_count for i in items),
        }
    
    elif industry_category == "contracting":
        data["key_metrics"] = {
            "has_contractors_classification": sum(1 for i in items if i.has_contractors_classification),
            "can_handle_government_projects": sum(1 for i in items if i.can_handle_government_projects),
            "owns_equipment": sum(1 for i in items if i.owns_equipment),
            "total_max_project_value": sum(i.max_project_value or 0 for i in items),
        }
    
    elif industry_category == "restaurants":
        data["key_metrics"] = {
            "has_delivery": sum(1 for i in items if i.has_delivery),
            "has_online_ordering": sum(1 for i in items if i.has_online_ordering),
            "has_pos_system": sum(1 for i in items if i.has_pos_system),
            "total_seating_capacity": sum(i.seating_capacity or 0 for i in items),
        }
    
    elif industry_category == "sports":
        data["key_metrics"] = {
            "has_gym": sum(1 for i in items if i.has_gym),
            "has_swimming_pool": sum(1 for i in items if i.has_swimming_pool),
            "has_booking_system": sum(1 for i in items if i.has_booking_system),
            "total_membership": sum(i.membership_count or 0 for i in items),
        }
    
    return data


@router.get("/widgets/top-companies", response_model=Dict[str, Any])
async def get_top_companies_widget(
    metric: str = Query("revenue", description="Metric to sort by: revenue, employees, rating"),
    limit: int = Query(10, description="Number of companies to return"),
    db: Session = Depends(get_db),
):
    """Get top companies by a specific metric"""
    sort_mapping = {
        "revenue": CompanyModel.estimated_revenue,
        "employees": CompanyModel.employee_count,
        "rating": CompanyModel.rating,
    }
    
    if metric not in sort_mapping:
        raise HTTPException(status_code=400, detail="Invalid metric")
    
    companies = db.query(CompanyModel).order_by(
        sort_mapping[metric].desc()
    ).limit(limit).all()
    
    data = {
        "metric": metric,
        "companies": [],
    }
    
    for company in companies:
        industry = db.query(IndustryModel).filter(
            IndustryModel.id == company.industry_id
        ).first()
        
        data["companies"].append({
            "id": company.id,
            "name": company.name_ar,
            "industry": industry.name_en if industry else "Unknown",
            "region": company.region,
            "revenue": company.estimated_revenue,
            "employees": company.employee_count,
            "rating": company.rating,
        })
    
    return data


@router.get("/widgets/recent-verifications", response_model=Dict[str, Any])
async def get_recent_verifications_widget(
    limit: int = Query(10, description="Number of companies to return"),
    db: Session = Depends(get_db),
):
    """Get recently verified companies"""
    companies = db.query(CompanyModel).filter(
        CompanyModel.verified == True
    ).order_by(CompanyModel.verification_date.desc()).limit(limit).all()
    
    data = {
        "companies": [],
    }
    
    for company in companies:
        industry = db.query(IndustryModel).filter(
            IndustryModel.id == company.industry_id
        ).first()
        
        data["companies"].append({
            "id": company.id,
            "name": company.name_ar,
            "industry": industry.name_en if industry else "Unknown",
            "region": company.region,
            "verification_date": company.verification_date,
            "revenue": company.estimated_revenue,
            "employees": company.employee_count,
        })
    
    return data
