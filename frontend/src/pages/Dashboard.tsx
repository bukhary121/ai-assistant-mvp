import React, { useState, useEffect } from 'react';
import {
  useDashboardSummary,
  useDashboardKPIs,
  useIndustryBreakdown,
  useRegionalDistribution,
  useTechnologyAdoption,
  useCompanySizeDistribution,
  useVerificationStatus,
  useTopCompanies,
  useRecentVerifications,
  useIndustries,
} from '../hooks/useApi';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import TopCompaniesList from '../components/TopCompaniesList';
import RecentActivity from '../components/RecentActivity';
import { IndustryCategory, IndustryCategoryLabels } from '../types/enums';
import { CircularProgress, Grid, Paper, Typography, Box, Chip } from '@mui/material';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  // Fetch all dashboard data
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs();
  const { data: industryBreakdown, isLoading: industryBreakdownLoading } = useIndustryBreakdown();
  const { data: regionalDistribution, isLoading: regionalDistributionLoading } = useRegionalDistribution();
  const { data: technologyAdoption, isLoading: technologyAdoptionLoading } = useTechnologyAdoption();
  const { data: companySizeDistribution, isLoading: companySizeLoading } = useCompanySizeDistribution();
  const { data: verificationStatus, isLoading: verificationStatusLoading } = useVerificationStatus();
  const { data: topCompanies, isLoading: topCompaniesLoading } = useTopCompanies('revenue', 5);
  const { data: recentVerifications, isLoading: recentVerificationsLoading } = useRecentVerifications(5);
  const { data: industries, isLoading: industriesLoading } = useIndustries();

  useEffect(() => {
    if (!summaryLoading && !kpisLoading && !industryBreakdownLoading && 
        !regionalDistributionLoading && !technologyAdoptionLoading && 
        !companySizeLoading && !verificationStatusLoading && 
        !topCompaniesLoading && !recentVerificationsLoading && 
        !industriesLoading) {
      setLoading(false);
    }
  }, [
    summaryLoading, kpisLoading, industryBreakdownLoading, 
    regionalDistributionLoading, technologyAdoptionLoading,
    companySizeLoading, verificationStatusLoading,
    topCompaniesLoading, recentVerificationsLoading, industriesLoading
  ]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Calculate industry counts by category
  const getIndustryCategoryCounts = () => {
    if (!summary?.industry_distribution) return {};
    
    const counts: Record<string, number> = {
      medicine: 0,
      engineering: 0,
      contracting: 0,
      restaurants: 0,
      sports: 0,
      general: 0,
    };
    
    summary.industry_distribution.forEach(industry => {
      if (counts[industry.category as keyof typeof counts] !== undefined) {
        counts[industry.category as keyof typeof counts] += industry.count;
      }
    });
    
    return counts;
  };

  const categoryCounts = getIndustryCategoryCounts();

  return (
    <div className="page">
      <div className="page-header">
        <Typography variant="h4" component="h1" gutterBottom>
          لوحة التحكم
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          نظرة عامة على بيانات الشركات السعودية
        </Typography>
      </div>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الشركات"
            value={summary?.total_companies || 0}
            icon="business"
            color="primary"
            change={0}
            changeType="positive"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="الشركات المؤكدة"
            value={summary?.verified_companies || 0}
            icon="verified"
            color="success"
            change={0}
            changeType="positive"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الإيرادات"
            value={summary?.total_revenue ? `${(summary.total_revenue / 1000000).toFixed(1)}M SAR` : '0'}
            icon="attach_money"
            color="info"
            change={0}
            changeType="positive"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الموظفين"
            value={summary?.total_employees || 0}
            icon="people"
            color="warning"
            change={0}
            changeType="positive"
          />
        </Grid>
      </Grid>

      {/* Industry Category Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          توزيع الصناعات
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <Grid item xs={6} sm={4} md={2} key={category}>
              <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                <Chip 
                  label={IndustryCategoryLabels[category as IndustryCategory] || category}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1, width: '100%' }}
                />
                <Typography variant="h5" fontWeight="bold">
                  {count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  شركة
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="توزيع الشركات حسب الصناعة"
            type="pie"
            data={industryBreakdown || { labels: [], datasets: [] }}
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="توزيع الشركات حسب المنطقة"
            type="bar"
            data={regionalDistribution || { labels: [], datasets: [] }}
            height={300}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="معدل تبني التكنولوجيا (%)"
            type="bar"
            data={technologyAdoption || { labels: [], datasets: [] }}
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="حالة التحقق"
            type="doughnut"
            data={verificationStatus || { labels: [], datasets: [] }}
            height={300}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="توزيع الشركات حسب الحجم"
            type="bar"
            data={companySizeDistribution || { labels: [], datasets: [] }}
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopCompaniesList
            data={topCompanies || { companies: [] }}
            title="أفضل 5 شركات من حيث الإيرادات"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RecentActivity
            data={recentVerifications || { companies: [] }}
            title="آخر الشركات المؤكدة"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
