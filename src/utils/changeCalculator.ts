import {
  CashDenomination,
  ChangeCalculationResult,
  ExchangeValidationResult,
} from "@/types";

/**
 * خوارزمية حساب الفكة بناءً على الفئات النقدية المتوفرة فعلياً بالدرج
 * @param changeDue المبلغ المتبقي الواجب إرجاعه للزبون
 * @param drawerDenominations الفئات النقدية المتوفرة بالدرج حالياً
 */
export function calculateChange(
  changeDue: number,
  drawerDenominations: CashDenomination[],
): ChangeCalculationResult {
  if (changeDue <= 0) {
    return {
      success: true,
      reason: "EXACT_AMOUNT",
      returnedDenominations: [],
      totalReturned: 0,
      remainingShortage: 0,
    };
  }

  const totalDrawerCash = drawerDenominations.reduce(
    (sum, item) => sum + item.value * item.count,
    0,
  );

  if (totalDrawerCash < changeDue) {
    return {
      success: false,
      reason: "INSUFFICIENT_TOTAL_CASH",
      returnedDenominations: [],
      totalReturned: 0,
      remainingShortage: changeDue - totalDrawerCash,
    };
  }

  const sortedDrawer = [...drawerDenominations].sort(
    (a, b) => b.value - a.value,
  );

  const returnedDenominations: CashDenomination[] = [];
  let currentRemaining = Math.round(changeDue * 100) / 100;

  for (const denom of sortedDrawer) {
    if (currentRemaining <= 0) break;
    if (denom.count <= 0 || denom.value > currentRemaining) continue;

    const countNeeded = Math.floor(currentRemaining / denom.value);
    const countToTake = Math.min(countNeeded, denom.count);

    if (countToTake > 0) {
      returnedDenominations.push({
        value: denom.value,
        count: countToTake,
        denomination: 0,
      });

      const amountDeducted = countToTake * denom.value;
      currentRemaining =
        Math.round((currentRemaining - amountDeducted) * 100) / 100;
    }
  }

  if (currentRemaining > 0) {
    const totalReturned = returnedDenominations.reduce(
      (sum, item) => sum + item.value * item.count,
      0,
    );

    return {
      success: false,
      reason: "UNAVAILABLE_DENOMINATIONS",
      returnedDenominations,
      totalReturned,
      remainingShortage: currentRemaining,
    };
  }

  return {
    success: true,
    returnedDenominations,
    totalReturned: changeDue,
    remainingShortage: 0,
  };
}

/**
 * التحقق من صحة عملية تبديل الفئات (الصرف) داخل الدرج
 */
export function validateDrawerExchange(
  takenDenominations: CashDenomination[],
  addedDenominations: CashDenomination[],
): ExchangeValidationResult {
  const takenTotal = takenDenominations.reduce(
    (sum, item) => sum + item.value * item.count,
    0,
  );
  const addedTotal = addedDenominations.reduce(
    (sum, item) => sum + item.value * item.count,
    0,
  );
  const difference = Math.round((addedTotal - takenTotal) * 100) / 100;

  return {
    isValid: difference === 0 && takenTotal > 0,
    takenTotal,
    addedTotal,
    difference,
  };
}

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

/**
 * تنسيق الأرقام إلى صيغة العملة المحلية (SAR) مع ضمان استخدام الأرقام الإنجليزية
 */
export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formatted.replace("SAR", "ر.س");
};

/**
 * تنسيق الأرقام للعرض البسيط بدون رمز العملة بالأرقام الإنجليزية
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
