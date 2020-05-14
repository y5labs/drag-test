import component from './component'
import putty from 'vue-putty'
import { getUnixTime, fromUnixTime, parseISO } from 'date-fns'
import { rangeSubtract } from 'date-fns-lost'

import locale from 'date-fns/locale/en-GB'
import { format, utcToZonedTime, toDate } from 'date-fns-tz'

const fmt = (d, timeZone) =>
  format(utcToZonedTime(d, timeZone), 'HH:mm', { timeZone, locale })


const getEdges = dataset => Array.from(
  dataset.reduce((res, d, i) => {
    if (res.has(d.start)) res.get(d.start).startindex = i
    else res.set(d.start, { startindex: i, endindex: null })
    res.set(d.end, { startindex: null, endindex: i })
    return res
  }, new Map())
  .entries(),
  d => ({ start: d[0], ...d[1] }))

const operate = (input, operation, quant = ts => ts) => {
  const dataset = input.slice()
  if (operation.type == 'new') {
    let start = operation.start
    let end = operation.start + operation.delta
    if (start > end) [start, end] = [end, start]
    const current = quant({ start, end })
    return {
      dataset: dataset.map(d => rangeSubtract(d, current)).flat(),
      selected: current,
      current
    }
  }
  const selected = dataset[operation.index]
  let { start, end } = selected
  if (operation.type == 'resize start') start += operation.delta
  if (operation.type == 'resize end') end += operation.delta
  if (operation.type == 'move') {
    start += operation.delta
    end += operation.delta
  }
  if (start > end) [start, end] = [end, start]
  const current = quant({ start, end })
  dataset.splice(operation.index, 1)
  return {
    dataset: dataset.map(d => rangeSubtract(d, current)).flat(),
    selected,
    current
  }
}

const visible = {
  start: getUnixTime(toDate('2020-04-05T00:00:00', 'Pacific/Auckland')),
  end: getUnixTime(toDate('2020-04-06T00:00:00', 'Pacific/Auckland'))
}
const secondsInAPixel = 2 * 60
const ts2px = d => (d - visible.start) / secondsInAPixel
const px2ts = ts => (ts * secondsInAPixel) + visible.start
const range2px = d => ({ ts1: ts2px(d.start), ts2: ts2px(d.end), ...d })
const smallestincrement = 5 * 60
const quantts = ts => Math.round(ts / smallestincrement) * smallestincrement
const quant = ({ start, end }) => {
  start = quantts(start)
  end = quantts(end)
  if (start == end) end += smallestincrement
  return { start, end }
}

let dataset = [
  {
    start: getUnixTime(toDate('2020-04-05T11:00:00', 'Pacific/Auckland')),
    end: getUnixTime(toDate('2020-04-05T12:00:00', 'Pacific/Auckland'))
  },
  {
    start: getUnixTime(toDate('2020-04-05T15:00:00', 'Pacific/Auckland')),
    end: getUnixTime(toDate('2020-04-05T16:00:00', 'Pacific/Auckland'))
  },
  {
    start: getUnixTime(toDate('2020-04-05T16:00:00', 'Pacific/Auckland')),
    end: getUnixTime(toDate('2020-04-05T18:00:00', 'Pacific/Auckland'))
  }
]

export default component({
  name: 'app',
  module,
  render: (h, { props, hub }) => {
    if (!props.operation) {
      const ds = dataset.map(range2px)
      const selected = props.selectedindex != null ? dataset[props.selectedindex] : null
      const edges = getEdges(dataset).map(d => ({ ts: ts2px(d.start), ...d }))
      const findEdge = ts => {
        for (const d of edges) if (Math.abs(d.ts - ts) <= 4) return d
        return null
      }
      const findRangeIndex = ts => {
        for (let i = 0; i < ds.length; i++) {
          const d = ds[i]
          if (d.ts1 < ts && d.ts2 > ts) return i
        }
        return null
      }
      let operation = null
      const cancelifesc = e => {
        e = e || window.event
        if (e.key === 'Escape' || e.key === 'Esc') {
          operation = null
          hub.emit('update', { operation })
          window.removeEventListener('keypress', cancelifesc)
        }
      }
      return h('#root', [
        h('.area', { style: { width: `${ts2px(visible.end)}px` } }, [
          h(putty, {
            on: {
              start: p => {
                const ts = p[0]
                const edge = findEdge(ts)
                if (edge != null) {
                  if (edge.endindex != null) {
                    operation = { type: 'resize end', index: edge.endindex, delta: 0 }
                    hub.emit('update', { operation, selectedindex: null })
                    window.addEventListener('keypress', cancelifesc)
                  }
                  else if (edge.startindex != null) {
                    operation = { type: 'resize start', index: edge.startindex, delta: 0 }
                    hub.emit('update', { operation, selectedindex: null })
                    window.addEventListener('keypress', cancelifesc)
                  }
                  return
                }
                const index = findRangeIndex(ts)
                if (index != null) {
                  operation = { type: 'move', index, delta: 0 }
                  hub.emit('update', { operation, selectedindex: null })
                  window.addEventListener('keypress', cancelifesc)
                  return
                }
                operation = {  type: 'new', start: px2ts(ts), delta: 0 }
                hub.emit('update', { operation, selectedindex: null })
                window.addEventListener('keypress', cancelifesc)
              },
              move: p => {
                if (!operation) return
                operation.delta = p.delta[0] * secondsInAPixel
                hub.emit('update', { operation, selectedindex: null })
              },
              end: p => {
                if (!operation) return
                const result = operate(dataset, operation, quant)
                dataset = result.dataset
                let selectedindex = null
                if (operation.type == 'resize start'
                  || operation.type == 'resize end'
                  || operation.type == 'move'
                  || operation.type == 'new') {
                  dataset.push(result.current)
                  selectedindex = dataset.length - 1
                }
                hub.emit('update', { operation: null, selectedindex })
                window.removeEventListener('keypress', cancelifesc)
                document.body.style.cursor = 'auto'
              },
              tap: p => {
                const selectedindex = findRangeIndex(p[0])
                if (selectedindex != null)
                  hub.emit('update', { selectedindex })
                else
                  hub.emit('update', { selectedindex: null })
              },
              hover: p => {
                const px = p[0]
                if (findEdge(px) != null)
                  document.body.style.cursor = 'col-resize'
                else if (findRangeIndex(px) != null)
                  document.body.style.cursor = 'ew-resize'
                else
                  document.body.style.cursor = 'crosshair'
                hub.emit('update', { hoverts: px2ts(px) })
              },
              leave: () => {
                document.body.style.cursor = 'auto'
                hub.emit('update', { hoverts: null })
              }
            }
          }),
          ...ds.map((d, i) => h('.box', {
            class: { selected: i == props.selectedindex },
            style: { left: `${d.ts1}px`, width: `${d.ts2 - d.ts1}px` }
          })),
          ...(selected ? [
            h('.start', { style: { left: `${ts2px(selected.start)}px` } },
              fmt(fromUnixTime(selected.start), 'Pacific/Auckland')),
            h('.end', { style: { left: `${ts2px(selected.end)}px`  } },
              fmt(fromUnixTime(selected.end), 'Pacific/Auckland'))
          ]
          : [
            props.hoverts && h('.hover', { style: { left: `${ts2px(props.hoverts)}px` } },
            fmt(fromUnixTime(quantts(props.hoverts)), 'Pacific/Auckland'))
          ])
        ])
      ])
    }

    const result = operate(dataset, props.operation, quant)
    const current = range2px(result.current)

    return h('#root', [
      h('.area', { style: { width: `${ts2px(visible.end)}px` } }, [
        h(putty),
        ...result.dataset.map(range2px).map((d, i) => h('.box', {
          style: { left: `${d.ts1}px`, width: `${d.ts2 - d.ts1}px` }
        })),
        h('.box.selected', {
          style: {
            left: `${current.ts1}px`,
            width: `${current.ts2 - current.ts1}px`
          }
        }),
        h('.start', { style: { left: `${ts2px(result.current.start)}px` } },
          fmt(fromUnixTime(result.current.start), 'Pacific/Auckland')),
        h('.end', { style: { left: `${ts2px(result.current.end)}px` } },
          fmt(fromUnixTime(result.current.end), 'Pacific/Auckland'))
      ])
    ])
  }
})