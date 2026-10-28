"""
Analytics router - Advanced analytics and insights
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import date, timedelta
import pandas as pd
import numpy as np

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


@router.get("/overview", response_model=Dict[str, Any])
async def get_analytics_overview(db: Session = Depends(get_db)):
    """Get comprehensive analytics overview"""
    overview = {
        "total_companies": 0,
        "industries": [],
        "regional_distribution": [],
        "company_size_distribution": [],
        "technology_adoption": {},
        "business_needs": {},
        "growth_metrics": {},
    }
    
    # Total companies
    overview["total_companies"] = db.query(CompanyModel).count()
    
    # Industry distribution
    industry_stats = db.query(
        IndustryModel.name_en,
        IndustryModel.category
    ).outerjoin(
        CompanyModel, IndustryModel.id == CompanyModel.industry_id
    ).group_by(IndustryModel.name_en, IndustryModel.category).all()
    
    for name, category in industry_stats:
        count = db.query(CompanyModel).filter(
            CompanyModel.industry_id == IndustryModel.id
        ).filter(IndustryModel.name_en == name).count()
        
        overview["industries"].append({
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
        overview["regional_distribution"].append({
            "region": region,
            "count": count,
        })
    
    # Company size distribution
    sizes = db.query(CompanyModel.company_size).group_by(
        CompanyModel.company_size
    ).all()
    for size, in sizes:
        count = db.query(CompanyModel).filter(
            CompanyModel.company_size == size
        ).count()
        overview["company_size_distribution"].append({
            "size": size,
            "count": count,
        })
    
    # Technology adoption rates
    tech_fields = {
        "has_website": "Website",
        "has_crm": "CRM System",
        "has_erp": "ERP System",
        "has_marketing_automation": "Marketing Automation",
        "has_ai_solutions": "AI Solutions",
    }
    
    for field, label in tech_fields.items():
        total = db.query(CompanyModel).count()
        adopted = db.query(CompanyModel).filter(getattr(CompanyModel, field) == True).count()
        overview["technology_adoption"][label] = {
            "count": adopted,
            "percentage": round((adopted / total * 100) if total > 0 else 0, 2),
        }
    
    # Business needs analysis
    needs_fields = ["challenges", "automation_needs"]
    for field in needs_fields:
        companies_with_needs = db.query(CompanyModel).filter(
            getattr(CompanyModel, field) != None
        ).all()
        
        all_needs = []
        for company in companies_with_needs:
            needs = getattr(company, field) or []
            all_needs.extend(needs)
        
        if all_needs:
            need_counts = {}
            for need in all_needs:
                need_counts[need] = need_counts.get(need, 0) + 1
            
            sorted_needs = sorted(need_counts.items(), key=lambda x: x[1], reverse=True)
            overview["business_needs"][field] = [
                {"need": need, "count": count} for need, count in sorted_needs[:10]
            ]
    
    # Growth metrics (from analytics)
    avg_revenue_growth = db.query(CompanyAnalyticsModel.revenue_growth).scalar()
    avg_employee_growth = db.query(CompanyAnalyticsModel.employee_growth).scalar()
    
    overview["growth_metrics"] = {
        "average_revenue_growth": avg_revenue_growth,
        "average_employee_growth": avg_employee_growth,
    }
    
    return overview


@router.get("/industry-analysis", response_model=Dict[str, Any])
async def get_industry_analysis(
    industry_category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get detailed analysis for specific industries"""
    analysis = {}
    
    # Define industry-specific models
    industry_models = {
        "medicine": MedicineCompanyModel,
        "engineering": EngineeringCompanyModel,
        "contracting": ContractingCompanyModel,
        "restaurants": RestaurantCompanyModel,
        "sports": SportsCompanyModel,
    }
    
    # Get all industries or filter by category
    query = db.query(IndustryModel)
    if industry_category:
        query = query.filter(IndustryModel.category == industry_category)
    
    industries = query.all()
    
    for industry in industries:
        category = industry.category
        industry_name = industry.name_en
        
        # Get companies in this industry
        companies = db.query(CompanyModel).filter(
            CompanyModel.industry_id == industry.id
        ).all()
        
        industry_data = {
            "name": industry_name,
            "category": category,
            "company_count": len(companies),
            "total_employees": 0,
            "total_revenue": 0,
            "technology_adoption": {},
            "specializations": {},
        }
        
        # Aggregate data
        total_employees = sum(c.employee_count or 0 for c in companies)
        total_revenue = sum(c.estimated_revenue or 0 for c in companies)
        
        industry_data["total_employees"] = total_employees
        industry_data["total_revenue"] = total_revenue
        
        # Technology adoption for this industry
        for company in companies:
            if company.has_website:
                industry_data["technology_adoption"]["Website"] = industry_data["technology_adoption"].get("Website", 0) + 1
            if company.has_crm:
                industry_data["technology_adoption"]["CRM"] = industry_data["technology_adoption"].get("CRM", 0) + 1
            if company.has_erp:
                industry_data["technology_adoption"]["ERP"] = industry_data["technology_adoption"].get("ERP", 0) + 1
            if company.has_marketing_automation:
                industry_data["technology_adoption"]["Marketing Automation"] = industry_data["technology_adoption"].get("Marketing Automation", 0) + 1
            if company.has_ai_solutions:
                industry_data["technology_adoption"]["AI Solutions"] = industry_data["technology_adoption"].get("AI Solutions", 0) + 1
        
        # Industry-specific data
        if category in industry_models:
            model = industry_models[category]
            industry_specific_items = db.query(model).filter(
                model.company_id.in_([c.id for c in companies])
            ).all()
            
            # Extract specializations or key data
            if category == "medicine":
                specializations = []
                for item in industry_specific_items:
                    if item.specializations:
                        specializations.extend(item.specializations)
                
                if specializations:
                    spec_counts = {}
                    for spec in specializations:
                        spec_counts[spec] = spec_counts.get(spec, 0) + 1
                    industry_data["specializations"] = dict(
                        sorted(spec_counts.items(), key=lambda x: x[1], reverse=True)[:5]
                    )
            
            elif category == "engineering":
                disciplines = []
                for item in industry_specific_items:
                    if item.disciplines:
                        disciplines.extend(item.disciplines)
                
                if disciplines:
                    disc_counts = {}
                    for disc in disciplines:
                        disc_counts[disc] = disc_counts.get(disc, 0) + 1
                    industry_data["specializations"] = dict(
                        sorted(disc_counts.items(), key=lambda x: x[1], reverse=True)[:5]
                    )
            
            elif category == "contracting":
                classifications = []
                for item in industry_specific_items:
                    if item.classification:
                        classifications.append(item.classification)
                
                if classifications:
                    class_counts = {}
                    for cls in classifications:
                        class_counts[cls] = class_counts.get(cls, 0) + 1
                    industry_data["specializations"] = dict(
                        sorted(class_counts.items(), key=lambda x: x[1], reverse=True)
                    )
            
            elif category == "restaurants":
                cuisines = []
                for item in industry_specific_items:
                    if item.cuisine_types:
                        cuisines.extend(item.cuisine_types)
                
                if cuisines:
                    cuisine_counts = {}
                    for cuisine in cuisines:
                        cuisine_counts[cuisine] = cuisine_counts.get(cuisine, 0) + 1
                    industry_data["specializations"] = dict(
                        sorted(cuisine_counts.items(), key=lambda x: x[1], reverse=True)[:5]
                    )
            
            elif category == "sports":
                sports = []
                for item in industry_specific_items:
                    if item.sports_types:
                        sports.extend(item.sports_types)
                
                if sports:
                    sport_counts = {}
                    for sport in sports:
                        sport_counts[sport] = sport_counts.get(sport, 0) + 1
                    industry_data["specializations"] = dict(
                        sorted(sport_counts.items(), key=lambda x: x[1], reverse=True)[:5]
                    )
        
        analysis[industry_name] = industry_data
    
    return {"industries": analysis}


@router.get("/market-opportunities", response_model=Dict[str, Any])
async def get_market_opportunities(db: Session = Depends(get_db)):
    """Identify market opportunities based on company data"""
    opportunities = {
        "high_potential_segments": [],
        "technology_gaps": [],
        "regional_opportunities": [],
        "automation_potential": [],
    }
    
    # High potential segments (industries with many companies but low tech adoption)
    industries = db.query(IndustryModel).all()
    for industry in industries:
        companies = db.query(CompanyModel).filter(
            CompanyModel.industry_id == industry.id
        ).all()
        
        if len(companies) > 10:  # Significant number of companies
            tech_adoption = sum(
                1 for c in companies if c.has_marketing_automation or c.has_ai_solutions
            )
            adoption_rate = tech_adoption / len(companies) * 100
            
            if adoption_rate < 30:  # Low adoption
                opportunities["high_potential_segments"].append({
                    "industry": industry.name_en,
                    "company_count": len(companies),
                    "tech_adoption_rate": round(adoption_rate, 2),
                    "potential": "High",
                })
    
    # Technology gaps
    tech_fields = [
        ("has_website", "Website"),
        ("has_crm", "CRM System"),
        ("has_erp", "ERP System"),
        ("has_marketing_automation", "Marketing Automation"),
        ("has_ai_solutions", "AI Solutions"),
    ]
    
    for field, label in tech_fields:
        total = db.query(CompanyModel).count()
        adopted = db.query(CompanyModel).filter(getattr(CompanyModel, field) == True).count()
        gap = total - adopted
        
        if gap > 0:
            opportunities["technology_gaps"].append({
                "technology": label,
                "adopted": adopted,
                "gap": gap,
                "penetration_rate": round((adopted / total * 100) if total > 0 else 0, 2),
            })
    
    # Regional opportunities (regions with many companies but low verification)
    regions = db.query(CompanyModel.region).group_by(CompanyModel.region).all()
    for region, in regions:
        companies = db.query(CompanyModel).filter(
            CompanyModel.region == region
        ).all()
        
        verified_count = sum(1 for c in companies if c.verified)
        verification_rate = verified_count / len(companies) * 100
        
        if verification_rate < 50 and len(companies) > 5:
            opportunities["regional_opportunities"].append({
                "region": region,
                "company_count": len(companies),
                "verification_rate": round(verification_rate, 2),
                "opportunity": "Data verification needed",
            })
    
    # Automation potential (companies with challenges that can be solved by automation)
    companies_with_challenges = db.query(CompanyModel).filter(
        CompanyModel.challenges != None
    ).all()
    
    automation_keywords = [
        "manual", "paperwork", "data entry", "reporting", "inventory", 
        "scheduling", "billing", "payroll", "customer management", "sales tracking"
    ]
    
    for company in companies_with_challenges:
        challenges = company.challenges or []
        matching_challenges = [
            c for c in challenges 
            if any(keyword.lower() in c.lower() for keyword in automation_keywords)
        ]
        
        if matching_challenges:
            opportunities["automation_potential"].append({
                "company_id": company.id,
                "company_name": company.name_ar,
                "industry": db.query(IndustryModel).filter(
                    IndustryModel.id == company.industry_id
                ).first().name_en,
                "matching_challenges": matching_challenges,
                "has_automation": company.has_marketing_automation or company.has_ai_solutions,
            })
    
    # Sort by potential
    opportunities["automation_potential"] = sorted(
        opportunities["automation_potential"],
        key=lambda x: (not x["has_automation"], len(x["matching_challenges"])),
        reverse=True
    )[:20]
    
    return opportunities


@router.get("/competitive-analysis", response_model=Dict[str, Any])
async def get_competitive_analysis(
    industry_category: Optional[str] = None,
    region: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Perform competitive analysis"""
    analysis = {
        "leaders": [],
        "followers": [],
        "laggards": [],
        "competitive_intensity": {},
    }
    
    # Get companies to analyze
    query = db.query(CompanyModel).join(IndustryModel)
    
    if industry_category:
        query = query.filter(IndustryModel.category == industry_category)
    
    if region:
        query = query.filter(CompanyModel.region == region)
    
    companies = query.all()
    
    if not companies:
        return analysis
    
    # Calculate competitive scores
    for company in companies:
        score = 0
        
        # Technology adoption (0-40 points)
        tech_score = sum([
            10 if company.has_website else 0,
            10 if company.has_crm else 0,
            10 if company.has_erp else 0,
            10 if company.has_marketing_automation else 0,
        ])
        score += tech_score
        
        # Company size (0-20 points)
        size_scores = {
            "enterprise": 20,
            "large": 15,
            "medium": 10,
            "small": 5,
        }
        score += size_scores.get(company.company_size or "", 0)
        
        # Revenue (0-20 points)
        revenue = company.estimated_revenue or 0
        if revenue > 100000000:  # > 100M SAR
            score += 20
        elif revenue > 50000000:  # > 50M SAR
            score += 15
        elif revenue > 10000000:  # > 10M SAR
            score += 10
        elif revenue > 1000000:  # > 1M SAR
            score += 5
        
        # Employee count (0-20 points)
        employees = company.employee_count or 0
        if employees > 1000:
            score += 20
        elif employees > 500:
            score += 15
        elif employees > 100:
            score += 10
        elif employees > 10:
            score += 5
        
        company.competitive_score = score
    
    # Sort companies by score
    sorted_companies = sorted(companies, key=lambda x: x.competitive_score, reverse=True)
    
    # Categorize
    n = len(sorted_companies)
    leader_count = max(1, n // 10)  # Top 10%
    follower_count = max(1, n // 2)  # Middle 50%
    
    analysis["leaders"] = [
        {
            "id": c.id,
            "name": c.name_ar,
            "score": c.competitive_score,
            "industry": db.query(IndustryModel).filter(
                IndustryModel.id == c.industry_id
            ).first().name_en,
            "region": c.region,
        }
        for c in sorted_companies[:leader_count]
    ]
    
    analysis["followers"] = [
        {
            "id": c.id,
            "name": c.name_ar,
            "score": c.competitive_score,
            "industry": db.query(IndustryModel).filter(
                IndustryModel.id == c.industry_id
            ).first().name_en,
        }
        for c in sorted_companies[leader_count:leader_count + follower_count]
    ]
    
    analysis["laggards"] = [
        {
            "id": c.id,
            "name": c.name_ar,
            "score": c.competitive_score,
            "industry": db.query(IndustryModel).filter(
                IndustryModel.id == c.industry_id
            ).first().name_en,
        }
        for c in sorted_companies[leader_count + follower_count:]
    ]
    
    # Competitive intensity metrics
    analysis["competitive_intensity"] = {
        "total_companies": n,
        "average_score": round(sum(c.competitive_score for c in companies) / n, 2),
        "max_score": sorted_companies[0].competitive_score if sorted_companies else 0,
        "min_score": sorted_companies[-1].competitive_score if sorted_companies else 0,
        "score_range": sorted_companies[0].competitive_score - sorted_companies[-1].competitive_score if sorted_companies and len(sorted_companies) > 1 else 0,
    }
    
    return analysis


@router.get("/company-analytics/{company_id}", response_model=Dict[str, Any])
async def get_company_analytics(company_id: int, db: Session = Depends(get_db)):
    """Get comprehensive analytics for a specific company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    analytics = db.query(CompanyAnalyticsModel).filter(
        CompanyAnalyticsModel.company_id == company_id
    ).order_by(CompanyAnalyticsModel.created_at.desc()).all()
    
    industry = db.query(IndustryModel).filter(
        IndustryModel.id == company.industry_id
    ).first()
    
    result = {
        "company": {
            "id": company.id,
            "name": company.name_ar,
            "industry": industry.name_en if industry else "Unknown",
            "region": company.region,
            "city": company.city,
            "size": company.company_size,
            "revenue": company.estimated_revenue,
            "employees": company.employee_count,
        },
        "technology_adoption": {
            "has_website": company.has_website,
            "has_crm": company.has_crm,
            "has_erp": company.has_erp,
            "has_marketing_automation": company.has_marketing_automation,
            "has_ai_solutions": company.has_ai_solutions,
        },
        "challenges": company.challenges or [],
        "automation_needs": company.automation_needs or [],
        "analytics_history": [],
        "comparisons": {},
    }
    
    # Add analytics history
    for a in analytics:
        result["analytics_history"].append({
            "period": a.period,
            "period_start": a.period_start,
            "period_end": a.period_end,
            "revenue_growth": a.revenue_growth,
            "employee_growth": a.employee_growth,
            "market_share": a.market_share,
            "tech_adoption_score": a.tech_adoption_score,
            "digital_maturity": a.digital_maturity,
            "customer_satisfaction": a.customer_satisfaction,
        })
    
    # Industry comparisons
    industry_companies = db.query(CompanyModel).filter(
        CompanyModel.industry_id == company.industry_id
    ).all()
    
    if industry_companies:
        avg_revenue = sum(c.estimated_revenue or 0 for c in industry_companies) / len(industry_companies)
        avg_employees = sum(c.employee_count or 0 for c in industry_companies) / len(industry_companies)
        
        tech_adoption_rates = {
            "website": sum(1 for c in industry_companies if c.has_website) / len(industry_companies) * 100,
            "crm": sum(1 for c in industry_companies if c.has_crm) / len(industry_companies) * 100,
            "erp": sum(1 for c in industry_companies if c.has_erp) / len(industry_companies) * 100,
            "marketing_automation": sum(1 for c in industry_companies if c.has_marketing_automation) / len(industry_companies) * 100,
            "ai_solutions": sum(1 for c in industry_companies if c.has_ai_solutions) / len(industry_companies) * 100,
        }
        
        result["comparisons"] = {
            "industry_average_revenue": round(avg_revenue, 2),
            "industry_average_employees": round(avg_employees, 2),
            "industry_tech_adoption": {k: round(v, 2) for k, v in tech_adoption_rates.items()},
            "company_position": "above_average" if (company.estimated_revenue or 0) > avg_revenue else "below_average",
        }
    
    return result
