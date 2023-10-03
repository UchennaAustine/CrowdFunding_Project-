import express from "express";
import {
  createAbeg,
  deleteAbeg,
  findAbegByCategory,
  loveBeg,
  unLoveBeg,
  updateAbeginfo,
  viewAbeg,
  viewAllAbeg,
} from "../controller/crowdAbegController";
import { verified } from "../utils/verifier";

import multer from "multer";

const myUpload = multer().single("avatar");

export const router = express.Router();

router.route("/create-beg-start").post(myUpload, verified, createAbeg);

router.route("/:begID/update-beg").patch(updateAbeginfo);

router.route("/view-begs").get(viewAllAbeg);

router.route("/:begID/view-beg").get(viewAbeg);

router.route("/:begID/delete-beg").delete(deleteAbeg);

router.route("/:begID/love-beg").get(verified, loveBeg);

router.route("/:begID/unlove-beg").get(verified, unLoveBeg);

router.route("/find-finance").get(findAbegByCategory);
