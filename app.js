const express = require('express');
const mqtt = require('mqtt');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite
const app = express();
const SerialPort = require('serialport').SerialPort;
const PORT = process.env.PORT || 3000;
const portPath = '/dev/tty.usbserial-10'; // path to serial portc(change per pc)// to do is het dynamic te maken 
const port = new SerialPort({ path: portPath, baudRate: 115200 });


app.use(function(req, res, next) {
 // Allow requests from this origin
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5501');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Include Authorization header
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Include allowed methods
  next();
});


const brokerUrl = 'mqtt://public:public@public.cloud.shiftr.io';
const username = 'public';
const password = 'public';
const topic = '000001';

// Connect to SQLite database
const db = new sqlite3.Database('database.db'); // Change ':memory:' to your database file path if you want to persist data

// Create table to store MQTT messages
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS mqtt_messages (
    Id INTEGER,
    Value REAL,
    Unit TEXT,
    Type TEXT,
    TimeStamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Create a client instance
const client = mqtt.connect(brokerUrl, {
  username: username,
  password: password
});

// When the client is connected
client.on('connect', function () {
  console.log('Connected to MQTT broker');

  // Subscribe to the topic
  client.subscribe(topic, function (err) {
    if (err) {
      console.error('Error subscribing to topic:', err);
    } else {
      console.log('Subscribed to topic:', topic);
    }
  });
});

// When a message is received
// client.on('message', function (receivedTopic, message) {
//   if (receivedTopic === topic) {
//     console.log('Received message on topic:', receivedTopic, 'message:', message.toString());

//     try {
//       // Extract the JSON string from the message using a regular expression
//       const jsonString = message.toString().match(/\{.*\}/)[0];

//       // Parse the extracted JSON string
//       const data = JSON.parse(jsonString);

//       // Insert all properties of the received message into the database as a single row
//       const stmt = db.prepare("INSERT INTO mqtt_messages (Id, Value, Unit, Type, TimeStamp) VALUES (?, ?, ?, ?, ?)");
//       stmt.run(data.Id.toString(), data.Value.toString(), data.Unit.toString(), data.Type.toString(), data.TimeStamp.toString());
//       stmt.finalize();
//     } catch (error) {
//       console.error('Error parsing message:', error);
//       // Handle the error gracefully, e.g., log it and continue processing other messages
//     }
//   }
// });
app.get('/getRH', (req, res) => {
  db.all('SELECT * FROM mqtt_messages where type = "RH"', (err, rows) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching users' });
    } else {
      res.send(rows);
    }
  });
});


app.get('/getUniqueIDsFromDatabase', (req, res) => {
  db.all('SELECT DISTINCT Id FROM mqtt_messages', (err, rows) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching users' });
    } else {
      res.send(rows);
    }
  });
});

app.get('/getDataFromDatabase', (req, res) => {
  const { id, type } = req.query; // Get the ID and type from the query parameters

  // Check if both ID and type are provided
  if (!id || !type) {
    return res.status(400).send({ error: 'ID and type parameters are required' });
  }

  // Fetch data from the database for the provided ID and type
  db.all('SELECT * FROM mqtt_messages WHERE Id = ? AND Type = ?', [id, type], (err, rows) => {
    if (err) {
      return res.status(500).send({ error: 'Error fetching data from the database' });
    }
    res.send(rows);
  });
});



app.get('/getUniqueTypesForIDFromDatabase', (req, res) => {
  const id = req.query.id; // Get the ID from the query parameters

  // Check if the ID is provided
  if (!id) {
    return res.status(400).send({ error: 'ID parameter is required' });
  }

  // Fetch unique types for the provided ID from the database
  db.all('SELECT DISTINCT Type FROM mqtt_messages WHERE Id = ?', id, (err, rows) => {
    if (err) {
      return res.status(500).send({ error: 'Error fetching unique types' });
    }
    res.send(rows);
  });
});



app.get('/getVOLT', (req, res) => {
  db.all('SELECT * FROM mqtt_messages where type = "Volt"', (err, rows) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching users' });
    } else {
      res.send(rows);
    }
  });
});




// Define a function to fetch and send the latest items
function fetchAndSendLatestItems(req, res) {
  db.all(`
  WITH RankedMessages AS (
    SELECT 
      Id, 
      Type, 
      Value, 
      TimeStamp,
      ROW_NUMBER() OVER (PARTITION BY Id, Type ORDER BY TimeStamp DESC) AS RowNum
    FROM mqtt_messages
  )
  SELECT Id, Type, Value, TimeStamp
  FROM RankedMessages
  WHERE RowNum = 1;
  `, (err, rows) => {
    if (err) { 
      if (res) {
        res.status(500).send({ error: 'Error fetching items' });
      } else {
        console.error('Error fetching items:', err);
      }
    } else {
      if (res) {
        res.send({ rows: rows });
      } else {
        
      }
    }
  });
}



// Route for /getAllitems
app.get('/getAllitems', (req, res) => {
  fetchAndSendLatestItems(req, res);
});

// Set an interval to call fetchAndSendLatestItems every 5 minutes (300,000 milliseconds)
setInterval(() => {
  fetchAndSendLatestItems(null, null); // Pass null as req and res since they are not used in the function
}, 3000);


app.get('/infoSensor', (req, res) => {
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // When a message is received, send it to the client
  db.each("SELECT * FROM mqtt_messages", function(err, row) {
    res.write(`data: ${JSON.stringify(row)}\n\n`);
  });


  // Handle errors
  db.on('error', function (error) {
    console.error('SQLite error:', error);
    res.status(500).end();
  });

  // When the client closes the connection
  req.on('close', function () {
    console.log('Client closed the connection');
  });
});

// Variable to store incomplete JSON data
let incompleteData = '';

// Function to handle incoming data
function onData(data) {
  try {
    // Convert the incoming data to a string
    const rawData = data.toString();

    console.log('Raw data:', rawData);

    // Concatenate the incoming data with any previously incomplete data
    const combinedData = incompleteData + rawData;

    // Regular expression to match JSON-like substrings
    const jsonRegex = /{[^{}]*}/g;

    // Extract JSON-like substrings from the combined data
    const jsonMatches = combinedData.match(jsonRegex);

    if (jsonMatches) {
      // Iterate over each matched substring
      jsonMatches.forEach((jsonString) => {
        try {
          // Parse the JSON substring
          const parsedData = JSON.parse(jsonString);

          console.log('Parsed data:', parsedData); // Log parsed data

          // Insert the parsed data into the database
          const stmt = db.prepare("INSERT INTO mqtt_messages (Id, Value, Unit, Type, TimeStamp) VALUES (?, ?, ?, ?, ?)");
          stmt.run(parsedData.Id, parsedData.Value, parsedData.Unit, parsedData.Type, parsedData.TimeStamp);
          stmt.finalize();

          console.log('Data inserted into the database:', parsedData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      });

      // Update incomplete data with any remaining unmatched substring
      incompleteData = combinedData.slice(jsonMatches[jsonMatches.length - 1].length);
    } else {
      // Update incomplete data with combined data if no JSON-like substrings found
      incompleteData = combinedData;
    }
  } catch (error) {
    console.error('Error handling data:', error);
  }
}





port.on('open', () => {
  console.log('Port opened successfully.');

  // Set up a listener for incoming data
  port.on('data', onData);
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
