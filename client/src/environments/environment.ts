// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
   apiURL: "http://des.indianorb.com", 
  /* apiURL: "http://localhost:4000", */
  Dynamsoft: {
    resourcesPath: '/assets/dwt-resources',
    dwtProductKey: 't01074wAAABu6b/2CX+HyDhSY7UU9BlKVsM4ZHLlZFNhShY9CcjEG2ZBUxEg0MJliNDxRbpW64DFHK48nFNTKdiCLwMMSpVj8GEgEYrcNjaapy5THnD4mzR+NqsBNMzOAOihfgDWmkg/RCzt5LeA=',
    uploadTargetURL: ''
  }
};
