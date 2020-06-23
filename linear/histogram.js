import component from '../component'
import {
  linearFromExtents,
  quant
} from '../math'

export default component({
  name: 'linear-histogram',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const height = props.height
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const bar_width_total = width / values.length
    const bar_width = (bar_width_total * 0.9).toFixed(0)
    const bar_gap = bar_width_total - bar_width
    const min = props.range ? props.range[0] : Math.min.apply(null, values)
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const x = linearFromExtents([0, values.length], [bar_gap, width + bar_gap])
    const y = linearFromExtents([
      quant(quant_incr).floor(min),
      quant(quant_incr).ceil(max)
    ], [height, 0])
    const xy2px = (x1, y1) => `${x(x1).toFixed(1)} ${y(y1).toFixed(1)}`
    return h('g', values.map((d, i) =>
      d == null ? null
      : y(0).toFixed(1) - y(d).toFixed(1) > 0
      ? h('rect.histogram', { attrs: {
        x: x(i).toFixed(1),
        y: y(d).toFixed(1),
        width: bar_width,
        height: y(0).toFixed(1) - y(d).toFixed(1)
      } })
      : h('rect.histogram', { attrs: {
        x: x(i).toFixed(1),
        y: y(0).toFixed(1),
        width: bar_width,
        height: y(d).toFixed(1) - y(0).toFixed(1)
      } })
    ))
  }
})