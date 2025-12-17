import express from "express";
import routes from './routes/index.routes'; // Importa o arquivo index.routes.ts

const app = express();
app.use(express.json());

// Utiliza as rotas centralizadas no index.routes.ts
app.use("/", routes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
