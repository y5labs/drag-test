import inject from 'seacreature/lib/inject'

inject('route', { path: '/', component: () => import('./app.js')})
