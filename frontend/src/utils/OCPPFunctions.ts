import { ChargingPoint } from "./types";
const { ChargingStationClient } = require('ocpp-js');

/* Start a charging session */
export const startChargingSession = async (
    chargingPoint: ChargingPoint,
    connectorId: number,
    reservationId?: number
): Promise<{ pricePerKwh: number; /*status: string*/ }> => {
    try {
        // Fetch the price per kWh from the charging point
        const { pricePerKwh } = chargingPoint;

        // Check the current status of the charging point
        //const status = await handleStatusNotification(chargingPoint);

        // Log the price per kWh and the status of the charger
        console.log(`Price per kWh: $${pricePerKwh.toFixed(2)}`);
        //console.log(`Charger Status: ${status === 'Charging' ? 'Charging' : 'Not charging'}`);

        // Send the StartTransaction message
        const startSessionResponse = await chargingPoint.sendMessage('StartTransaction', {
            connectorId: connectorId,
            timestamp: new Date().toISOString(),
            reservationId: reservationId,
            serviceType: 'Charging',
        });

        console.log('Charging Session Started:', startSessionResponse);

        // Return the required information
        return {
            pricePerKwh: pricePerKwh,
            //status: status === 'Charging' ? 'Charging' : 'Not charging',
        };
    } catch (error) {
        console.error('Error starting charging session:', error);
        throw error; // Re-throw the error so the caller is informed of it
    }
};

// End charging session
export const endChargingSession = async (
    chargingPoint: any,
    transactionId: number
): Promise<void> => {
    try {
        const endSessionResponse = await chargingPoint.sendMessage('StopTransaction', {
            transactionId: transactionId,
            timestamp: new Date().toISOString(),
        });

        console.log('Charging Session Ended:', endSessionResponse);
    } catch (error) {
        console.error('Error ending charging session:', error);
    }
};