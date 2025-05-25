import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  labels: string[];
  data: number[];
  colors: string[];
  hideLegend?: boolean; // <-- Nueva prop opcional
};

const PieChart: React.FC<PieChartProps> = ({ labels, data, colors, hideLegend = false }) => {
  const [legendPosition, setLegendPosition] = useState<'right' | 'bottom'>('right');

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setLegendPosition(isMobile ? 'bottom' : 'right');
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const pieData = {
    labels,
    datasets: [
      {
        label: 'Spending by Category',
        data,
        backgroundColor: colors,
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: hideLegend
        ? { display: false }
        : {
            position: legendPosition,
            labels: {
              color: '#333',
              font: { family: 'Sora' },
            },
          },
      title: {
        display: true,
        text: 'Spending Distribution by Category',
        color: '#3b82f6',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Sora',
        },
      },
    },
  };

  return <Pie data={pieData} options={options} />;
};

export default PieChart;
