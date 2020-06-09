import { putty } from 'vue-putty'
import component from '../component'
import { quant, breaks } from '../math'
import {
  apply_operation,
  len,
  xy2rad,
  modRad,
  modRadHalf
} from './shared'

// brush
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

export default component({
  name: 'radial-brush',
  module,
  render: (h, { props, state, hub }) => {
    // shared
    const quant_incr = props.quant_incr || Math.PI / 8

    // brush
    const radius = props.radius
    const isnear = (a, b) =>
      Math.abs(modRad(b) - modRad(a)) < quant_incr

    let operation = props.operation
    const selection = apply_operation({
      anchor: props.selection_anchor,
      range: props.selection_range
    }, operation, quant_incr)
    return h('rect', {
      on: putty({ offset: [radius[1], radius[1]] }, {
        start: p => {
          const length = len(p)
          if (length > radius[1] || length < radius[0]) return
          const current = xy2rad(p)
          if (selection.anchor != null) {
            if (isnear(selection.anchor, current)) {
              operation = { type: 'anchor', start: current, delta: 0 }
              return hub.emit('update', { operation: Object.assign({}, operation) })
            }
            else if (isnear(selection.anchor + selection.range, current)) {
              operation = { type: 'range', start: current, delta: 0 }
              return hub.emit('update', { operation: Object.assign({}, operation) })
            }
            else {
              let rel = current
              while (rel > selection.anchor) rel -= 2 * Math.PI
              if (selection.range > 0) {
                rel += 2 * Math.PI
                if (rel > selection.anchor
                  && rel < selection.anchor + selection.range) {
                  operation = { type: 'move', start: current, delta: 0 }
                  return hub.emit('update', { operation: Object.assign({}, operation) })
                }
              }
              else if (rel < selection.anchor
                && rel > selection.anchor + selection.range) {
                operation = { type: 'move', start: current, delta: 0 }
                return hub.emit('update', { operation: Object.assign({}, operation) })
              }
            }
          }
          const start = quant(quant_incr).round(current)
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
          const selection = apply_operation({
            anchor: props.selection_anchor,
            range: props.selection_range
          }, operation, quant_incr)
          hub.emit('update', {
            operation: null,
            selection_anchor: selection.anchor,
            selection_range: selection.range
          })
        },
        tap: p => {
          hub.emit('update', { selection_anchor: null, selection_range: null })
        },
        hover: p => {
          const length = len(p)
          if (length > radius[1] || length < radius[0]) {
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
        x: -radius[1], y: -radius[1],
        width: 2 * radius[1], height: 2 * radius[1]
      }
    })
  }
})
