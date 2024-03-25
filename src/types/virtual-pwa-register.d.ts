// This file serves as a dummy module declaration to satisfy TypeScript

declare module 'virtual:pwa-register' {
    import type { RegisterSWOptions } from 'vite-plugin-pwa/types';
  
    export type { RegisterSWOptions };
  
    export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
  }