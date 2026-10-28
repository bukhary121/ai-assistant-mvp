// Company types
import { IndustryCategory, CompanySize, CompanyType, OwnershipType, DataQuality, DigitalMaturity, ProjectStatus } from './enums';

export interface Industry {
  id: number;
  name_ar: string;
  name_en: string;
  description: string | null;
  category: IndustryCategory;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name_ar: string;
  name_en?: string;
  trade_name?: string;
  cr_number?: string;
  tax_number?: string;
  establishment_date?: string;
  industry_id: number;
  sub_industry?: string;
  city: string;
  region: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  company_size?: CompanySize;
  company_type?: CompanyType;
  ownership?: OwnershipType;
  estimated_revenue?: number;
  employee_count?: number;
  industry_specific_data?: Record<string, any>;
  description?: string;
  services?: string;
  products?: string;
  has_website: boolean;
  has_crm: boolean;
  has_erp: boolean;
  has_marketing_automation: boolean;
  has_ai_solutions: boolean;
  challenges?: string[];
  automation_needs?: string[];
  data_source?: string;
  data_quality?: DataQuality;
  verified: boolean;
  verification_date?: string;
  rating?: number;
  review_count: number;
  social_media?: Record<string, string>;
  is_active: boolean;
  created_at: string;
  last_updated: string;
  industry?: Industry;
}

export interface CompanyListResponse {
  companies: Company[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CompanyContact {
  id: number;
  company_id: number;
  name: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  linkedin?: string;
  notes?: string;
  created_at: string;
}

export interface CompanyProject {
  id: number;
  company_id: number;
  name: string;
  description?: string;
  project_type?: string;
  status?: ProjectStatus;
  start_date?: string;
  completion_date?: string;
  budget?: number;
  location?: string;
  client?: string;
  created_at: string;
}

export interface CompanyAnalytics {
  id: number;
  company_id: number;
  revenue_growth?: number;
  employee_growth?: number;
  market_share?: number;
  website_traffic?: number;
  social_media_followers?: number;
  online_reputation_score?: number;
  profitability?: number;
  liquidity_ratio?: number;
  debt_to_equity?: number;
  tech_adoption_score?: number;
  digital_maturity?: DigitalMaturity;
  marketing_roi?: number;
  lead_conversion_rate?: number;
  customer_satisfaction?: number;
  competitors?: number[];
  competitive_advantage?: string;
  industry_metrics?: Record<string, any>;
  period?: string;
  period_start?: string;
  period_end?: string;
  created_at: string;
}

// Industry-specific types
export interface MedicineCompany {
  id: number;
  company_id: number;
  specializations?: string[];
  medical_fields?: string[];
  has_moh_approval: boolean;
  has_iso_certification: boolean;
  has_jci_accreditation: boolean;
  certifications?: string[];
  offers_telemedicine: boolean;
  offers_home_care: boolean;
  has_emergency_services: boolean;
  bed_capacity?: number;
  has_ehr_system: boolean;
  has_lab_management: boolean;
  has_radiology_system: boolean;
  has_pacs: boolean;
  annual_patient_volume?: number;
  average_patient_satisfaction?: number;
  created_at: string;
}

export interface EngineeringCompany {
  id: number;
  company_id: number;
  disciplines?: string[];
  has_saudi_council_license: boolean;
  has_iso_9001: boolean;
  has_oshas_18001: boolean;
  certifications?: string[];
  offers_design: boolean;
  offers_consulting: boolean;
  offers_supervision: boolean;
  offers_project_management: boolean;
  software_tools?: string[];
  completed_projects_count: number;
  ongoing_projects_count: number;
  created_at: string;
}

export interface ContractingCompany {
  id: number;
  company_id: number;
  classification?: string;
  grade?: string;
  has_contractors_classification: boolean;
  has_saudi_contractors_authority: boolean;
  certifications?: string[];
  max_project_value?: number;
  can_handle_government_projects: boolean;
  can_handle_international_projects: boolean;
  owns_equipment: boolean;
  equipment_list?: string[];
  safety_rating?: number;
  has_safety_certifications: boolean;
  created_at: string;
}

export interface RestaurantCompany {
  id: number;
  company_id: number;
  cuisine_types?: string[];
  restaurant_type?: string;
  has_food_safety_certification: boolean;
  has_halal_certification: boolean;
  certifications?: string[];
  has_delivery: boolean;
  has_takeaway: boolean;
  has_reservations: boolean;
  has_catering: boolean;
  has_pos_system: boolean;
  has_online_ordering: boolean;
  has_inventory_management: boolean;
  seating_capacity?: number;
  daily_customers?: number;
  food_rating?: number;
  service_rating?: number;
  cleanliness_rating?: number;
  has_digital_menu: boolean;
  menu_items_count?: number;
  average_price_range?: string;
  created_at: string;
}

export interface SportsCompany {
  id: number;
  company_id: number;
  sports_types?: string[];
  facility_type?: string;
  has_sports_authority_approval: boolean;
  has_international_standards: boolean;
  certifications?: string[];
  has_gym: boolean;
  has_swimming_pool: boolean;
  has_sports_hall: boolean;
  has_outdoor_fields: boolean;
  membership_count?: number;
  membership_fee_range?: string;
  has_member_management: boolean;
  has_booking_system: boolean;
  has_fitness_tracking: boolean;
  hosts_events: boolean;
  events_per_year?: number;
  created_at: string;
}

// Dashboard types
export interface DashboardSummary {
  total_companies: number;
  verified_companies: number;
  total_revenue: number;
  total_employees: number;
  industry_distribution: Array<{
    name: string;
    category: string;
    count: number;
  }>;
  regional_distribution: Array<{
    region: string;
    count: number;
  }>;
  technology_adoption: Record<string, number>;
  recent_activity: Array<{
    id: number;
    name: string;
    industry: string;
    region: string;
    verification_date: string;
  }>;
  quick_stats: {
    average_revenue: number;
    average_employees: number;
    verification_rate: number;
    tech_adoption_rate: number;
  };
}

export interface KPIData {
  company_growth: {
    total_companies: number;
    verified_companies: number;
    verification_rate: number;
    growth_potential: number;
  };
  technology_penetration: Record<string, {
    count: number;
    penetration: number;
  }>;
  industry_health: Array<{
    name: string;
    category: string;
    company_count: number;
    average_revenue: number;
    average_employees: number;
    tech_adoption_score: number;
    health_score: number;
  }>;
  regional_insights: Array<{
    region: string;
    company_count: number;
    total_revenue: number;
    total_employees: number;
    verification_rate: number;
    density: number;
  }>;
}

// Analytics types
export interface AnalyticsOverview {
  total_companies: number;
  industries: Array<{
    name: string;
    category: string;
    count: number;
  }>;
  regional_distribution: Array<{
    region: string;
    count: number;
  }>;
  company_size_distribution: Array<{
    size: string;
    count: number;
  }>;
  technology_adoption: Record<string, {
    count: number;
    percentage: number;
  }>;
  recent_activity: Array<any>;
  quick_stats: {
    average_revenue: number;
    average_employees: number;
    verification_rate: number;
    tech_adoption_rate: number;
  };
}

export interface IndustryAnalysis {
  industries: Record<string, {
    name: string;
    category: string;
    company_count: number;
    total_employees: number;
    total_revenue: number;
    technology_adoption: Record<string, number>;
    specializations: Record<string, number>;
  }>;
}

export interface MarketOpportunities {
  high_potential_segments: Array<{
    industry: string;
    company_count: number;
    tech_adoption_rate: number;
    potential: string;
  }>;
  technology_gaps: Array<{
    technology: string;
    adopted: number;
    gap: number;
    penetration_rate: number;
  }>;
  regional_opportunities: Array<{
    region: string;
    company_count: number;
    verification_rate: number;
    opportunity: string;
  }>;
  automation_potential: Array<{
    company_id: number;
    company_name: string;
    industry: string;
    matching_challenges: string[];
    has_automation: boolean;
  }>;
}

export interface CompetitiveAnalysis {
  leaders: Array<{
    id: number;
    name: string;
    score: number;
    industry: string;
    region: string;
  }>;
  followers: Array<{
    id: number;
    name: string;
    score: number;
    industry: string;
  }>;
  laggards: Array<{
    id: number;
    name: string;
    score: number;
    industry: string;
  }>;
  competitive_intensity: {
    total_companies: number;
    average_score: number;
    max_score: number;
    min_score: number;
    score_range: number;
  };
}

export interface CompanyAnalyticsData {
  company: {
    id: number;
    name: string;
    industry: string;
    region: string;
    city: string;
    size?: string;
    revenue?: number;
    employees?: number;
  };
  technology_adoption: {
    has_website: boolean;
    has_crm: boolean;
    has_erp: boolean;
    has_marketing_automation: boolean;
    has_ai_solutions: boolean;
  };
  challenges: string[];
  automation_needs: string[];
  analytics_history: Array<{
    period?: string;
    period_start?: string;
    period_end?: string;
    revenue_growth?: number;
    employee_growth?: number;
    market_share?: number;
    tech_adoption_score?: number;
    digital_maturity?: string;
    customer_satisfaction?: number;
  }>;
  comparisons: {
    industry_average_revenue: number;
    industry_average_employees: number;
    industry_tech_adoption: Record<string, number>;
    company_position: string;
  };
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: (number | null)[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
  }>;
}

// Filter types
export interface CompanyFilters {
  industry_id?: number;
  region?: string;
  city?: string;
  company_size?: CompanySize;
  verified?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

// Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Export all types
export * from './enums';
