import component from '../component'
import {
  linearFromExtents,
  quant,
  range
} from '../math'

export default component({
  name: 'linear-histogram-axis-x',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const values = props.values
    const display_fn = props.display_fn || (x => x.toFixed(0))
    const quant_incr = props.quant_incr || 10
    const bar_width_total = width / values.length
    const bar_width = (bar_width_total * 0.9).toFixed(0)
    const bar_gap = bar_width_total - bar_width
    const r = [0, values.length]
    const x = linearFromExtents(r, [
      bar_gap + bar_width / 2,
      width + bar_gap + bar_width / 2
    ])
    return h('g', range(r[0], r[1], quant_incr).map(i =>
      values[i] == null ? null
      : h('g', { attrs: { transform: `translate(${x(i).toFixed(1)} 0)` } }, [
        h('text.axis.x', display_fn(values[i]))
      ])
    ))
  }
})