import React from 'react';
import { useCompetitiveAnalysis } from '../hooks/useApi';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { People as PeopleIcon, Assessment as AssessmentIcon, EmojiEvents as EmojiEventsIcon } from '@mui/icons-material';
import ChartCard from '../components/ChartCard';

const CompetitiveAnalysis: React.FC = () => {
  const { data: competitiveAnalysis, isLoading } = useCompetitiveAnalysis();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!competitiveAnalysis) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          لا توجد بيانات للتحليل التنافسي
        </Typography>
      </Paper>
    );
  }

  // Prepare chart data
  const competitiveChartData = {
    labels: ['القادة', 'المتابعون', 'المتخلفون'],
    datasets: [
      {
        label: 'عدد الشركات',
        data: [
          competitiveAnalysis.leaders.length,
          competitiveAnalysis.followers.length,
          competitiveAnalysis.laggards.length,
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

  const scoreChartData = {
    labels: ['أدنى درجة', 'متوسط الدرجة', 'أعلى درجة'],
    datasets: [
      {
        label: 'الدرجات',
        data: [
          competitiveAnalysis.competitive_intensity.min_score,
          competitiveAnalysis.competitive_intensity.average_score,
          competitiveAnalysis.competitive_intensity.max_score,
        ],
        backgroundColor: [
          'rgba(244, 67, 54, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(76, 175, 80, 0.7)',
        ],
        borderColor: [
          'rgba(244, 67, 54, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(76, 175, 80, 1)',
        ],
      },
    ],
  };

  return (
    <div className="page">
      <div className="page-header">
        <Typography variant="h4" component="h1" gutterBottom>
          التحليل التنافسي
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          تحليل المنافسة بين الشركات السعودية
        </Typography>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                إجمالي الشركات
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {competitiveAnalysis.competitive_intensity.total_companies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                متوسط الدرجة
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {competitiveAnalysis.competitive_intensity.average_score.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                أعلى درجة
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {competitiveAnalysis.competitive_intensity.max_score}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                نطاق الدرجات
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {competitiveAnalysis.competitive_intensity.score_range}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="تصنيف الشركات التنافسي"
            type="pie"
            data={competitiveChartData}
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="مقاييس الدرجات التنافسية"
            type="bar"
            data={scoreChartData}
            height={300}
          />
        </Grid>
      </Grid>

      {/* Leaders */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEventsIcon color="success" />
          القادة ({competitiveAnalysis.leaders.length})
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>اسم الشركة</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الصناعة</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>المنطقة</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الدرجة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competitiveAnalysis.leaders.map((leader, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ textAlign: 'right' }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 500 }}>{leader.name}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{leader.industry}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{leader.region}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Chip label={leader.score} color="success" variant="filled" size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Followers and Laggards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="warning" />
              المتبعون ({competitiveAnalysis.followers.length})
            </Typography>
            
            <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>اسم الشركة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الصناعة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الدرجة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {competitiveAnalysis.followers.map((follower, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ textAlign: 'right' }}>{index + 1}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>{follower.name}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>{follower.industry}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Chip label={follower.score} color="warning" variant="outlined" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="error" />
              المتخلفون ({competitiveAnalysis.laggards.length})
            </Typography>
            
            <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>اسم الشركة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الصناعة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>الدرجة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {competitiveAnalysis.laggards.map((laggard, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ textAlign: 'right' }}>{index + 1}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>{laggard.name}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>{laggard.industry}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Chip label={laggard.score} color="error" variant="outlined" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Analysis Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="القادة"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              avatar={<EmojiEventsIcon color="success" />}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                الشركات الأكثر تنافسية
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="h5" fontWeight="bold">
                  {competitiveAnalysis.leaders.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  شركة
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                متوسط الدرجة: {(competitiveAnalysis.leaders.reduce((sum, l) => sum + l.score, 0) / competitiveAnalysis.leaders.length).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="المتابعون"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              avatar={<PeopleIcon color="warning" />}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                الشركات ذات التنافسية المتوسطة
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="h5" fontWeight="bold">
                  {competitiveAnalysis.followers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  شركة
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                متوسط الدرجة: {(competitiveAnalysis.followers.reduce((sum, f) => sum + f.score, 0) / competitiveAnalysis.followers.length).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="المتخلفون"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              avatar={<PeopleIcon color="error" />}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                الشركات الأقل تنافسية
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="h5" fontWeight="bold">
                  {competitiveAnalysis.laggards.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  شركة
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                متوسط الدرجة: {(competitiveAnalysis.laggards.reduce((sum, l) => sum + l.score, 0) / competitiveAnalysis.laggards.length).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CompetitiveAnalysis;
