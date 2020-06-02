import component from './component'
import putty from 'vue-putty'
import {
  linear,
  linearFromExtents,
  quant,
  lerp,
  nearestExp,
  mod,
  breaks
} from './scratch'

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

const epsilon = 0.00001
const quantincr = Math.PI / 16
const modRad = rad => mod(rad, 2 * Math.PI)
const modRadHalf = rad =>
  modRad(rad + Math.PI) - Math.PI
const isnear = (a, b) =>
  Math.abs(modRad(b) - modRad(a)) < quantincr


const center = 50
const radius = 45
const innerRadius = 35
const unit = linearFromExtents([-1, 1], [center - radius, center + radius])
const xy2rad = (x, y) =>
  (Math.atan2(y, x) + 2.5 * Math.PI) % (2 * Math.PI)
const rad2xy = rad =>
  [Math.sin(rad), -Math.cos(rad)]
const rad2deg = rad => (rad / Math.PI * 180 + 360 + epsilon) % 360
const xy2px = (pos, f = 1) => {
  const scale = f == 1 ? unit : linearFromExtents([-1, 1], [
    center - radius * f,
    center + radius * f
  ])
  return `${scale(pos[0]).toFixed(3)} ${scale(pos[1]).toFixed(3)}`
}

const brushRadial = component({
  name: 'app',
  module,
  render: (h, { props, state, hub }) => {
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
    return h('#root', [
      h('.area', { style: { width: '100px', height: '100px' } }, [
        h(putty, {
          on: {
            start: p => {
              const x = unit.inv(p[0])
              const y = unit.inv(p[1])
              const current = xy2rad(x, y)
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
              const x = unit.inv(p.current[0])
              const y = unit.inv(p.current[1])
              const current = xy2rad(x, y)
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
              document.body.style.cursor = cursorBreak(xy2rad(
                unit.inv(p[0]),
                unit.inv(p[1])))
            },
            leave: () => {
              document.body.style.cursor = 'auto'
            }
          }
        }),
        h('svg', { style: { width: '100px', height: '100px' } }, [
          ...(selected.anchor != null ? (() => {
            const from = rad2xy(selected.anchor)
            const from_deg = Number(rad2deg(selected.anchor).toFixed(0))
            const until = rad2xy(selected.anchor + selected.range)
            const until_deg = Number(rad2deg(selected.anchor + selected.range).toFixed(0))
            const islarge = selected.range > Math.PI
              || selected.range < -Math.PI
            const issweep = selected.range > 0
            const radiusRatio = innerRadius / radius
            const isafter =
              (selected.range > 0 && (selected.range < 1.5 * Math.PI - epsilon))
              || (selected.range < 0 && (selected.range < -1.5 * Math.PI + epsilon)) ? true : false
            return [
              h('g', { attrs: {
                transform: `translate(${center} ${center})`
              } }, [
                from_deg > 180
                ? h('text.label', { attrs: {
                    dx: -innerRadius + 4,
                    'alignment-baseline': isafter ? 'baseline' : 'alphabetic',
                    'text-anchor': 'start',
                    transform: `rotate(${from_deg + 90})`
                  }}, `${from_deg}°`)
                : h('text.label', { attrs: {
                    dx: innerRadius - 4,
                    'alignment-baseline': isafter ? 'alphabetic' : 'baseline',
                    'text-anchor': 'end',
                    transform: `rotate(${from_deg - 90})`
                  }}, `${from_deg}°`),
                Math.abs(selected.range) < quantincr * 1
                ? null
                : until_deg > 180
                ? h('text.label', { attrs: {
                    dx: -innerRadius + 4,
                    'alignment-baseline': isafter ? 'alphabetic' : 'baseline',
                    'text-anchor': 'start',
                    transform: `rotate(${until_deg + 90})`
                  }}, `${until_deg}°`)
                : h('text.label', { attrs: {
                    dx: innerRadius - 4,
                    'alignment-baseline': isafter ? 'baseline' : 'alphabetic',
                    'text-anchor': 'end',
                    transform: `rotate(${until_deg - 90})`
                  }}, `${until_deg}°`)
              ]),
              h('path.segment', { attrs: { d: `
                M ${xy2px(from)}
                A ${radius} ${radius}
                  0 ${islarge ? '1' : '0'}
                  ${issweep ? '1' : '0'}
                  ${xy2px(until)}
                L ${xy2px(until, radiusRatio)}
                A ${innerRadius} ${innerRadius}
                  0 ${islarge ? '1' : '0'}
                  ${issweep ? '0' : '1'}
                  ${xy2px(from, radiusRatio)}
                Z
              ` } })
            ]
          })() : [])
        ])
      ])
    ])
  }
})

export default brushRadial
