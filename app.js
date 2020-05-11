import component from './component'
import putty from './putty'
import { format, utcToZonedTime } from 'date-fns-tz'
import { fromUnixTime, getUnixTime, formatDistanceStrict, parseISO } from 'date-fns'

// const formatTime = ts => {
//   const date = utcToZonedTime(fromUnixTime(ts), 'Pacific/Auckland')
//   const formatted = format(date,
//     getYear(date) != currentYear
//     ? 'iii d MMM yyyy h:mma'
//     : 'iii d MMM h:mma')
//   return `${formatted.slice(0, -2)}${formatted.slice(-2).toLowerCase()}`
// }

// a and b do more than just touch
const overlaps = (a, b) => a[1] > b[0] && a[0] < b[1]
// add a and b together
const add = (a, b) => {
  if (!overlaps(a, b)) return [[a[0], a[1]], [b[0], b[1]]]
  return [Math.min(a[0], b[0]), Math.max(a[1], b[1])]
}
// remove b from a
const subtract = (a, b) => {
  if (!overlaps(a, b)) return [[a[0], a[1]]]
  // a is within
  if (a[0] >= b[0] && a[1] <= b[1]) return []
  // b is within
  if (a[0] <= b[0] && a[1] >= b[1]) {
    if (a[0] == b[0]) return [[b[1], a[1]]]
    if (a[1] == b[1]) return [[b[0], a[0]]]
    return [[a[0], b[0]], [b[1], a[1]]]
  }
  // clip left
  if (a[0] <= b[0]) return [[a[0], b[0]]]
  // clip right
  if (b[1] <= a[1]) return [[b[1], a[1]]]
  return []
}
// intersect a and b
const intersect = (a, b) => {
  if (!overlaps(a, b)) return []
  return [[
    a[0] > b[0] ? a[0] : b[0],
    a[1] > b[1] ? b[1] : a[1]
  ]]
}


const dataset = [
  [
    getUnixTime(parseISO('2020-05-11T11:00:00')),
    getUnixTime(parseISO('2020-05-11T12:00:00'))
  ],
  [
    getUnixTime(parseISO('2020-05-11T13:00:00')),
    getUnixTime(parseISO('2020-05-11T16:00:00'))
  ],
  [
    getUnixTime(parseISO('2020-05-11T16:00:00')),
    getUnixTime(parseISO('2020-05-11T17:00:00'))
  ]
]
const visible = [
  getUnixTime(parseISO('2020-05-11T00:00:00')),
  getUnixTime(parseISO('2020-05-12T00:00:00'))
]
const secondsInAPixel = 3 * 60

const x = d => (d - visible[0]) / secondsInAPixel

const edges = Array.from(
  dataset.reduce((res, d, i) => {
    if (res.has(d[0])) res.get(d[0])[0] = i
    else res.set(d[0], [i, null])
    res.set(d[1], [null, i])
    return res
  }, new Map())
  .entries(),
  d => [ x(d[0]), ...d[1] ])

console.log(dataset, edges)
console.log(
  dataset.map(d => [ x(d[0]), x(d[1]) ])
)

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