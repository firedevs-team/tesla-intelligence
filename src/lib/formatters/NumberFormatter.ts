class NumberFormatter {
  /**
   * Formats a number to a string with thousands separators.
   * @param value The number to format.
   * @returns The formatted string.
   *
   * Example:
   * - 1200000 -> "1.2M"
   * - 1200 -> "1.2k"
   * - 999 -> "999"
   */
  static formatThousands(value: number): string {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000)
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return value.toString();
  }
}

export default NumberFormatter;
