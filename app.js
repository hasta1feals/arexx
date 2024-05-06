const express = require('express');
const mqtt = require('mqtt');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite
const app = express();
const bodyParser = require('body-parser');


const SerialPort = require('serialport').SerialPort;
const PORT = process.env.PORT || 3000;
// const portPath = '/COM4'; // path to serial portc(change per pc)// to do is het dynamic te maken 
const nodemailer = require('nodemailer');
// const port = new SerialPort({ path: portPath, baudRate: 115200 });


app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

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



app.get('/getAlarm', (req, res) => {
  db.all('SELECT * FROM alert_settings', (err, rows) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching alarm settings' });
    } else {
      res.send({ message: 'Success', rows });
    }
  });
});

app.delete('/deleteAlarm/:id?', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).send({ error: 'No ID provided' });
    return;
  }

  db.run('DELETE  FROM alert_settings WHERE id_alert = ?', id, function(err) {
    if (err) {
      res.status(500).send({ error: 'Error deleting alarm settings' });
    } else {
      if (this.changes === 0) {
        res.status(404).send({ error: 'Alarm settings not found' });
      } else {
        res.send({ message: 'Alarm settings deleted successfully' });
      }
    }
  });
});



// Define the queryDatabaseForData function
function queryDatabaseForData(id, type) {
  return new Promise((resolve, reject) => {
    db.all('SELECT TimeStamp, Value FROM mqtt_messages WHERE Id = ? AND Type = ?', [id, type], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Extract labels and values from the fetched rows
        const labels = rows.map(row => row.TimeStamp);
        const values = rows.map(row => row.Value);
        // Resolve the promise with the labels and values
        resolve({ labels, values });
      }
    });
  });
}

// Route to fetch data from the database based on ID and type
app.get('/combinedData/:id', async (req, res) => {
  const id = req.params.id; // Get the ID from the request parameters

  try {
    // Fetch unique types for the provided ID
    const types = await getUniqueTypesForIDFromDatabase(id);

    // Iterate over each type and fetch data for the ID and type
    const combinedData = {};
    for (const typeEntry of types) {
      const type = typeEntry.Type;
      // Query the database for data based on ID and type
      const { labels, values } = await queryDatabaseForData(id, type);
      combinedData[type] = { labels, values };
    }

    // Send the combined data back to the frontend
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Error fetching combined data' });
  }
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


app.post('/setAlert', (req, res) => {
  const { id, threshold, comparison_operator: comparisonOperator, type } = req.body;

  // Check if all required parameters are provided
  if (!id || !threshold || !comparisonOperator || !type) {
    return res.status(400).send({ error: 'ID, threshold, comparisonOperator, and type parameters are required' });
  }

  // You can execute an SQL query to insert or update the values
  db.run('INSERT OR REPLACE INTO alert_settings (id, threshold, comparison_operator, type) VALUES (?, ?, ?, ?)', [id, threshold, comparisonOperator, type], (err) => {
    if (err) {
      console.error('Error saving alert parameters:', err);
      return res.status(500).send({ error: 'Error saving alert parameters' });
    }
    res.status(200).send({ message: 'Alert parameters set successfully' });
  });
});




async function sendEmail(subject, text, authOptions, senderEmail, senderPassword) {
  try {
    // Create a transporter object using SMTP
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: "denzelrustenberg@gmail.com", // Your email
        clientId: "1071497641816-bofvj0vukv01uo4vanou1gp2cbptdb96.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04HE2dhwIh-fSCgYIARAAGAQSNwF-L9IrG259fUVT64FpMgWZXJHW6i5O7MEzEkB9x3_LWAhUrxGVxMEuWRhwrDpqa1wn_6x5LVc",
        accessToken: "ya29.a0Ad52N3_WAot2nl2cOdakxyn9YpTBBxcKFtPjBHAwWX2UEZR7FJhryiM1IduFOn6tAiEsoPbzE0i2c3Z4HtDn60fdYAVbaJyYTRlYHKL1TkDtQ3Y-Rk4Bfc031yj271WkofQu9YAtzaXtBUhX-H2Xy5X22VSgLvQ7YEa5aCgYKAdcSARASFQHGX2MiQG96mjLCUFwnefXi159OHA0171",
      }
    });

    // Define email options
    let mailOptions = {
      from: senderEmail, // Sender address
      to: 'Debohughes15@gmail.com', // List of recipients
      subject: subject, // Subject line
      text: text // Plain text body
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}


// Function to check if an alert should be triggered

let incompleteData = '';
let lastEmailSentTime = {}; // Keep track of the last email sent time for each condition

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

          // Check if the received data meets the specified conditions for email alerts
          // Retrieve the alert settings from the database based on the parsed ID
          db.get('SELECT threshold, comparison_operator FROM alert_settings WHERE id = ? AND type = ?', parsedData.Id, parsedData.Type, (err, row) => {
            if (err) {
              console.error('Error fetching alert settings from the database:', err);
              return;
            }

            if (!row) {
              console.log('No alert settings found for the specified ID and type:', parsedData.Id, parsedData.Type);
              return;
            }

            const savedThreshold = row.threshold;
            const comparisonOperator = row.comparison_operator;

            // Now you have the saved threshold and comparison operator, you can use them for comparison
            const condition = evaluateCondition(parsedData.Value, comparisonOperator, savedThreshold);
            if (condition) {
              // Send an email
              sendEmail('Alert: Value meets condition', `The value associated with ID ${parsedData.Id} and type ${parsedData.Type} meets the condition (${parsedData.Value} ${comparisonOperator} ${savedThreshold}).`);
            }
          });

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


// Function to update last sent time in the database
// Function to update last sent time in the database
function updateLastSentTime(conditionId, lastSentTime) {
  // Check if the row already exists
  db.get('SELECT condition_id FROM email_sent_times WHERE condition_id = ?', conditionId, (err, row) => {
    if (err) {
      console.error('Error checking if row exists:', err);
      return;
    }

    if (row) {
      // Row exists, update last sent time
      db.run('UPDATE email_sent_times SET last_sent_time = ? WHERE condition_id = ?', lastSentTime, conditionId, (err) => {
        if (err) {
          console.error('Error updating last sent time in the database:', err);
        } else {
          console.log('Last sent time updated in the database for condition:', conditionId);
        }
      });
    } else {
      // Row doesn't exist, insert new row
      db.run('INSERT INTO email_sent_times (condition_id, last_sent_time) VALUES (?, ?)', conditionId, lastSentTime, (err) => {
        if (err) {
          console.error('Error inserting last sent time into the database:', err);
        } else {
          console.log('Last sent time inserted into the database for condition:', conditionId);
        }
      });
    }
  });
}



// Function to insert last sent time into the database
function insertLastSentTime(conditionId, lastSentTime) {
  // Your database query to insert last sent time for the given conditionId
  db.run('INSERT INTO email_sent_times (condition_id, last_sent_time) VALUES (?, ?)', conditionId, lastSentTime, (err) => {
    if (err) {
      console.error('Error inserting last sent time into the database:', err);
    } else {
      console.log('Last sent time inserted into the database for condition:', conditionId);
    }
  });
}




// Function to evaluate the condition dynamically
function evaluateCondition(value, operator, threshold) {
  switch (operator) {
    case '<':
      return value < threshold;
    case '<=':
      return value <= threshold;
    case '>':
      return value > threshold;
    case '>=':
      return value >= threshold;
    case '=':
      return value === threshold;
    default:
      console.error('Invalid comparison operator:', operator);
      return false;
  }
}





// port.on('open', () => {
//   console.log('Port opened successfully.');

//   // Set up a listener for incoming data
//   port.on('data', onData);
// });



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});