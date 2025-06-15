// TimeSeriesChart.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import React from 'react';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

type TimeSeriesChartProps = {
  labels: string[]; // Fechas o tiempos
  high: number[];
  low: number[];
  open: number[];
  close: number[];
};

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ labels, high, low, open, close }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'High',
        data: high,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Low',
        data: low,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Open',
        data: open,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Close',
        data: close,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        position: 'top' as const,
        labels: {
            font: {
            family: 'Sora',
            },
        },
        },
        tooltip: {
        mode: 'index' as const,
        intersect: false,
        titleFont: {
            family: 'Sora',
        },
        bodyFont: {
            family: 'Sora',
        },
        },
    },
    interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false,
    },
    scales: {
        x: {
        display: true,
        title: {
            display: true,
            text: 'Time',
            font: {
            family: 'Sora',
            },
        },
        ticks: {
            font: {
            family: 'Sora',
            },
        },
        },
        y: {
        display: true,
        title: {
            display: true,
            text: 'Price',
            font: {
            family: 'Sora',
            },
        },
        ticks: {
            font: {
            family: 'Sora',
            },
        },
        },
    },
    };


  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default TimeSeriesChart;
