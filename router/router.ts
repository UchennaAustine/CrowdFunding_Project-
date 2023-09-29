import express from "express";
import {
  createAbeg,
  deleteAbeg,
  loveBeg,
  unLoveBeg,
  updateAbegImage,
  updateAbeginfo,
  viewAbeg,
} from "../controller/crowdAbegController";
import { verified } from "../utils/verifier";

import multer from "multer";

const myUpload = multer().single("avatar");

export const router = express.Router();

router.route("/create-beg-start").post(verified, createAbeg);

router.route("/:begID/update-beg").patch(updateAbeginfo);

router.route("/:begID/update-beg").patch(myUpload, updateAbegImage);

router.route("/:begID/view-beg").get(viewAbeg);

router.route("/:begID/delete-beg").delete(deleteAbeg);

router.route("/:userID/:begID/love-beg").get(loveBeg);

router.route("/:userID/:begID/unlove-beg").get(unLoveBeg);
