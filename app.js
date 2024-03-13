const express = require('express');
const app = express();
const multer = require('multer'); // Import multer
const fs = require('fs');
const cors = require('cors');
const PORT = process.env.PORT || 5500;
const path = require('path');
const folderPath = 'imported_data';





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the target folder for uploaded files
    cb(null, 'imported_data/');
  },
  filename: function (req, file, cb) {
    // Set the file name to "database"
    const fixedFileName = 'database' + path.extname(file.originalname);
    cb(null, fixedFileName);
  }
});

const upload = multer({ storage: storage });

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'],
};

app.use(cors(corsOptions));


app.get('/', (req, res) => {

  res.json({ message: 'success' });
});

app.get('/checkFolder', (req, res) => {
  // Check if a file exists in the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (files.length > 0) {
      console.log('Files exist in the "imported_data" folder:', files);
      res.status(200).json({ message: 'here' });
    } else {
      console.log('No files found in the "imported_data" folder.');
      res.status(200).json({ message: 'empty' });
    }
  });
});


app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }
    // Process the file, save it, etc.
    res.json({ message: 'File uploaded successfully.' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
