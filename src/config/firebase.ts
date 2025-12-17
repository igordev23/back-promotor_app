import { initializeApp } from "firebase/app";
import {
  getDatabase,
  connectDatabaseEmulator,
  Database,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "fake",
  authDomain: "localhost",
  projectId: "local-project",
  databaseURL: "http://127.0.0.1:9000?ns=local-project",
};

const app = initializeApp(firebaseConfig);
const db: Database = getDatabase(app);

// Conectar ao emulador
connectDatabaseEmulator(db, "127.0.0.1", 9000);

export { db };
