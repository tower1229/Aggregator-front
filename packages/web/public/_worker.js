export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      return fetch(
        url.href.replace(url.host, env.Proxy.get('API_PROXY_HOST') || 'd.comunion.io'),
        request
      )
    }
    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return env.ASSETS.fetch(request)
  }
}
