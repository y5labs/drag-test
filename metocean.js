import Cube from 'seacreature/analytics/cube'
import { quant } from './math'
import pathie from 'seacreature/lib/pathie'


const cube = Cube(x => x.time)
const by_time = cube.range_single(x => x.time)
const by_wsp = cube.range_single(x => x.wsp)
const by_hs = cube.range_single(x => x.hs)

const group = (cube, quant_incr, fn, round = x => x) => {
  const q = quant(quant_incr).floor
  const groups = {}
  const index = [{ v: 0, r: round(0) }]
  const domain = [0, 0]
  const range = [0, 0]
  cube.on('selection changed', ({ put, del }) => {
    del.forEach(x => {
      pathie.assign(groups, [round(q(fn(x)))], c => (c || 0) - 1)
    })
    put.forEach(x => {
      const v = q(fn(x))
      while (index[index.length - 1].v < v) {
        domain[1] = index[index.length - 1].v + quant_incr
        index.push({v: domain[1], r: round(domain[1]) })
      }
      pathie.assign(groups, [round(v)], c => {
        const res = (c || 0) + 1
        range[1] = Math.max(res, range[1])
        return res
      })
    })
  })
  return { quant_incr, groups, index, domain, range }
}

const wd = group(cube, Math.PI / 8, x => x.wd, x => x.toFixed(3))
const wd_freq1 = cube.range_single(x => quant(Math.PI / 8).floor(x.wd) / Math.PI * 180)
const wd_freq2 = cube.range_single(x => quant(Math.PI / 8).floor(x.wd) / Math.PI * 180)
const wsp = group(cube, 2, x => x.wsp, x => x.toFixed(0))
const wsp_freq = cube.range_single(x => quant(2).floor(x.wsp))
const dpm = group(cube, Math.PI / 8, x => x.dpm, x => x.toFixed(3))
const dpm_freq1 = cube.range_single(x => quant(Math.PI / 8).floor(x.dpm) / Math.PI * 180)
const dpm_freq2 = cube.range_single(x => quant(Math.PI / 8).floor(x.dpm) / Math.PI * 180)
const hs = group(cube, 0.2, x => x.hs, x => x.toFixed(1))
const hs_freq = cube.range_single(x => quant(0.2).floor(x.hs))

export {
  cube,
  by_time,
  by_wsp,
  wsp,
  wsp_freq,
  wd,
  wd_freq1,
  wd_freq2,
  by_hs,
  hs,
  hs_freq,
  dpm,
  dpm_freq1,
  dpm_freq2
}