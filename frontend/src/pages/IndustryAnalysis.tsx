import React from 'react';
import { useIndustryAnalysis } from '../hooks/useApi';
import {
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { Factory as FactoryIcon, Assessment as AssessmentIcon } from '@mui/icons-material';
import ChartCard from '../components/ChartCard';

const IndustryAnalysis: React.FC = () => {
  const { data: industryAnalysis, isLoading } = useIndustryAnalysis();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!industryAnalysis) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          لا توجد بيانات للتحليل
        </Typography>
      </Paper>
    );
  }

  // Prepare chart data for each industry category
  const medicineData = industryAnalysis.industries['Hospitals'] || 
                       industryAnalysis.industries['Clinics'] || 
                       industryAnalysis.industries['Pharmacies'] || null;
  
  const engineeringData = industryAnalysis.industries['Civil Engineering'] || 
                          industryAnalysis.industries['Mechanical Engineering'] || null;
  
  const contractingData = industryAnalysis.industries['General Contracting'] || 
                          industryAnalysis.industries['Specialized Contracting'] || null;
  
  const restaurantsData = industryAnalysis.industries['Restaurants'] || 
                         industryAnalysis.industries['Cafes'] || null;
  
  const sportsData = industryAnalysis.industries['Gyms'] || 
                     industryAnalysis.industries['Sports Clubs'] || null;

  // Create comparison chart data
  const comparisonChartData = {
    labels: Object.keys(industryAnalysis.industries),
    datasets: [
      {
        label: 'عدد الشركات',
        data: Object.values(industryAnalysis.industries).map(i => i.company_count),
        backgroundColor: 'rgba(25, 118, 210, 0.7)',
        borderColor: 'rgba(25, 118, 210, 1)',
      },
      {
        label: 'عدد الموظفين (ألف)',
        data: Object.values(industryAnalysis.industries).map(i => Math.round(i.total_employees / 1000)),
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
      },
    ],
  };

  const revenueChartData = {
    labels: Object.keys(industryAnalysis.industries),
    datasets: [
      {
        label: 'إجمالي الإيرادات (مليون ريال)',
        data: Object.values(industryAnalysis.industries).map(i => Math.round(i.total_revenue / 1000000)),
        backgroundColor: 'rgba(156, 39, 176, 0.7)',
        borderColor: 'rgba(156, 39, 176, 1)',
      },
    ],
  };

  const techAdoptionChartData = {
    labels: Object.keys(industryAnalysis.industries),
    datasets: [
      {
        label: 'معدل تبني التكنولوجيا (%)',
        data: Object.values(industryAnalysis.industries).map(i => i.tech_adoption_score),
        backgroundColor: 'rgba(255, 152, 0, 0.7)',
        borderColor: 'rgba(255, 152, 0, 1)',
      },
    ],
  };

  return (
    <div className="page">
      <div className="page-header">
        <Typography variant="h4" component="h1" gutterBottom>
          تحليل الصناعات
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          تحليل مفصل للصناعات السعودية
        </Typography>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                إجمالي الصناعات
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {Object.keys(industryAnalysis.industries).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                إجمالي الشركات
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {Object.values(industryAnalysis.industries)
                  .reduce((sum, industry) => sum + industry.company_count, 0)
                  .toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                إجمالي الموظفين
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {Object.values(industryAnalysis.industries)
                  .reduce((sum, industry) => sum + industry.total_employees, 0)
                  .toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                إجمالي الإيرادات
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {((Object.values(industryAnalysis.industries)
                  .reduce((sum, industry) => sum + industry.total_revenue, 0)) / 1000000).toFixed(1)}M
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Comparison Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <ChartCard
            title="مقارنة بين الصناعات - عدد الشركات والموظفين"
            type="bar"
            data={comparisonChartData}
            height={350}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="إجمالي الإيرادات حسب الصناعة"
            type="bar"
            data={revenueChartData}
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="معدل تبني التكنولوجيا حسب الصناعة"
            type="bar"
            data={techAdoptionChartData}
            height={300}
          />
        </Grid>
      </Grid>

      {/* Industry Details */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        تفاصيل الصناعات
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(industryAnalysis.industries).map(([name, data]) => (
          <Grid item xs={12} md={6} lg={4} key={name}>
            <Card>
              <CardHeader
                title={name}
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                action={
                  <Chip 
                    label={data.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {data.company_count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        شركة
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {data.total_employees.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        موظف
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {(data.total_revenue / 1000000).toFixed(1)}M
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        إيرادات
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {data.tech_adoption_score.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        تبني التكنولوجيا
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {data.specializations && Object.keys(data.specializations).length > 0 && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      التخصصات:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {Object.entries(data.specializations).map(([spec, count]) => (
                        <Chip 
                          key={spec} 
                          label={`${spec} (${count})`} 
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    تبني التكنولوجيا:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {Object.entries(data.technology_adoption).map(([tech, count]) => (
                      <Chip 
                        key={tech} 
                        label={`${tech}: ${count}`} 
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default IndustryAnalysis;
