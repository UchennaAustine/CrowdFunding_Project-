import express, { Application } from "express";
import appConfig from "./app";
import { envVars } from "./utils/envVar";
import { consumeConnection } from "./utils/rabbitMQConnection";

process.on("uncaughtException", (error: Error) => {
  console.log("uncaughtException error: ", error);
  process.exit(1);
});

const app: Application = express();
const port: number = envVars.Port;

appConfig(app);
const server = app.listen(process.env.port || port, () => {
  console.log("A server is connected on port: ", port);
});

// consumeConnection("checkouted");

process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection reason: ", reason);
  server.close(() => {
    process.exit(1);
  });
});
