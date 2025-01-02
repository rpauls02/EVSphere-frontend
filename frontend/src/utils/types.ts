export interface UserBalance {
    pointsBalance: number;
    creditsBalance: number;
}

export interface UserDetails {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    role: string;
    stripe_cid: string;
}

export interface UserAddress {
    userID: string;
    other: string;
    postcode: string;
    street: string;
    town: string;
    number: string;
}

export interface UserMessage {
    recipient: string;
    sender: string;
    content: string;
    sent: any;
    received: any;
    type: string;
}

export interface UserSession {
    bookedAt: any;
    createdAt: any;
    duration: number;
    energy_consumed: number;
    status: string;
}

export interface UserCharger {
    id: string;
    userID: string;
    address: string;
    chargerCount: number;
    connector: string;
}

export interface UserTransaction {
    id: string;
    sessionID: string;
    userID: string;
    createdAt: any;
    invoiceID: string;
    total: number;
}

export interface UserInvoice {
    id: string;
    userID: string;
    customerID: string;
    customerEmail: string;
    createdAt: any;
    currency: string;
    status: string;
    amount_due: number;
    total: number;
    energyConsumed: number;
    pricePerKwh: number;
    invoicePDF: string;
}

export interface PastSessionData {
    bookedAt: any;
    duration: number;
    energy_consumed: number;
}

export interface PastMessageData {
    received: any;
    content: string;
    type: string;
}

export interface UpcomingSessionData {
    bookedAt: any;
}

export interface ChargerDetails {
    type: string;
}

export interface ChargingPoint {
    id: string;
    connector: string;
    pricePerKwh: number;
    status: 'charging' | 'not charging';
    sendMessage: (messageType: string, data: any) => Promise<any>;
}
