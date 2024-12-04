// Start a charging session
export const startChargingSession = async (
    chargingPoint: any,
    connectorId: number,
    idTag: string,
    reservationId?: number
): Promise<void> => {
    try {
        const startSessionResponse = await chargingPoint.sendMessage('StartTransaction', {
            connectorId: connectorId,
            idTag: idTag,
            timestamp: new Date().toISOString(),
            reservationId: reservationId,
            serviceType: 'Charging',
        });

        console.log('Charging Session Started:', startSessionResponse);
    } catch (error) {
        console.error('Error starting charging session:', error);
    }
};

// End charging session
export const endChargingSession = async (
    chargingPoint: any,
    transactionId: number
): Promise<void> => {
    try {
        const endSessionResponse = await chargingPoint.sendMessage('EndTransaction', {
            transactionId: transactionId,
            timestamp: new Date().toISOString(),
        });

        console.log('Charging Session Ended:', endSessionResponse);
    } catch (error) {
        console.error('Error ending charging session:', error);
    }
};