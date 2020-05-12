import component from './component'
import putty from './putty'
import { getUnixTime, parseISO } from 'date-fns'


const visible = {
  start: getUnixTime(parseISO('2020-05-10T12:00:00Z')),
  end: getUnixTime(parseISO('2020-05-11T12:00:00Z'))
}
const secondsInAPixel = 3 * 60
const x2p = d => (d - visible.start) / secondsInAPixel
const p2x = x => (x * secondsInAPixel) + visible.start


const dataset = [
  {
    start: getUnixTime(parseISO('2020-05-10T23:00:00Z')),
    end: getUnixTime(parseISO('2020-05-11T00:00:00Z'))
  },
  {
    start: getUnixTime(parseISO('2020-05-11T01:00:00Z')),
    end: getUnixTime(parseISO('2020-05-11T04:00:00Z'))
  },
  {
    start: getUnixTime(parseISO('2020-05-11T04:00:00Z')),
    end: getUnixTime(parseISO('2020-05-11T05:00:00Z'))
  }
]

const getEdges = dataset => Array.from(
  dataset.reduce((res, d, i) => {
    if (res.has(d.start)) res.get(d.start).startindex = i
    else res.set(d.start, { startindex: i, endindex: null })
    res.set(d.end, { startindex: null, endindex: i })
    return res
  }, new Map())
  .entries(),
  d => ({ start: d[0], ...d[1] }))

const operation = {
  type: 'resize start',
  startindex: 0,
  endindex: null,
  delta: 5 * secondsInAPixel
}

const result = ((input, operation) => {
  const dataset = input.slice()
  if (operation.type == 'resize start') {
    const selected = dataset[operation.startindex]
    let { start, end } = selected
    start += operation.delta
    if (start > end) [start, end] = [end, start]
    dataset.splice(operation.startindex, 1)
    return {
      dataset,
      start: selected,
      current: { start, end },
      delta: {
        start: start - selected.start,
        end: end - selected.end
      }
    }
  }
  if (operation.type == 'resize end') {
    const selected = dataset[operation.endindex]
    let { start, end } = selected
    end += operation.delta
    if (start > end) [start, end] = [end, start]
    dataset.splice(operation.endindex, 1)
    return {
      dataset,
      start: selected,
      current: { start, end },
      delta: {
        start: start - selected.start,
        end: end - selected.end
      }
    }
  }
})(dataset, operation)

console.log(result)




const edges = getEdges(dataset)

console.log(dataset.map(d => ({ x1: x2p(d.start), x2: x2p(d.end), ...d })))
console.log(edges.map(d => ({ x: x2p(d.start), ...d })))




// Questions:
// How to tell when two periods share an edge?

export default component({
  name: 'app',
  module,
  render: (h, { props, hub, state, route, router }) => {
    return h('#root', [
      h('.area', [
        h(putty, {
          attrs: {
            hub: hub.child({
              start: p => console.log('start', p),
              move: p => console.log('move', p),
              end: p => console.log('end', p),
              tap: p => console.log('tap', p)
            })
          },
          scopedSlots: {
            default: () =>
              h('.box', {
                style: {
                  top: '20px',
                  left: '20px',
                  width: '300px',
                  height: '300px'
                }
              })
          }
        })
      ]),
      h('p', 'Hello')
    ])
  }
})