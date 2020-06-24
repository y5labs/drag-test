import component from '../component'
import {
  linearFromExtents,
  quant
} from '../math'

export default component({
  name: 'linear-histogram-x-axis',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const display_fn = props.display_fn || (x => x.toFixed(0))
    const bar_width_total = width / values.length
    const bar_width = (bar_width_total * 0.9).toFixed(0)
    const bar_gap = bar_width_total - bar_width
    const x = linearFromExtents([0, values.length], [
      bar_gap + bar_width / 2,
      width + bar_gap + bar_width / 2
    ])
    return h('g', values.map((d, i) =>
      d == null ? null
      : h('g', { attrs: { transform: `translate(${x(i).toFixed(1)} 0)` } }, [
        h('text.axis.x', display_fn(d))
      ])
    ))
  }
})