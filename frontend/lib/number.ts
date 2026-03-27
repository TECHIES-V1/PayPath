export function normalizeDecimalInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "")
  const firstDotIndex = cleaned.indexOf(".")

  if (firstDotIndex === -1) {
    return cleaned
  }

  const integerPart = cleaned.slice(0, firstDotIndex)
  const decimalPart = cleaned.slice(firstDotIndex + 1).replace(/\./g, "")

  return `${integerPart}.${decimalPart}`
}

export function formatDecimalInput(value: string) {
  if (!value) return ""

  const normalized = normalizeDecimalInput(value)
  const hasDecimal = normalized.includes(".")
  const [rawIntegerPart, rawDecimalPart = ""] = normalized.split(".")
  const integerDigits = rawIntegerPart.replace(/\D/g, "")
  const formattedInteger = integerDigits
    ? new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(Number(integerDigits))
    : "0"

  if (!hasDecimal) {
    return integerDigits ? formattedInteger : ""
  }

  return `${formattedInteger}.${rawDecimalPart.replace(/\D/g, "")}`
}

export function parseDecimalInput(value: string) {
  const normalized = normalizeDecimalInput(value)

  if (!normalized || normalized === ".") return NaN

  return Number.parseFloat(normalized)
}
