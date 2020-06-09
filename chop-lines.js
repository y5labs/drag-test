import component from './component'
import {
  linearFromExtents,
  sliceArea,
  quant
} from './math'

export default component({
  name: 'app',
  module,
  render: (h, { props, hub }) => {
    const width = props.width
    const height = props.height
    const scaleBreak = props.scaleBreak
    const values = props.values
    const quant_incr = props.quant_incr
    const gap = width / values.length / 2
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const x = linearFromExtents([0, values.length], [gap, width + gap])
    const y = linearFromExtents([0, quant(quant_incr).ceil(max)], [height, 0])
    const xy2px = (x1, y1) => `${x(x1).toFixed(1)} ${y(y1).toFixed(1)}`
    const points = sliceArea(scaleBreak, 0, values)
    return h('g', [
      ...points.map(c => h('path.segment', {
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