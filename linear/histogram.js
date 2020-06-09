import component from '../component'
import {
  linearFromExtents,
  quant
} from '../math'

export default component({
  name: 'app',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const height = props.height
    const values = props.values
    const bar_width_total = width / values.length
    const bar_width = (bar_width_total * 0.9).toFixed(0)
    const bar_gap = bar_width_total - bar_width
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const x = linearFromExtents([0, values.length], [bar_gap, width + bar_gap])
    const y = linearFromExtents([0, quant(10).ceil(max)], [height, 0])
    const xy2px = (x1, y1) => `${x(x1).toFixed(1)} ${y(y1).toFixed(1)}`
    return h('g', values.map((d, i) =>
      d == null
      ? null
      : h('rect.histogram', { attrs: {
        x: x(i).toFixed(1),
        y: y(d).toFixed(1),
        width: bar_width,
        height: height - y(d).toFixed(1)
      } })))
  }
})