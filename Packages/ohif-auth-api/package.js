Package.describe({
    name: 'ohif:auth-api',
    summary: 'OHIF Studies secure API to deal with studies, retrieval and manipulation',
    version: '0.0.1'
});

Package.onUse(function(api) {
    api.versionsFrom('1.4');

    api.use([
        'ecmascript',
        'templating',
        'stylus',
        'http'
    ]);

    // Our custom packages
    api.use([
        'ohif:studies'
    ]);

    // Server imports
    api.addFiles('server/main.js', 'server');
});
