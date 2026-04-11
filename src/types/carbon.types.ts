export interface CarbonLog {
    _id: string;
    date: string;
    period: 'daily' | 'weekly' | 'monthly';
    privateTransportKm: number;
    vehicleFuelType: string;
    busKm: number;
    trainKm: number;
    electricityKwh: number;
    diet: string;
    cookingFuel: string;
    cookingHoursPerDay: number;
    transportCO2: number;
    energyCO2: number;
    dietCO2: number;
    cookingCO2: number;
    totalCO2: number;
}

export interface CarbonStats {
    totalCO2: number;
    totalLogs: number;
    avgCO2: number;
}

export interface CarbonFormData {
    period: 'daily' | 'weekly' | 'monthly';
    privateTransportKm: number;
    vehicleFuelType: string;
    busKm: number;
    trainKm: number;
    electricityKwh: number;
    diet: string;
    cookingFuel: string;
    cookingHoursPerDay: number;
}