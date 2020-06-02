import component from './component'
import {
  linearFromExtents,
  quant
} from './math'

export default component({
  name: 'app',
  module,
  render: (h, { props, hub }) => {
    const width = 400
    const height = 200
    const values = [
      null, null, 5, 6, 5, null, 3, null, 2, 0, 3, 4, 4, 5, null, 5, 6, 6, 7, 8, null
    ]
    const bar_width_total = width / values.length
    const bar_width = (bar_width_total * 0.9).toFixed(0)
    const bar_gap = bar_width_total - bar_width
    const x = linearFromExtents([0, values.length], [bar_gap, width + bar_gap])
    const y = linearFromExtents([0, quant(10).ceil(Math.max.apply(null, values))], [height, 0])
    const xy2px = (x1, y1) => `${x(x1).toFixed(1)} ${y(y1).toFixed(1)}`
    return h('svg', { style: { width: `${width}px`, height: `${height}px` } }, [
      ...values.map((d, i) =>
        d == null
        ? null
        : h('rect.histogram', { attrs: {
          x: x(i).toFixed(1),
          y: y(d).toFixed(1),
          width: bar_width,
          height: height - y(d).toFixed(1)
        } }))
    ])
  }
})