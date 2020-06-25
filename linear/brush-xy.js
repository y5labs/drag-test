import component from '../component'
import { putty } from 'vue-putty'
import { linearFromExtents, quant } from '../math'
import { apply_operation } from './shared'

export default component({
  name: 'linear-brush-xy',
  module,
  render: (h, { props, hub }) => {
    const quant_incr_x = props.quant_incr_x
    const range_quant_incr_x = props.range_quant_incr_x || 10
    const width = props.width
    const height = props.height
    const values_x = props.values_x
    const display_quant_x = props.display_quant_x != null
      ? props.display_quant_x
      : false
    const isnear = (a, b) => Math.abs(b - a) < quant_incr_x

    const domain_x = props.domain_x || [0, 100]
    let operation_x = props.operation_x
    const selection_x = apply_operation(
      props.selection_x,
      operation_x,
      quant_incr_x,
      domain_x)

    const min_x = props.range_x ? props.range_x[0] : Math.min.apply(null, values_x)
    const max_x = props.range_x ? props.range_x[1] : Math.max.apply(null, values_x)
    const r_x = [
      quant(range_quant_incr_x).floor(min_x),
      quant(range_quant_incr_x).ceil(max_x) - (!display_quant_x ? 0 : quant_incr_x)
    ]
    const x = linearFromExtents(r_x, [0, width])

    return h('rect', {
      on: putty({ offset: [0, 0] }, {
        start: p => {
          const current = x.inv(p[0])
          if (selection_x != null) {
            if (isnear(selection_x[0], current)) {
              operation_x = { type: 'from', delta: 0 }
              return hub.emit('update', { operation_x: Object.assign({}, operation_x) })
            }
            else if (isnear(selection_x[1], current)) {
              operation_x = { type: 'until', delta: 0 }
              return hub.emit('update', { operation_x: Object.assign({}, operation_x) })
            }
            else if (selection_x[0] < current && selection_x[1] > current) {
              operation_x = { type: 'move', delta: 0 }
              return hub.emit('update', { operation_x: Object.assign({}, operation_x) })
            }
          }
          const start = quant(quant_incr_x).round(current)
          operation_x = {
            type: 'new',
            start,
            current: start,
            delta: 0
          }
          hub.emit('update', { operation_x: Object.assign({}, operation_x) })
        },
        move: p => {
          if (!operation_x) return
          operation_x.delta = p.delta[0] / x.factor
          operation_x.current = quant(quant_incr_x).round(
            x.inv(p.current[0]))
          hub.emit('update', { operation_x: Object.assign({}, operation_x) })
        },
        end: p => {
          const selection_x = apply_operation(
            props.selection_x,
            operation_x,
            quant_incr_x,
            domain_x)
          hub.emit('update', {
            operation_x: null,
            selection_x: selection_x
          })
        },
        tap: p => {
          const current = x.inv(p[0])
          document.body.style.cursor = 'crosshair'
          hub.emit('update', {
            selection_x: null
          })
        },
        hover: p => {
          const current = x.inv(p[0])
          document.body.style.cursor = 'crosshair'
          if (selection_x != null) {
            if (isnear(selection_x[0], current)
              || isnear(selection_x[1], current))
              document.body.style.cursor = 'col-resize'
            else if (selection_x[0] < current && selection_x[1] > current)
              document.body.style.cursor = 'ew-resize'
            else
              document.body.style.cursor = 'crosshair'
          }
        },
        leave: () => {
          document.body.style.cursor = 'auto'
        }
      }),
      style: { opacity: 0 },
      attrs: { width, height }
    })
  }
})