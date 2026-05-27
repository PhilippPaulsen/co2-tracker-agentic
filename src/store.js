/**
 * @file store.js
 * @description Kernlogik und Datenstruktur für den Alltags-CO2-Rechner.
 * Enthält die Emissionsfaktoren, den initialen Anwendungsstatus sowie
 * Berechnungs- und Persistierungsfunktionen für den Browser (ES6-Module).
 */

/**
 * Globale Emissionsfaktoren (CO2 in kg)
 * @constant {Object}
 */
export const EMISSION_FACTORS = {
  transport: {
    car: 0.12,            // Auto: 0.12kg CO2 pro km
    publicTransport: 0.03 // ÖPNV: 0.03kg CO2 pro km
  },
  diet: {
    meatRich: 2.5,        // Fleischreich: 2.5kg CO2 pro Tag
    vegan: 0.9            // Vegan: 0.9kg CO2 pro Tag
  },
  consumption: {
    electricity: 0.42     // Stromverbrauch pro kWh: 0.42kg CO2
  }
};

/**
 * Initialer Anwendungsstatus (State) des CO2-Rechners
 * @constant {Object}
 */
export const INITIAL_STATE = {
  transport: {
    carKm: 0,              // Gefahrene Kilometer mit dem Auto
    publicTransportKm: 0   // Zurückgelegte Kilometer im ÖPNV
  },
  diet: {
    meatRichDays: 0,       // Tage mit fleischreicher Ernährung
    veganDays: 0           // Tage mit veganer Ernährung
  },
  consumption: {
    electricityKWh: 0      // Stromverbrauch in kWh
  }
};

/**
 * Berechnet das gesamte CO2-Äquivalent in Kilogramm (kg) basierend auf dem übergebenen State.
 * 
 * @param {Object} state - Der aktuelle Anwendungsstatus
 * @returns {number} Gesamt-CO2 in kg (gerundet auf zwei Nachkommastellen)
 */
export function calculateTotalCO2(state) {
  if (!state) return 0;

  // 1. Berechnung Transport
  const carCO2 = (state.transport?.carKm || 0) * EMISSION_FACTORS.transport.car;
  const publicTransportCO2 = (state.transport?.publicTransportKm || 0) * EMISSION_FACTORS.transport.publicTransport;
  const transportTotal = carCO2 + publicTransportCO2;

  // 2. Berechnung Ernährung
  const meatRichCO2 = (state.diet?.meatRichDays || 0) * EMISSION_FACTORS.diet.meatRich;
  const veganCO2 = (state.diet?.veganDays || 0) * EMISSION_FACTORS.diet.vegan;
  const dietTotal = meatRichCO2 + veganCO2;

  // 3. Berechnung Konsum (Strom)
  const electricityCO2 = (state.consumption?.electricityKWh || 0) * EMISSION_FACTORS.consumption.electricity;

  // Gesamtsumme
  const total = transportTotal + dietTotal + electricityCO2;

  // Auf 2 Nachkommastellen runden
  return Math.round(total * 100) / 100;
}

/**
 * Speichert den aktuellen Anwendungsstatus im LocalStorage des Browsers.
 * 
 * @param {Object} state - Der zu speichernde Anwendungsstatus
 * @param {string} [key='co2_calculator_state'] - Der LocalStorage-Schlüssel
 * @returns {boolean} True, wenn der Speichervorgang erfolgreich war, andernfalls False
 */
export function saveToLocalStorage(state, key = 'co2_calculator_state') {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern des States in LocalStorage:', error);
    return false;
  }
}

/**
 * Lädt den Anwendungsstatus aus dem LocalStorage des Browsers.
 * Falls kein gespeicherter Status existiert, wird ein Klon des INITIAL_STATE zurückgegeben.
 * 
 * @param {string} [key='co2_calculator_state'] - Der LocalStorage-Schlüssel
 * @returns {Object} Geladener State oder Klon von INITIAL_STATE
 */
export function loadFromLocalStorage(key = 'co2_calculator_state') {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return JSON.parse(JSON.stringify(INITIAL_STATE));
    }
    const loadedState = JSON.parse(serializedState);
    
    // Validierung und Fallback auf INITIAL_STATE Struktur (Deep Merge)
    return {
      transport: {
        carKm: typeof loadedState?.transport?.carKm === 'number' ? loadedState.transport.carKm : INITIAL_STATE.transport.carKm,
        publicTransportKm: typeof loadedState?.transport?.publicTransportKm === 'number' ? loadedState.transport.publicTransportKm : INITIAL_STATE.transport.publicTransportKm
      },
      diet: {
        meatRichDays: typeof loadedState?.diet?.meatRichDays === 'number' ? loadedState.diet.meatRichDays : INITIAL_STATE.diet.meatRichDays,
        veganDays: typeof loadedState?.diet?.veganDays === 'number' ? loadedState.diet.veganDays : INITIAL_STATE.diet.veganDays
      },
      consumption: {
        electricityKWh: typeof loadedState?.consumption?.electricityKWh === 'number' ? loadedState.consumption.electricityKWh : INITIAL_STATE.consumption.electricityKWh
      }
    };
  } catch (error) {
    console.warn('Fehler beim Laden aus LocalStorage. Verwende INITIAL_STATE:', error);
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }
}
