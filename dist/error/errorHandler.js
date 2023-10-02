"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mainError_1 = require("./mainError");
const preparedError = (err, res) => {
    res.status(mainError_1.HTTP.BAD_REQUEST).json({
        name: err.name,
        message: err.message,
        status: err.status,
        success: err.success,
        stack: err.stack,
    });
};
const errorHandler = (err, req, res, next) => {
    preparedError(err, res);
};
exports.errorHandler = errorHandler;
