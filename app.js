import component from './component'
import putty from './putty'
import { getUnixTime, parseISO } from 'date-fns'
import { rangeSubtract, getEdges, operate } from './lib/range'


const visible = {
  start: getUnixTime(parseISO('2020-05-10T12:00:00Z')),
  end: getUnixTime(parseISO('2020-05-11T12:00:00Z'))
}
const secondsInAPixel = 3 * 60
const x2p = d => (d - visible.start) / secondsInAPixel
const p2x = x => (x * secondsInAPixel) + visible.start
const range2p = d => ({ x1: x2p(d.start), x2: x2p(d.end), ...d })

let dataset = [
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

export default component({
  name: 'app',
  module,
  render: (h, { props, hub, state, route, router }) => {
    if (!props.operation) {
      const ds = dataset.map(range2p)
      const edges = getEdges(dataset).map(d => ({ x: x2p(d.start), ...d }))
      const findEdge = x => {
        for (const d of edges) if (Math.abs(d.x - x) <= 4) return d
        return null
      }
      const findRangeIndex = x => {
        for (let i = 0; i < ds.length; i++) {
          const d = ds[i]
          if (d.x1 < x && d.x2 > x) return i
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
        h('.area', { style: { width: `${x2p(visible.end)}px` } }, [
          h(putty, {
            attrs: {
              hub: hub.child({
                start: p => {
                  const x = p.start[0]
                  const edge = findEdge(x)
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
                  const index = findRangeIndex(x)
                  if (index != null) {
                    operation = { type: 'move', index, delta: 0 }
                    hub.emit('update', { operation, selectedindex: null })
                    window.addEventListener('keypress', cancelifesc)
                    return
                  }
                  operation = {  type: 'new', start: p2x(x), delta: 0 }
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
                  const result = operate(dataset, operation)
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
                  const x = p.current[0]
                  if (findEdge(x) != null)
                    document.body.style.cursor = 'col-resize'
                  else if (findRangeIndex(x) != null)
                    document.body.style.cursor = 'ew-resize'
                  else document.body.style.cursor = 'crosshair'
                }
              })
            }
          }),
          ...ds.map((d, i) => h('.box', {
            class: { selected: i == props.selectedindex },
            style: { left: `${d.x1}px`, width: `${d.x2 - d.x1}px` }
          }))
        ])
      ])
    }

    const result = operate(dataset, props.operation)
    const current = range2p(result.current)

    return h('#root', [
      h('.area', [
        h(putty),
        ...result.dataset.map(range2p).map((d, i) => h('.box', {
          style: { left: `${d.x1}px`, width: `${d.x2 - d.x1}px` }
        })),
        h('.box.selected', {
          style: {
            left: `${current.x1}px`,
            width: `${current.x2 - current.x1}px`
          }
        })
      ])
    ])
  }
})