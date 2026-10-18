import { Router } from "express";
import {
  imagesCertsChartController,
  imagesController,
  imageFileController,
} from "../controllers/images/imagesControllers.js";

const router = Router();

router.get("/certs-chart", imagesCertsChartController);
router.get("/file", imageFileController);
router.get("/", imagesController);

export default router;
