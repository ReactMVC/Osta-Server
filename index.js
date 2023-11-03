const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');

// Config App
const upload = multer();
const app = express();

// CORS Access
app.use(cors());

// API for upload files
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const content = Buffer.from(file.buffer).toString('base64');

        // Edit Github Info
        const githubToken = "your_auth";
        const githubUsername = "your_username";
        const githubRepo = "your_repo_name";

        const date = new Date();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const newFileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${randomStr}.${file.originalname.split('.').pop()}`;

        const response = await axios({
            method: 'put',
            url: `https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/${newFileName}`,
            headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: {
                message: 'new osta file',
                content: content
            }
        });

        // Return success
        res.json({ download_url: response.data.content.download_url });
    } catch (error) {
        // Return errors
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            res.status(500).json({ error: error.response.data });
        } else if (error.request) {
            console.log(error.request);
            res.status(500).json({ error: 'No response received from the server.' });
        } else {
            console.log('Error', error.message);
            res.status(500).json({ error: error.message });
        }
    }
});

// Run Express App
app.listen(4000, () => console.log('Server started on port 4000'));