import fs from 'fs';

const getManifest = () => {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, '/publicAssets/manifest.json')),
    );
  } catch (err) {
    console.error(err);
  }
};

export default getManifest;
