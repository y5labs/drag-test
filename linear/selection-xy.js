import component from '../component'
import { linearFromExtents, quant } from '../math'
import { apply_operation } from './shared'

export default component({
  name: 'linear-selection-xy',
  module,
  render: (h, { props, hub }) => {
    const quant_incr_x = props.quant_incr_x
    const range_quant_incr_x = props.range_quant_incr_x || 10
    const quant_incr_y = props.quant_incr_y
    const range_quant_incr_y = props.range_quant_incr_y || 10
    const width = props.width
    const height = props.height
    const values_x = props.values_x
    const display_quant_x = props.display_quant_x != null
      ? props.display_quant_x
      : false
    const domain_x = props.domain_x || [0, 100]

    const selection_x = apply_operation(
      props.selection_x,
      props.operation_x,
      quant_incr_x,
      domain_x)

    const min_x = props.range_x ? props.range_x[0] : Math.min.apply(null, values_x)
    const max_x = props.range_x ? props.range_x[1] : Math.max.apply(null, values_x)
    const r_x = [
      quant(range_quant_incr_x).floor(min_x),
      quant(range_quant_incr_x).ceil(max_x) - (!display_quant_x ? 0 : quant_incr_x)
    ]
    const x = linearFromExtents(r_x, [0, width])

    const values_y = props.values_y
    const display_quant_y = props.display_quant_y != null
      ? props.display_quant_y
      : false
    const domain_y = props.domain_y || [0, 100]

    const selection_y = apply_operation(
      props.selection_y,
      props.operation_y,
      quant_incr_y,
      domain_y)

    const min_y = props.range_y ? props.range_y[0] : Math.min.apply(null, values_y)
    const max_y = props.range_y ? props.range_y[1] : Math.max.apply(null, values_y)
    const r_y = [
      quant(range_quant_incr_y).floor(min_y),
      quant(range_quant_incr_y).ceil(max_y) - (!display_quant_y ? 0 : quant_incr_y)
    ]
    const y = linearFromExtents(r_y, [height, 0])

    return h('g', selection_x != null || selection_y != null ? (() => {
      const quant_selection_x = !selection_x
        ? r_x
        : !display_quant_x
        ? selection_x
        : [
          selection_x[0],
          selection_x[1] + quant_incr_x
        ]
      const quant_selection_y = !selection_y
        ? r_y
        : !display_quant_y
        ? selection_y
        : [
          selection_y[0],
          selection_y[1] + quant_incr_y
        ]
      return [
        h('rect.selection', {
          attrs: {
            x: x(quant_selection_x[0]),
            y: y(quant_selection_y[1]),
            width: x(quant_selection_x[1]) - x(quant_selection_x[0]),
            height: y(quant_selection_y[0]) - y(quant_selection_y[1])
          }
        })
      ]
    })() : [])
  }
})