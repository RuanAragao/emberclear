'use strict';

const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

// instascan requires 'fs'...
const nodeBuiltins = require('rollup-plugin-node-builtins');


module.exports = function(defaults) {
  let disabledAddons = [];
  let environment = EmberApp.env();
  let enableSW = process.env.ENABLE_SW;
  let disableServiceWorker = environment !== 'production' && !enableSW;

  console.log('\n---------------');
  console.log('environment: ', environment, 'ENABLE_SW', enableSW);
  console.log('Service Worker Will Be Enabled: ', disableServiceWorker);
  console.log('---------------\n');

  if (disableServiceWorker) {
     // disable service workers by default for dev and testing
     disabledAddons.push('ember-service-worker');
   }


  let app = new EmberApp(defaults, {
    // eslint slows down the dev-build-debug cycle significantly
    // hinting: false disables linting at build time.
    hinting: false,
    eslint: {
      testGenerator: 'qunit',
      group: true,
      rulesDir: 'eslint-rules',
      extensions: ['js', 'ts'],
    },
    addons: {
      blacklist: disabledAddons
    },
    // always enable sourcemaps, even in production
    // (cause debugging!)
    // sourcemaps: {
    //   enabled: true,
    //   extensions: ['js', 'css'],
    // },
    prember: {
      urls: [
        '/',
        '/faq',
        '/chat',
      ]
    },
    treeShaking: {
      enabled: true,

      include: [

        // This is an example of a vendor shim reaching back into the addon tree. This needs a hint to prevent removal.
        // https://github.com/simplabs/ember-test-selectors/blob/62070d20a2a50918f7cac373a3b23f8e9a94bf31/vendor/ember-test-selectors/patch-component.js#L10
        'ember-test-selectors/utils/bind-data-test-attributes.js'
      ]
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // phoenix sockets!
  app.import('node_modules/phoenix/assets/js/phoenix.js', {
    using: [{ transformation: 'cjs', as: 'phoenix' }],
  });

  // font awesome
  app.import('vendor/fontawesome/css/font-awesome-all.min.css');
  var fontTree = new Funnel('vendor/fontawesome/webfonts', { destDir: '/assets/fontawesome/webfonts' });
  var fontStyleTree = new Funnel('vendor/fontawesome/css', { destDir: '/assets/fontawesome/css' });

  // libsodium
  app.import('node_modules/libsodium/dist/modules/libsodium.js');
  app.import('node_modules/libsodium-wrappers/dist/modules/libsodium-wrappers.js');
  app.import('vendor/shims/libsodium.js');
  app.import('vendor/shims/libsodium-wrappers.js');

  // qrcode
  app.import('node_modules/qrcode/build/qrcode.min.js');
  app.import('vendor/shims/qrcode.js');
  app.import('node_modules/instascan/index.js', {
    using: [{ transformation: 'cjs', as: 'instascan', plugins: [nodeBuiltins()] }]
  });

  // localforage
  app.import('node_modules/localforage/dist/localforage.js');
  app.import('vendor/shims/localforage.js');

  // uuid
  app.import('node_modules/uuid/index.js', {
    using: [{ transformation: 'cjs', as: 'uuid' }]
  });

  // bulma-toast
  app.import('node_modules/bulma-toast/dist/bulma-toast.js');
  app.import('vendor/shims/bulma-toast.js');
  app.import('node_modules/bulma-toast/dist/bulma-toast.min.css');

  return mergeTrees([app.toTree(), fontTree, fontStyleTree]);
};
