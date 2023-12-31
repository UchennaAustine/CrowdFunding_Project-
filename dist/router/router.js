"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const crowdAbegController_1 = require("../controller/crowdAbegController");
const verifier_1 = require("../utils/verifier");
const multer_1 = __importDefault(require("multer"));
const validator_1 = require("../utils/validator");
const validatorHolder_1 = __importDefault(require("../utils/validatorHolder"));
const myUpload = (0, multer_1.default)().single("avatar");
exports.router = express_1.default.Router();
exports.router
    .route("/create-beg-start")
    .post(myUpload, verifier_1.verified, (0, validatorHolder_1.default)(validator_1.createAbegValidator), crowdAbegController_1.createAbeg);
exports.router.route("/:begID/update-beg").patch(crowdAbegController_1.updateAbeginfo);
exports.router.route("/view-begs").get(crowdAbegController_1.viewAllAbeg);
exports.router.route("/:begID/view-beg").get(crowdAbegController_1.viewAbeg);
exports.router.route("/:begID/delete-beg").delete(crowdAbegController_1.deleteAbeg);
exports.router.route("/:begID/love-beg").get(verifier_1.verified, crowdAbegController_1.loveBeg);
exports.router.route("/:begID/unlove-beg").get(verifier_1.verified, crowdAbegController_1.unLoveBeg);
// router.route("/find-finance").get(findAbegByCategory);
