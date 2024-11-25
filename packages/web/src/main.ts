// import './polyfil'
import 'virtual:windi.css'
// import { BrowserTracing } from '@sentry/tracing'
// import * as Sentry from '@sentry/vue'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App'
import router from './router'
import './styles/index.css'

const app = createApp(App)

// Sentry.init({
//   app,
//   dsn: import.meta.env.VITE_SENTRY_DSN,
//   integrations: [
//     new BrowserTracing({
//       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//       tracePropagationTargets: ['localhost', import.meta.env.VITE_HOST, /^\//]
//     })
//   ],
//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
//   trackComponents: true,
//   release: 'd.wedex@0.0.1'
// })

app.use(createPinia())
app.use(router)
app.mount('#app')

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js').then(() => {
//     console.log('Service Worker Registered')
//   })
// }
