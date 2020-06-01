import component from './component'
import { linear, linearFromExtents, breaks} from './scratch'

const data = [
  5, 6, 5, 4, 3, 2, 2, 3, 4, 4, 5, 5, 5, 6, 6, 7, 8
]

const scaleBreak = [
  [2.3, { level: 0, class: 'red'}],
  [3.7, { level: 1, class: 'blue'}],
  [5.5, { level: 2, class: 'green'}],
  [Infinity, { level: 3, class: 'purple'}]
]
const bottom = 0

const collection = []
const stack = [...Array(breaks(scaleBreak, data[0]).level).keys()]
  .map(i => [[0, scaleBreak[i][0]]])
stack.push([[0, data[0]]])
let i = 1
while (i < data.length) {
  let d = data[i]
  let level = breaks(scaleBreak, d).level
  // climb into scale, creating as we go.
  while (stack.length <= level) {
    const start = data[i - 1]
    const scale = scaleBreak[stack.length - 1][0] - start
    const point = [i - 1 + scale, start + scale / (d - start)]
    stack[stack.length - 1].push(point)
    stack.push([point])
  }
  // descend out of scales
  while (stack.length > level + 1) {
    const start = data[i - 1]
    const scale = start - scaleBreak[stack.length - 2][0]
    const point = [i - 1 + scale, start - scale / (start - d)]
    stack[stack.length - 1].push(point)
    const points = stack.pop()
    points.push([points[0][0], scaleBreak[stack.length - 1][0]])
    collection.push({ level: stack.length, points })
    stack[stack.length - 1].push(point)
  }
  stack[stack.length - 1].push([i, d])
  i++
}
while (stack.length > 0) {
  const base = stack.length > 1 ? scaleBreak[stack.length - 2][0] : bottom
  const points = stack.pop()
  points.push([data.length - 1, points[points.length - 1][1]])
  points.push([data.length - 1, base])
  points.push([points[0][0], base])
  collection.push({ level: stack.length, points })
}

export default component({
  name: 'app',
  module,
  render: (h, { props, hub }) => {
    const width = 400
    const height = 200
    const x = linearFromExtents(
      [0, data.length - 1],
      [0, width]
    )
    const y = linearFromExtents(
      [0, 10],
      [height, 0]
    )
    const xy2px = (x1, y1) => `${x(x1).toFixed(1)} ${y(y1).toFixed(1)}`
    return h('svg', { style: { width: `${width}px`, height: `${height}px` } }, [
      ...collection.map(c => h('path.segment', {
        class: {
          [scaleBreak[c.level][1].class]: true
        },
        attrs: { d: `
          M ${xy2px(c.points[0][0], c.points[0][1])}
          ${c.points.map(d => `L ${xy2px(d[0], d[1])}`)}
          Z
        ` }
      } ))
    ])
  }
})