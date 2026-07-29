/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL do aplicativo da web do Google Apps Script que grava na planilha. */
  readonly VITE_SHEETS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}
