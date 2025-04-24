import React from "react";
import { Layout } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { QuarterReference, SalesRecord } from "../../types";
import _sales from "../../data/sales-record.json";
import constants from "../../constants";

ChartJS.register(ChartDataLabels);

const sales: SalesRecord[] = _sales;
const region = "GLOBAL";

const current: QuarterReference = (() => {
  // Helper: obtiene el trimestre de una fecha
  const getQuarter = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const quarter = constants.MONTH_TO_QUARTER[month];
    return {
      year,
      quarter,
    };
  };

  const now = new Date();
  let quarter = getQuarter(now);

  const day = now.getDate();
  const quarterMonth = constants.MONTH_TO_QUARTER_MONTH[now.getMonth() + 1];
  if (quarterMonth === 1 && day <= 7) {
    // Le pongo dia 1 a now y le resto un mes
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    quarter = getQuarter(lastMonth);
  }
  return quarter;
})();
const qoq: QuarterReference = ((current: QuarterReference) => {
  let quarter = current.quarter - 1;
  let year = current.year;
  if (quarter === 0) {
    quarter = 4;
    year--;
  }
  return {
    year,
    quarter,
  };
})(current);
const yoy: QuarterReference = ((current: QuarterReference) => {
  let quarter = current.quarter;
  let year = current.year - 1;
  return {
    year,
    quarter,
  };
})(current);

// Helper: filtra ventas por región, año y trimestre
const filterByPeriod = (data: SalesRecord[], ref: QuarterReference) =>
  data.filter((sale) => {
    let checkRegion = sale.region === region;
    if (region === "GLOBAL") {
      checkRegion = true;
    }

    return (
      checkRegion && sale.year === ref.year && sale.quarter === ref.quarter
    );
  });

// Datos principales
const currentSales = filterByPeriod(sales, current);
const qoqSales = filterByPeriod(sales, qoq);
const yoySales = filterByPeriod(sales, yoy);

// Match: solo países y meses comunes
const matchByCountryMonth = (base: SalesRecord[], compare: SalesRecord[]) =>
  compare.filter((sale) =>
    base.some((s) => s.country === sale.country && s.month === sale.month)
  );

// Matches con estructura similar
const qoqMatched = matchByCountryMonth(currentSales, qoqSales);
const yoyMatched = matchByCountryMonth(currentSales, yoySales);

// Totales
const sumTotals = (arr: SalesRecord[]) =>
  arr.reduce((acc, sale) => acc + sale.total, 0);

const currentTotal = sumTotals(currentSales);
const qoqTotal = sumTotals(qoqSales);
const qoqMatchedTotal = sumTotals(qoqMatched);
// const yoyTotal = sumTotals(yoySales);
const yoyMatchedTotal = sumTotals(yoyMatched);

// Porcentajes
const calcGrowth = (current: number, past: number) =>
  past === 0 ? 0 : ((current - past) / past) * 100;

const qoqPercentage = calcGrowth(currentTotal, qoqMatchedTotal);
const yoyPercentage = calcGrowth(currentTotal, yoyMatchedTotal);

// Porcentaje de datos recolectados
const percentCollected = (qoqMatchedTotal / qoqTotal) * 100;

const { Content } = Layout;

// Helper: convierte quarter a string
const quarterToString = (quarter: QuarterReference) =>
  `Q${quarter.quarter}-${quarter.year.toString().slice(-2)}`;

const data: {
  quarter: string;
  total: number;
}[] = [
  { quarter: quarterToString(yoy), total: yoyMatchedTotal },
  { quarter: quarterToString(qoq), total: qoqMatchedTotal },
  { quarter: quarterToString(current), total: currentTotal },
];

const chartData: ChartData<"bar", number[], string> = {
  labels: data.map((d) => d.quarter),
  datasets: [
    {
      label: "Sales",
      data: data.map((d) => d.total),
      backgroundColor: "rgba(75, 192, 192, 1)",
      datalabels: {
        display: (ctx) =>
          ctx.chart.data.labels?.[ctx.dataIndex] === quarterToString(current),
        color: "white",
        font: {
          size: 10,
        },
        align: "end",
        anchor: "end",
        offset: -20,
        clamp: true,
        formatter: () =>
          `YoY ${yoyPercentage.toFixed(1)}%\nQoQ ${qoqPercentage.toFixed(1)}%`,
      },
    },
  ],
};

const formatThousands = (value: number) => {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return value.toString();
};

const options: ChartOptions<"bar"> = {
  responsive: true,
  elements: {
    bar: {
      borderWidth: 30,
    },
  },
  plugins: {
    title: { display: true, text: "Tesla Quarterly Sales" },
    datalabels: {}, // activación global, lo manejamos por dataset
  },
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          if (typeof value === "number") {
            return formatThousands(value);
          }
          return value;
        },
      },
    },
  },
};

const Home: React.FC = () => (
  <Content
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <div style={{ width: 500, height: 500 }}>
      <Bar data={chartData} options={options} />
      <p
        style={{
          marginTop: "12px",
          fontSize: "10px",
          color: "rgb(108, 117, 125)",
          fontStyle: "italic",
          marginLeft: "10px",
        }}
      >
        {`Data status: ${percentCollected.toFixed(1)}% of quarter collected`}
      </p>
    </div>
  </Content>
);

export default Home;
