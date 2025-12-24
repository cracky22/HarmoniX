const VERSION = '1.0.5';

class MusicTransposer {
    constructor() {
        this.chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.keyNames = {
            'C': 'C-Dur', 'C#': 'C#-Dur / D♭-Dur', 'D': 'D-Dur', 'D#': 'D#-Dur / E♭-Dur',
            'E': 'E-Dur', 'F': 'F-Dur', 'F#': 'F#-Dur / G♭-Dur', 'G': 'G-Dur',
            'G#': 'G#-Dur / A♭-Dur', 'A': 'A-Dur', 'A#': 'A#-Dur / B♭-Dur', 'B': 'H-Dur',
            'Am': 'a-Moll', 'A#m': 'a#-Moll / b♭-Moll', 'Bm': 'h-Moll', 'Cm': 'c-Moll',
            'C#m': 'c#-Moll / d♭-Moll', 'Dm': 'd-Moll', 'D#m': 'd#-Moll / e♭-Moll',
            'Em': 'e-Moll', 'Fm': 'f-Moll', 'F#m': 'f#-Moll / g♭-Moll',
            'Gm': 'g-Moll', 'G#m': 'g#-Moll / a♭-Moll'
        };
        this.instrumentIntervals = {
            'C': 0,     // Konzertinstrument
            'Bb': 2,    // B♭-Instrument (große Sekunde höher notiert)
            'Eb': 9,    // E♭-Instrument (große Sexte höher notiert)
            'F': 7,     // F-Instrument (Quinte höher notiert)
            'G': 10     // G-Instrument (kleine Septime höher notiert)
        };
        
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
    
    getKeyIndex(key) {
        const isMinor = key.includes('m');
        const baseKey = isMinor ? key.replace('m', '') : key;
        return this.chromaticScale.indexOf(baseKey);
    }
    transposeKey(originalKey, semitones) {
        const isMinor = originalKey.includes('m');
        const baseKey = isMinor ? originalKey.replace('m', '') : originalKey;
        const originalIndex = this.getKeyIndex(baseKey);
        
        if (originalIndex === -1) return originalKey;
        
        let newIndex = (originalIndex + semitones) % 12;
        if (newIndex < 0) newIndex += 12;
        
        const newKey = this.chromaticScale[newIndex];
        return isMinor ? newKey + 'm' : newKey;
    }
    calculateInterval(fromInstrument, toInstrument) {
        const fromInterval = this.instrumentIntervals[fromInstrument];
        const toInterval = this.instrumentIntervals[toInstrument];
        let interval = toInterval - fromInterval;
        while (interval < 0) interval += 12;
        while (interval >= 12) interval -= 12;
        return interval;
    }
}

const transposer = new MusicTransposer();

function transpose() {
    const originalKey = document.getElementById('originalKey').value;
    const fromInstrument = document.getElementById('fromInstrument').value;
    const toInstrument = document.getElementById('toInstrument').value;
    if (!originalKey || !fromInstrument || !toInstrument) {
        alert('Bitte alle Felder ausfüllen!');
        return;
    }
    const interval = transposer.calculateInterval(fromInstrument, toInstrument);
    const transposedKey = transposer.transposeKey(originalKey, interval);
    setTimeout(() => {
        displayResult(originalKey, transposedKey, interval);
    }, 500);
}

function displayResult(originalKey, transposedKey, interval) {
    const resultDiv = document.getElementById('result');
    const originalResult = document.getElementById('originalResult');
    const transposedResult = document.getElementById('transposedResult');
    const intervalResult = document.getElementById('intervalResult');
    originalResult.textContent = transposer.keyNames[originalKey] || originalKey;
    transposedResult.textContent = transposer.keyNames[transposedKey] || transposedKey;
    intervalResult.textContent = transposer.intervalNames[interval] || `${interval} Halbtöne`;
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const button = document.getElementById('transposeBtn');
    const originalText = button.textContent;
    button.textContent = '✓ Transponiert!';
    button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("version").innerText = `v${VERSION}`;
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            transpose();
        }
    });
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
    validateForm();
});