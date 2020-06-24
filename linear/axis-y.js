import component from '../component'
import {
  linearFromExtents,
  quant,
  range
} from '../math'

export default component({
  name: 'linear-axis-y',
  module,
  render: (h, { props, hub }) => {
    const height = props.height
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const display_fn = props.display_fn || (y => y.toFixed(0))
    const min = props.range ? props.range[0] : Math.min.apply(null, values)
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const r = [ quant(quant_incr).floor(min), quant(quant_incr).ceil(max) ]
    const y = linearFromExtents(r, [height, 0])
    return h('g', range(r[0], r[1], quant_incr).map(d =>
      h('g', { attrs: { transform: `translate(0 ${y(d).toFixed(1)})` } }, [
        h('text.axis.y', display_fn(d))
      ])
    ))
  }
})