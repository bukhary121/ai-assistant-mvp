import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useCompany,
  useIndustries,
  useCompanyAnalytics,
} from '../hooks/useApi';
import {
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  Verified as VerifiedIcon,
  CalendarToday as CalendarTodayIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Web as WebIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { CompanySizeLabels, IndustryCategoryLabels } from '../types/enums';
import ChartCard from '../components/ChartCard';

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const { data: company, isLoading, refetch } = useCompany(id ? parseInt(id) : null);
  const { data: industries, isLoading: industriesLoading } = useIndustries();
  const { data: analytics, isLoading: analyticsLoading } = useCompanyAnalytics(id ? parseInt(id) : null);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading || industriesLoading || analyticsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          لم يتم العثور على الشركة
        </Typography>
        <Button onClick={() => navigate('/companies')} sx={{ mt: 2 }}>
          العودة إلى قائمة الشركات
        </Button>
      </Paper>
    );
  }

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format revenue
  const formatRevenue = (revenue: number | undefined) => {
    if (!revenue) return 'N/A';
    if (revenue >= 1000000) {
      return `${(revenue / 1000000).toFixed(2)} مليون ريال`;
    } else if (revenue >= 1000) {
      return `${(revenue / 1000).toFixed(2)} ألف ريال`;
    }
    return `${revenue} ريال`;
  };

  // Render rating
  const renderRating = (rating: number | undefined) => {
    if (!rating) return null;
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        {Array.from({ length: 5 }).map((_, index) => (
          index < Math.floor(rating) ? (
            <StarIcon key={index} color="primary" fontSize="small" />
          ) : (
            <StarBorderIcon key={index} color="disabled" fontSize="small" />
          )
        ))}
        <Typography variant="body2" color="text.secondary">
          ({rating.toFixed(1)})
        </Typography>
      </Box>
    );
  };

  // Analytics data for charts
  const analyticsChartData = {
    labels: analytics?.analytics_history.map(a => a.period || `الفترة ${analytics?.analytics_history.indexOf(a) + 1}`) || [],
    datasets: [
      {
        label: 'نمو الإيرادات (%)',
        data: analytics?.analytics_history.map(a => a.revenue_growth || 0) || [],
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: 'rgba(76, 175, 80, 1)',
        fill: false,
      },
      {
        label: 'نمو الموظفين (%)',
        data: analytics?.analytics_history.map(a => a.employee_growth || 0) || [],
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderColor: 'rgba(25, 118, 210, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="page">
      <div className="page-header">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              {company.name_ar}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              {company.industry && (
                <Chip 
                  label={company.industry.name_ar}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Chip 
                label={company.verified ? 'مؤكدة' : 'غير مؤكدة'}
                color={company.verified ? 'success' : 'warning'}
                variant={company.verified ? 'filled' : 'outlined'}
              />
              {company.rating && renderRating(company.rating)}
            </Box>
          </div>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/companies')}
            startIcon={<BusinessIcon />}
          >
            العودة إلى الشركات
          </Button>
        </Box>
      </div>

      {/* Company Header Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 1,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                <BusinessIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                {company.trade_name || company.name_ar}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {company.name_en}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOnIcon color="disabled" />
                  <Typography variant="body2">{company.region}, {company.city}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon color="disabled" />
                  <Typography variant="body2">{formatDate(company.establishment_date)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PeopleIcon color="disabled" />
                  <Typography variant="body2">{company.employee_count || 0} موظف</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AttachMoneyIcon color="disabled" />
                  <Typography variant="body2">{formatRevenue(company.estimated_revenue)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <VerifiedIcon color={company.verified ? 'success' : 'disabled'} />
                  <Typography variant="body2">
                    {company.verified ? 'مؤكدة' : 'غير مؤكدة'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <BusinessIcon color="disabled" />
                  <Typography variant="body2">
                    {CompanySizeLabels[company.company_size as keyof typeof CompanySizeLabels] || company.company_size || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ p: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="نظرة عامة" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="معلومات الاتصال" icon={<PhoneIcon />} iconPosition="start" />
          <Tab label="التحليلات" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="التاريخ" icon={<HistoryIcon />} iconPosition="start" />
        </Tabs>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              معلومات الشركة
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    معلومات أساسية
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="الاسم التجاري" 
                        secondary={company.trade_name || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="رقم السجل التجاري" 
                        secondary={company.cr_number || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="الرقم الضريبي" 
                        secondary={company.tax_number || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="تاريخ التأسيس" 
                        secondary={formatDate(company.establishment_date)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="نوع الشركة" 
                        secondary={company.company_type || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="الملكية" 
                        secondary={company.ownership || 'N/A'}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    الموقع
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="العنوان" 
                        secondary={company.address || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="الحي" 
                        secondary={company.district || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="الإحداثيات" 
                        secondary={company.latitude && company.longitude 
                          ? `${company.latitude}, ${company.longitude}` 
                          : 'N/A'}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    الوصف
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" whiteSpace="pre-wrap">
                    {company.description || 'لا يوجد وصف'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    الخدمات والمنتجات
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {company.services && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        الخدمات:
                      </Typography>
                      <Typography variant="body1">{company.services}</Typography>
                    </Box>
                  )}
                  {company.products && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        المنتجات:
                      </Typography>
                      <Typography variant="body1">{company.products}</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              معلومات الاتصال
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    معلومات الاتصال الأساسية
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <PhoneIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="الهاتف" 
                        secondary={company.phone || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <PhoneIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="الجوال" 
                        secondary={company.mobile || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <EmailIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="البريد الإلكتروني" 
                        secondary={company.email || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <LanguageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="الموقع الإلكتروني" 
                        secondary={company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            {company.website}
                          </a>
                        ) : 'N/A'}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    وسائل التواصل الاجتماعي
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {company.social_media && Object.keys(company.social_media).length > 0 ? (
                    <List dense>
                      {Object.entries(company.social_media).map(([platform, url]) => (
                        <ListItem key={platform}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.light' }}>
                              {platform === 'twitter' && '🐦'}
                              {platform === 'linkedin' && '🔗'}
                              {platform === 'facebook' && '📘'}
                              {platform === 'instagram' && '📷'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={platform}
                            secondary={(
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                {url}
                              </a>
                            )}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      لا توجد وسائل التواصل الاجتماعي
                    </Typography>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    تبني التكنولوجيا
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {company.has_website && (
                      <Chip label="موقع إلكتروني" icon={<WebIcon />} color="success" variant="outlined" />
                    )}
                    {company.has_crm && (
                      <Chip label="نظام CRM" icon={<SettingsIcon />} color="success" variant="outlined" />
                    )}
                    {company.has_erp && (
                      <Chip label="نظام ERP" icon={<SettingsIcon />} color="success" variant="outlined" />
                    )}
                    {company.has_marketing_automation && (
                      <Chip label="تسويق آلي" icon={<SettingsIcon />} color="success" variant="outlined" />
                    )}
                    {company.has_ai_solutions && (
                      <Chip label="حلول الذكاء الاصطناعي" icon={<SettingsIcon />} color="success" variant="outlined" />
                    )}
                    {!company.has_website && !company.has_crm && !company.has_erp && 
                      !company.has_marketing_automation && !company.has_ai_solutions && (
                      <Typography variant="body2" color="text.secondary">
                        لا توجد أنظمة تكنولوجية
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              التحليلات
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    مقارنة مع الصناعة
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {analytics?.comparisons ? (
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">
                          متوسط إيرادات الصناعة:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {formatRevenue(analytics.comparisons.industry_average_revenue)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">
                          متوسط عدد الموظفين في الصناعة:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {Math.round(analytics.comparisons.industry_average_employees)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">
                          موقع الشركة:
                        </Typography>
                        <Chip 
                          label={analytics.comparisons.company_position === 'above_average' ? 'أفضل من المتوسط' : 'أقل من المتوسط'}
                          color={analytics.comparisons.company_position === 'above_average' ? 'success' : 'warning'}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      لا توجد بيانات مقارنة
                    </Typography>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    التحديات واحتياجات الأتمتة
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box>
                    {company.challenges && company.challenges.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          التحديات:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {company.challenges.map((challenge, index) => (
                            <Chip key={index} label={challenge} color="warning" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                    {company.automation_needs && company.automation_needs.length > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          احتياجات الأتمتة:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {company.automation_needs.map((need, index) => (
                            <Chip key={index} label={need} color="primary" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                    {!company.challenges && !company.automation_needs && (
                      <Typography variant="body2" color="text.secondary">
                        لا توجد بيانات
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <ChartCard
                  title="اتجاهات النمو"
                  type="line"
                  data={analyticsChartData}
                  height={300}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              التاريخ
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    معلومات التاريخ
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="تاريخ الإنشاء" 
                        secondary={formatDate(company.created_at)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="آخر تحديث" 
                        secondary={formatDate(company.last_updated)}
                      />
                    </ListItem>
                    {company.verification_date && (
                      <ListItem>
                        <ListItemText 
                          primary="تاريخ التحقق" 
                          secondary={formatDate(company.verification_date)}
                        />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemText 
                        primary="مصدر البيانات" 
                        secondary={company.data_source || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="جودة البيانات" 
                        secondary={company.data_quality || 'N/A'}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    السجل
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    سيتم عرض سجل أنشطة الشركة هنا
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default CompanyDetail;
