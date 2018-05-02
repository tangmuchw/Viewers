import { Meteor } from 'meteor/meteor';
import { OHIF } from 'meteor/ohif:core';
import { cornerstoneWADOImageLoader } from 'meteor/ohif:cornerstone';
import Keycloak from 'keycloak';

window.keycloak = new Keycloak({
    url: "http://localhost:8080/auth",
    realm: "ohif",
    clientId: "ohif-app",
    flow: 'hybrid'
});

Meteor.startup(function() {
    const maxWebWorkers = Math.max(navigator.hardwareConcurrency - 1, 1);
    const config = {
        maxWebWorkers: maxWebWorkers,
        startWebWorkersOnDemand: true,
        webWorkerPath: OHIF.utils.absoluteUrl('packages/ohif_cornerstone/public/js/cornerstoneWADOImageLoaderWebWorker.es5.js'),
        taskConfiguration: {
            decodeTask: {
                loadCodecsOnStartup: true,
                initializeCodecsOnStartup: false,
                codecsPath: OHIF.utils.absoluteUrl('packages/ohif_cornerstone/public/js/cornerstoneWADOImageLoaderCodecs.es5.js'),
                usePDFJS: false
            }
        }
    };

    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

    window.keycloak.init({onload: 'check-sso'}).success(function(authenticated) {
        if (authenticated) {
            sessionStorage.setItem('kc_signedin', authenticated);
            sessionStorage.setItem('kc_username', window.keycloak.tokenParsed['preferred_username']);
            sessionStorage.setItem('kc_token', window.keycloak.token);
        }
    }).error(function() {
        sessionStorage.removeItem('kc_username');
        sessionStorage.removeItem('kc_token');
        sessionStorage.setItem('kc_signedin', false);
    });
});
