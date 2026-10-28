import React, { useState } from 'react';
import {
  useAnalyticsOverview,
  useIndustryAnalysis,
  useMarketOpportunities,
  useCompetitiveAnalysis,
} from '../hooks/useApi';
import {
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Factory as FactoryIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';

const Analytics: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: industryAnalysis, isLoading: industryAnalysisLoading } = useIndustryAnalysis();
  const { data: marketOpportunities, isLoading: marketOpportunitiesLoading } = useMarketOpportunities();
  const { data: competitiveAnalysis, isLoading: competitiveAnalysisLoading } = useCompetitiveAnalysis();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (overviewLoading || industryAnalysisLoading || marketOpportunitiesLoading || competitiveAnalysisLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Prepare industry analysis chart data
  const industryChartData = {
    labels: Object.keys(industryAnalysis?.industries || {}),
    datasets: [
      {
        label: 'عدد الشركات',
        data: Object.values(industryAnalysis?.industries || {}).map(i => i.company_count),
        backgroundColor: 'rgba(25, 118, 210, 0.7)',
        borderColor: 'rgba(25, 118, 210, 1)',
      },
    ],
  };

  // Prepare market opportunities chart data
  const marketOpportunitiesChartData = {
    labels: marketOpportunities?.technology_gaps.map(t => t.technology) || [],
    datasets: [
      {
        label: 'معدل التبني (%)',
        data: marketOpportunities?.technology_gaps.map(t => t.penetration_rate) || [],
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
      },
      {
        label: 'الفجوة',
        data: marketOpportunities?.technology_gaps.map(t => t.gap) || [],
        backgroundColor: 'rgba(244, 67, 54, 0.7)',
        borderColor: 'rgba(244, 67, 54, 1)',
      },
    ],
  };

  // Prepare competitive analysis chart data
  const competitiveChartData = {
    labels: ['القادة', 'المتابعون', 'المتخلفون'],
    datasets: [
      {
        label: 'عدد الشركات',
        data: [
          competitiveAnalysis?.leaders.length || 0,
          competitiveAnalysis?.followers.length || 0,
          competitiveAnalysis?.laggards.length || 0,
        ],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(244, 67, 54, 0.7)',
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)',
        ],
      },
    ],
  };

  return (
    <div className="page">
      <div className="page-header">
        <Typography variant="h4" component="h1" gutterBottom>
          التحليلات
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          تحليل شامل لبيانات الشركات السعودية
        </Typography>
      </div>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="نظرة عامة" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="تحليل الصناعات" icon={<FactoryIcon />} iconPosition="start" />
          <Tab label="فرص السوق" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="التحليل التنافسي" icon={<PeopleIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Box>
          {/* Overview Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="إجمالي الشركات"
                value={overview?.total_companies || 0}
                icon="business"
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="معدل التبني التكنولوجي"
                value={`${overview?.quick_stats?.tech_adoption_rate || 0}%`}
                icon="trending_up"
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="معدل التحقق"
                value={`${overview?.quick_stats?.verification_rate || 0}%`}
                icon="verified"
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="متوسط الإيرادات"
                value={overview?.quick_stats?.average_revenue 
                  ? `${(overview.quick_stats.average_revenue / 1000000).toFixed(1)}M SAR`
                  : '0'}
                icon="attach_money"
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Overview Charts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <ChartCard
                title="توزيع الشركات حسب الصناعة"
                type="pie"
                data={{
                  labels: overview?.industry_distribution.map(i => i.name) || [],
                  datasets: [{
                    label: 'عدد الشركات',
                    data: overview?.industry_distribution.map(i => i.count) || [],
                    backgroundColor: [
                      'rgba(25, 118, 210, 0.7)',
                      'rgba(156, 39, 176, 0.7)',
                      'rgba(76, 175, 80, 0.7)',
                      'rgba(255, 152, 0, 0.7)',
                      'rgba(244, 67, 54, 0.7)',
                    ],
                  }],
                }}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard
                title="توزيع الشركات حسب المنطقة"
                type="bar"
                data={{
                  labels: overview?.regional_distribution.map(r => r.region) || [],
                  datasets: [{
                    label: 'عدد الشركات',
                    data: overview?.regional_distribution.map(r => r.count) || [],
                    backgroundColor: 'rgba(33, 150, 243, 0.7)',
                    borderColor: 'rgba(33, 150, 243, 1)',
                  }],
                }}
                height={300}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ChartCard
                title="معدل تبني التكنولوجيا (%)"
                type="bar"
                data={{
                  labels: Object.keys(overview?.technology_adoption || {}),
                  datasets: [{
                    label: 'عدد الشركات',
                    data: Object.values(overview?.technology_adoption || {}),
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                  }],
                }}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard
                title="توزيع الشركات حسب الحجم"
                type="doughnut"
                data={{
                  labels: overview?.company_size_distribution.map(s => s.size) || [],
                  datasets: [{
                    label: 'عدد الشركات',
                    data: overview?.company_size_distribution.map(s => s.count) || [],
                    backgroundColor: [
                      'rgba(255, 193, 7, 0.7)',
                      'rgba(33, 150, 243, 0.7)',
                      'rgba(25, 118, 210, 0.7)',
                      'rgba(156, 39, 176, 0.7)',
                    ],
                  }],
                }}
                height={300}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            تحليل الصناعات
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(industryAnalysis?.industries || {}).map(([name, data]) => (
              <Grid item xs={12} md={6} lg={4} key={name}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {name}
                  </Typography>
                  <Chip label={data.category} color="primary" variant="outlined" sx={{ mb: 2 }} />
                  
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
                </Paper>
              </Grid>
            ))}
          </Grid>

          <ChartCard
            title="مقارنة بين الصناعات"
            type="bar"
            data={industryChartData}
            height={300}
          />
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            فرص السوق
          </Typography>

          {/* High Potential Segments */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              قطاعات ذات إمكانيات عالية
            </Typography>
            <Grid container spacing={2}>
              {marketOpportunities?.high_potential_segments.map((segment, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="body1" fontWeight="bold">{segment.industry}</Typography>
                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Chip 
                        label={segment.potential}
                        color="success"
                        variant="filled"
                        size="small"
                      />
                    </Box>
                    <Box mt={2}>
                      <Typography variant="body2">
                        عدد الشركات: {segment.company_count}
                      </Typography>
                      <Typography variant="body2">
                        معدل تبني التكنولوجيا: {segment.tech_adoption_rate}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Technology Gaps */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              فجوات التكنولوجيا
            </Typography>
            <ChartCard
              title="معدل تبني التكنولوجيا والفجوات"
              type="bar"
              data={marketOpportunitiesChartData}
              height={300}
            />
          </Paper>

          {/* Regional Opportunities */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              فرص إقليمية
            </Typography>
            <Grid container spacing={2}>
              {marketOpportunities?.regional_opportunities.map((opportunity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="body1" fontWeight="bold">{opportunity.region}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {opportunity.opportunity}
                    </Typography>
                    <Box mt={2}>
                      <Typography variant="body2">
                        عدد الشركات: {opportunity.company_count}
                      </Typography>
                      <Typography variant="body2">
                        معدل التحقق: {opportunity.verification_rate}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Automation Potential */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              إمكانيات الأتمتة
            </Typography>
            <Grid container spacing={2}>
              {marketOpportunities?.automation_potential.slice(0, 6).map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="body1" fontWeight="bold">{item.company_name}</Typography>
                    <Chip 
                      label={item.industry}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    <Box mt={2}>
                      <Typography variant="body2">
                        التحديات المطابقة: {item.matching_challenges.join(', ')}
                      </Typography>
                      <Chip 
                        label={item.has_automation ? 'لديها أتمتة' : 'لا يوجد أتمتة'}
                        color={item.has_automation ? 'success' : 'warning'}
                        variant={item.has_automation ? 'filled' : 'outlined'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )}

      {tabValue === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            التحليل التنافسي
          </Typography>

          {/* Competitive Intensity */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              كثافة التنافس
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h5" fontWeight="bold">
                    {competitiveAnalysis?.competitive_intensity.total_companies || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    إجمالي الشركات
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h5" fontWeight="bold">
                    {competitiveAnalysis?.competitive_intensity.average_score || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    متوسط الدرجة
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h5" fontWeight="bold">
                    {competitiveAnalysis?.competitive_intensity.max_score || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    أعلى درجة
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h5" fontWeight="bold">
                    {competitiveAnalysis?.competitive_intensity.score_range || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    نطاق الدرجات
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Leaders, Followers, Laggards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="success.main">
                  القادة ({competitiveAnalysis?.leaders.length || 0})
                </Typography>
                <Box maxHeight={300} overflow="auto">
                  {competitiveAnalysis?.leaders.map((leader, index) => (
                    <Box key={index} p={1} borderBottom={index < competitiveAnalysis.leaders.length - 1 ? '1px solid #eee' : 'none'}>
                      <Typography variant="body2" fontWeight="bold">{leader.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {leader.industry} - {leader.region}
                      </Typography>
                      <Chip label={`درجة: ${leader.score}`} size="small" color="success" variant="outlined" sx={{ mt: 0.5 }} />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="warning.main">
                  المتبعون ({competitiveAnalysis?.followers.length || 0})
                </Typography>
                <Box maxHeight={300} overflow="auto">
                  {competitiveAnalysis?.followers.map((follower, index) => (
                    <Box key={index} p={1} borderBottom={index < competitiveAnalysis.followers.length - 1 ? '1px solid #eee' : 'none'}>
                      <Typography variant="body2" fontWeight="bold">{follower.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {follower.industry}
                      </Typography>
                      <Chip label={`درجة: ${follower.score}`} size="small" color="warning" variant="outlined" sx={{ mt: 0.5 }} />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="error.main">
                  المتخلفون ({competitiveAnalysis?.laggards.length || 0})
                </Typography>
                <Box maxHeight={300} overflow="auto">
                  {competitiveAnalysis?.laggards.map((laggard, index) => (
                    <Box key={index} p={1} borderBottom={index < competitiveAnalysis.laggards.length - 1 ? '1px solid #eee' : 'none'}>
                      <Typography variant="body2" fontWeight="bold">{laggard.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {laggard.industry}
                      </Typography>
                      <Chip label={`درجة: ${laggard.score}`} size="small" color="error" variant="outlined" sx={{ mt: 0.5 }} />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <ChartCard
            title="تصنيف الشركات التنافسي"
            type="pie"
            data={competitiveChartData}
            height={300}
          />
        </Box>
      )}
    </div>
  );
};

export default Analytics;
