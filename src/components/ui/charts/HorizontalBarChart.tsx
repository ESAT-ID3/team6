import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Divide texto en líneas de maxLength chars para multilínea
  const formatLabel = (text: string, maxLength = 10): string[] => {
    const words = text.split(" ");
    let lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + " " + word).trim().length <= maxLength) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // En móvil, formatea labels a multilínea (array de strings)
  const formattedLabels = isMobile
    ? (categories.map((cat) => formatLabel(cat)) as (string | string[])[])
    : (categories as (string | string[])[]);

  const data: {
    labels: (string | string[])[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      barThickness?: number;
    }[];
  } = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Gastos (€)",
        data: expenses,
        backgroundColor: colors,
        barThickness: isMobile ? 20 : undefined,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: isMobile
        ? { left: 0, right: 20, top: 10, bottom: 10 }
        : {},
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value < 50 ? "end" : "center";
        },
        align: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value < 50 ? "right" : "center";
        },
        color: "#000",
        font: {
          weight: "bold",
          family: "Sora",
        },
        formatter: (value) => `€${value}`,
        clamp: true,
        clip: false,
      },
      title: {
        display: true,
        text: "Gastos por Categoría (€)",
        color: "#3b82f6",
        font: { size: 16, weight: "bold", family: "Sora" },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => `€${value}`,
          color: "#333",
          font: { family: "Sora" },
        },
        grid: { color: "#e5e7eb" },
      },
      y: {
        ticks: {
          callback: (value) => {
            if (Array.isArray(value)) {
              return value; // multilínea
            }
            return value;
          },
          font: { family: "Sora" },
          color: "#333",
          padding: isMobile ? 6 : 10,
          autoSkip: false,
        },
        grid: {
          display: false,
          drawTicks: !isMobile,
        },
        // Quitamos afterBuildTicks para que labels no desaparezcan
      },
    },
  };

  return (
    <>
      <Bar
        data={data}
        options={options}
        plugins={[ChartDataLabels]}
        style={{ minHeight: isMobile ? 300 : 200 }}
      />
      {isMobile && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {categories.map((category, idx) => (
            <div
              key={category}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors[idx],
                  borderRadius: 4,
                }}
              />
              <span
                style={{
                  fontFamily: "Sora",
                  fontWeight: "600",
                  fontSize: 14,
                  color: "#333",
                }}
              >
                {category}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HorizontalBarChart;
