import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Company,
  CompanyListResponse,
  Industry,
  DashboardSummary,
  KPIData,
  AnalyticsOverview,
  IndustryAnalysis,
  MarketOpportunities,
  CompetitiveAnalysis,
  CompanyAnalyticsData,
  ChartData,
  CompanyFilters,
} from '../types';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Dashboard endpoints

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary>('dashboard-summary', async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/summary`);
    return response.data;
  });
};

export const useDashboardKPIs = () => {
  return useQuery<KPIData>('dashboard-kpis', async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/kpis`);
    return response.data;
  });
};

// Industry widget endpoints

export const useIndustryBreakdown = () => {
  return useQuery<ChartData>('industry-breakdown', async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/widgets/industry-breakdown`);
    return response.data;
  });
};

export const useRegionalDistribution = () => {
  return useQuery<ChartData>('regional-distribution', async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/widgets/regional-distribution`);
    return response.data;
  });
};

export const useTechnologyAdoption = () => {
  return useQuery<ChartData>('technology-adoption', async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/widgets/technology-adoption`);
    return response.data;
  });
};

export const useCompanySizeDistribution = () => {
  return useQuery<ChartData>('company-size-distribution', async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/widgets/company-size-distribution`);
    return response.data;
  });
};

export const useGrowthTrends = () => {
  return useQuery<ChartData>('growth-trends', async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/widgets/growth-trends`);
    return response.data;
  });
};

export const useVerificationStatus = () => {
  return useQuery<ChartData>('verification-status', async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/widgets/verification-status`);
    return response.data;
  });
};

export const useIndustrySpecificWidget = (industryCategory: string) => {
  return useQuery<Record<string, any>>(
    ['industry-specific-widget', industryCategory],
    async () => {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/widgets/industry-specific?industry_category=${industryCategory}`
      );
      return response.data;
    },
    { enabled: !!industryCategory }
  );
};

export const useTopCompanies = (metric: string = 'revenue', limit: number = 10) => {
  return useQuery<Record<string, any>>(
    ['top-companies', metric, limit],
    async () => {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/widgets/top-companies?metric=${metric}&limit=${limit}`
      );
      return response.data;
    }
  );
};

export const useRecentVerifications = (limit: number = 10) => {
  return useQuery<Record<string, any>>(
    ['recent-verifications', limit],
    async () => {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/widgets/recent-verifications?limit=${limit}`
      );
      return response.data;
    }
  );
};

// Companies endpoints

export const useCompanies = (filters: CompanyFilters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.industry_id) queryParams.append('industry_id', filters.industry_id.toString());
  if (filters.region) queryParams.append('region', filters.region);
  if (filters.city) queryParams.append('city', filters.city);
  if (filters.company_size) queryParams.append('company_size', filters.company_size);
  if (filters.verified !== undefined) queryParams.append('verified', filters.verified.toString());
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.page) queryParams.append('skip', ((filters.page - 1) * (filters.page_size || 50)).toString());
  if (filters.page_size) queryParams.append('limit', filters.page_size.toString());
  
  return useQuery<CompanyListResponse>(
    ['companies', filters],
    async () => {
      const response = await axios.get(`${API_BASE_URL}/companies/?${queryParams.toString()}`);
      return response.data;
    }
  );
};

export const useCompany = (id: number | null) => {
  return useQuery<Company>(
    ['company', id],
    async () => {
      const response = await axios.get(`${API_BASE_URL}/companies/${id}`);
      return response.data;
    },
    { enabled: !!id }
  );
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (companyData: Omit<Company, 'id' | 'created_at' | 'last_updated' | 'industry'>) => {
      const response = await axios.post(`${API_BASE_URL}/companies/`, companyData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('companies');
        queryClient.invalidateQueries('dashboard-summary');
        queryClient.invalidateQueries('dashboard-kpis');
      },
    }
  );
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async ({ id, data }: { id: number; data: Partial<Company> }) => {
      const response = await axios.put(`${API_BASE_URL}/companies/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('companies');
        queryClient.invalidateQueries('company');
      },
    }
  );
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (id: number) => {
      await axios.delete(`${API_BASE_URL}/companies/${id}`);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('companies');
        queryClient.invalidateQueries('dashboard-summary');
        queryClient.invalidateQueries('dashboard-kpis');
      },
    }
  );
};

// Industries endpoints

export const useIndustries = () => {
  return useQuery<Industry[]>('industries', async () => {
    const response = await axios.get(`${API_BASE_URL}/industries/`);
    return response.data;
  });
};

export const useIndustry = (id: number | null) => {
  return useQuery<Industry>(
    ['industry', id],
    async () => {
      const response = await axios.get(`${API_BASE_URL}/industries/${id}`);
      return response.data;
    },
    { enabled: !!id }
  );
};

export const useCreateIndustry = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (industryData: Omit<Industry, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await axios.post(`${API_BASE_URL}/industries/`, industryData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('industries');
        queryClient.invalidateQueries('companies');
      },
    }
  );
};

// Analytics endpoints

export const useAnalyticsOverview = () => {
  return useQuery<AnalyticsOverview>('analytics-overview', async () => {
    const response = await axios.get(`${API_BASE_URL}/analytics/overview`);
    return response.data;
  });
};

export const useIndustryAnalysis = () => {
  return useQuery<IndustryAnalysis>('industry-analysis', async () => {
    const response = await axios.get(`${API_BASE_URL}/analytics/industry-analysis`);
    return response.data;
  });
};

export const useMarketOpportunities = () => {
  return useQuery<MarketOpportunities>('market-opportunities', async () => {
    const response = await axios.get(`${API_BASE_URL}/analytics/market-opportunities`);
    return response.data;
  });
};

export const useCompetitiveAnalysis = () => {
  return useQuery<CompetitiveAnalysis>('competitive-analysis', async () => {
    const response = await axios.get(`${API_BASE_URL}/analytics/competitive-analysis`);
    return response.data;
  });
};

export const useCompanyAnalytics = (companyId: number | null) => {
  return useQuery<CompanyAnalyticsData>(
    ['company-analytics', companyId],
    async () => {
      const response = await axios.get(`${API_BASE_URL}/analytics/company-analytics/${companyId}`);
      return response.data;
    },
    { enabled: !!companyId }
  );
};

// Industry-specific endpoints

export const useMedicineCompanies = () => {
  return useQuery<Record<string, any>>('medicine-companies', async () => {
    const response = await axios.get(`${API_BASE_URL}/industries/medicine/`);
    return response.data;
  });
};

export const useEngineeringCompanies = () => {
  return useQuery<Record<string, any>>('engineering-companies', async () => {
    const response = await axios.get(`${API_BASE_URL}/industries/engineering/`);
    return response.data;
  });
};

export const useContractingCompanies = () => {
  return useQuery<Record<string, any>>('contracting-companies', async () => {
    const response = await axios.get(`${API_BASE_URL}/industries/contracting/`);
    return response.data;
  });
};

export const useRestaurantCompanies = () => {
  return useQuery<Record<string, any>>('restaurant-companies', async () => {
    const response = await axios.get(`${API_BASE_URL}/industries/restaurants/`);
    return response.data;
  });
};

export const useSportsCompanies = () => {
  return useQuery<Record<string, any>>('sports-companies', async () => {
    const response = await axios.get(`${API_BASE_URL}/industries/sports/`);
    return response.data;
  });
};

// Statistics endpoint

export const useIndustryStatistics = () => {
  return useQuery<Record<string, any>>('industry-statistics', async () => {
    const response = await axios.get(`${API_BASE_URL}/industries/statistics`);
    return response.data;
  });
};

// Custom hook to prefetch multiple queries
export const usePrefetchDashboard = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery('dashboard-summary', useDashboardSummary().queryFn);
    queryClient.prefetchQuery('dashboard-kpis', useDashboardKPIs().queryFn);
    queryClient.prefetchQuery('industry-breakdown', useIndustryBreakdown().queryFn);
    queryClient.prefetchQuery('regional-distribution', useRegionalDistribution().queryFn);
    queryClient.prefetchQuery('technology-adoption', useTechnologyAdoption().queryFn);
    queryClient.prefetchQuery('company-size-distribution', useCompanySizeDistribution().queryFn);
    queryClient.prefetchQuery('verification-status', useVerificationStatus().queryFn);
    queryClient.prefetchQuery('top-companies', useTopCompanies().queryFn);
    queryClient.prefetchQuery('recent-verifications', useRecentVerifications().queryFn);
    queryClient.prefetchQuery('industries', useIndustries().queryFn);
  };
};
