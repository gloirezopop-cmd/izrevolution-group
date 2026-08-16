const { Jimp } = require('jimp');

async function processImage() {
  try {
    const image = await Jimp.read('./public/brand/logos.png');
    // We try to autocrop any uniform background around the image
    image.autocrop();
    await image.write('./public/brand/logo_cropped.png');
    console.log('Successfully cropped the logo!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();
