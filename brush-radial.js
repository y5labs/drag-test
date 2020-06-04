import component from './component'
import { putty } from 'vue-putty'
import { quant, mod, breaks } from './math'

const cursorIncr = Math.PI / 8
const cursorBreaks = [
  [1 * cursorIncr, 'ew-resize'],
  [3 * cursorIncr, 'nwse-resize'],
  [5 * cursorIncr, 'ns-resize'],
  [7 * cursorIncr, 'nesw-resize'],
  [9 * cursorIncr, 'ew-resize'],
  [11 * cursorIncr, 'nwse-resize'],
  [13 * cursorIncr, 'ns-resize'],
  [15 * cursorIncr, 'nesw-resize']
]
const cursorBreak = rad => breaks(cursorBreaks, rad)
const quantincr = Math.PI / 16
const modRad = rad => mod(rad, 2 * Math.PI)
const modRadHalf = rad =>
  modRad(rad + Math.PI) - Math.PI
const isnear = (a, b) =>
  Math.abs(modRad(b) - modRad(a)) < quantincr
const xy2rad = pos =>
  (Math.atan2(pos[1], pos[0]) + 2.5 * Math.PI) % (2 * Math.PI)
const rad2xy = rad => [Math.sin(rad), -Math.cos(rad)]
const epsilon = 0.00001
const rad2degmod = rad => (rad / Math.PI * 180 + 360 + epsilon) % 360
const xy2px = (pos, f = 1) =>
  `${(f * pos[0]).toFixed(3)} ${(f * pos[1]).toFixed(3)}`
const len = pos => Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1])
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

export default component({
  name: 'app',
  module,
  render: (h, { props, state, hub }) => {
    const offset = props.offset
    const select_radius = props.select_radius
    const display_radius = props.display_radius

    let operation = props.operation
    const apply_operation = selected => {
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
    const selected = apply_operation({
      anchor: props.selected_anchor,
      range: props.selected_range
    })
    // TODO: use this for seacreature
    if (selected.anchor != null) {
      const selections = splitselection(selected)
        .map(([start, end]) =>
          [quantdeg(start - epsilon), quantdeg(end + epsilon)])
      // console.log(selections)
    }
    return h('g', { attrs: { transform: `translate(${offset[0]} ${offset[1]})` } }, [
      ...(selected.anchor != null ? (() => {
        const from = rad2xy(selected.anchor)
        const from_deg = Number(rad2degmod(selected.anchor).toFixed(0))
        const until = rad2xy(selected.anchor + selected.range)
        const until_deg = Number(rad2degmod(selected.anchor + selected.range).toFixed(0))
        const islarge = selected.range > Math.PI || selected.range < -Math.PI
        const issweep = selected.range > 0
        const isafter =
          (selected.range > 0 && (selected.range < 1.5 * Math.PI - epsilon))
          || (selected.range < 0 && (selected.range < -1.5 * Math.PI + epsilon))
        return [
          from_deg > 180
          ? h('text.label', { attrs: {
              dx: -display_radius[0] + 4,
              'alignment-baseline': isafter ? 'baseline' : 'alphabetic',
              'text-anchor': 'start',
              transform: `rotate(${from_deg + 90})`
            }}, `${from_deg}°`)
          : h('text.label', { attrs: {
              dx: display_radius[0] - 4,
              'alignment-baseline': isafter ? 'alphabetic' : 'baseline',
              'text-anchor': 'end',
              transform: `rotate(${from_deg - 90})`
            }}, `${from_deg}°`),
          Math.abs(selected.range) < quantincr * 1
          ? null
          : until_deg > 180
          ? h('text.label', { attrs: {
              dx: -display_radius[0] + 4,
              'alignment-baseline': isafter ? 'alphabetic' : 'baseline',
              'text-anchor': 'start',
              transform: `rotate(${until_deg + 90})`
            }}, `${until_deg}°`)
          : h('text.label', { attrs: {
              dx: display_radius[0] - 4,
              'alignment-baseline': isafter ? 'baseline' : 'alphabetic',
              'text-anchor': 'end',
              transform: `rotate(${until_deg - 90})`
            }}, `${until_deg}°`),
          h('path.segment', { attrs: { d: `
            M ${xy2px(from, display_radius[1])}
            A ${display_radius[1]} ${display_radius[1]}
              0 ${islarge ? '1' : '0'}
              ${issweep ? '1' : '0'}
              ${xy2px(until, display_radius[1])}
            L ${xy2px(until, display_radius[0])}
            A ${display_radius[0]} ${display_radius[0]}
              0 ${islarge ? '1' : '0'}
              ${issweep ? '0' : '1'}
              ${xy2px(from, display_radius[0])}
            Z
          ` } })
        ]
      })() : []),
      h('rect', {
        on: putty({ offset }, {
          start: p => {
            const length = len(p)
            if (length > select_radius[1] || length < select_radius[0]) return
            const current = xy2rad(p)
            if (selected.anchor != null) {
              if (isnear(selected.anchor, current)) {
                operation = { type: 'anchor', start: current, delta: 0 }
                return hub.emit('update', { operation: Object.assign({}, operation) })
              }
              else if (isnear(selected.anchor + selected.range, current)) {
                operation = { type: 'range', start: current, delta: 0 }
                return hub.emit('update', { operation: Object.assign({}, operation) })
              }
              else {
                let rel = current
                while (rel > selected.anchor) rel -= 2 * Math.PI
                if (selected.range > 0) {
                  rel += 2 * Math.PI
                  if (rel > selected.anchor
                    && rel < selected.anchor + selected.range) {
                    operation = { type: 'move', start: current, delta: 0 }
                    return hub.emit('update', { operation: Object.assign({}, operation) })
                  }
                }
                else if (rel < selected.anchor
                  && rel > selected.anchor + selected.range) {
                  operation = { type: 'move', start: current, delta: 0 }
                  return hub.emit('update', { operation: Object.assign({}, operation) })
                }
              }
            }
            const start = quant(quantincr).round(current)
            operation = { type: 'new', start, delta: 0 }
            hub.emit('update', { operation: Object.assign({}, operation) })
          },
          move: p => {
            const current = xy2rad(p.current)
            document.body.style.cursor = cursorBreak(current)
            if (!operation) return

            let delta = modRadHalf(current - operation.start)
            if (operation.delta > Math.PI / 2 && delta < 0 / 2)
              delta += 2 * Math.PI
            else if (operation.delta < -Math.PI / 2 && delta > 0 / 2)
              delta -= 2 * Math.PI
            operation.delta = delta
            hub.emit('update', { operation: Object.assign({}, operation) })
          },
          end: p => {
            const selected = apply_operation({
              anchor: props.selected_anchor,
              range: props.selected_range
            })
            hub.emit('update', {
              operation: null,
              selected_anchor: selected.anchor,
              selected_range: selected.range
            })
          },
          tap: p => {
            hub.emit('update', { selected_anchor: null, selected_range: null })
          },
          hover: p => {
            const length = len(p)
            if (length > select_radius[1] || length < select_radius[0]) {
              document.body.style.cursor = 'auto'
              return
            }
            document.body.style.cursor = cursorBreak(xy2rad(p))
          },
          leave: () => {
            document.body.style.cursor = 'auto'
          }
        }),
        style: { opacity: 0 },
        attrs: {
          x: -select_radius[1], y: -select_radius[1],
          width: 2 * select_radius[1], height: 2 * select_radius[1]
        }
      })
    ])
  }
})
