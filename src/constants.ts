const MONTH_TO_QUARTER: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 3,
  8: 3,
  9: 3,
  10: 4,
  11: 4,
  12: 4,
};

const MONTH_TO_QUARTER_MONTH: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 1,
  5: 2,
  6: 3,
  7: 1,
  8: 2,
  9: 3,
  10: 1,
  11: 2,
  12: 3,
};

export default {
  MONTH_TO_QUARTER,
  MONTH_TO_QUARTER_MONTH,
};
