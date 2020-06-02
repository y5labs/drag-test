import component from './component'
import { linearFromExtents, sliceArea } from './scratch'

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
    const data = [
      5, 6, 5, 4, 3, 2, 2, 3, 4, 4, 5, 5, 5, 6, 6, 7, 8
    ]
    const x = linearFromExtents([0, data.length - 1], [0, width])
    const y = linearFromExtents([0, 10], [height, 0])
    const xy2px = (x1, y1) => `${x(x1).toFixed(1)} ${y(y1).toFixed(1)}`
    const points = sliceArea(scaleBreak, 0, data)
    return h('svg', { style: { width: `${width}px`, height: `${height}px` } }, [
      ...points.map(c => h('path.segment', {
        class: {
          [scaleBreak[c.level][1].class]: true
        },
        attrs: { d: `
          M ${xy2px(c.points[0][0], c.points[0][1])}
          ${c.points.slice(1).map(d => `L ${xy2px(d[0], d[1])}`)}
          Z
        ` }
      } ))
    ])
  }
})