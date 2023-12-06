import config from "../config.js";
import { buildImages } from "../docker.js";

await buildImages(config.images);