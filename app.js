import component from './component'
import putty from './putty'
import { format, utcToZonedTime } from 'date-fns-tz'
import locale from 'date-fns/locale/en-GB'
const fmt = (d, timeZone) =>
  format(
    utcToZonedTime(d, timeZone),
    'yyyy-MM-dd\'T\'HH:mm:ss (zzzz)',
    { timeZone, locale })

import spanner from './lib/spanner'
import chrono from './lib/chrono'
import schedule from './lib/schedule'
import dsl from './lib/dsl'

const parsed = dsl(`

  start: now/M
  end: now+4M/M

  // the first tuesday of every month
  result:
    + interval(now/M, +7d, 1M)

`,
'America/New_York')
console.log(parsed.constants)
const segments = schedule(
  parsed.schedules,
  parsed.schedules.result,
  {
    start: parsed.constants.start,
    end: parsed.constants.end
  },
  'America/New_York')
for (let segment of segments) {
  console.log(`${fmt(segment.start, 'America/New_York')} — ${fmt(segment.end, 'America/New_York')}`)
}


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