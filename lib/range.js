const isAfter = (a, b) => a.getTime() > b.getTime()
const isBefore = (a, b) => a.getTime() < b.getTime()

// a and b do more than just touch
const rangeOverlaps = (a, b) => isAfter(a.end, b.start) && isBefore(a.start, b.end)
// add a and b together
const rangeAdd = (a, b) => {
  if (!rangeOverlaps(a, b)) return [a, b]
  return [
    isBefore(a.start, b.start) ? b.start : a.start,
    isAfter(a.end, b.end) ? b.end : a.end
  ]
}
// remove b from a
const rangeSubtract = (a, b) => {
  if (!rangeOverlaps(a, b)) return [a]
  // a is within
  if (a.start >= b.start && a.end <= b.end) return []
  // b is within
  if (a.start <= b.start && a.end >= b.end) {
    if (a.start == b.start) return [{ start: b.end, end: a.end }]
    if (a.end == b.end) return [{ start: b.start, end: a.start}]
    return [{ start: a.start, end: b.start }, { start: b.end, end: a.end }]
  }
  // clip left
  if (a.start <= b.start) return [{ start: a.start, end: b.start }]
  // clip right
  if (b.end <= a.end) return [{ start: b.end, end: a.end }]
  return []
}
// intersect a and b
const rangeIntersect = (a, b) => {
  if (!rangeOverlaps(a, b)) return []
  return [{
    start: a.start > b.start ? a.start : b.start,
    end: a.end > b.end ? b.end : a.end
  }]
}

export { isAfter, isBefore, rangeOverlaps, rangeAdd, rangeSubtract, rangeIntersect }
