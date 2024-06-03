const express = require('express');
const mqtt = require('mqtt');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite
const app = express();
const bodyParser = require('body-parser');
const ping = require('ping');
const http = require('http');
const wifi = require('node-wifi');
const path = require('path');
const { exec } = require('child_process'); // Add this line





app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// Serve index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const nodemailer = require('nodemailer');


app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(function(req, res, next) {
 // Allow requests from this origin
  res.header('Access-Control-Allow-Origin', '*');
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



app.post('/set-wifi-sta', (req, res) => {
  const { SSID, PWD, adminKey } = req.body;

  if (!SSID || !PWD || !adminKey) {
    return res.status(400).send('Invalid request payload');
  }

  // Here you would handle the logic to set the Wi-Fi STA
  console.log('Setting Wi-Fi STA with the following details:');
  console.log(`SSID: ${SSID}`);
  console.log(`PWD: ${PWD}`);
  console.log(`Admin Key: ${adminKey}`);

  // For now, just respond with a success message
  res.status(200).send('Wi-Fi STA settings updated successfully');
});


app.post('/ping', (req, res) => {
  const url = 'http://192.168.4.1/';
  if (!url) {
      return res.status(400).json({ error: 'URL is required' });
  }

  let responseSent = false;

  const requestOptions = new URL(url);

  const options = {
      method: 'GET',
      hostname: requestOptions.hostname,
      port: requestOptions.port || 80,
      path: requestOptions.pathname,
      timeout: 5000 // 5 seconds timeout
  };

  const reqPing = http.request(options, (resPing) => {
      if (!responseSent) {
          const isAlive = resPing.statusCode === 200;
          res.json({
              url: url,
              alive: isAlive,
              statusCode: resPing.statusCode
          });
          responseSent = true;
      }
  });

  reqPing.on('error', (e) => {
      if (!responseSent) {
          res.status(500).json({ error: e.message });
          responseSent = true;
      }
  });

  reqPing.on('timeout', () => {
      if (!responseSent) {
          reqPing.destroy();
          res.status(408).json({ error: 'Request timed out', alive: false });
          responseSent = true;
      }
  });

  reqPing.end();
});


app.post('/pingLocal', (req, res) => {
  const url = 'http://multilogger.local/';
  if (!url) {
      return res.status(400).json({ error: 'URL is required' });
  }

  let responseSent = false;

  const requestOptions = new URL(url);

  const options = {
      method: 'GET',
      hostname: requestOptions.hostname,
      port: requestOptions.port || 80,
      path: requestOptions.pathname,
      timeout: 50000 // 5 seconds timeout
  };

  const reqPing = http.request(options, (resPing) => {
      if (!responseSent) {
          const isAlive = resPing.statusCode === 200;
          res.json({
              url: url,
              alive: isAlive,
              statusCode: resPing.statusCode
          });
          responseSent = true;
      }
  });

  reqPing.on('error', (e) => {
      if (!responseSent) {
          res.status(500).json({ error: e.message });
          responseSent = true;
      }
  });

  reqPing.on('timeout', () => {
      if (!responseSent) {
          reqPing.destroy();
          res.status(408).json({ error: 'Request timed out', alive: false });
          responseSent = true;
      }
  });

  reqPing.end();
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


app.get('/get-wifi', (req, res) => {
  
  res.status(200).json(wifiCredentials);
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



app.post

app.get('/getDataFromDatabase', (req, res) => {
  const { id, type } = req.query; // Get the ID and type from the query parameters

  // Check if both ID and type are provided
  if (!id || !type) {
    return res.status(400).send({ error: 'ID and type parameters are required' });
  }

  // Fetch data from the database for the provided ID and type
  db.all('SELECT *  FROM mqtt_messages WHERE Id = ? AND Type = ?', [id, type], (err, rows) => {
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
  db.all('SELECT DISTINCT Type, Nickname FROM mqtt_messages WHERE Id = ?  ', id, (err, rows) => {
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
      Nickname, 
      ROW_NUMBER() OVER (PARTITION BY Id, Type ORDER BY TimeStamp DESC) AS RowNum
    FROM mqtt_messages
  )
  SELECT Id, Type, Value, TimeStamp, Nickname
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




async function sendEmail(subject, text, recipientEmail, senderEmail = "denzelrustenberg@gmail.com", senderPassword) {
  try {
    // Create a transporter object using SMTP
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'arexxschoollab@gmail.com',
          pass: 'gvja gnsn yqpr ozcm'
      }
  });


    // Define email options
    let mailOptions = {
      from: senderEmail, // Sender address
      to: recipientEmail, // Recipient address from the database
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

function setNickname(sensorId, nickname, callback) {
  db.serialize(() => {
    db.run("INSERT INTO sensor_nicknames (id, nickname) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET nickname = excluded.nickname", [sensorId, nickname], (err) => {
      if (err) {
        console.error('Error setting nickname:', err);
        return callback(err);
      }

      console.log(`Nickname for sensor ${sensorId} set to ${nickname}`);

      // Update the nickname in existing mqtt_messages entries
      db.run("UPDATE mqtt_messages SET Nickname = ? WHERE Id = ?", [nickname, sensorId], (updateErr) => {
        if (updateErr) {
          console.error('Error updating nickname in mqtt_messages:', updateErr);
          return callback(updateErr);
        }
        console.log(`Updated existing entries for sensor ${sensorId} with nickname ${nickname}`);
        callback(null);
      });
    });
  });
}

// POST endpoint to set or update a nickname
app.post('/setNickname', (req, res) => {
  const { sensorId, nickname } = req.body;

  if (!sensorId || !nickname) {
    return res.status(400).send({ error: 'Sensor ID and nickname are required' });
  }

  setNickname(sensorId, nickname, (err) => {
    if (err) {
      return res.status(500).send({ error: 'Error setting nickname' });
    }
    res.status(200).send({ message: `Nickname for sensor ${sensorId} set to ${nickname}` });
  });
});

function processAndInsertData(parsedData) {
  try {
    db.get("SELECT nickname FROM sensor_nicknames WHERE id = ?", [parsedData.Id], (err, row) => {
      if (err) {
        console.error('Error fetching nickname from the database:', err);
        return;
      }

      const nickname = row ? row.nickname : `Sensor-${parsedData.Id}`;

      // Update the nickname in existing mqtt_messages entries
      db.run("UPDATE mqtt_messages SET Nickname = ? WHERE Id = ?", [nickname, parsedData.Id], (updateErr) => {
        if (updateErr) {
          console.error('Error updating nickname in mqtt_messages:', updateErr);
          return;
        }
        console.log(`Updated existing entries for sensor ${parsedData.Id} with nickname ${nickname}`);

        // Insert the new data into mqtt_messages
        const stmt = db.prepare("INSERT INTO mqtt_messages (Id, Value, Unit, Type, TimeStamp, Nickname) VALUES (?, ?, ?, ?, ?, ?)");
        stmt.run(parsedData.Id, parsedData.Value, parsedData.Unit, parsedData.Type, parsedData.TimeStamp, nickname, (err) => {
          if (err) {
            console.error('Error inserting data into the database:', err);
          } else {
            console.log('Data inserted into the database:', parsedData);
            checkAlertConditions(parsedData);
          }
          stmt.finalize();
        });
      });
    });
  } catch (error) {
    console.error('Error preparing database statement:', error);
  }
}

// Function to check alert conditions
const alertCache = {};
function checkAlertConditions(parsedData) {
  const alertSettingsQuery = `
    SELECT DISTINCT id, type, threshold, comparison_operator, id_alert 
    FROM alert_settings 
    WHERE id = ? AND type = ?
  `;

  db.get(alertSettingsQuery, [parsedData.Id, parsedData.Type], (err, alertRow) => {
    if (err) {
      console.error('Error fetching alert settings from the database:', err);
      return;
    }

    if (!alertRow) {
      console.log('No alert settings found for the specified ID and type:', parsedData.Id, parsedData.Type);
      return;
    }

    const savedThreshold = alertRow.threshold;
    const comparisonOperator = alertRow.comparison_operator;

    // Second query to get the email address
    const emailQuery = `
      SELECT email 
      FROM email 
      WHERE id = 1
    `;

    db.get(emailQuery, (err, emailRow) => {
      if (err) {
        console.error('Error fetching email from the database:', err);
        return;
      }

      if (!emailRow) {
        console.log('No email found for the specified alert:');
        return;
      }

      const recipientEmail = emailRow.email;
      const condition = evaluateCondition(parsedData.Value, comparisonOperator, savedThreshold);

      if (condition) {
        const currentTime = new Date();
        const cacheKey = `${parsedData.Id}-${parsedData.Type}`;
        const lastSent = alertCache[cacheKey] || 0;

        if (currentTime - lastSent >= 30 * 60 * 1000) { // 30 minutes
          alertCache[cacheKey] = currentTime;
          
          const subject = 'Alert: Value meets condition';
          const nextAlertTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
          const message = `
            The value associated with ID ${parsedData.Id} and type ${parsedData.Type} meets the condition (${parsedData.Value} ${comparisonOperator} ${savedThreshold}).
            \nTime sent: ${currentTime.toLocaleString()}
            \nNext alert will be sent at: ${nextAlertTime.toLocaleString()}
          `;

          sendEmail(subject, message, recipientEmail);
        }
      }
    });
  });
}


// Update email address endpoint
app.post('/update-email', (req, res) => {
  const { email } = req.body; // Extract email from request body

  if (!email) {
    return res.status(400).send('New email is required');
  }

  const updateEmailQuery = `
    UPDATE email 
    SET email = ? 
    WHERE id = 1
  `;

  db.run(updateEmailQuery, [email], function(err) {
    if (err) {
      console.error('Error updating email in the database:', err);
      return res.status(500).send('Internal server error');
    }

    if (this.changes === 0) {
      return res.status(404).send('Email not found');
    }

    res.send('Email updated successfully');
  });
});

// Main function to handle data
function onData(data) {
  try {
    const rawData = data.toString();
    console.log('Raw data:', rawData);
    const combinedData = incompleteData + rawData;
    const jsonRegex = /{[^{}]*}/g;
    const jsonMatches = combinedData.match(jsonRegex);

    if (jsonMatches) {
      jsonMatches.forEach((jsonString) => {
        try {
          const parsedData = JSON.parse(jsonString);
          console.log('Parsed data:', parsedData);
          processAndInsertData(parsedData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      });

      incompleteData = combinedData.slice(jsonMatches[jsonMatches.length - 1].length);
    } else {
      incompleteData = combinedData;
    }
  } catch (error) {
    console.error('Error handling data:', error);
  }
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


// const SerialPort = require('serialport').SerialPort;


// const portPath = '/dev/tty.usbserial-10'; // path to serial portc(change per pc)// to do is het dynamic te maken 
// const port = new SerialPort({ path: portPath, baudRate: 115200 });


// port.on('open', () => {
//   console.log('Port opened successfully.');

//   // Set up a listener for incoming data
//   port.on('data', onData);
// });


const { SerialPort } = require('serialport');

app.post('/openAndListenSerialPort', async (req, res) => {
  try {
    // List available serial ports
    SerialPort.list().then(
      ports => {
        // Log available ports and their details
        console.log('Available serial ports:');
        ports.forEach(port => {
          console.log(port);
        });

        // Define criteria to find the desired serial port
        const criteria = {
          //voor mac zonder hoofletter A en windows met hoofletter A dus maak 2 pkg.json files een voor mac en een voor windows=
          vendorId: '1a86',
          productId: '7523'
        };

        // Find the port path that matches the criteria
        const portInfo = ports.find(
          port =>
            port.vendorId === criteria.vendorId &&
            port.productId === criteria.productId &&
            port.path // Ensure port object has a path property
        );

        // Log the portInfo object to see its contents
        console.log('Port info:', portInfo);

        // Check if the portInfo is found and has a path property
        if (!portInfo || !portInfo.path) {
          console.error('Serial port not found for the specified criteria:', criteria);
          return res.status(500).json({ error: 'Serial port not found for the specified criteria', criteria });
        }

        console.log('Port path:', portInfo.path); // Log port path

        // Open the serial port using the port path from portInfo
        const port = new SerialPort({ path: portInfo.path, baudRate: 115200 });

        // Listen to incoming data
        port.on('data', onData);

        res.status(200).json({ message: 'Serial port opened and listening successfully' });
      },
      err => {
        console.error('Error listing serial ports:', err);
        res.status(500).json({ error: 'Error listing serial ports', details: err.message });
      }
    );
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ error: 'Error handling request', details: err.message });
  }
});





app.post('/closeSerial', async (req, res) => {
  try {
    // List available serial ports
    SerialPort.list().then(
      ports => {
        // Log available ports and their details
        console.log('Available serial ports:');
        ports.forEach(port => {
          console.log(port);
        });

        // Define criteria to find the desired serial port
        const criteria = {
          vendorId: '1a86',
          productId: '7523'
        };

        // Find the port path that matches the criteria
        const portInfo = ports.find(
          port =>
            port.vendorId === criteria.vendorId &&
            port.productId === criteria.productId &&
            port.path // Ensure port object has a path property
        );

        // Log the portInfo object to see its contents
        console.log('Port info:', portInfo);

        // Check if the portInfo is found and has a path property
        if (!portInfo || !portInfo.path) {
          console.error('Serial port not found for the specified criteria:', criteria);
          return res.status(500).json({ error: 'Serial port not found for the specified criteria', criteria });
        }

        console.log('Port path:', portInfo.path); // Log port path

        // Open the serial port using the port path from portInfo
        const port = new SerialPort({ path: portInfo.path, baudRate: 115200 });

        // Listen to incoming data
        // Open the serial port
        port.open(err => {
          if (err) {
            console.error('Error opening serial port:', err);
            res.status(500).json({ error: 'Error opening serial port', details: err.message });
          } else {
            // Close the serial port
            port.close((err) => {
              if (err) {
                console.error('Error closing serial port:', err);
                res.status(500).json({ error: 'Error closing serial port', details: err.message });
              } else {
                console.log('Serial port closed successfully');
                res.status(200).json({ message: 'Serial port closed successfully' });
              }
            });
          }
        });
      },
      err => {
        console.error('Error listing serial ports:', err);
        res.status(500).json({ error: 'Error listing serial ports', details: err.message });
      }
    );
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ error: 'Error handling request', details: err.message });
  }
});











// In-memory storage for the WiFi credentials (for demonstration purposes)
let wifiCredentials = {
  STA: {
    SSID: '',
    PWD: ''
  },
  AP: {
    SSID: '',
    PWD: ''
  }
};

// Endpoint to set WiFi credentials for station mode
app.post('/set-wifi-sta', (req, res) => {
  const { STA, 'admin-key': adminKey } = req.body;

  if (!STA || !STA.SSID) {
    return res.status(400).send('SSID is required');
  }

  if (!adminKey || adminKey !== 'wifi key') { // Replace 'wifi key' with your actual admin key
    return res.status(403).send('Forbidden');
  }

  wifiCredentials.STA = {
    SSID: STA.SSID,
    PWD: STA.PWD || ''
  };

  res.status(200).send('Station mode WiFi credentials updated');
});

// Endpoint to set WiFi credentials for access point mode
app.post('/set-wifi-ap', (req, res) => {
  const { AP, 'admin-key': adminKey } = req.body;

  if (!AP || !AP.SSID) {
    return res.status(400).send('SSID is required');
  }

  if (!adminKey || adminKey !== 'admin') { // Replace 'admin' with your actual admin key
    return res.status(403).send('Forbidden');
  }

  wifiCredentials.AP = {
    SSID: AP.SSID,
    PWD: AP.PWD || ''
  };

  res.status(200).send('Access Point mode WiFi credentials updated');
});

// Endpoint to get the stored WiFi credentials
app.get('/get-wifi', (req, res) => {
  res.status(200).json(wifiCredentials);
});

// Endpoint to set both STA and AP credentials
app.post('/set-wifi', (req, res) => {
  const { STA, AP, 'admin-key': adminKey } = req.body;

  if (!adminKey || adminKey !== 'admin') { // Replace 'admin' with your actual admin key
    return res.status(403).send('Forbidden');
  }

  if (STA) {
    if (!STA.SSID) {
      return res.status(400).send('SSID is required for STA');
    }
    wifiCredentials.STA = {
      SSID: STA.SSID,
      PWD: STA.PWD || ''
    };
  }

  if (AP) {
    if (!AP.SSID) {
      return res.status(400).send('SSID is required for AP');
    }
    wifiCredentials.AP = {
      SSID: AP.SSID,
      PWD: AP.PWD || ''
    };
  }

  res.status(200).send('WiFi credentials updated');
});




// Initialize wifi module
wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});

// Define a route to scan for available Wi-Fi networks
app.get('/scan-wifi', (req, res) => {
  wifi.scan((error, networks) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json(networks);
    }
  });
});









app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 

  // Use child_process.exec to open the default web browser
  const url = `http://localhost:5500/arexx/public/`;
  console.log(`Open ${url} in your browser`);
  switch (process.platform) {
    case 'darwin':
      exec(`open ${url}`);
      break;
    case 'win32':
      exec(`start ${url}`);
      break;
    case 'linux':
      exec(`xdg-open ${url}`);
      break;
    default:
      console.log(`Cannot open browser on your platform: ${process.platform}`);
  }
});