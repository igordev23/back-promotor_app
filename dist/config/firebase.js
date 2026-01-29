"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const firebaseConfig = {
    apiKey: "fake",
    authDomain: "localhost",
    projectId: "local-project",
    databaseURL: "http://127.0.0.1:9000?ns=local-project",
};
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, database_1.getDatabase)(app);
exports.db = db;
// Conectar ao emulador
(0, database_1.connectDatabaseEmulator)(db, "127.0.0.1", 9000);
