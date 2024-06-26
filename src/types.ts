export type Patient = {
  id: number;
  x: number;
  y: number;
  infected: boolean;
  infectious : boolean;
  vaccinated: boolean;
  daysInfected : number;
};

export type SimulationParameters = {  
  infectionChance: number;
  vaccineProtecion: number;
};

export const defaultSimulationParameters: SimulationParameters = {
  distanceThreshold: 5,
  movement: 5,
  infectionChance: 5,
  vaccineProtecion: 80,
};