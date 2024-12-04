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
    primary: boolean;
}

export interface UserChargers {
    id: string;
    userID: string;
    address: string;
    chargerCount: number;
    chargerType: string;
}

export interface PastSessionData {
    bookedAt: any;
    duration: number;
    energy_consumed: number;
}

export interface UpcomingSessionData {
    bookedAt: any;
}

export interface ChargerDetails {
    type: string;
}

export interface UserTransactions {
    userID: string;
    createdAt: any;
    invoiceID: string;
    total: number;
}
