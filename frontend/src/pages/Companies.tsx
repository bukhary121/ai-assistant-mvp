import React, { useState, useEffect } from 'react';
import {
  useCompanies,
  useIndustries,
  useDeleteCompany,
} from '../hooks/useApi';
import {
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { IndustryCategory, CompanySize, CompanySizeLabels, IndustryCategoryLabels } from '../types/enums';
import { useNavigate } from 'react-router-dom';

const Companies: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    industry_id: '',
    region: '',
    city: '',
    company_size: '',
    verified: '',
    page: 1,
    page_size: 20,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);

  const { data: companiesData, isLoading, refetch } = useCompanies({
    ...filters,
    industry_id: filters.industry_id ? parseInt(filters.industry_id) : undefined,
    page: filters.page,
    page_size: filters.page_size,
  });

  const { data: industries, isLoading: industriesLoading } = useIndustries();
  const { mutate: deleteCompany, isLoading: isDeleting } = useDeleteCompany();

  // Saudi regions
  const saudiRegions = [
    'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'الشرقية', 'عسير',
    'تبوك', 'حائل', 'الجوف', 'نجران', 'الباحة', 'الحدود الشمالية'
  ];

  // Saudi cities (sample)
  const saudiCities = [
    'الرياض', 'جدة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران',
    'الاحساء', 'المبارك', 'تبوك', 'حائل', 'نجران', 'جيزان',
    'ابها', 'الطائف', 'القطيف', 'الخرج', 'الجبيل'
  ];

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  const handleDeleteClick = (id: number) => {
    setCompanyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (companyToDelete) {
      deleteCompany(companyToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCompanyToDelete(null);
          refetch();
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };

  const handleAddCompany = () => {
    navigate('/companies/new');
  };

  const handleViewCompany = (id: number) => {
    navigate(`/companies/${id}`);
  };

  const handleEditCompany = (id: number) => {
    navigate(`/companies/${id}/edit`);
  };

  if (isLoading || industriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              الشركات
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              إدارة بيانات الشركات السعودية
            </Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddCompany}
            sx={{ direction: 'ltr' }}
          >
            إضافة شركة
          </Button>
        </Box>
      </div>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterListIcon color="primary" sx={{ verticalAlign: 'middle', mx: 1 }} />
          فلتر الشركات
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="بحث" 
              variant="outlined"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="disabled" sx={{ mr: 1 }} />,
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>الصناعة</InputLabel>
              <Select
                value={filters.industry_id}
                label="الصناعة"
                onChange={(e) => handleFilterChange('industry_id', e.target.value)}
              >
                <MenuItem value="">جميع الصناعات</MenuItem>
                {industries?.map(industry => (
                  <MenuItem key={industry.id} value={industry.id}>
                    {industry.name_ar}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>المنطقة</InputLabel>
              <Select
                value={filters.region}
                label="المنطقة"
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <MenuItem value="">جميع المناطق</MenuItem>
                {saudiRegions.map(region => (
                  <MenuItem key={region} value={region}>{region}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>حجم الشركة</InputLabel>
              <Select
                value={filters.company_size}
                label="حجم الشركة"
                onChange={(e) => handleFilterChange('company_size', e.target.value)}
              >
                <MenuItem value="">جميع الأحجام</MenuItem>
                {Object.entries(CompanySizeLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>الحالة</InputLabel>
              <Select
                value={filters.verified}
                label="الحالة"
                onChange={(e) => handleFilterChange('verified', e.target.value)}
              >
                <MenuItem value="">جميع الحالات</MenuItem>
                <MenuItem value="true">مؤكدة</MenuItem>
                <MenuItem value="false">غير مؤكدة</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Companies Table */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            قائمة الشركات ({companiesData?.total || 0})
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>اسم الشركة</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الصناعة</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>المنطقة</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>المدينة</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الحجم</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companiesData?.companies.map((company, index) => (
                <TableRow key={company.id} hover>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {((companiesData.page - 1) * companiesData.page_size) + index + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 500 }}>
                    {company.name_ar}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {company.industry?.name_ar || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{company.region}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{company.city}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={CompanySizeLabels[company.company_size as CompanySize] || company.company_size || 'N/A'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={company.verified ? 'مؤكدة' : 'غير مؤكدة'}
                      size="small"
                      color={company.verified ? 'success' : 'warning'}
                      variant={company.verified ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Tooltip title="عرض">
                        <IconButton size="small" onClick={() => handleViewCompany(company.id)}>
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="تعديل">
                        <IconButton size="small" onClick={() => handleEditCompany(company.id)}>
                          <EditIcon color="secondary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="حذف">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(company.id)}
                          disabled={isDeleting}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Empty State */}
        {companiesData?.companies.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              لا توجد شركات مطابقة للفلاتر
            </Typography>
          </Box>
        )}
        
        {/* Pagination */}
        {companiesData && companiesData.total_pages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={companiesData.total_pages}
              page={companiesData.page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              sx={{ direction: 'ltr' }}
            />
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          تأكيد الحذف
        </DialogTitle>
        <DialogContent id="delete-dialog-description">
          <Typography>
            هل أنت متأكد من حذف هذه الشركة؟ لا يمكن التراجع عن هذا الإجراء.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            إلغاء
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? <CircularProgress size={20} /> : 'حذف'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Companies;
