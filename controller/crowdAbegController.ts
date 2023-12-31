import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import { publishConnection } from "../utils/rabbitMQConnection";
import { streamUpload } from "../utils/stream";

const prisma = new PrismaClient();

export const createAbeg = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const { title, motivation, detailDescription, amountNeeded, category } =
      req.body;
    const { secure_url, public_id }: any = await streamUpload(req);
    const abeg = await prisma.abegs.create({
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
        category,
      },
    });

    publishConnection("beg", abeg);
    publishConnection("abeg", abeg);

    return res.status(HTTP.CREATED).json({
      message: "Plead has being created successfully",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error due the creating process: ${error.message}`,
      error,
    });
  }
};

export const viewAbeg = async (req: Request, res: Response) => {
  try {
    const { begID } = req.params;
    const abeg = await prisma.abegs.findUnique({
      where: { id: begID },
    });

    return res.status(HTTP.OK).json({
      message: "Viewing plead",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error viewing plead: ${error}`,
    });
  }
};

export const viewAllAbeg = async (req: Request, res: Response) => {
  try {
    const abeg = await prisma.abegs.findMany({});

    return res.status(HTTP.OK).json({
      message: "Viewing plead",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error viewing plead: ${error}`,
    });
  }
};

export const updateAbeginfo = async (req: Request, res: Response) => {
  try {
    const { begID } = req.params;
    const { motivation, detailDescription } = req.body;
    const abeg = await prisma.abegs.update({
      where: { id: begID },
      data: {
        motivation,
        detailDescription,
      },
    });

    return res.status(HTTP.CREATED).json({
      message: "Viewing plead",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error viewing plead: ${error}`,
    });
  }
};

export const deleteAbeg = async (req: Request, res: Response) => {
  try {
    const { begID } = req.params;
    const abeg = await prisma.abegs.delete({
      where: { id: begID },
    });
    return res.status(HTTP.OK).json({
      message: `Plead successfully deleted`,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error delete a plead: ${error}`,
    });
  }
};

export const loveBeg = async (req: any, res: Response) => {
  try {
    const { id: userID } = req.user;
    const { begID } = req.params;

    const abeg: any = await prisma.abegs.findUnique({
      where: { id: begID },
    });

    if (!abeg) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "Plead not found",
      });
    }

    if (abeg?.love.includes(userID)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "You have already loved this plead",
      });
    } else {
      abeg.love.push(userID);
      await prisma.abegs.update({
        where: { id: begID },
        data: {
          love: abeg?.love,
        },
      });

      return res.status(HTTP.CREATED).json({
        message: "You just loved this plead",
        data: abeg,
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error loving plead: ${error.message}`,
      data: error,
    });
  }
};

export const unLoveBeg = async (req: any, res: Response) => {
  try {
    const { id: userID } = req.user;
    const { begID } = req.params;

    const abeg: any = await prisma.abegs.findUnique({
      where: { id: begID },
    });

    if (!abeg) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "Plead not found",
      });
    }

    if (!abeg.love.includes(userID)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "You have not loved this plead",
      });
    }

    const unlikedUsers: any = abeg?.love.filter((user: any) => user !== userID);

    await prisma.abegs.update({
      where: { id: begID },
      data: {
        love: unlikedUsers,
      },
    });

    return res.status(HTTP.CREATED).json({
      message: "You just unloved this plead",
      data: {
        love: unlikedUsers,
      },
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error unloving plead: ${error.message}`,
      data: error,
    });
  }
};

export const findAbegByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    const findFinance = await prisma.abegs.findMany({
      where: { category },
    });
    console.log(findFinance);

    return res.status(200).json({
      message: "getting all category",
      data: findFinance,
    });
  } catch (error) {
    res.status(404).json({
      message: "Couldn't get all category",
    });
  }
};
//SRFDiCSRxiHfEA5M9kEt5w
