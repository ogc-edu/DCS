var awsIot = require("aws-iot-device-sdk");

var device = awsIot.device({
  keyPath: "traffic_controller_int01-private.pem",
  certPath: "traffic_controller_int01-certificate.pem.crt.cert",
  caPath: "AmazonRootCA1.pem",
  host: "a3plgd8pfckwr2-ats.iot.ap-southeast-1.amazonaws.com",
  debug: true
});

device.on('connect', function () {
  const timestamp = new Date().toISOString();
  console.log("Connected to AWS IoT");

  const payload = {
    intersection_id: "01",
    traffic_num: 4,
    timestamp: timestamp,
    cameras: [
      { camera_id: "camera01", car_total: 50 },
      { camera_id: "camera02", car_total: 24 },
      { camera_id: "camera03", car_total: 3 },
      { camera_id: "camera04", car_total: 20 }
    ]
  };

  // Subscribe to topic to receive instructions or data
  device.subscribe("output/01", {}, (err, granted) => {
    if (err) {
      console.error("Subscribe error:", err);
    } else {
      console.log("Subscribed to output/int01:", granted);
    }
  });

  // Publish data to data/int01
  device.publish("data", JSON.stringify(payload), {}, (err) => {
    if (err) {
      console.error("Publish error:", err);
    } else {
      console.log("Published camera data to data/int01");
    }
  });
});

// Listen for incoming messages
device.on('message', function (topic, message) {
  // Parse the message to a JSON object if it's a string
  let messageContent;
  try {
    messageContent = JSON.parse(message.toString());
  } catch (error) {
    console.error("Failed to parse message:", error);
    return;
  }

  // Format the output for cleaner terminal view
  console.log('\n==========================================');
  console.log(`Message received on topic: \x1b[34m${topic}\x1b[0m`);  // Blue color for topic
  console.log('------------------------------------------');
  console.log('Timestamp:', `\x1b[32m${messageContent.timestamp}\x1b[0m`);  // Green color for timestamp
  console.log('Allocated Times:');
  
  messageContent.allocated_times.forEach(camera => {
    console.log(`  - Camera ID: \x1b[33m${camera.camera_id}\x1b[0m`);  // Yellow color for camera_id
    console.log(`    Green Duration: \x1b[32m${camera.green_duration}s\x1b[0m`);  // Green for green_duration
    console.log(`    Red Duration: \x1b[31m${camera.red_duration}s\x1b[0m`);  // Red for red_duration
    console.log('------------------------------------------');
  });

  console.log('==========================================\n');
});

var device2 = awsIot.device({
  keyPath: "traffic_controller_int02-private.pem",  // Use same keypath for now, change later
  certPath: "traffic_controller_int02-certificate.pem.crt.cert", // Use same cert path for now, change later
  caPath: "AmazonRootCA1.pem",
  host: "a3plgd8pfckwr2-ats.iot.ap-southeast-1.amazonaws.com",
  debug: true
});

device2.on('connect', function () {
  const timestamp = new Date().toISOString();
  console.log("Connected to AWS IoT - Device 2");

  const payload = {
    intersection_id: "02",  // Change intersection_id for device 2
    traffic_num: 3,
    timestamp: timestamp,
    cameras: [
      { camera_id: "camera01", car_total: 1 },
      { camera_id: "camera02", car_total: 16 },
      { camera_id: "camera03", car_total: 38 }
    ]
  };

  // Subscribe to topic to receive instructions or data for device 2
  device2.subscribe("output/02", {}, (err, granted) => {
    if (err) {
      console.error("Subscribe error:", err);
    } else {
      console.log("Subscribed to output/int02:", granted);
    }
  });

  // Publish data to data
  device2.publish("data", JSON.stringify(payload), {}, (err) => {
    if (err) {
      console.error("Publish error:", err);
    } else {
      console.log("Published camera data to data");
    }
  });
});

// Listen for incoming messages for device2
device2.on('message', function (topic, message) {
  // Parse the message to a JSON object if it's a string
  let messageContent;
  try {
    messageContent = JSON.parse(message.toString());
  } catch (error) {
    console.error("Failed to parse message:", error);
    return;
  }

  // Format the output for cleaner terminal view
  console.log('\n==========================================');
  console.log(`Message received on topic: \x1b[34m${topic}\x1b[0m`);  // Blue color for topic
  console.log('------------------------------------------');
  console.log('Timestamp:', `\x1b[32m${messageContent.timestamp}\x1b[0m`);  // Green color for timestamp
  console.log('Allocated Times:');
  
  messageContent.allocated_times.forEach(camera => {
    console.log(`  - Camera ID: \x1b[33m${camera.camera_id}\x1b[0m`);  // Yellow color for camera_id
    console.log(`    Green Duration: \x1b[32m${camera.green_duration}s\x1b[0m`);  // Green for green_duration
    console.log(`    Red Duration: \x1b[31m${camera.red_duration}s\x1b[0m`);  // Red for red_duration
    console.log('------------------------------------------');
  });

  console.log('==========================================\n');
});

