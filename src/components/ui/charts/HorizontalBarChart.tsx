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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

type HorizontalBarChartProps = {
  categories: string[];
  expenses: number[];
  colors: string[];
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  categories,
  expenses,
  colors,
}) => {
  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Gastos (€)',
        data: expenses,
        backgroundColor: colors,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value < 50 ? 'end' : 'center';
        },
        align: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value < 50 ? 'right' : 'center';
        },
        color: '#fff', // Siempre blanco
        textStrokeColor: '#000', // Outline violeta
        textStrokeWidth: 3,
        font: {
          weight: 'bold',
          family: 'Sora',
        },
        formatter: (value) => `€${value}`,
        clamp: true,
        clip: false,
      },
      title: {
        display: true,
        text: 'Gastos por Categoría (€)',
        color: '#3b82f6',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Sora',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value: number | string) => `€${value}`,
          color: '#333',
          font: {
            family: 'Sora',
          },
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y: {
        ticks: {
          font: {
            family: 'Sora',
          },
          color: '#333',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={data} options={options} plugins={[ChartDataLabels]} />;
};

export default HorizontalBarChart;
