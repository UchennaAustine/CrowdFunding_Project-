import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import { publishConnection } from "../utils/rabbitMQConnection";
import cloudinary from "../utils/cloudinary";

const prisma = new PrismaClient();

export const createAbeg = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const { title, motivation, detailDescription, amountNeeded } = req.body;

    const abeg = await prisma.crowdAbeg.create({
      data: {
        title,
        userID: id,
        motivation,
        detailDescription,
        amountNeeded,
        amountRaised: 0,
        givers: [],
        love: [],
        picture: "",
        pictureID: "",
      },
      // tnI8xnFmLdiObzC-t29ztA
    });

    publishConnection("beg", abeg);

    return res.status(HTTP.CREATED).json({
      message: "Plead has being created successfully",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error due the creating process: ${error}`,
    });
  }
};

export const viewAbeg = async (req: Request, res: Response) => {
  try {
    const { begID } = req.params;
    const abeg = await prisma.crowdAbeg.findUnique({
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
    const abeg = await prisma.crowdAbeg.findMany({});

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
    const abeg = await prisma.crowdAbeg.update({
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

export const updateAbegImage = async (req: Request, res: Response) => {
  try {
    const { begID } = req.params;
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req?.file?.path!
    );
    const abeg = await prisma.crowdAbeg.update({
      where: { id: begID },
      data: {
        picture: secure_url,
        pictureID: public_id,
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
    const abeg = await prisma.crowdAbeg.delete({
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

    const abeg = await prisma.crowdAbeg.findUnique({
      where: { id: begID },
    });

    if (!abeg) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "Plead not found",
      });
    }

    if (abeg.love.includes(userID)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "You have already loved this plead",
      });
    } else {
      abeg.love.push(userID);
      await prisma.crowdAbeg.update({
        where: { id: begID },
        data: {
          love: abeg.love,
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

    const abeg = await prisma.crowdAbeg.findUnique({
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

    const unlikedUsers = abeg.love.filter((user) => user !== userID);

    await prisma.crowdAbeg.update({
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
//SRFDiCSRxiHfEA5M9kEt5w
