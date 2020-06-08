import { quant, mod, breaks, epsilon } from '../math'

// shared
const apply_operation = (selection, operation, quant_incr) => {
  if (!operation) return selection
  selection = { ...selection }
  if (operation.type == 'anchor') {
    selection.anchor += operation.delta
    selection.range -= operation.delta
  }
  else if (operation.type == 'range') {
    const anchor = selection.anchor + selection.range
    const range = -selection.range
    selection.anchor = anchor + operation.delta
    selection.range = range - operation.delta
  }
  else if (operation.type == 'move') {
    selection.anchor += operation.delta
  } else if (operation.type == 'new') {
    selection.anchor = operation.start
    selection.range = operation.delta
  }
  selection.anchor = quant(quant_incr).round(selection.anchor)
  selection.range = quant(quant_incr).round(selection.range)
  selection.anchor = modRad(selection.anchor)
  while (selection.range + epsilon >= 2 * Math.PI)
    selection.range -= 2 * Math.PI
  while (selection.range - epsilon <= - 2 * Math.PI)
    selection.range += 2 * Math.PI
  if (Math.abs(selection.range) < epsilon)
    selection.range = quant_incr
  // if (Math.abs(Math.abs(selection.range) - 2 * Math.PI) - epsilon < quant_incr)
  //   return { anchor: null, range: null }
  return selection
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
const splitselection = selection => {
  const anchor1 = moddeg(rad2deg(selection.anchor))
  const anchor2 = anchor1 + rad2deg(selection.range)
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
