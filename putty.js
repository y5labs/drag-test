import component from './component'

const istouch = (('ontouchstart' in global)
  || global.DocumentTouch && document instanceof global.DocumentTouch)
  || navigator.msMaxTouchPoints
  || false

export default component({
  name: 'putty',
  module,
  render: (h, { hub, scopedSlots }) => {
    let hasmoved = null
    let start = null
    let delta = null
    const mousemove = e => {
      const rect = e.target.getBoundingClientRect()
      const current = [e.clientX - rect.left, e.clientY - rect.top]
      delta = [current[0] - start[0], current[1] - start[1]]
      if (!hasmoved) {
        hub.emit('start', { start: start })
        hasmoved = true
      }
      hub.emit('move', { start: start, current: current, delta: delta })
    }
    const mouseup = e => {
      const rect = e.target.getBoundingClientRect()
      const end = [e.clientX - rect.left, e.clientY - rect.top]
      const delta = [end[0] - start[0], end[1] - start[1]]
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', mouseup)
      if (!hasmoved) hub.emit('tap', start)
      else hub.emit('end', { start: start, end: end, delta: delta })
    }
    const mousedown = e => {
      e.preventDefault()
      let rect = e.target.getBoundingClientRect()
      start = [e.clientX - rect.left, e.clientY - rect.top]
      hasmoved = false
      window.addEventListener('mousemove', mousemove)
      window.addEventListener('mouseup', mouseup)
    }
    const cancelmousedown = e => {
      e.stopPropagation()
      e.preventDefault()
    }
    const touchmove = e => {
      rect = e.target.getBoundingClientRect()
      current = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top]
      delta = [current[0] - start[0], current[1] - start[1]]
      if (!hasmoved) {
        hub.emit('start', { start: start })
        hasmoved = true
      }
      hub.emit('move', { start: start, current: current, delta: delta })
    }
    const touchend = e => {
      rect = e.target.getBoundingClientRect()
      end = [e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top]
      delta = [end[0] - start[0], end[1] - start[1]]
      window.removeEventListener('touchmove', touchmove)
      window.removeEventListener('touchend', touchend)
      if (!hasmoved) hub.emit('tap', start)
      else hub.emit('end', { start: start, end: end, delta: delta })
    }
    const touchstart = e => {
      e.preventDefault()
      hasmoved = false
      let rect = e.target.getBoundingClientRect()
      start = [
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top]
      window.addEventListener('touchmove', touchmove)
      window.addEventListener('touchend', touchend)
    }
    const content = scopedSlots.default ? [scopedSlots.default()] : []
    return istouch
      ? h('div.putty', { on: { touchstart: touchstart }}, content)
      : h('div.putty', { on: { mousedown: mousedown }}, content)
  }
})
