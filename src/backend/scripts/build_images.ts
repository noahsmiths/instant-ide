import { buildImages } from "../docker";
import config from "../config";

await buildImages(config.images);