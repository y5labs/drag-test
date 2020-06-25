import component from '../component'
import {
  linearFromExtents,
  quant,
  range
} from '../math'

export default component({
  name: 'radial-grid-y',
  module,
  render: (h, { props, state, hub }) => {
    const radius = props.radius
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const r = [0, quant(quant_incr).ceil(max)]
    const y = linearFromExtents(r, radius)
    const ticks = props.ticks || range(r[0], r[1], quant_incr)
    return h('g', ticks.map(d =>
      h('circle.grid.y', { attrs: { cx: 0, cy: 0, r: y(d) } })))
  }
})
