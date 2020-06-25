import component from '../component'
import { putty } from 'vue-putty'
import { linearFromExtents, quant } from '../math'
import { apply_operation } from './shared'

export default component({
  name: 'linear-brush-x',
  module,
  render: (h, { props, hub }) => {
    const quant_incr = props.quant_incr
    const range_quant_incr = props.range_quant_incr || 10
    const width = props.width
    const height = props.height
    const values = props.values
    const display_quant = props.display_quant != null
      ? props.display_quant
      : false
    const isnear = (a, b) => Math.abs(b - a) < props.quant_incr

    const domain = props.domain || [0, 100]
    let operation = props.operation
    const selection = apply_operation(
      props.selection,
      operation,
      quant_incr,
      domain)

    const min = props.range ? props.range[0] : Math.min.apply(null, values)
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const r = [
      quant(range_quant_incr).floor(min),
      quant(range_quant_incr).ceil(max) - (!display_quant ? 0 : quant_incr)
    ]
    const scale = linearFromExtents(r, [0, width])

    return h('rect', {
      on: putty({ offset: [0, 0] }, {
        start: p => {
          const current = scale.inv(p[0])
          if (selection != null) {
            if (isnear(selection[0], current)) {
              operation = { type: 'from', delta: 0 }
              return hub.emit('update', { operation: Object.assign({}, operation) })
            }
            else if (isnear(selection[1], current)) {
              operation = { type: 'until', delta: 0 }
              return hub.emit('update', { operation: Object.assign({}, operation) })
            }
            else if (selection[0] < current && selection[1] > current) {
              operation = { type: 'move', delta: 0 }
              return hub.emit('update', { operation: Object.assign({}, operation) })
            }
          }
          const start = quant(quant_incr).round(current)
          operation = {
            type: 'new',
            start,
            current: start,
            delta: 0
          }
          hub.emit('update', { operation: Object.assign({}, operation) })
        },
        move: p => {
          if (!operation) return
          operation.delta = p.delta[0] / scale.factor
          operation.current = quant(quant_incr).round(
            scale.inv(p.current[0]))
          hub.emit('update', { operation: Object.assign({}, operation) })
        },
        end: p => {
          const selection = apply_operation(
            props.selection,
            operation,
            quant_incr,
            domain)
          hub.emit('update', {
            operation: null,
            selection: selection
          })
        },
        tap: p => {
          const current = scale.inv(p[0])
          document.body.style.cursor = 'crosshair'
          hub.emit('update', {
            selection: null
          })
        },
        hover: p => {
          const current = scale.inv(p[0])
          document.body.style.cursor = 'crosshair'
          if (selection != null) {
            if (isnear(selection[0], current)
              || isnear(selection[1], current))
              document.body.style.cursor = 'col-resize'
            else if (selection[0] < current && selection[1] > current)
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