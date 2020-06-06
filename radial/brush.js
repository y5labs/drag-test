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
    const quantincr = props.quantincr || Math.PI / 8

    // brush
    const radius = props.radius
    const isnear = (a, b) =>
      Math.abs(modRad(b) - modRad(a)) < quantincr

    let operation = props.operation
    const selected = apply_operation({
      anchor: props.selected_anchor,
      range: props.selected_range
    }, operation, quantincr)
    // // TODO: use this for seacreature
    // if (selected.anchor != null) {
    //   const selections = splitselection(selected)
    //     .map(([start, end]) =>
    //       [quantdeg(start - epsilon), quantdeg(end + epsilon)])
    //   // console.log(selections)
    // }
    return h('rect', {
      on: putty({ offset: [radius[1], radius[1]] }, {
        start: p => {
          const length = len(p)
          if (length > radius[1] || length < radius[0]) return
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
          }, operation, quantincr)
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
