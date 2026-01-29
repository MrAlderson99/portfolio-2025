import { ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  icon: ReactNode;
  isInteractive?: boolean;
}

export interface TelemetryPoint {
  id: number;
  vehicleId: string;
  speed: number;
  engineTemp: number;
  fuelLevel: number;
  status: 'Normal' | 'Critical';
}

export interface FleetMetrics {
  activeVehicles: number;
  infractions: number;
  efficiency: number;
}

export interface DriverStats {
  id: string;
  name: string;
  avatar: string;
  totalKm: number;
  totalEvents: number;
  epk: number; // Events per Kilometer
  riskLevel: 'Low' | 'Medium' | 'High';
  topEvent: string;
}
