import component from '../component'
import putty from 'vue-putty'
import { linearFromExtents, quant } from '../math'

import { getUnixTime, fromUnixTime } from 'date-fns'
import { format, utcToZonedTime, toDate } from 'date-fns-tz'
import locale from 'date-fns/locale/en-GB'
const fmt = (d, timeZone) =>
  format(utcToZonedTime(d, timeZone), 'HH:mm', { timeZone, locale })


const secondsPerPixel = 2 * 60
const isnear = (a, b) => Math.abs(b - a) < 8 * 60

export default component({
  name: 'app',
  module,
  render: (h, { props, hub }) => {
    const quant_incr = props.quant_incr
    const domain = {
      from: props.domain_from
        || getUnixTime(toDate('2020-04-05T00:00:00', 'Pacific/Auckland')),
      until: props.domain_until
        || getUnixTime(toDate('2020-04-06T00:00:00', 'Pacific/Auckland'))
    }
    const scale = linearFromExtents(
      [domain.from, domain.until],
      [0, (domain.until - domain.from) / secondsPerPixel])
    const range_width = scale(domain.until) - scale(domain.from)
    let operation = props.operation
    const apply_operation = selected => {
      if (!operation) return selected
      selected = { ...selected }
      if (operation.type == 'from')
        selected.from += operation.delta
      else if (operation.type == 'until')
        selected.until += operation.delta
      else if (operation.type == 'move') {
        selected.from += operation.delta
        selected.until += operation.delta
      } else if (operation.type == 'new') {
        selected.from = operation.start
        selected.until = operation.current
      }
      if (selected.from > selected.until)
        [selected.from, selected.until] =
          [selected.until, selected.from]
      selected.from = quant(quant_incr).round(selected.from)
      selected.until = quant(quant_incr).round(selected.until)
      if (selected.from == selected.until)
        selected.until += quant_incr
      if (selected.from < domain.from)
        selected.from = domain.from
      if (selected.until > domain.until)
        selected.until = domain.until
      return selected
    }
    const selected = apply_operation({
      from: props.selected_from,
      until: props.selected_until
    })

    return h('.area', { style: { width: `${range_width}px` } }, [
      h(putty, {
        on: {
          start: p => {
            const current = scale.inv(p[0])
            if (selected.from != null) {
              if (isnear(selected.from, current)) {
                operation = { type: 'from', delta: 0 }
                return hub.emit('update', { operation: Object.assign({}, operation) })
              }
              else if (isnear(selected.until, current)) {
                operation = { type: 'until', delta: 0 }
                return hub.emit('update', { operation: Object.assign({}, operation) })
              }
              else if (selected.from < current && selected.until > current) {
                operation = { type: 'move', delta: 0 }
                return hub.emit('update', { operation: Object.assign({}, operation) })
              }
            }
            const start = quant(quant_incr).round(current)
            operation = {
              type: 'new',
              start,
              current: start,
              delta: 0
            }
            hub.emit('update', { operation: Object.assign({}, operation) })
          },
          move: p => {
            if (!operation) return
            operation.delta = p.delta[0] * secondsPerPixel
            operation.current = quant(quant_incr).round(
              scale.inv(p.current[0]))
            hub.emit('update', { operation: Object.assign({}, operation) })
          },
          end: p => {
            const selected = apply_operation({
              from: props.selected_from,
              until: props.selected_until
            })
            hub.emit('update', {
              operation: null,
              selected_from: selected.from,
              selected_until: selected.until
            })
          },
          tap: p => {
            document.body.style.cursor = 'crosshair'
            hub.emit('update', {
              selected_from: null,
              selected_until: null
            })
          },
          hover: p => {
            const current = scale.inv(p[0])
            document.body.style.cursor = 'crosshair'
            if (selected.from) {
              if (isnear(selected.from, current)
                || isnear(selected.until, current))
                document.body.style.cursor = 'col-resize'
              else if (selected.from < current && selected.until > current)
                document.body.style.cursor = 'ew-resize'
              else
                document.body.style.cursor = 'crosshair'
            }
          },
          leave: () => {
            document.body.style.cursor = 'auto'
          }
        }
      }),
        ...(selected.from != null ? [
          h('.box.selected', {
            style: {
              left: `${scale(selected.from)}px`,
              width: `${scale(selected.until) - scale(selected.from)}px` }
          }),
          h('.start', { style: { left: `${scale(selected.from)}px` } },
            fmt(fromUnixTime(selected.from), 'Pacific/Auckland')),
          h('.end', { style: { left: `${scale(selected.until)}px`  } },
            fmt(fromUnixTime(selected.until), 'Pacific/Auckland'))
        ] : [])
    ])
  }
})