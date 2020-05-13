// a and b do more than just touch
const rangeOverlaps = (a, b) => a.end > b.start && a.start < b.end
// add a and b together
const rangeAdd = (a, b) => {
  if (!rangeOverlaps(a, b)) return [a, b]
  return [
    a.start < b.start ? b.start : a.start,
    a.end > b.end ? b.end : a.end
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

const getEdges = dataset => Array.from(
  dataset.reduce((res, d, i) => {
    if (res.has(d.start)) res.get(d.start).startindex = i
    else res.set(d.start, { startindex: i, endindex: null })
    res.set(d.end, { startindex: null, endindex: i })
    return res
  }, new Map())
  .entries(),
  d => ({ start: d[0], ...d[1] }))

const operate = (input, operation, quant = ts => ts) => {
  const dataset = input.slice()
  if (operation.type == 'new') {
    let start = operation.start
    let end = operation.start + operation.delta
    if (start > end) [start, end] = [end, start]
    const current = quant({ start, end })
    return {
      dataset: dataset.map(d => rangeSubtract(d, current)).flat(),
      selected: current,
      current
    }
  }
  const selected = dataset[operation.index]
  let { start, end } = selected
  if (operation.type == 'resize start') start += operation.delta
  if (operation.type == 'resize end') end += operation.delta
  if (operation.type == 'move') {
    start += operation.delta
    end += operation.delta
  }
  if (start > end) [start, end] = [end, start]
  const current = quant({ start, end })
  dataset.splice(operation.index, 1)
  return {
    dataset: dataset.map(d => rangeSubtract(d, current)).flat(),
    selected,
    current
  }
}

export { rangeOverlaps, rangeAdd, rangeSubtract, rangeIntersect, getEdges, operate }
