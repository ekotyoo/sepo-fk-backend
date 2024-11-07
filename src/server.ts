import app from "./app";
import env from "./util/env";
import { AppDataSource } from "./config/datasource.config";

const port = env.PORT || 3000;

AppDataSource.initialize().then(() => {
  console.log("Database is running");
  app.listen(port, () => {
    console.log("Server running on port: " + port);
  });
}).catch((err) => console.error(err));