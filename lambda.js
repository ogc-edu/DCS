const AWS = require('aws-sdk');
const iotdata = new AWS.IotData({ endpoint: 'a3plgd8pfckwr2-ats.iot.ap-southeast-1.amazonaws.com' });

exports.handler = async (event) => {
    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            const newItem = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
            const payload = newItem.payload;
            const intId = payload.intersection_id;

            // Step 1: Assign weights based on car counts
            function getWeight(carTotal) {
                if (carTotal <= 5) return 1;
                if (carTotal <= 15) return 2;
                if (carTotal <= 30) return 3;
                if (carTotal <= 50) return 4;
                return 5;
            }

            // Step 2: Map weight to fixed green time
            function greenTimeFromWeight(weight) {
                switch (weight) {
                    case 1: return 15;
                    case 2: return 30;
                    case 3: return 40;
                    case 4: return 50;
                    case 5: return 60;
                    default: return 15;
                }
            }

            const lanes = payload.cameras.map(cam => {
                const weight = getWeight(cam.car_total);
                const green = greenTimeFromWeight(weight);
                return {
                    camera_id: cam.camera_id,
                    green_duration: green
                };
            });

            // Step 3: Calculate red time per lane (sum of others' green)
            const allocatedTimes = lanes.map(lane => {
                const red = lanes
                    .filter(l => l.camera_id !== lane.camera_id)
                    .reduce((sum, l) => sum + l.green_duration, 0);

                return {
                    camera_id: lane.camera_id,
                    green_duration: lane.green_duration,
                    red_duration: red
                };
            });

            const publishPayload = {
                timestamp: payload.timestamp,
                allocated_times: allocatedTimes
            };

            const params = {
                topic: 'output/' + intId,
                payload: JSON.stringify(publishPayload),
                qos: 0
            };

            try {
                await iotdata.publish(params).promise();
                console.log('Published message to topic:', params.topic, 'Payload:', publishPayload);
            } catch (err) {
                console.error('Failed to publish message:', err);
            }
        }
    }
};
