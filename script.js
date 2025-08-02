// Transpositions-Tool für Musikinstrumente
class MusicTransposer {
    constructor() {
        // Chromatische Tonleiter
        this.chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        // Anzeigenamen für Tonarten
        this.keyNames = {
            'C': 'C-Dur', 'C#': 'C#-Dur / Db-Dur', 'D': 'D-Dur', 'D#': 'D#-Dur / Eb-Dur',
            'E': 'E-Dur', 'F': 'F-Dur', 'F#': 'F#-Dur / Gb-Dur', 'G': 'G-Dur',
            'G#': 'G#-Dur / Ab-Dur', 'A': 'A-Dur', 'A#': 'A#-Dur / Bb-Dur', 'B': 'B-Dur',
            'Am': 'a-Moll', 'A#m': 'a#-Moll / bb-Moll', 'Bm': 'h-Moll', 'Cm': 'c-Moll',
            'C#m': 'c#-Moll / db-Moll', 'Dm': 'd-Moll', 'D#m': 'd#-Moll / eb-Moll',
            'Em': 'e-Moll', 'Fm': 'f-Moll', 'F#m': 'f#-Moll / gb-Moll',
            'Gm': 'g-Moll', 'G#m': 'g#-Moll / ab-Moll'
        };
        
        // Transpositions-Intervalle für Instrumente (in Halbtönen)
        this.instrumentIntervals = {
            'C': 0,     // Konzertinstrument
            'Bb': 2,    // B♭-Instrument (große Sekunde höher notiert)
            'Eb': 9,    // E♭-Instrument (große Sexte höher notiert)
            'F': 7,     // F-Instrument (Quinte höher notiert)
            'G': 10     // G-Instrument (kleine Septime höher notiert)
        };
        
        // Intervall-Namen
        this.intervalNames = {
            0: 'Unison (keine Transposition)',
            1: 'kleine Sekunde aufwärts',
            2: 'große Sekunde aufwärts',
            3: 'kleine Terz aufwärts',
            4: 'große Terz aufwärts',
            5: 'Quarte aufwärts',
            6: 'Tritonus',
            7: 'Quinte aufwärts',
            8: 'kleine Sexte aufwärts',
            9: 'große Sexte aufwärts',
            10: 'kleine Septime aufwärts',
            11: 'große Septime aufwärts'
        };
    }
    
    // Berechne Index einer Tonart in der chromatischen Tonleiter
    getKeyIndex(key) {
        const isMinor = key.includes('m');
        const baseKey = isMinor ? key.replace('m', '') : key;
        return this.chromaticScale.indexOf(baseKey);
    }
    
    // Transponiere eine Tonart um eine bestimmte Anzahl von Halbtönen
    transposeKey(originalKey, semitones) {
        const isMinor = originalKey.includes('m');
        const baseKey = isMinor ? originalKey.replace('m', '') : originalKey;
        const originalIndex = this.getKeyIndex(baseKey);
        
        if (originalIndex === -1) return originalKey;
        
        // Berechne neue Tonart
        let newIndex = (originalIndex + semitones) % 12;
        if (newIndex < 0) newIndex += 12;
        
        const newKey = this.chromaticScale[newIndex];
        return isMinor ? newKey + 'm' : newKey;
    }
    
    // Berechne Transpositions-Intervall zwischen zwei Instrumenten
    calculateInterval(fromInstrument, toInstrument) {
        const fromInterval = this.instrumentIntervals[fromInstrument];
        const toInterval = this.instrumentIntervals[toInstrument];
        
        let interval = toInterval - fromInterval;
        
        // Normalisiere auf 0-11 Bereich
        while (interval < 0) interval += 12;
        while (interval >= 12) interval -= 12;
        
        return interval;
    }
}

// Globale Instanz des Transposers
const transposer = new MusicTransposer();

// Hauptfunktion für Transposition
function transpose() {
    const originalKey = document.getElementById('originalKey').value;
    const fromInstrument = document.getElementById('fromInstrument').value;
    const toInstrument = document.getElementById('toInstrument').value;
    
    // Validierung
    if (!originalKey || !fromInstrument || !toInstrument) {
        alert('Bitte alle Felder ausfüllen!');
        return;
    }
    
    // Berechne Transposition
    const interval = transposer.calculateInterval(fromInstrument, toInstrument);
    const transposedKey = transposer.transposeKey(originalKey, interval);
    
    // Zeige Ergebnis
    displayResult(originalKey, transposedKey, interval);
}

// Zeige Transpositions-Ergebnis an
function displayResult(originalKey, transposedKey, interval) {
    const resultDiv = document.getElementById('result');
    const originalResult = document.getElementById('originalResult');
    const transposedResult = document.getElementById('transposedResult');
    const intervalResult = document.getElementById('intervalResult');
    
    // Setze Ergebnis-Texte
    originalResult.textContent = transposer.keyNames[originalKey] || originalKey;
    transposedResult.textContent = transposer.keyNames[transposedKey] || transposedKey;
    intervalResult.textContent = transposer.intervalNames[interval] || `${interval} Halbtöne`;
    
    // Zeige Ergebnis-Bereich
    resultDiv.classList.remove('hidden');
    
    // Scroll zum Ergebnis
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Button-Feedback
    const button = document.getElementById('transposeBtn');
    const originalText = button.textContent;
    
    button.textContent = '✓ Transponiert!';
    button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
}

// Event Listeners für bessere UX
document.addEventListener('DOMContentLoaded', function() {
    // Enter-Taste für Transposition
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            transpose();
        }
    });
    
    // Automatische Validierung
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', validateForm);
    });
    
    function validateForm() {
        const originalKey = document.getElementById('originalKey').value;
        const fromInstrument = document.getElementById('fromInstrument').value;
        const toInstrument = document.getElementById('toInstrument').value;
        const button = document.getElementById('transposeBtn');
        
        button.disabled = !(originalKey && fromInstrument && toInstrument);
    }
    
    // Initial validation
    validateForm();
});