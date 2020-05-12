import component from './component'
import putty from './putty'
import { toDate, format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { fromUnixTime, getUnixTime, formatDistanceStrict, parseISO } from 'date-fns'
import enGB from 'date-fns/locale/en-GB'
const fmt = (d, tz) =>
  format(d, 'yyyy-MM-dd\'T\'HH:mm:ss (zzzz)', { timeZone: tz, locale: enGB })

import spanner from './lib/spanner'
import chrono from './lib/chrono'

// const nzdaylightsavingsexample = [
//   '2020-04-04T12:00:00Z',
//   '2020-04-04T12:30:00Z',
//   '2020-04-04T13:00:00Z',
//   '2020-04-04T13:30:00Z',
//   '2020-04-04T14:00:00Z',
//   '2020-04-04T14:30:00Z',
//   '2020-04-04T15:00:00Z',
//   '2020-04-04T15:30:00Z',
//   '2020-04-04T16:00:00Z',
//   '2020-04-04T16:30:00Z',
//   '2020-04-04T17:00:00Z'
// ]

// for (const d of nzdaylightsavingsexample)
//   console.log(fmt(utcToZonedTime(parseISO(d), 'Pacific/Auckland'), 'Pacific/Auckland'))

// const usdaylightsavingsexample = [
//   '2020-03-08T06:00:00Z',
//   '2020-03-08T06:30:00Z',
//   '2020-03-08T07:00:00Z',
//   '2020-03-08T07:30:00Z',
//   '2020-03-08T08:00:00Z',
//   '2020-03-08T08:30:00Z',
//   '2020-03-08T09:00:00Z',
//   '2020-03-08T09:30:00Z',
//   '2020-03-08T10:00:00Z',
//   '2020-03-08T10:30:00Z',
//   '2020-03-08T11:00:00Z'
// ]

// for (const d of usdaylightsavingsexample)
//   console.log(fmt(utcToZonedTime(parseISO(d), 'America/New_York'), 'America/New_York'))

// console.log(fmt(spanner(new Date(), '(Pacific/Auckland)-5d/isow'), 'Pacific/Auckland'))

const days = chrono(parseISO('2020-05-12T00:00:00Z'), 1, 'd', 'Pacific/Auckland')
console.log(fmt(days.nth(-1), 'Pacific/Auckland'))
console.log(fmt(days.nth(0), 'Pacific/Auckland'))
console.log(fmt(days.nth(1), 'Pacific/Auckland'))
console.log(fmt(days.nth(2), 'Pacific/Auckland'))
console.log(days.floor(parseISO('2020-05-10T10:00:00Z')))
console.log(days.floor(parseISO('2020-05-11T10:00:00Z')))
console.log(days.floor(parseISO('2020-05-12T10:00:00Z')))
console.log(days.floor(parseISO('2020-05-13T10:00:00Z')))
console.log(days.floor(parseISO('2020-05-14T10:00:00Z')))
console.log()
console.log(days.ceil(parseISO('2020-05-10T10:00:00Z')))
console.log(days.ceil(parseISO('2020-05-11T10:00:00Z')))
console.log(days.ceil(parseISO('2020-05-12T10:00:00Z')))
console.log(days.ceil(parseISO('2020-05-13T10:00:00Z')))
console.log(days.ceil(parseISO('2020-05-14T10:00:00Z')))
console.log(days.between(
  parseISO('2020-05-02T00:00:00Z'),
  parseISO('2020-05-03T00:00:00Z')
).map(d => fmt(d, 'Pacific/Auckland')))


// const dataset = [
//   [
//     getUnixTime(parseISO('2020-05-10T23:00:00Z')),
//     getUnixTime(parseISO('2020-05-11T00:00:00Z'))
//   ],
//   [
//     getUnixTime(parseISO('2020-05-11T01:00:00Z')),
//     getUnixTime(parseISO('2020-05-11T04:00:00Z'))
//   ],
//   [
//     getUnixTime(parseISO('2020-05-11T04:00:00Z')),
//     getUnixTime(parseISO('2020-05-11T05:00:00Z'))
//   ]
// ]
// const visible = [
//   getUnixTime(parseISO('2020-05-10T12:00:00Z')),
//   getUnixTime(parseISO('2020-05-11T12:00:00Z'))
// ]
// const secondsInAPixel = 3 * 60

// const x = d => (d - visible[0]) / secondsInAPixel

// const edges = Array.from(
//   dataset.reduce((res, d, i) => {
//     if (res.has(d[0])) res.get(d[0])[0] = i
//     else res.set(d[0], [i, null])
//     res.set(d[1], [null, i])
//     return res
//   }, new Map())
//   .entries(),
//   d => [ x(d[0]), ...d[1] ])

// console.log(dataset, edges)
// console.log(
//   dataset.map(d => [ x(d[0]), x(d[1]) ])
// )




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