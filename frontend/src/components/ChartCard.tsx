import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface ChartCardProps {
  title: string;
  type: 'bar' | 'pie' | 'doughnut' | 'line';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: (number | null)[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      fill?: boolean;
    }>;
  };
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, type, data, height = 300 }) => {
  // Default colors for datasets
  const defaultColors = [
    'rgba(25, 118, 210, 0.7)',
    'rgba(156, 39, 176, 0.7)',
    'rgba(76, 175, 80, 0.7)',
    'rgba(255, 152, 0, 0.7)',
    'rgba(244, 67, 54, 0.7)',
    'rgba(33, 150, 243, 0.7)',
    'rgba(255, 193, 7, 0.7)',
  ];

  const defaultBorderColors = [
    'rgba(25, 118, 210, 1)',
    'rgba(156, 39, 176, 1)',
    'rgba(76, 175, 80, 1)',
    'rgba(255, 152, 0, 1)',
    'rgba(244, 67, 54, 1)',
    'rgba(33, 150, 243, 1)',
    'rgba(255, 193, 7, 1)',
  ];

  // Apply default colors if not provided
  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || defaultColors[index % defaultColors.length],
      borderColor: dataset.borderColor || defaultBorderColors[index % defaultBorderColors.length],
      borderWidth: 1,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 11 },
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
        },
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={options} height={height} />;
      case 'pie':
        return <Pie data={chartData} options={options} height={height} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} height={height} />;
      case 'line':
        return <Line data={chartData} options={options} height={height} />;
      default:
        return <Bar data={chartData} options={options} height={height} />;
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box height={height}>
        {renderChart()}
      </Box>
    </Paper>
  );
};

export default ChartCard;
