export function getFirstDayAtMounth() {
  return new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0))
}

export function getToday() {
  return new Date(new Date().setHours(23, 59, 59, 59))
}
