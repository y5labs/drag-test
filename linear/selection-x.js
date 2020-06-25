import component from '../component'
import { linearFromExtents, quant } from '../math'
import { apply_operation } from './shared'

export default component({
  name: 'linear-selection-x',
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
    const display_fn = props.display_fn || (x => x.toFixed(0))
    const domain = props.domain || [0, 100]

    const selection = apply_operation(
      props.selection,
      props.operation,
      quant_incr,
      domain)

    const min = props.range ? props.range[0] : Math.min.apply(null, values)
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const r = [
      quant(range_quant_incr).floor(min),
      quant(range_quant_incr).ceil(max) - quant_incr
    ]
    const scale = linearFromExtents(r, [0, width])

    return h('g', selection != null ? (() => {
      const quant_selection = !display_quant
        ? selection
        : [
          selection[0],
          selection[1] + quant_incr
        ]
      return [
        h('rect.selection', {
          attrs: {
            x: scale(quant_selection[0]),
            y: 0,
            width: scale(quant_selection[1]) - scale(quant_selection[0]),
            height
          }
        }),
        h('text.label', { attrs: {
          dx: scale(quant_selection[0]) - 4,
          dy: height + 4,
          'text-anchor': 'end',
          'alignment-baseline': 'baseline'
        } }, display_fn(selection[0])),
        h('text.label', { attrs: {
          dx: scale(quant_selection[1]) + 4,
          dy: height + 4,
          'text-anchor': 'start',
          'alignment-baseline': 'baseline'
        } }, display_fn(selection[1]))
      ]
    })() : [])
  }
})