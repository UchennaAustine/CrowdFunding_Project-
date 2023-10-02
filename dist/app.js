"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mainError_1 = require("./error/mainError");
const router_1 = require("./router/router");
const appConfig = (app) => {
    app.use(express_1.default.json());
    app.use("/api", router_1.router);
    app
        .use((0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    }))
        .get("/", (req, res) => {
        try {
            res.status(mainError_1.HTTP.OK).json({
                message: "Everything should be fine!!",
            });
        }
        catch (error) {
            console.log(error);
        }
    });
    app.all("*", (error, req, res, next) => {
        new mainError_1.mainError({
            name: "Route Error",
            message: `this message is as a result of a wrong route: ${req.originalUrl}`,
            status: mainError_1.HTTP.BAD_REQUEST,
            success: false,
        });
    });
};
exports.default = appConfig;
