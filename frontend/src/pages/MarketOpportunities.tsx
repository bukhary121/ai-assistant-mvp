import React from 'react';
import { useMarketOpportunities } from '../hooks/useApi';
import {
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Chip,
} from '@mui/material';
import { TrendingUp as TrendingUpIcon, Opportunity as OpportunityIcon } from '@mui/icons-material';
import ChartCard from '../components/ChartCard';

const MarketOpportunities: React.FC = () => {
  const { data: marketOpportunities, isLoading } = useMarketOpportunities();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!marketOpportunities) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          لا توجد بيانات لفرص السوق
        </Typography>
      </Paper>
    );
  }

  // Prepare chart data
  const techGapsChartData = {
    labels: marketOpportunities.technology_gaps.map(t => t.technology),
    datasets: [
      {
        label: 'معدل التبني (%)',
        data: marketOpportunities.technology_gaps.map(t => t.penetration_rate),
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
      },
      {
        label: 'الفجوة',
        data: marketOpportunities.technology_gaps.map(t => t.gap),
        backgroundColor: 'rgba(244, 67, 54, 0.7)',
        borderColor: 'rgba(244, 67, 54, 1)',
      },
    ],
  };

  const regionalChartData = {
    labels: marketOpportunities.regional_opportunities.map(r => r.region),
    datasets: [
      {
        label: 'عدد الشركات',
        data: marketOpportunities.regional_opportunities.map(r => r.company_count),
        backgroundColor: 'rgba(25, 118, 210, 0.7)',
        borderColor: 'rgba(25, 118, 210, 1)',
      },
    ],
  };

  return (
    <div className="page">
      <div className="page-header">
        <Typography variant="h4" component="h1" gutterBottom>
          فرص السوق
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          اكتشاف فرص الأعمال في السوق السعودي
        </Typography>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                قطاعات عالية الإمكانات
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {marketOpportunities.high_potential_segments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                فجوات التكنولوجيا
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {marketOpportunities.technology_gaps.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                فرص إقليمية
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {marketOpportunities.regional_opportunities.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                إمكانيات الأتمتة
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {marketOpportunities.automation_potential.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* High Potential Segments */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" />
          قطاعات ذات إمكانيات عالية
        </Typography>
        
        <Grid container spacing={2}>
          {marketOpportunities.high_potential_segments.map((segment, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardHeader
                  title={segment.industry}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                  action={
                    <Chip 
                      label={segment.potential}
                      color="success"
                      variant="filled"
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold">
                        {segment.company_count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        شركة
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold">
                        {segment.tech_adoption_rate}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        تبني التكنولوجيا
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    قطاع ذو إمكانيات عالية بسبب انخفاض معدل تبني التكنولوجيا
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Technology Gaps */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <OpportunityIcon color="warning" />
          فجوات التكنولوجيا
        </Typography>
        
        <ChartCard
          title="معدل تبني التكنولوجيا والفجوات"
          type="bar"
          data={techGapsChartData}
          height={300}
        />
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {marketOpportunities.technology_gaps.map((gap, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">{gap.technology}</Typography>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="body2">
                      عدد الشركات: {gap.adopted}
                    </Typography>
                    <Typography variant="body2">
                      الفجوة: {gap.gap}
                    </Typography>
                  </Box>
                  <Box mt={1}>
                    <Chip 
                      label={`معدل التبني: ${gap.penetration_rate}%`}
                      color={gap.penetration_rate > 50 ? 'success' : gap.penetration_rate > 25 ? 'warning' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Regional Opportunities */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="info" />
          فرص إقليمية
        </Typography>
        
        <ChartCard
          title="توزيع الشركات حسب المنطقة"
          type="bar"
          data={regionalChartData}
          height={300}
        />
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {marketOpportunities.regional_opportunities.map((opportunity, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined">
                <CardHeader
                  title={opportunity.region}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold">
                        {opportunity.company_count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        شركة
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold">
                        {opportunity.verification_rate}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        معدل التحقق
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={opportunity.opportunity}
                    color="info"
                    variant="outlined"
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Automation Potential */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="secondary" />
          إمكانيات الأتمتة
        </Typography>
        
        <Grid container spacing={2}>
          {marketOpportunities.automation_potential.slice(0, 12).map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined">
                <CardHeader
                  title={item.company_name}
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold' }}
                  subheader={item.industry}
                  action={
                    <Chip 
                      label={item.has_automation ? 'لديها أتمتة' : 'لا يوجد أتمتة'}
                      color={item.has_automation ? 'success' : 'warning'}
                      variant={item.has_automation ? 'filled' : 'outlined'}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    التحديات المطابقة:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {item.matching_challenges.map((challenge, idx) => (
                      <Chip key={idx} label={challenge} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

export default MarketOpportunities;
