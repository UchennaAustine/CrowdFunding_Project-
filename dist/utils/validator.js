"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAbegValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAbegValidator = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    motivation: joi_1.default.string().trim().required(),
    detailDescription: joi_1.default.string().trim().required(),
    amountNeeded: joi_1.default.number().required(),
    category: joi_1.default.string().lowercase().trim().required(),
});
