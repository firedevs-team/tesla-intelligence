import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { QuarterReference, SalesRecord } from "../../types";
import _sales from "../../data/sales-record.json";
import constants from "../../constants";
import { NumberFormatter } from "../../lib";

ChartJS.register(ChartDataLabels);

// Obtengo el trimestre actual
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

// Obtengo el trimestre anterior
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

// Obtengo el trimestre actual del año anterior
const yoy: QuarterReference = ((current: QuarterReference) => {
  let quarter = current.quarter;
  let year = current.year - 1;
  return {
    year,
    quarter,
  };
})(current);

// Helper: filtra ventas por región, año y trimestre
const filterByPeriod = (
  data: SalesRecord[],
  ref: QuarterReference,
  region: string
) =>
  data.filter((sale) => {
    let isRegion = sale.region === region;
    if (region === "GLOBAL") {
      isRegion = true;
    }
    return isRegion && sale.year === ref.year && sale.quarter === ref.quarter;
  });

// Helper: Match solo países y meses comunes
const matchByCountryMonth = (base: SalesRecord[], compare: SalesRecord[]) =>
  compare.filter((sale) =>
    base.some((s) => s.country === sale.country && s.month === sale.month)
  );

// Helper: Porcentajes
const calcGrowth = (current: number, past: number) =>
  past === 0 ? 0 : ((current - past) / past) * 100;

// Helper: convierte quarter a string
const quarterToString = (quarter: QuarterReference) =>
  `Q${quarter.quarter}-${quarter.year.toString().slice(-2)}`;

interface QuaterlySalesChartProps {
  title: string;
  region: "GLOBAL" | "CHINA" | "USA" | "EUROPE" | "ROW";
}

const QuaterlySalesChart: React.FC<QuaterlySalesChartProps> = (
  props: QuaterlySalesChartProps
) => {
  const { title, region } = props;

  const sales: SalesRecord[] = _sales;

  // Datos principales
  const currentSales = filterByPeriod(sales, current, region);
  const qoqSales = filterByPeriod(sales, qoq, region);
  const yoySales = filterByPeriod(sales, yoy, region);

  // Matches con estructura similar
  const qoqMatched = matchByCountryMonth(currentSales, qoqSales);
  const yoyMatched = matchByCountryMonth(currentSales, yoySales);

  // Totales
  const sumTotals = (arr: SalesRecord[]) =>
    arr.reduce((acc, sale) => acc + sale.total, 0);

  const currentTotal = sumTotals(currentSales);
  const qoqTotal = sumTotals(qoqSales);
  const qoqMatchedTotal = sumTotals(qoqMatched);
  const yoyMatchedTotal = sumTotals(yoyMatched);

  const qoqPercentage = calcGrowth(currentTotal, qoqMatchedTotal);
  const yoyPercentage = calcGrowth(currentTotal, yoyMatchedTotal);

  // Porcentaje de datos recolectados
  const percentCollected = (qoqMatchedTotal / qoqTotal) * 100;

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
        backgroundColor: "#4875b4",
        datalabels: {
          display: (ctx) =>
            ctx.chart.data.labels?.[ctx.dataIndex] === quarterToString(current),
          color: "white",
          font: {
            size: 10,
          },
          align: "end",
          anchor: "end",
          offset: -5,
          clamp: true,
          formatter: () => {
            if (currentTotal === 0) {
              return "";
            }
            return `${yoyPercentage.toFixed(0)}% YoY\n${qoqPercentage.toFixed(
              0
            )}% QoQ`;
          },
        },
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    elements: {
      bar: {
        borderWidth: 18,
      },
    },
    plugins: {
      title: {
        display: true,
        text: title,
        color: "#e0e0e0",
        align: "start",
        padding: {
          bottom: 30,
        },
      },
      datalabels: {
        color: "#ffffff", // color por defecto para datalabels si aplica
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cccccc", // color de las etiquetas del eje X
        },
        grid: {
          color: "rgba(255, 255, 255, 0.08)", // líneas suaves
        },
      },
      y: {
        ticks: {
          color: "#cccccc", // color de las etiquetas del eje Y
          callback: function (value) {
            if (typeof value === "number") {
              return NumberFormatter.formatThousands(value);
            }
            return value;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.08)", // líneas suaves
        },
      },
    },
  };

  return (
    <div style={{ width: 360 }}>
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
        {`Data status: ${percentCollected.toFixed(1)}% of data collected`}
      </p>
    </div>
  );
};

export default QuaterlySalesChart;
