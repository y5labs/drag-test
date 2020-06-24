import component from '../component'
import {
  linearFromExtents,
  quant,
  range
} from '../math'

export default component({
  name: 'linear-axis-x',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const gap = width / values.length / 2
    const display_fn = props.display_fn || (x => x.toFixed(0))
    const r = [0, values.length]
    const x = linearFromExtents(r, [gap, width + gap])
    return h('g', range(r[0], r[1], quant_incr).map(i =>
      values[i] == null ? null
      : h('g', { attrs: { transform: `translate(${x(i).toFixed(1)} 0)` } }, [
        h('text.axis.x', display_fn(values[i]))
      ])
    ))
  }
})