import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: 'business' | 'verified' | 'attach_money' | 'people' | 'check' | 'warning' | 'trending_up' | 'trending_down';
  color: 'primary' | 'success' | 'info' | 'warning' | 'error';
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const iconMap = {
  business: BusinessIcon,
  verified: VerifiedIcon,
  attach_money: AttachMoneyIcon,
  people: PeopleIcon,
  check: CheckCircleIcon,
  warning: WarningIcon,
  trending_up: TrendingUpIcon,
  trending_down: TrendingDownIcon,
};

const colorMap = {
  primary: { bg: 'rgba(25, 118, 210, 0.1)', text: '#1976d2' },
  success: { bg: 'rgba(76, 175, 80, 0.1)', text: '#4caf50' },
  info: { bg: 'rgba(33, 150, 243, 0.1)', text: '#2196f3' },
  warning: { bg: 'rgba(255, 152, 0, 0.1)', text: '#ff9800' },
  error: { bg: 'rgba(244, 67, 54, 0.1)', text: '#f44336' },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  change,
  changeType = 'neutral',
}) => {
  const theme = useTheme();
  const Icon = iconMap[icon];
  const colors = colorMap[color];

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '8px',
            backgroundColor: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text,
          }}
        >
          <Icon fontSize="large" />
        </Box>
        {change !== undefined && (
          <Chip
            label={`${change > 0 ? '+' : ''}${change}%`}
            size="small"
            color={changeType === 'positive' ? 'success' : changeType === 'negative' ? 'error' : 'default'}
            sx={{ fontSize: '0.75rem' }}
          />
        )}
      </Box>
      
      <Box mt={2}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCard;
