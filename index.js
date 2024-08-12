const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const app = express();
const port = 3000;

// Register the custom font
const fontPath = path.resolve(__dirname, 'zh-cn.ttf');
registerFont(fontPath, { family: 'HYWenHei' });

app.get('/image', async (req, res) => {
    try {
        const { newImage, text, uid, rank } = req.query;

        const canvas = createCanvas(536, 719);
        const ctx = canvas.getContext('2d');

        // Load and draw the background image
        const backgroundImage = await loadImage('avatar.png');
        ctx.drawImage(backgroundImage, 0, 0, 536, 719);

        // Set font and position for text
        ctx.font = '30px HYWenHei';
        ctx.fillStyle = 'black';

        if (text) {
            const textWidth = ctx.measureText(text).width;
            const textX = (canvas.width - textWidth) / 2;
            const textY = 288; // Y-coordinate for the text

            // Draw text
            ctx.fillText(text, textX, textY);
        }

        ctx.font = '17px HYWenHei';
        ctx.fillStyle = 'white';

        if (uid) {
            const uidX = 235;
            const uidY = 44; 

            // Draw UID text
            ctx.fillText(uid, uidX, uidY);
        }

        ctx.font = '23px HYWenHei';
        ctx.fillStyle = 'white';

        if (rank) {
            const rankX = 450;
            const rankY = 384; // Y-coordinate for the text

            // Draw rank text
            ctx.fillText(rank, rankX, rankY);
        }

        if (newImage) {
            // Calculate the position for the new image
            const imageX = 197; // X-coordinate for the new image
            const imageY = 102; // Y-coordinate for the new image (textY + some offset)
            const imageSize = 142; // Size of the circle image

            // Load the new image
            const newImageLoaded = await loadImage(newImage) || await loadImage('cat.jpg');

            // Draw circular image
            ctx.save(); // Save the current state
            ctx.beginPath(); // Start a new path
            ctx.arc(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2); // Create a circular path
            ctx.clip(); // Clip to the circular path

            ctx.drawImage(newImageLoaded, imageX, imageY, imageSize, imageSize); // Draw the image

            ctx.restore(); // Restore the previous state
        }

        // Send the image as a response
        res.setHeader('Content-Type', 'image/png');
        res.send(canvas.toBuffer('image/png'));
    } catch (err) {
        console.error('Error generating image:', err);
        res.status(500).send('Error generating image');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
