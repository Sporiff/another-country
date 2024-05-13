/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
   readonly MAILGUN_KEY: string;
   readonly MAILGUN_ENDPOINT: string;
   readonly EMAIL: string;
   readonly GRAPHQL_ENDPOINT: string;
}

interface ImportMeta {
   readonly env: ImportMetaEnv;
}
