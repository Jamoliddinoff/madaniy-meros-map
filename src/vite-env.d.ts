/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_LOGIN: string;
  readonly VITE_AUTH_PASSWORD: string;
  readonly VITE_2GIS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
