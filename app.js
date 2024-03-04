const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;



app.use(cors());


app.get('/', (req, res) => {
  res.send('app is running!!');
  res.json({ message: 'success' });
});










app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
