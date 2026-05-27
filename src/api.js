/**
 * @file api.js
 * @description Kapselt asynchrone Schnittstellen und Fetch-Zugriffe der Anwendung.
 * Integriert asynchrones Laden von Quellcode-Modulen zur sicheren Anzeige.
 */

/**
 * Holt den Quellcode der store.js Datei asynchron via HTTP-Fetch, 
 * um ihn nativ im Source-Tab des Dashboards darzustellen.
 * 
 * @returns {Promise<string>} Der Quelltext von store.js
 */
export async function fetchStoreCode() {
    try {
        // Verwende relativen Pfad zur Unterstützung verschiedener Deployment-Kontexte
        const response = await fetch("./src/store.js");
        if (!response.ok) {
            throw new Error(`HTTP-Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Fehler beim Laden des Store-Quellcodes:", error);
        return `/**
 * FEHLER: Der Quellcode von store.js konnte nicht dynamisch geladen werden.
 * Dies tritt auf, wenn die Anwendung direkt per file:// Protokoll geöffnet wird.
 * Bitte nutzen Sie einen lokalen Webserver (z. B. python -m http.server 8080).
 */`;
    }
}
