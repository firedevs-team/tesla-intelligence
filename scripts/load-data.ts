import Papa from "papaparse";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import { SalesRecord } from "../src/types";
import constants from "../src/constants";

const SALES_DB = "../tesla-data/_generated/tesla_monthly_registrations.csv";

interface RegistrationsRecord {
  year: number;
  month: number;
  region: string;
  country: string;
  registrations: number;
}

const loadData = async () => {
  const filePath = path.join(process.cwd(), SALES_DB);
  const fileContent = await readFile(filePath, "utf-8");
  const result = Papa.parse<RegistrationsRecord>(fileContent, {
    header: true,
    dynamicTyping: true,
  });

  // 1. Convierto a sales record
  const salesRecords: SalesRecord[] = result.data.map((record) => {
    const result: SalesRecord = {
      year: record.year,
      quarter: constants.MONTH_TO_QUARTER[record.month],
      month: constants.MONTH_TO_QUARTER_MONTH[record.month],
      region: record.region,
      country: record.country,
      total: record.registrations,
    };
    return result;
  });

  // 2. Muestro los registros que faltan
  console.log("Missing data:");
  const countries = [...new Set(salesRecords.map((record) => record.country))];
  for (const country of countries) {
    const start = { year: 2023, month: 1 };
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = {
      year: endDate.getFullYear(),
      month: endDate.getMonth() + 1,
    };

    let year = start.year;
    let month = start.month;

    while (year < end.year || (year === end.year && month <= end.month)) {
      let quarter = constants.MONTH_TO_QUARTER[month];
      let quarterMonth = constants.MONTH_TO_QUARTER_MONTH[month];

      // Verifico si el registro existe
      const record = salesRecords.find(
        (record) =>
          record.year === year &&
          record.quarter === quarter &&
          record.month === quarterMonth &&
          record.country === country
      );
      if (!record) {
        console.log(
          `No existe el registro para ${country} en ${year}_${month}`
        );
      }

      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  }

  // 3. Elimino algunos países que están incompletos
  const countriesToRemove = [
    "CZECH_REPUBLIC",
    "CHILE",
    "AUSTRALIA",
    "THAILAND",
  ];
  const data = salesRecords.filter(
    (record) => !countriesToRemove.includes(record.country)
  );

  // 4. Guardo el archivo
  const outputPath = path.join(process.cwd(), "./src/data/sales-record.json");
  await writeFile(outputPath, JSON.stringify(data, null, 2));
  console.log("");
  console.log("Archivo guardado en", outputPath);
};

loadData();
