import type { Patient } from "./types";
import type { SimulationParameters } from "./types";

export const createPopulation = (size = 1600) => {
  const population: Patient[] = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
      infectious: false,
      vaccinated: false,
      daysInfected : 0
    });
  }
  // Infect patient zero...
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;

  return population;
};

let roundCounter = 0

const vaccinate = (population : Patient[], params : SimulationParameters) =>{
  //get unvaxxed patients from population
  let unvaxxed = population.filter(
    (p) =>!p.vaccinated
  )
  if (unvaxxed.length == 0){
    return null
  }
  else{
    let randomIndex= Math.floor(Math.random()*unvaxxed.length)
    unvaxxed[randomIndex].vaccinated = true
  }
}


const updatePatient = (
  patient: Patient,
  population: Patient[],
  params: SimulationParameters,
): Patient => {
  let updatedPatient : Patient = { ...patient };
  // IF we are NOT sick, see if our neighbors are sick...
  // choose a partner
  const partner = population[Math.floor(Math.random() * population.length)];
  if (partner.infectious && 100*Math.random() < params.infectionChance) {          
    updatedPatient = { ...patient, infected : true };
  } 
  if (partner.infectious && patient.vaccinated==true && Math.random()*100>params.vaccineProtecion){
      updatedPatient= {...patient, infected : true};
  }
  if (updatedPatient.infected) {
    // Add one to counter each day we are infected
    updatedPatient.daysInfected += 1;
  }
  // If infected more than 5 days, we become infectious
  if (updatedPatient.daysInfected > 5){
   updatedPatient.infectious = true;
  }
  // if Infected more than 14 days, we stop being infectious
  if (updatedPatient.daysInfected > 14) {
    updatedPatient.infectious = false;
  }
  // If infected more than 3-4 months, we can be infected again...
  if (updatedPatient.daysInfected > 30 * 3) {
    updatedPatient.infected = false;
  }

  return updatedPatient;
};

export const updatePopulation = (
  population: Patient[],
  params: SimulationParameters
): Patient[] => {
  // Run updatePatient once per patient to create *new* patients for new round.
  let newPopulation = population.map((patient) =>
    updatePatient(patient, population, params)
  );
  for (let i=0; i<10;i++){
    vaccinate(newPopulation, params)
  }
  roundCounter ++
  
  return newPopulation;
};
