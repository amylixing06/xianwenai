/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_URL: string
  readonly VITE_BUILD_MODE: 'development' | 'production' | 'analyze'
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_ANALYTICS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 