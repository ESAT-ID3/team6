// BarChart.tsx
import React, { useRef } from 'react';
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
import { Chart as ChartInstance } from 'chart.js/auto';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = {
  labels: string[];
  incomeData: number[];
  outcomeData: number[];
  onBarClick?: (label: string) => void;
  selectedLabel?: string; // <-- Añadido para resaltar
};

const BarChart: React.FC<BarChartProps> = ({
  labels,
  incomeData,
  outcomeData,
  onBarClick,
  selectedLabel,
}) => {
  const chartRef = useRef<ChartInstance<'bar'> | null>(null);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: labels.map(label =>
          label === selectedLabel ? 'rgba(75, 192, 192, 1.0)' : 'rgba(75, 192, 192, 0.5)'
        ),
      },
      {
        label: 'Outcome',
        data: outcomeData,
        backgroundColor: labels.map(label =>
          label === selectedLabel ? 'rgba(153, 102, 255, 1.0)' : 'rgba(153, 102, 255, 0.5)'
        ),
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements, chart) => {
      const chartInstance = chartRef.current;
      if (!chartInstance) return;

      const element = chartInstance.getElementsAtEventForMode(event as unknown as Event, 'nearest', { intersect: true }, true)[0];

      if (element) {
        const index = element.index;
        const label = labels[index];
        if (onBarClick) onBarClick(label);
      }
    },
    plugins: {
      datalabels: { display: false },
      legend: {
        position: 'top',
        labels: {
          color: '#333',
          font: { family: 'Sora' },
        },
      },
      title: {
        display: true,
        text: 'Income and Outcome evolution per Month (€)',
        color: '#3b82f6',
        font: { size: 16, weight: 'bold', family: 'Sora' },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number | string) => `€${value}`,
          color: '#333',
          font: { family: 'Sora' },
        },
        grid: { color: '#e5e7eb' },
      },
      x: {
        ticks: { font: { family: 'Sora' } },
        grid: { display: false },
      },
    },
  };

  return <Bar ref={chartRef} data={data} options={options} />;
};

export default BarChart;
