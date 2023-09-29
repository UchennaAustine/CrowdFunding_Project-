import amqplib from "amqplib";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const amqpServer =
  "amqps://ytczyrcc:VVy6y7RE1kt3-FCMs_kV1621467bNh0t@whale.rmq.cloudamqp.com/ytczyrcc";

export const publishConnection = async (queue: string, data: any) => {
  try {
    const connection = await amqplib.connect(amqpServer);
    const channel = await connection.createChannel();

    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  } catch (error: any) {
    console.log(`Publisher connection error: ${error}`);
  }
};

export const consumeConnection = async (queue: string) => {
  try {
    const connection = await amqplib.connect(amqpServer);
    const channel = await connection.createChannel();

    await channel.consume(queue, async (message: any) => {
      const allData = JSON.parse(message?.content.toString());

      const account: any = await prisma.crowdAbeg.findUnique({
        where: { id: allData?.abegID },
      });

      account?.givers.push(allData);

      const accountProf: any = await prisma.crowdAbeg.update({
        where: { id: allData?.abegID },
        data: {
          givers: account?.givers,
          amountNeeded: account?.amountNeeded - allData?.amount,
          amountRaised: account?.amountRaised + allData?.amount,
        },
      });
      await channel.ack(message);
    });
  } catch (error: any) {
    console.log(`error occured while consuming: ${error}`);
  }
};
