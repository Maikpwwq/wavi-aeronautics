import fs from 'fs';
import * as path from "path";

const getManifest = () => {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, '/public/manifest.json')),
    );
  } catch (err) {
    console.error(err);
  }
};

export default getManifest;
