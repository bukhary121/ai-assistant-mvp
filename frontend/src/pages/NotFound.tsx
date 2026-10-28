import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button } from '@mui/material';
import { ErrorOutline as ErrorOutlineIcon, Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
      p={4}
    >
      <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 600 }}>
        <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          404 - الصفحة غير موجودة
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
        </Typography>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
          >
            العودة إلى الصفحة الرئيسية
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            العودة إلى الخلف
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;
