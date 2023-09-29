import express, { Application, Request, Response } from "express";

import cors from "cors";
import { HTTP, mainError } from "./error/mainError";
import { router } from "./router/router";

const appConfig = (app: Application) => {
  app.use(express.json());
  app.use("/api", router);
  app
    .use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
      })
    )

    .get("/", (req: Request, res: Response) => {
      try {
        res.status(HTTP.OK).json({
          message: "Everything should be fine!!",
        });
      } catch (error) {
        console.log(error);
      }
    });

  app.all("*", () => {
    new mainError({
      name: "Route Error",
      message: "this message is as a result of a wrong route",
      status: HTTP.BAD_REQUEST,
      success: false,
    });
  });
};

export default appConfig;
