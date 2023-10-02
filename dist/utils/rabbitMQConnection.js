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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeConnection = exports.publishConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const amqpServer = "amqps://ytczyrcc:VVy6y7RE1kt3-FCMs_kV1621467bNh0t@whale.rmq.cloudamqp.com/ytczyrcc";
const publishConnection = (queue, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(amqpServer);
        const channel = yield connection.createChannel();
        yield channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    }
    catch (error) {
        console.log(`Publisher connection error: ${error}`);
    }
});
exports.publishConnection = publishConnection;
const consumeConnection = (queue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(amqpServer);
        const channel = yield connection.createChannel();
        yield channel.consume(queue, (message) => __awaiter(void 0, void 0, void 0, function* () {
            const allData = JSON.parse(message === null || message === void 0 ? void 0 : message.content.toString());
            const account = yield prisma.crowdAbeg.findUnique({
                where: { id: allData === null || allData === void 0 ? void 0 : allData.abegID },
            });
            account === null || account === void 0 ? void 0 : account.givers.push(allData);
            const accountProf = yield prisma.crowdAbeg.update({
                where: { id: allData === null || allData === void 0 ? void 0 : allData.abegID },
                data: {
                    givers: account === null || account === void 0 ? void 0 : account.givers,
                    amountNeeded: (account === null || account === void 0 ? void 0 : account.amountNeeded) - (allData === null || allData === void 0 ? void 0 : allData.amount),
                    amountRaised: (account === null || account === void 0 ? void 0 : account.amountRaised) + (allData === null || allData === void 0 ? void 0 : allData.amount),
                },
            });
            yield channel.ack(message);
        }));
    }
    catch (error) {
        console.log(`error occured while consuming: ${error}`);
    }
});
exports.consumeConnection = consumeConnection;
