import { Meteor } from 'meteor/meteor';  
import express from 'express';
import Keycloak from 'keycloak-connect';
import ExpressSession from 'express-session';

async function getStudyList(req, res) {
    const filter = {};
    let callResponse = { error: true };
    try {
        await Meteor.call('StudyListSearch', filter, (error, studiesData) => {
            if (error) {
                res.status(500).json({ message: `Server error: ${error}` });
            } else {
                res.status(200).json(studiesData);
            }
        });
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error}` });
    }
};


const kcConfig = {
    realm: 'ohif',
    clientId: 'ohif-app',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080/auth'
};

export function setupApi() {  
    const app = express();

    const memoryStore = new ExpressSession.MemoryStore();
    const keycloak = new Keycloak({
        store: memoryStore
    }, kcConfig);

    app.use(ExpressSession({
        secret: 'ohifappsecret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    }));

    app.use( keycloak.middleware() );

    app.get('/api/getStudies', keycloak.protect(), getStudyList);
    app.get('/api', (req, res) => {
        res.status(200).json({ message: 'Hello World!!!'});
    });

    WebApp.connectHandlers.use(app);
}

