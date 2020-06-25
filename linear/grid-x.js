import component from '../component'
import {
  linearFromExtents,
  quant,
  range
} from '../math'

export default component({
  name: 'linear-grid-x',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const height = props.height
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const display_fn = props.display_fn || (x => x.toFixed(0))
    const min = props.range ? props.range[0] : Math.min.apply(null, values)
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const r = [ quant(quant_incr).floor(min), quant(quant_incr).ceil(max) ]
    const x = linearFromExtents(r, [0, width])
    const ticks = props.ticks || range(r[0], r[1], quant_incr)
    return h('g', ticks.map(d =>
      h('g', { attrs: { transform: `translate(${x(d).toFixed(1)} 0)` } }, [
        h('line.grid.x', { attrs: { x1: 0, y1: 0, x2: 0, y2: height } })
      ])
    ))
  }
})