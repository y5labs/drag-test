const linear = (offset, factor) => {
  const fn = x => (x - offset) * factor
  fn.inv = x => (x / factor) + offset
  fn.offset = offset
  fn.factor = factor
  return fn
}
const linearFromExtents = (domain, range) => {
  const m = (range[1] - range[0]) / (domain[1] - domain[0])
  const offset = domain[0] - range[0] / m
  return linear(offset, m)
}
const quant = incr => ({
  round: x => Math.round(x / incr) * incr,
  ceil: x => Math.ceil(x / incr) * incr,
  floor: x => Math.floor(x / incr) * incr
})
const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t
const _nearestExp = (fn, value, exp) => {
  if (typeof exp === 'undefined' || +exp == 0)
    return fn(value)
  value = +value
  exp = +exp
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 == 0))
    return NaN
  value = value.toString().split('e')
  value = fn(+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)))
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp))
}
const nearestExp = {
  round: (value, exp) => _nearestExp(Math.round, value, exp),
  floor: (value, exp) => _nearestExp(Math.floor, value, exp),
  ceil: (value, exp) => _nearestExp(Math.ceil, value, exp)
}
const mod = (n, r) => ((n % r) + r) % r
const breaks = (breaks, x) => {
  for (const b of breaks)
    if (b[0] > x) return b[1]
  return breaks[0][1]
}

export {
  linear,
  linearFromExtents,
  quant,
  lerp,
  nearestExp,
  mod,
  breaks
}
