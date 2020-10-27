// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
   //apiURL: "http://des.indianorb.com", 
   apiURL: "http://localhost:4000", 
  Dynamsoft: {
    resourcesPath: '/assets/dwt-resources',
    dwtProductKey: 't0068MgAAAApGzuu+DLiiBgATwJswsVH7G1zzzQ5ne4idr/S6waYoACWqzIkCk/dcjj80trFozI94qagSri1qGGe04SaQw2k=',
    uploadTargetURL: ''
  }
};
