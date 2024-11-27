const functions = require('@google-cloud/functions-framework');

functions.http('helloHttp', (req, res) => {
  res.send(`Hello ${req.query.name || req.body.name || 'World'}!`);
});

functions.http('trackCharging', (req, res) => {
    const { vehicleId, startTime, endTime, energyConsumed } = req.body;

    if (!vehicleId || !startTime || !endTime || !energyConsumed) {
        return res.status(400).send('Missing required parameters');
    }

    // Add firebase functions to save data to the DB
    console.log(`Vehicle ID: ${vehicleId}`);
    console.log(`Start Time: ${startTime}`);
    console.log(`End Time: ${endTime}`);
    console.log(`Energy Consumed: ${energyConsumed} kWh`);

    res.status(200).send('Charging data tracked successfully');
});