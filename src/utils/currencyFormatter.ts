/**
 * تنسيق الأرقام إلى صيغة العملة المحلية (SAR)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * تنسيق الأرقام للعرض البسيط بدون رمز العملة
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * تحويل الأرقام الشرقية/العربية (٠١٢٣٤٥٦٧٨٩) إلى أرقام إنجليزية (0123456789)
 */
export const convertArabicToEnglishNumbers = (
  input: string | number,
): string => {
  if (typeof input === "number") return input.toString();
  if (!input) return "";

  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return input.replace(/[٠-٩]/g, (digit) =>
    arabicNumbers.indexOf(digit).toString(),
  );
};
