import React, { useEffect, useState, useMemo } from 'react';
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

// Generador de color aleatorio claro
const getRandomColor = (): string => {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};

const PieChart: React.FC<PieChartProps> = ({ labels, data }) => {
  const [legendPosition, setLegendPosition] = useState<'right' | 'bottom'>('right');

  // 📱 Cambia la posición de la leyenda según el tamaño de la pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setLegendPosition(isMobile ? 'bottom' : 'right');
    };

    checkScreenSize(); // al montar
    window.addEventListener('resize', checkScreenSize); // al cambiar tamaño
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 🎨 Memoriza los colores para que no cambien en cada render
  const backgroundColors = useMemo(() => {
    return labels.map(() => getRandomColor());
  }, [labels.join(',')]); // depende de las etiquetas

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
        position: legendPosition,
        labels: {
          color: '#333',
          font: {
            family: 'Sora',
          },
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
