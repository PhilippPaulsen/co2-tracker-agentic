/**
 * @file ui.js
 * @description Kapselt alle DOM-Manipulationen, das Rendering und die XSS-sichere
 * Darstellung der Zustandsänderungen für das CARBON_OS Dashboard.
 */

// DOM-Elemente
export const elements = {
    // Inputs
    carKmInput: document.getElementById("input-car-km"),
    publicKmInput: document.getElementById("input-public-km"),
    meatDaysInput: document.getElementById("input-meat-days"),
    veganDaysInput: document.getElementById("input-vegan-days"),
    electricityKwhInput: document.getElementById("input-electricity-kwh"),

    // Buttons
    btnSave: document.getElementById("btn-manual-save"),
    btnReset: document.getElementById("btn-reset"),
    btnCopyCode: document.getElementById("btn-copy-code"),

    // Result Displays
    totalCO2: document.getElementById("total-co2"),
    trafficCO2: document.getElementById("traffic-co2"),
    livingCO2: document.getElementById("living-co2"),

    // Tab Navigation
    tabCalculator: document.getElementById("tab-calculator"),
    tabCode: document.getElementById("tab-code"),

    // Content Views
    calculatorView: document.getElementById("calculator-view"),
    codeView: document.getElementById("code-view"),

    // Overlays & Code Display
    saveOverlay: document.getElementById("save-overlay"),
    codeDisplay: document.getElementById("code-display")
};

/**
 * Validierte Auslesung von Eingabewerten (verhindert negative Werte).
 * @param {HTMLInputElement} inputEl
 * @returns {number} Sauberer numerischer Wert
 */
export function getInputValue(inputEl) {
    const val = parseFloat(inputEl.value);
    return isNaN(val) || val < 0 ? 0 : val;
}

/**
 * XSS-sichere Aktualisierung des Berechnungs-Panels.
 * 
 * @param {number} total - Gesamt-CO2 in kg
 * @param {number} traffic - CO2-Anteil Verkehr
 * @param {number} living - CO2-Anteil Wohnen/Konsum
 */
export function renderCalculation(total, traffic, living) {
    // Verwende ausschließlich textContent zur Vermeidung von XSS
    if (elements.totalCO2) {
        elements.totalCO2.textContent = total.toLocaleString("de-DE", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        });
    }
    if (elements.trafficCO2) {
        elements.trafficCO2.textContent = `${traffic.toFixed(1)}kg`;
    }
    if (elements.livingCO2) {
        elements.livingCO2.textContent = `${living.toFixed(1)}kg`;
    }
}

/**
 * Befüllt die Eingabefelder im UI mit den Werten des aktuellen States.
 * Dies wird hauptsächlich zur Initialisierung und beim Zurücksetzen (Reset) aufgerufen.
 * 
 * @param {Object} state - Der aktuelle Anwendungsstatus
 */
export function updateInputFields(state) {
    if (!state) return;

    if (elements.carKmInput) elements.carKmInput.value = state.transport.carKm;
    if (elements.publicKmInput) elements.publicKmInput.value = state.transport.publicTransportKm;
    if (elements.meatDaysInput) elements.meatDaysInput.value = state.diet.meatRichDays;
    if (elements.veganDaysInput) elements.veganDaysInput.value = state.diet.veganDays;
    if (elements.electricityKwhInput) elements.electricityKwhInput.value = state.consumption.electricityKWh;
}

/**
 * Zeigt das Overlay für die erfolgreiche Zustandsspeicherung.
 */
export function showSaveOverlay() {
    if (!elements.saveOverlay) return;
    elements.saveOverlay.classList.remove("opacity-0", "pointer-events-none");
    
    // Automatisch nach 1200ms wieder ausblenden
    setTimeout(() => {
        elements.saveOverlay.classList.add("opacity-0", "pointer-events-none");
    }, 1200);
}

/**
 * XSS-sichere Darstellung des Quellcodes im Source-Code-Viewer.
 * 
 * @param {string} codeText - Der anzuzeigende JavaScript-Code
 */
export function renderCode(codeText) {
    if (!elements.codeDisplay) return;
    // textContent sichert den Inhalt gegen HTML-Injektionen ab
    elements.codeDisplay.textContent = codeText;
}

/**
 * Wechselt zwischen den Tabs (Compute / Source Code) und passt das Styling an.
 * 
 * @param {string} tab - 'calculator' oder 'code'
 */
export function switchTab(tab) {
    if (tab === "calculator") {
        // Views umschalten
        elements.calculatorView.classList.remove("hidden");
        elements.codeView.classList.add("hidden");

        // Compute Tab aktivieren (Tailwind-Styles)
        elements.tabCalculator.classList.remove("text-on-surface-variant", "border-transparent");
        elements.tabCalculator.classList.add("text-on-primary-container", "bg-primary-container", "border-primary");

        // Code Tab deaktivieren
        elements.tabCode.classList.remove("text-on-primary-container", "bg-primary-container", "border-primary");
        elements.tabCode.classList.add("text-on-surface-variant", "border-transparent");
    } else if (tab === "code") {
        // Views umschalten
        elements.calculatorView.classList.add("hidden");
        elements.codeView.classList.remove("hidden");

        // Code Tab aktivieren
        elements.tabCode.classList.remove("text-on-surface-variant", "border-transparent");
        elements.tabCode.classList.add("text-on-primary-container", "bg-primary-container", "border-primary");

        // Compute Tab deaktivieren
        elements.tabCalculator.classList.remove("text-on-primary-container", "bg-primary-container", "border-primary");
        elements.tabCalculator.classList.add("text-on-surface-variant", "border-transparent");
    }
}

/**
 * Initialisiert Standard-UI-Fokus-Interaktionen für die Eingabefelder.
 */
export function initFocusInteractions() {
    const inputs = [
        elements.carKmInput,
        elements.publicKmInput,
        elements.meatDaysInput,
        elements.veganDaysInput,
        elements.electricityKwhInput
    ];

    inputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener("focus", () => {
            const container = input.closest(".border");
            if (container) {
                container.classList.add("border-primary-container", "scale-[1.01]");
            }
        });

        input.addEventListener("blur", () => {
            const container = input.closest(".border");
            if (container) {
                container.classList.remove("border-primary-container", "scale-[1.01]");
            }
        });
    });
}
