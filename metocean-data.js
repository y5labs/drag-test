const deg2rad = x => x / 180 * Math.PI

export default async () =>
  (await (await fetch('./metocean.txt')).text())
    .split('>')[0]
    .split('\n')
    .slice(1, -1)
    .map(line => {
      const items = line.split(',')
      const g = () => items.shift()

      return {
        time: new Date(`${g().replace(' ', 'T')}+13:00`).getTime() / 1000,
        lev: Number(g()),
        hs: Number(g()),
        hx: Number(g()),
        tp: Number(g()),
        tm01: Number(g()),
        tm02: Number(g()),
        dp: Number(g()),
        dpm: Number(deg2rad(g())),
        hs_sw1: Number(g()),
        hs_sw8: Number(g()),
        tp_sw1: Number(g()),
        tp_sw8: Number(g()),
        dpm_sw8: Number(g()),
        dpm_sw1: Number(g()),
        hs_sea8: Number(g()),
        hs_sea: Number(g()),
        tp_sea8: Number(g()),
        tp_sea: Number(g()),
        tm_sea: Number(g()),
        dpm_sea8: Number(g()),
        dpm_sea: Number(g()),
        hs_ig: Number(g()),
        hs_fig: Number(g()),
        wsp: Number(g()),
        gst: Number(g()),
        wd: Number(deg2rad(g())),
        wsp100: Number(g()),
        wsp50: Number(g()),
        wsp80: Number(g()),
        precip: Number(g()),
        tmp: Number(g()),
        rh: Number(g()),
        vis: Number(g()),
        cld: Number(g()),
        cb: Number(g()),
        csp0: Number(g()),
        cd0: Number(g()),
        ss: Number(g()),
        sst: Number(g())
      }
    })
