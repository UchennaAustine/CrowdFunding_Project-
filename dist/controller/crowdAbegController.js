"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAbegByCategory = exports.unLoveBeg = exports.loveBeg = exports.deleteAbeg = exports.updateAbeginfo = exports.viewAllAbeg = exports.viewAbeg = exports.createAbeg = void 0;
const client_1 = require("@prisma/client");
const mainError_1 = require("../error/mainError");
const rabbitMQConnection_1 = require("../utils/rabbitMQConnection");
const stream_1 = require("../utils/stream");
const prisma = new client_1.PrismaClient();
const createAbeg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { title, motivation, detailDescription, amountNeeded, category } = req.body;
        const { secure_url, public_id } = yield (0, stream_1.streamUpload)(req);
        const abeg = yield prisma.crowdAbeg.create({
            data: {
                title,
                userID: id,
                motivation,
                detailDescription,
                amountNeeded: parseInt(amountNeeded),
                amountRaised: 0,
                givers: [],
                love: [],
                picture: secure_url,
                pictureID: public_id,
                category: category.toLowerCase(),
            },
        });
        (0, rabbitMQConnection_1.publishConnection)("beg", abeg);
        (0, rabbitMQConnection_1.publishConnection)("abeg", abeg);
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "Plead has being created successfully",
            data: abeg,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error due the creating process: ${error}`,
        });
    }
});
exports.createAbeg = createAbeg;
const viewAbeg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { begID } = req.params;
        const abeg = yield prisma.crowdAbeg.findUnique({
            where: { id: begID },
        });
        return res.status(mainError_1.HTTP.OK).json({
            message: "Viewing plead",
            data: abeg,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Error viewing plead: ${error}`,
        });
    }
});
exports.viewAbeg = viewAbeg;
const viewAllAbeg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const abeg = yield prisma.crowdAbeg.findMany({});
        return res.status(mainError_1.HTTP.OK).json({
            message: "Viewing plead",
            data: abeg,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Error viewing plead: ${error}`,
        });
    }
});
exports.viewAllAbeg = viewAllAbeg;
const updateAbeginfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { begID } = req.params;
        const { motivation, detailDescription } = req.body;
        const abeg = yield prisma.crowdAbeg.update({
            where: { id: begID },
            data: {
                motivation,
                detailDescription,
            },
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "Viewing plead",
            data: abeg,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Error viewing plead: ${error}`,
        });
    }
});
exports.updateAbeginfo = updateAbeginfo;
const deleteAbeg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { begID } = req.params;
        const abeg = yield prisma.crowdAbeg.delete({
            where: { id: begID },
        });
        return res.status(mainError_1.HTTP.OK).json({
            message: `Plead successfully deleted`,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error delete a plead: ${error}`,
        });
    }
});
exports.deleteAbeg = deleteAbeg;
const loveBeg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userID } = req.user;
        const { begID } = req.params;
        const abeg = yield prisma.crowdAbeg.findUnique({
            where: { id: begID },
        });
        if (!abeg) {
            return res.status(mainError_1.HTTP.NOT_FOUND).json({
                message: "Plead not found",
            });
        }
        if (abeg.love.includes(userID)) {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: "You have already loved this plead",
            });
        }
        else {
            abeg.love.push(userID);
            yield prisma.crowdAbeg.update({
                where: { id: begID },
                data: {
                    love: abeg.love,
                },
            });
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "You just loved this plead",
                data: abeg,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Error loving plead: ${error.message}`,
            data: error,
        });
    }
});
exports.loveBeg = loveBeg;
const unLoveBeg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userID } = req.user;
        const { begID } = req.params;
        const abeg = yield prisma.crowdAbeg.findUnique({
            where: { id: begID },
        });
        if (!abeg) {
            return res.status(mainError_1.HTTP.NOT_FOUND).json({
                message: "Plead not found",
            });
        }
        if (!abeg.love.includes(userID)) {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: "You have not loved this plead",
            });
        }
        const unlikedUsers = abeg.love.filter((user) => user !== userID);
        yield prisma.crowdAbeg.update({
            where: { id: begID },
            data: {
                love: unlikedUsers,
            },
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "You just unloved this plead",
            data: {
                love: unlikedUsers,
            },
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Error unloving plead: ${error.message}`,
            data: error,
        });
    }
});
exports.unLoveBeg = unLoveBeg;
const findAbegByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.body;
        const findFinance = yield prisma.crowdAbeg.findMany({
            where: { category },
        });
        console.log(findFinance);
        return res.status(200).json({
            message: "getting all category",
            data: findFinance,
        });
    }
    catch (error) {
        res.status(404).json({
            message: "Couldn't get all category",
        });
    }
});
exports.findAbegByCategory = findAbegByCategory;
//SRFDiCSRxiHfEA5M9kEt5w
