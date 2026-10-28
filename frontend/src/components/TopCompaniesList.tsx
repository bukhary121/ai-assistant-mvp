import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Business as BusinessIcon, LocationOn as LocationOnIcon, AttachMoney as AttachMoneyIcon, People as PeopleIcon } from '@mui/icons-material';

interface TopCompaniesListProps {
  data: {
    companies: Array<{
      id: number;
      name: string;
      industry: string;
      region: string;
      revenue?: number;
      employees?: number;
    }>;
  };
  title: string;
}

const TopCompaniesList: React.FC<TopCompaniesListProps> = ({ data, title }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>اسم الشركة</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الصناعة</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>المنطقة</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الإيرادات</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الموظفون</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.companies.map((company, index) => (
              <TableRow key={company.id} hover>
                <TableCell sx={{ textAlign: 'right' }}>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontWeight: 500 }}>{company.name}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Chip label={company.industry} size="small" variant="outlined" />
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{company.region}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  {company.revenue ? `${(company.revenue / 1000000).toFixed(1)}M SAR` : 'N/A'}
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{company.employees || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {data.companies.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          لا توجد بيانات
        </Typography>
      )}
    </Paper>
  );
};

export default TopCompaniesList;
