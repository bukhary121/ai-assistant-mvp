// Enums for standardized values

export enum CompanySize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  ENTERPRISE = "enterprise",
}

export enum CompanyType {
  LLC = "llc",
  JOINT_STOCK = "joint_stock",
  SOLE_PROPRIETORSHIP = "sole_proprietorship",
  PARTNERSHIP = "partnership",
  GOVERNMENT = "government",
}

export enum OwnershipType {
  SAUDI = "saudi",
  FOREIGN = "foreign",
  JOINT_VENTURE = "joint_venture",
  GOVERNMENT = "government",
}

export enum DataQuality {
  VERIFIED = "verified",
  UNVERIFIED = "unverified",
  ESTIMATED = "estimated",
}

export enum IndustryCategory {
  MEDICINE = "medicine",
  ENGINEERING = "engineering",
  CONTRACTING = "contracting",
  RESTAURANTS = "restaurants",
  SPORTS = "sports",
  GENERAL = "general",
}

export enum DigitalMaturity {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  LEADER = "leader",
}

export enum ProjectStatus {
  PLANNED = "planned",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Arabic labels for enums
export const CompanySizeLabels: Record<CompanySize, string> = {
  [CompanySize.SMALL]: "صغيرة",
  [CompanySize.MEDIUM]: "متوسطة",
  [CompanySize.LARGE]: "كبيرة",
  [CompanySize.ENTERPRISE]: "شركة كبيرة",
};

export const CompanyTypeLabels: Record<CompanyType, string> = {
  [CompanyType.LLC]: "ذ.م.م",
  [CompanyType.JOINT_STOCK]: "مساهمة",
  [CompanyType.SOLE_PROPRIETORSHIP]: "فردية",
  [CompanyType.PARTNERSHIP]: "شركة شخصين",
  [CompanyType.GOVERNMENT]: "حكومية",
};

export const OwnershipTypeLabels: Record<OwnershipType, string> = {
  [OwnershipType.SAUDI]: "سعودية",
  [OwnershipType.FOREIGN]: "أجنبية",
  [OwnershipType.JOINT_VENTURE]: "مشتركة",
  [OwnershipType.GOVERNMENT]: "حكومية",
};

export const IndustryCategoryLabels: Record<IndustryCategory, string> = {
  [IndustryCategory.MEDICINE]: "الطب",
  [IndustryCategory.ENGINEERING]: "الهندسة",
  [IndustryCategory.CONTRACTING]: "المقاولات",
  [IndustryCategory.RESTAURANTS]: "المطاعم",
  [IndustryCategory.SPORTS]: "الرياضة",
  [IndustryCategory.GENERAL]: "عام",
};

export const DigitalMaturityLabels: Record<DigitalMaturity, string> = {
  [DigitalMaturity.BEGINNER]: "مبتدئ",
  [DigitalMaturity.INTERMEDIATE]: "متوسط",
  [DigitalMaturity.ADVANCED]: "متقدم",
  [DigitalMaturity.LEADER]: "قائد",
};

export const ProjectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNED]: "مخطط",
  [ProjectStatus.ONGOING]: "جاري",
  [ProjectStatus.COMPLETED]: "منجز",
  [ProjectStatus.CANCELLED]: "ملغي",
};

export const DataQualityLabels: Record<DataQuality, string> = {
  [DataQuality.VERIFIED]: "مؤكد",
  [DataQuality.UNVERIFIED]: "غير مؤكد",
  [DataQuality.ESTIMATED]: "تقديري",
};

// Saudi regions
 export const SaudiRegions = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "الشرقية",
  "عسير",
  "تبوك",
  "حائل",
  "الجوف",
  "نجران",
  "الباحة",
  "الجوف",
  "الحدود الشمالية",
];

// Industry categories for filters
export const IndustryCategories = [
  IndustryCategory.MEDICINE,
  IndustryCategory.ENGINEERING,
  IndustryCategory.CONTRACTING,
  IndustryCategory.RESTAURANTS,
  IndustryCategory.SPORTS,
  IndustryCategory.GENERAL,
];

// Company sizes for filters
export const CompanySizes = [
  CompanySize.SMALL,
  CompanySize.MEDIUM,
  CompanySize.LARGE,
  CompanySize.ENTERPRISE,
];

// Helper functions
export const getIndustryCategoryLabel = (category: IndustryCategory): string => {
  return IndustryCategoryLabels[category];
};

export const getCompanySizeLabel = (size: CompanySize): string => {
  return CompanySizeLabels[size];
};

export const getCompanyTypeLabel = (type: CompanyType): string => {
  return CompanyTypeLabels[type];
};

export const getOwnershipTypeLabel = (ownership: OwnershipType): string => {
  return OwnershipTypeLabels[ownership];
};

export const getDigitalMaturityLabel = (maturity: DigitalMaturity): string => {
  return DigitalMaturityLabels[maturity];
};

export const getProjectStatusLabel = (status: ProjectStatus): string => {
  return ProjectStatusLabels[status];
};

export const getDataQualityLabel = (quality: DataQuality): string => {
  return DataQualityLabels[quality];
};
