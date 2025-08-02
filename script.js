// Transpositions-Logik für HarmoniX
class TranspositionTool {
    constructor() {
        this.keys = [
            'C', 'C#', 'D', 'D#', 'E', 'F', 
            'F#', 'G', 'G#', 'A', 'A#', 'B'
        ];
        
        this.keyDisplayNames = {
            'C': 'C-Dur',
            'C#': 'C#-Dur / Db-Dur',
            'D': 'D-Dur',
            'D#': 'D#-Dur / Eb-Dur',
            'E': 'E-Dur',
            'F': 'F-Dur',
            'F#': 'F#-Dur / Gb-Dur',
            'G': 'G-Dur',
            'G#': 'G#-Dur / Ab-Dur',
            'A': 'A-Dur',
            'A#': 'A#-Dur / Bb-Dur',
            'B': 'B-Dur / H-Dur',
            'Am': 'a-Moll',
            'A#m': 'a#-Moll / bb-Moll',
            'Bm': 'h-Moll',
            'Cm': 'c-Moll',
            'C#m': 'c#-Moll / db-Moll',
            'Dm': 'd-Moll',
            'D#m': 'd#-Moll / eb-Moll',
            'Em': 'e-Moll',
            'Fm': 'f-Moll',
            'F#m': 'f#-Moll / gb-Moll',
            'Gm': 'g-Moll',
            'G#m': 'g#-Moll / ab-Moll'
        };
        
        // Transpositions-Intervalle für verschiedene Instrumente
        this.instrumentTranspositions = {
            'concert': 0,    // Konzertinstrument (C)
            'bb': 2,         // B♭-Instrument (große Sekunde höher notiert)
            'eb': 9,         // E♭-Instrument (große Sexte höher notiert)
            'f': 7,          // F-Instrument (Quinte höher notiert)
            'g': 10,         // G-Instrument (kleine Septime höher notiert)
            'a': 3           // A-Instrument (kleine Terz höher notiert)
        };
        
        this.intervalNames = {
            0: 'Unison (keine Transposition)',
            1: 'kleine Sekunde',
            2: 'große Sekunde',
            3: 'kleine Terz',
            4: 'große Terz',
            5: 'Quarte',
            6: 'Tritonus',
            7: 'Quinte',
            8: 'kleine Sexte',
            9: 'große Sexte',
            10: 'kleine Septime',
            11: 'große Septime'
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        const originalKey = document.getElementById('original-key');
        const instrument = document.getElementById('instrument');
        const targetInstrument = document.getElementById('target-instrument');
        const transposeBtn = document.getElementById('transpose-btn');
        
        // Event Listeners für Eingabevalidierung
        [originalKey, instrument, targetInstrument].forEach(element => {
            element.addEventListener('change', () => this.validateInputs());
        });
        
        // Transpositions-Button
        transposeBtn.addEventListener('click', () => this.performTransposition());
        
        // Initial validation
        this.validateInputs();
    }
    
    validateInputs() {
        const originalKey = document.getElementById('original-key').value;
        const instrument = document.getElementById('instrument').value;
        const targetInstrument = document.getElementById('target-instrument').value;
        const transposeBtn = document.getElementById('transpose-btn');
        
        const isValid = originalKey && instrument && targetInstrument;
        transposeBtn.disabled = !isValid;
        
        if (isValid) {
            transposeBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        } else {
            transposeBtn.style.background = '#cbd5e0';
        }
    }
    
    getKeyIndex(key) {
        // Behandle Moll-Tonarten
        if (key.includes('m')) {
            const baseKey = key.replace('m', '');
            return this.keys.indexOf(baseKey);
        }
        return this.keys.indexOf(key);
    }
    
    transposeKey(originalKey, semitones) {
        const isMinor = originalKey.includes('m');
        const baseKey = isMinor ? originalKey.replace('m', '') : originalKey;
        const originalIndex = this.getKeyIndex(baseKey);
        
        if (originalIndex === -1) return originalKey;
        
        // Berechne neue Tonart
        let newIndex = (originalIndex + semitones) % 12;
        if (newIndex < 0) newIndex += 12;
        
        const newKey = this.keys[newIndex];
        return isMinor ? newKey + 'm' : newKey;
    }
    
    calculateTranspositionInterval(fromInstrument, toInstrument) {
        const fromTransposition = this.instrumentTranspositions[fromInstrument];
        const toTransposition = this.instrumentTranspositions[toInstrument];
        
        // Berechne die Differenz zwischen den Instrumenten
        let interval = toTransposition - fromTransposition;
        
        // Normalisiere auf 0-11 Bereich
        while (interval < 0) interval += 12;
        while (interval >= 12) interval -= 12;
        
        return interval;
    }
    
    performTransposition() {
        const originalKey = document.getElementById('original-key').value;
        const instrument = document.getElementById('instrument').value;
        const targetInstrument = document.getElementById('target-instrument').value;
        
        if (!originalKey || !instrument || !targetInstrument) return;
        
        // Berechne Transpositions-Intervall
        const interval = this.calculateTranspositionInterval(instrument, targetInstrument);
        
        // Transponiere die Tonart
        const transposedKey = this.transposeKey(originalKey, interval);
        
        // Zeige Ergebnis an
        this.displayResult(originalKey, transposedKey, interval);
    }
    
    displayResult(originalKey, transposedKey, interval) {
        const resultSection = document.getElementById('result-section');
        const originalResult = document.getElementById('original-result');
        const transposedResult = document.getElementById('transposed-result');
        const intervalResult = document.getElementById('interval-result');
        
        // Setze Ergebnis-Werte
        originalResult.textContent = this.keyDisplayNames[originalKey] || originalKey;
        transposedResult.textContent = this.keyDisplayNames[transposedKey] || transposedKey;
        intervalResult.textContent = this.intervalNames[interval] || `${interval} Halbtöne`;
        
        // Zeige Ergebnis-Sektion mit Animation
        resultSection.classList.remove('hidden');
        
        // Scroll zum Ergebnis
        setTimeout(() => {
            resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 300);
        
        // Erfolgs-Animation für den Button
        const transposeBtn = document.getElementById('transpose-btn');
        const originalText = transposeBtn.innerHTML;
        
        transposeBtn.innerHTML = '<i class="fas fa-check"></i> Transponiert!';
        transposeBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        
        setTimeout(() => {
            transposeBtn.innerHTML = originalText;
            transposeBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 2000);
    }
}

// Initialisiere die Anwendung
document.addEventListener('DOMContentLoaded', () => {
    new TranspositionTool();
    
    // Zusätzliche UI-Verbesserungen
    addUIEnhancements();
});

function addUIEnhancements() {
    // Smooth scrolling für bessere UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const transposeBtn = document.getElementById('transpose-btn');
            if (!transposeBtn.disabled) {
                transposeBtn.click();
            }
        }
    });
    
    // Touch-friendly hover effects für mobile Geräte
    if ('ontouchstart' in window) {
        const cards = document.querySelectorAll('.info-card, .transposition-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });
    }
    
    // Preload wichtiger Ressourcen
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.as = 'style';
    document.head.appendChild(link);
}