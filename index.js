const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const app = express();
const port = 3000;

// Register the custom font
const fontPath = path.resolve(__dirname, 'genshin.ttf');
registerFont(fontPath, { family: 'Genshin' });

app.get('/image', async (req, res) => {
    try {
        const canvas = createCanvas(536, 719);
        const ctx = canvas.getContext('2d');

        // Load and draw the background image
        const backgroundImage = await loadImage('avatar.png');
        ctx.drawImage(backgroundImage, 0, 0, 536, 719);

        // Set font and position for text
        ctx.font = '30px Genshin';
        ctx.fillStyle = 'black'; // Set text color
        const text = 'Awesome!';

        const textWidth = ctx.measureText(text).width;
        const textX = (canvas.width - textWidth) / 2;
        const textY = 288; // Y-coordinate for the text

        // Draw text
        ctx.fillText(text, textX, textY);

        // Calculate the position for the new image
        const imageX = 188; // X-coordinate for the new image
        const imageY = textY + 40; // Y-coordinate for the new image (textY + some offset)

        // Load and draw the new image
        const newImage = await loadImage('cat.jpg');
        ctx.drawImage(newImage, imageX, imageY, 100, 100); // Adjust size as needed

        // Send the image as a response
        res.setHeader('Content-Type', 'image/png');
        res.send(canvas.toBuffer('image/png'));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating image');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
