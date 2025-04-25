var awsIot = require("aws-iot-device-sdk")

var device = awsIot.device({
  keyPath: "traffic_controller_int01-private.pem",
  certPath: "traffic_controller_int01-certificate.pem.crt.cert",
  caPath: "AmazonRootCA1.pem",
  host: "a3plgd8pfckwr2-ats.iot.ap-southeast-1.amazonaws.com",
  debug: true
});

device.on('connect', function () {
  const timestamp = new Date().toISOString();
  console.log("connected");

  const payload = {
    intersection_id: "01",
    timestamp: timestamp,
    cameras: [
      { camera_id: "camera01", occupancy_ratio: "0.75" },
      { camera_id: "camera02", occupancy_ratio: "0.82" },
      { camera_id: "camera03", occupancy_ratio: "0.60" },
      { camera_id: "camera04", occupancy_ratio: "0.93" }
    ]
  };

  device.publish("data/int01", JSON.stringify(payload));
});

device.on('error', function (error) {
  console.error("Connection error:", error);
});

device.on('close', function () {
  console.log("Connection closed");
});

device.on('reconnect', function () {
  console.log("Reconnecting...");
});

