/**
 * @file main.js
 * @description Der zentrale Koordinator (Controller) der Anwendung. 
 * Orchestriert den Anwendungslebenszyklus, verbindet Datenstrukturen (store.js)
 * mit den DOM-Manipulationen (ui.js) und verwaltet Event-Binding.
 */

import { 
    EMISSION_FACTORS, 
    INITIAL_STATE, 
    calculateTotalCO2, 
    saveToLocalStorage, 
    loadFromLocalStorage 
} from "./store.js";

import { 
    elements, 
    getInputValue, 
    renderCalculation, 
    updateInputFields, 
    showSaveOverlay, 
    renderCode, 
    switchTab, 
    initFocusInteractions 
} from "./ui.js";

import { fetchStoreCode } from "./api.js";

// Lokaler Anwendungszustand
let activeState = {};

/**
 * Führt Berechnungen auf dem aktuellen State aus und aktualisiert die UI.
 * Speichert den State zudem automatisch bei jeder Änderung ab.
 */
function updateAndRender() {
    // 1. Berechnung der Einzelkomponenten
    const traffic = 
        (activeState.transport.carKm || 0) * EMISSION_FACTORS.transport.car +
        (activeState.transport.publicTransportKm || 0) * EMISSION_FACTORS.transport.publicTransport;

    const diet = 
        (activeState.diet.meatRichDays || 0) * EMISSION_FACTORS.diet.meatRich +
        (activeState.diet.veganDays || 0) * EMISSION_FACTORS.diet.vegan;

    const living = 
        (activeState.consumption.electricityKWh || 0) * EMISSION_FACTORS.consumption.electricity;

    // 2. Gesamtberechnung aus Store
    const total = calculateTotalCO2(activeState);

    // 3. UI rendern
    renderCalculation(total, traffic, diet, living);

    // 4. Automatisches Speichern bei jeder Zustandsänderung (UX Auto-Save)
    saveToLocalStorage(activeState);
}

/**
 * Bindet alle Event-Listener an die UI-Elemente.
 */
function bindEvents() {
    // Event-Binding für numerische Eingaben (Echtzeit-Berechnung)
    if (elements.carKmInput) {
        elements.carKmInput.addEventListener("input", (e) => {
            activeState.transport.carKm = getInputValue(e.target);
            updateAndRender();
        });
    }

    if (elements.publicKmInput) {
        elements.publicKmInput.addEventListener("input", (e) => {
            activeState.transport.publicTransportKm = getInputValue(e.target);
            updateAndRender();
        });
    }

    if (elements.meatDaysInput) {
        elements.meatDaysInput.addEventListener("input", (e) => {
            activeState.diet.meatRichDays = getInputValue(e.target);
            updateAndRender();
        });
    }

    if (elements.veganDaysInput) {
        elements.veganDaysInput.addEventListener("input", (e) => {
            activeState.diet.veganDays = getInputValue(e.target);
            updateAndRender();
        });
    }

    if (elements.electricityKwhInput) {
        elements.electricityKwhInput.addEventListener("input", (e) => {
            activeState.consumption.electricityKWh = getInputValue(e.target);
            updateAndRender();
        });
    }

    // Event-Binding für Buttons
    if (elements.btnSave) {
        elements.btnSave.addEventListener("click", () => {
            const success = saveToLocalStorage(activeState);
            if (success) {
                showSaveOverlay();
            }
        });
    }

    if (elements.btnReset) {
        elements.btnReset.addEventListener("click", () => {
            // Setze auf den tiefen Klon des INITIAL_STATE zurück
            activeState = JSON.parse(JSON.stringify(INITIAL_STATE));
            // UI-Felder zurücksetzen
            updateInputFields(activeState);
            // Render triggern
            updateAndRender();
        });
    }

    if (elements.btnCopyCode) {
        elements.btnCopyCode.addEventListener("click", () => {
            if (elements.codeDisplay) {
                const codeText = elements.codeDisplay.textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                    const originalText = elements.btnCopyCode.textContent;
                    elements.btnCopyCode.textContent = "COPIED!";
                    setTimeout(() => {
                        elements.btnCopyCode.textContent = originalText;
                    }, 1500);
                }).catch(err => {
                    console.error("Fehler beim Kopieren des Codes:", err);
                });
            }
        });
    }

    // Event-Binding für Tabs
    if (elements.tabCalculator) {
        elements.tabCalculator.addEventListener("click", () => {
            switchTab("calculator");
        });
    }

    if (elements.tabCode) {
        elements.tabCode.addEventListener("click", () => {
            switchTab("code");
        });
    }
}

/**
 * Startet die Anwendung nach dem Laden des DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialen Zustand aus LocalStorage laden (oder Fallback)
    activeState = loadFromLocalStorage();

    // 2. Eingabefelder mit geladenen Werten befüllen
    updateInputFields(activeState);

    // 3. Fokus-Effekte auf Eingabefeldern aktivieren
    initFocusInteractions();

    // 4. Event-Listener binden
    bindEvents();

    // 4.5. Dynamische Aktivierung von CSS-Animationen bei ?animated=true oder ?anim=true
    const urlParams = new URLSearchParams(window.location.search);
    const enableAnimations = urlParams.has("animated") || urlParams.has("anim");
    if (enableAnimations) {
        // Warnleiste
        const alertBar = document.querySelector("main > div");
        if (alertBar) alertBar.classList.add("entrance-anim");
        
        // Sections
        const sections = document.querySelectorAll("section");
        sections.forEach((sec, idx) => {
            sec.classList.add("entrance-anim", `delay-${idx + 1}`);
        });
        
        // Output Panel
        const outputPanel = document.querySelector(".result-glow");
        if (outputPanel) outputPanel.classList.add("entrance-anim", "delay-4");
    }

    // 5. Erstes Rendering ausführen
    updateAndRender();

    // 6. Quellcode asynchron laden und für den Source-Tab bereitstellen
    fetchStoreCode().then(code => {
        renderCode(code);
    });
});
