"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const envVar_1 = require("./utils/envVar");
process.on("uncaughtException", (error) => {
    console.log("uncaughtException error: ", error);
    process.exit(1);
});
const app = (0, express_1.default)();
const port = envVar_1.envVars.Port;
(0, app_1.default)(app);
const server = app.listen(process.env.port || port, () => {
    console.log("A server is connected on port: ", port);
});
process.on("unhandledRejection", (reason) => {
    console.log("unhandledRejection reason: ", reason);
    server.close(() => {
        process.exit(1);
    });
});
