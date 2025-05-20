import React from 'react';
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
};

// Función para generar un color RGBA aleatorio
const getRandomColor = (): string => {
  const r = Math.floor(Math.random() * 156) + 100; // evitar colores muy oscuros
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};

const PieChart: React.FC<PieChartProps> = ({ labels, data }) => {
  const backgroundColors = labels.map(() => getRandomColor());

  const pieData = {
    labels,
    datasets: [
      {
        label: 'Spending by Category',
        data,
        backgroundColor: backgroundColors,
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', // 👈 cambia 'top' por 'right'
        labels: {
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Spending Distribution by Category',
        color: '#3b82f6',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };
  

  return <Pie data={pieData} options={options} />;
};

export default PieChart;
