interface ImportMetaEnv {
  readonly VITE_SUPPORTED_CHAIN_ID: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vue-virtual-scroller'
