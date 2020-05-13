import component from './component'
import putty from './putty'
import { getUnixTime, parseISO } from 'date-fns'
import { rangeSubtract, getEdges, operate } from './lib/range'


const visible = {
  start: getUnixTime(parseISO('2020-04-03T12:00:00Z')),
  end: getUnixTime(parseISO('2020-04-04T12:00:00Z'))
}
const secondsInAPixel = 2 * 60
const ts2px = d => (d - visible.start) / secondsInAPixel
const px2ts = ts => (ts * secondsInAPixel) + visible.start
const range2px = d => ({ ts1: ts2px(d.start), ts2: ts2px(d.end), ...d })
const smallestincrement = 6 * 60
const quant = ({ start, end }) => {
  start = Math.round(start / smallestincrement) * smallestincrement
  end = Math.round(end / smallestincrement) * smallestincrement
  if (start == end) end += smallestincrement
  return { start, end }
}

let dataset = [
  {
    start: getUnixTime(parseISO('2020-04-03T23:00:00Z')),
    end: getUnixTime(parseISO('2020-04-04T00:00:00Z'))
  },
  {
    start: getUnixTime(parseISO('2020-04-04T01:00:00Z')),
    end: getUnixTime(parseISO('2020-04-04T04:00:00Z'))
  },
  {
    start: getUnixTime(parseISO('2020-04-04T04:00:00Z')),
    end: getUnixTime(parseISO('2020-04-04T05:00:00Z'))
  }
]

export default component({
  name: 'app',
  module,
  render: (h, { props, hub, state, route, router }) => {
    if (!props.operation) {
      const ds = dataset.map(range2px)
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
            attrs: {
              hub: hub.child({
                start: p => {
                  const ts = p.start[0]
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
                leave: () => document.body.style.cursor = 'auto',
                hover: p => {
                  const ts = p.current[0]
                  if (findEdge(ts) != null)
                    document.body.style.cursor = 'col-resize'
                  else if (findRangeIndex(ts) != null)
                    document.body.style.cursor = 'ew-resize'
                  else document.body.style.cursor = 'crosshair'
                }
              })
            }
          }),
          ...ds.map((d, i) => h('.box', {
            class: { selected: i == props.selectedindex },
            style: { left: `${d.ts1}px`, width: `${d.ts2 - d.ts1}px` }
          }))
        ])
      ])
    }

    const result = operate(dataset, props.operation, quant)
    const current = range2px(result.current)

    return h('#root', [
      h('.area', [
        h(putty),
        ...result.dataset.map(range2px).map((d, i) => h('.box', {
          style: { left: `${d.ts1}px`, width: `${d.ts2 - d.ts1}px` }
        })),
        h('.box.selected', {
          style: {
            left: `${current.ts1}px`,
            width: `${current.ts2 - current.ts1}px`
          }
        })
      ])
    ])
  }
})