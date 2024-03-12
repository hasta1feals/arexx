const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const upload = multer({ storage: storage });

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
};

app.use(cors());


app.get('/', (req, res) => {

  res.json({ message: 'success' });
});


app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully.');
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
