import component from '../component'
import {
  linearFromExtents,
  quant,
  range
} from '../math'

export default component({
  name: 'linear-grid-y',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const height = props.height
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const display_fn = props.display_fn || (y => y.toFixed(0))
    const min = props.range ? props.range[0] : Math.min.apply(null, values)
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const r = [ quant(quant_incr).floor(min), quant(quant_incr).ceil(max) ]
    const y = linearFromExtents(r, [height, 0])
    const ticks = props.ticks || range(r[0], r[1], quant_incr)
    return h('g', ticks.map(d =>
      h('g', { attrs: { transform: `translate(0 ${y(d).toFixed(1)})` } }, [
        h('line.grid.y', { attrs: { x1: 0, y1: 0, x2: width, y2: 0 } })
      ])
    ))
  }
})