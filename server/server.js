const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');
const iconv = require('iconv-lite'); // Import iconv-lite

const app = express();
const cors = require('cors');
const port = 3001;
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Convert buffer to string with appropriate encoding
  const csvString = iconv.decode(req.file.buffer, 'win1252'); // Adjust encoding as needed

  const fileStream = new Readable();
  fileStream.push(csvString);
  fileStream.push(null);

  const shipmentsByDestination = {};

  fileStream
    .pipe(csvParser())
    .on('data', (data) => {
      console.log('CSV row:', data);
      const { destination, ...shipmentDetails } = data;
      if (!shipmentsByDestination[destination]) {
        shipmentsByDestination[destination] = [];
      }
      shipmentsByDestination[destination].push(shipmentDetails);
    })
    .on('end', () => {
      console.log('Parsed CSV data:', shipmentsByDestination);
      res.json(shipmentsByDestination);
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      res.status(500).send('Error parsing CSV');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

