// a and b do more than just touch
const rangeOverlaps = (a, b) => a[1] > b[0] && a[0] < b[1]
// add a and b together
const rangeAdd = (a, b) => {
  if (!rangeOverlaps(a, b)) return [[a[0], a[1]], [b[0], b[1]]]
  return [Math.min(a[0], b[0]), Math.max(a[1], b[1])]
}
// remove b from a
const rangeSubtract = (a, b) => {
  if (!rangeOverlaps(a, b)) return [[a[0], a[1]]]
  // a is within
  if (a[0] >= b[0] && a[1] <= b[1]) return []
  // b is within
  if (a[0] <= b[0] && a[1] >= b[1]) {
    if (a[0] == b[0]) return [[b[1], a[1]]]
    if (a[1] == b[1]) return [[b[0], a[0]]]
    return [[a[0], b[0]], [b[1], a[1]]]
  }
  // clip left
  if (a[0] <= b[0]) return [[a[0], b[0]]]
  // clip right
  if (b[1] <= a[1]) return [[b[1], a[1]]]
  return []
}
// intersect a and b
const rangeIntersect = (a, b) => {
  if (!rangeOverlaps(a, b)) return []
  return [[
    a[0] > b[0] ? a[0] : b[0],
    a[1] > b[1] ? b[1] : a[1]
  ]]
}

export { rangeOverlaps, rangeAdd, rangeSubtract, rangeIntersect }
