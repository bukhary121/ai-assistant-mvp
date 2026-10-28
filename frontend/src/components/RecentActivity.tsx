import React from 'react';
import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Verified as VerifiedIcon, Business as BusinessIcon, LocationOn as LocationOnIcon, DateRange as DateRangeIcon } from '@mui/icons-material';

interface RecentActivityProps {
  data: {
    companies: Array<{
      id: number;
      name: string;
      industry: string;
      region: string;
      verification_date: string;
    }>;
  };
  title: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ data, title }) => {
  const theme = useTheme();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <List dense>
        {data.companies.map((company, index) => (
          <ListItem key={company.id} divider={index < data.companies.length - 1}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <VerifiedIcon fontSize="small" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={company.name}
              secondary={
                <Box display="flex" gap={1} alignItems="center">
                  <Chip label={company.industry} size="small" variant="outlined" />
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocationOnIcon fontSize="small" color="disabled" />
                    <Typography variant="caption" color="text.secondary">
                      {company.region}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <DateRangeIcon fontSize="small" color="disabled" />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(company.verification_date)}
                    </Typography>
                  </Box>
                </Box>
              }
              primaryTypographyProps={{ fontWeight: 500, variant: 'body1' }}
            />
          </ListItem>
        ))}
      </List>
      
      {data.companies.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          لا توجد بيانات
        </Typography>
      )}
    </Paper>
  );
};

export default RecentActivity;
