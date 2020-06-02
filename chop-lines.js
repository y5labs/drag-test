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
    const width = 400
    const height = 200
    const scaleBreak = [
      [2.3, { level: 0, class: 'red'}],
      [3.7, { level: 1, class: 'blue'}],
      [5.5, { level: 2, class: 'green'}],
      [Infinity, { level: 3, class: 'purple'}]
    ]
    const values = [
      null, null, 5, 6, 5, null, 3, null, 2, 0, 3, 4, 4, 5, null, 5, 6, 6, 7, 8, null
    ]
    const x = linearFromExtents([0, values.length - 1], [0, width])
    const y = linearFromExtents([0, quant(10).ceil(Math.max.apply(null, values))], [height, 0])
    const xy2px = (x1, y1) => `${x(x1).toFixed(1)} ${y(y1).toFixed(1)}`
    const points = sliceArea(scaleBreak, 0, values)
    return h('svg', { style: { width: `${width}px`, height: `${height}px` } }, [
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