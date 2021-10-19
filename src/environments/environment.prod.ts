// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  host: 'https://server.ritewine.com:8002',
  version: 'v1',
  firebase: {
    apiKey: "AIzaSyA-RHU-zYAdEV4eGgsXCaxV4ClGajsOECA",
    authDomain: "crawler-client-9c5ea.firebaseapp.com",
    databaseURL: "https://crawler-client-9c5ea.firebaseio.com",
    projectId: "crawler-client-9c5ea",
    storageBucket: "",
    messagingSenderId: "510034804665",
    appId: "1:510034804665:web:282f092bf49dd693698068"
  },
};
