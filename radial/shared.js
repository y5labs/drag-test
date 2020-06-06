import { quant, mod, breaks, epsilon } from '../math'

// shared
const apply_operation = (selected, operation, quantincr) => {
  if (!operation) return selected
  selected = { ...selected }
  if (operation.type == 'anchor') {
    selected.anchor += operation.delta
    selected.range -= operation.delta
  }
  else if (operation.type == 'range') {
    const anchor = selected.anchor + selected.range
    const range = -selected.range
    selected.anchor = anchor + operation.delta
    selected.range = range - operation.delta
  }
  else if (operation.type == 'move') {
    selected.anchor += operation.delta
  } else if (operation.type == 'new') {
    selected.anchor = operation.start
    selected.range = operation.delta
  }
  selected.anchor = quant(quantincr).round(selected.anchor)
  selected.range = quant(quantincr).round(selected.range)
  selected.anchor = modRad(selected.anchor)
  while (selected.range + epsilon >= 2 * Math.PI)
    selected.range -= 2 * Math.PI
  while (selected.range - epsilon <= - 2 * Math.PI)
    selected.range += 2 * Math.PI
  if (selected.range == 0)
    selected.range = quantincr
  return selected
}

// brush
const len = pos => Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1])
const xy2rad = pos =>
  (Math.atan2(pos[1], pos[0]) + 2.5 * Math.PI) % (2 * Math.PI)
const modRad = rad => mod(rad, 2 * Math.PI)
const modRadHalf = rad =>
  modRad(rad + Math.PI) - Math.PI

// display
const rad2xy = rad => [Math.sin(rad), -Math.cos(rad)]
const rad2degmod = rad => (rad / Math.PI * 180 + 360 + epsilon) % 360
const xy2px = (pos, f = 1) =>
  `${(f * pos[0]).toFixed(3)} ${(f * pos[1]).toFixed(3)}`

// optional
const rad2deg = rad => rad / Math.PI * 180
const moddeg = deg => mod(deg, 360)
const quantdeg = quant(1).round
const splitselection = selected => {
  const anchor1 = moddeg(rad2deg(selected.anchor))
  const anchor2 = anchor1 + rad2deg(selected.range)
  if (anchor2 < 0)
    return [[0, anchor1], [moddeg(anchor2), 360]]
  if (anchor2 > 0)
    return [[anchor1, 360], [0, moddeg(anchor2)]]
  return anchor1 < anchor2
    ? [[anchor1, moddeg(anchor2)]]
    : [[moddeg(anchor2), anchor1]]
}

export {
  apply_operation,
  quantdeg,
  splitselection,
  len,
  xy2rad,
  modRad,
  modRadHalf,
  rad2xy,
  rad2degmod,
  xy2px
}
