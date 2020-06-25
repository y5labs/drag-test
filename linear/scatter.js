import component from '../component'
import {
  linearFromExtents,
  quant,
  range
} from '../math'

export default component({
  name: 'linear-scatter',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const height = props.height
    const values_x = props.values_x
    const quant_incr_x = props.quant_incr_x || 10
    const min_x = props.range_x ? props.range_x[0] : Math.min.apply(null, values_x)
    const max_x = props.range_x ? props.range_x[1] : Math.max.apply(null, values_x)
    const r_x = [ quant(quant_incr_x).floor(min_x), quant(quant_incr_x).ceil(max_x) ]
    const x = linearFromExtents(r_x, [0, width])
    const values_y = props.values_y
    const quant_incr_y = props.quant_incr_y || 10
    const min_y = props.range_y ? props.range_y[0] : Math.min.apply(null, values_y)
    const max_y = props.range_y ? props.range_y[1] : Math.max.apply(null, values_y)
    const r_y = [ quant(quant_incr_y).floor(min_y), quant(quant_incr_y).ceil(max_y) ]
    const y = linearFromExtents(r_y, [height, 0])
    return h('g', range(0, Math.min(values_x.length, values_y.length))
      .map(i => ({ i, d_x: values_x[i], d_y: values_y[i] }))
      .filter(({ d_x, d_y }) => d_x != null && d_y != null)
      .map(({ d_x, d_y }) => h('circle.scatter', { attrs: {
        cx: x(d_x),
        cy: y(d_y),
        r: 3
      } })))
  }
})