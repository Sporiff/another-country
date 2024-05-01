/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
   readonly MAILGUN_KEY: string | undefined;
}

interface ImportMeta {
   readonly env: ImportMetaEnv;
}
