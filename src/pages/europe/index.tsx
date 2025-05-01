import React from "react";
import { Layout } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { NumberFormatter } from "../../lib";
import _sales from "../../data/sales-record.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const { Content } = Layout;

// Helper: obtiene el total de ventas por región, año y trimestre
const getTotalSales = (region: string, year: number, quarter: number) => {
  const sales = _sales.filter(
    (s) => s.region === region && s.year === year && s.quarter === quarter
  );
  return sales.reduce((acc, s) => acc + s.total, 0);
};

const region = "EUROPE";
const now = new Date();
const startYear = 2023;
const endYear = now.getFullYear();
const data: { years: number[]; quarters: number[][] } = {
  years: [],
  quarters: [],
};

let currentYear = startYear;
while (currentYear <= endYear) {
  data.years.push(currentYear);

  // En 0 van todos los q1
  // En 1 van todos los q2
  // ...
  for (let i = 0; i < 4; i++) {
    const currentQuarter = i + 1;
    if (!data.quarters[i]) {
      data.quarters[i] = [];
    }

    data.quarters[i].push(getTotalSales(region, currentYear, currentQuarter));
  }
  currentYear++;
}

const Europe: React.FC = () => {
  const chartData = {
    labels: data.years.map((year) => year.toString()),
    datasets: [
      {
        label: "Q1",
        data: data.quarters[0],
        backgroundColor: "#b3cde3",
      },
      {
        label: "Q2",
        data: data.quarters[1],
        backgroundColor: "#80accd",
      },
      {
        label: "Q3",
        data: data.quarters[2],
        backgroundColor: "#4e8ac3",
      },
      {
        label: "Q4",
        data: data.quarters[3],
        backgroundColor: "#265a99",
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Europe 🇪🇺 Quarterly Sales",
        color: "#e0e0e0",
        align: "start",
        padding: {
          bottom: 30,
        },
      },
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
      datalabels: {
        // elimino los labels de los datos
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: (value: string | number) =>
            NumberFormatter.formatThousands(Number(value)),
        },
        grid: {
          display: true,
          color: "#444",
          lineWidth: 0.5,
        },
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <Content
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <br />
      <br />
      <div style={{ width: "360px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </Content>
  );
};

export default Europe;
