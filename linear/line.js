import component from '../component'
import {
  linearFromExtents,
  sliceLine,
  quant
} from '../math'

export default component({
  name: 'linear-area',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const height = props.height
    const scaleBreak = props.scaleBreak
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const gap = width / values.length / 2
    const min = props.range ? props.range[0] : Math.min.apply(null, values)
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const x = linearFromExtents([0, values.length], [gap, width + gap])
    const y = linearFromExtents([
      quant(quant_incr).floor(min),
      quant(quant_incr).ceil(max)
    ], [height, 0])
    const xy2px = (x1, y1) => `${x(x1).toFixed(1)} ${y(y1).toFixed(1)}`
    const points = sliceLine(scaleBreak, values)
    return h('g', [
      ...points.map(c => h('path.line', {
        class: {
          [scaleBreak[c.level][1].class]: true
        },
        attrs: { d: `
          M ${xy2px(c.points[0][0], c.points[0][1])}
          ${c.points.slice(1).map(d =>
            `L ${xy2px(d[0], d[1])}`)}
        ` }
      } ))
    ])
  }
})