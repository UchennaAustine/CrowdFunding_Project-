"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const envVar_1 = require("./envVar");
cloudinary_1.v2.config({
    cloud_name: envVar_1.envVars.cloud_name,
    api_key: envVar_1.envVars.api_key,
    api_secret: envVar_1.envVars.api_secret,
});
exports.default = cloudinary_1.v2;
