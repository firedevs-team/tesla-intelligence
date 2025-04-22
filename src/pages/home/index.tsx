import React from "react";
import { Layout } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { ChartData, ChartOptions } from "chart.js/auto";

const { Content } = Layout;

interface DataPoint {
  quarter: string;
  comparable: number;
  pending: number;
}

const data: DataPoint[] = [
  { quarter: "Q2-24 (YoY)", comparable: 7680, pending: 422392 },
  { quarter: "Q1-25 (QoQ)", comparable: 7000, pending: 413000 },
  { quarter: "Q2-25", comparable: 6000, pending: 0 },
];

const chartData: ChartData<"bar", number[], string> = {
  labels: data.map((d) => d.quarter),
  datasets: [
    {
      label: "Comparable data",
      data: data.map((d) => d.comparable),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
    {
      label: "Pending data",
      data: data.map((d) => d.pending),
      backgroundColor: "rgba(255, 159, 64, 0.6)",
    },
  ],
};

const options: ChartOptions<"bar"> = {
  responsive: true,
  scales: {
    x: { stacked: true },
    y: { stacked: true },
  },
  elements: {
    bar: { borderWidth: 30 },
  },
  plugins: {
    title: { display: true, text: "Tesla Registrations" },
  },
};

const Home: React.FC = () => (
  <Content
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <div style={{ width: 500, height: 500 }}>
      <Bar data={chartData} options={options} />
    </div>
  </Content>
);

export default Home;
