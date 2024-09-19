/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GILGAMESH_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module '*.vue' {
  import type { Component } from 'vue';

  const component: Component;
  export default component;
}
