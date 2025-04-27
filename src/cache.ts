import * as fs from "fs";
import * as path from "path";
import { screenshot } from "./ss";

const imgDir = path.resolve("img");

function update_images() {
  try {
    const images = fs.readdirSync(imgDir);
    images.map((image) => {
      const address = image.split("_")[0];
      const network = image.split("_")[1].split(".")[0];
      screenshot(network, address);
    });
  } catch (err) {
    console.error("Error updating images", err);
  }
}

setInterval(update_images, 1000 * 60 * 60 * 24); // every 24 hours
