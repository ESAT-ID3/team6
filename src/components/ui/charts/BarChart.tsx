// components/BarChart.tsx

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type BarChartProps = {
  labels: string[];
  incomeData: number[];
  outcomeData: number[];
};

const BarChart: React.FC<BarChartProps> = ({
  labels,
  incomeData,
  outcomeData,
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Outcome',
        data: outcomeData,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Income and Outcome evolution per Month (€)',
        color: '#3b82f6',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        ticks: {
            callback: (value: number | string) => `€${value}`,
            color: '#333', // opcional
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
