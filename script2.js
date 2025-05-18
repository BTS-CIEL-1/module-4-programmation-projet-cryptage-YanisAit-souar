// Version ultra simplifiée pour résoudre définitivement le problème
// Tous les systèmes de verrouillage sont supprimés
// Le HTML sera manipulé directement pour contourner les problèmes

// Sélection des éléments DOM
const encryptedText = document.getElementById('encryptedText');
const fileInput = document.getElementById('fileInput');
const decryptKey = document.getElementById('decryptKey');
const decryptPhrase = document.getElementById('decryptPhrase');
const decryptedOutput = document.getElementById('decryptedOutput');
const usedPhrase = document.getElementById('usedPhrase');
const usedKey = document.getElementById('usedKey');
const charCount = document.getElementById('charCount');

// Variable pour stocker le contenu du fichier
let fileContent = "";

// Déchiffrement César
function caesarDecrypt(text, shift) {
    shift = parseInt(shift, 10);
    if (isNaN(shift)) {
        alert("Le chiffre de décryptage doit être un nombre valide.");
        return "";
    }
    
    shift = ((shift % 26) + 26) % 26;
    
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
        } else {
            return char;
        }
    }).join('');
}

// Déchiffrement Vigenère ASCII
function vigenereDecrypt(text, key) {
    if (!key || key.trim() === "") {
        alert("Veuillez entrer une phrase de décryptage valide.");
        return "";
    }
    
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % key.length);
        const decryptedCharCode = (charCode - keyCharCode + 256) % 256;
        result += String.fromCharCode(decryptedCharCode);
    }
    return result;
}

// Fonction principale de décryptage
function decryptText() {
    // S'assurer que les champs sont actifs
    decryptKey.disabled = false;
    decryptPhrase.disabled = false;
    
    const textFromInput = encryptedText.value.trim();
    const caesarShift = decryptKey.value.trim();
    const vigenereKey = decryptPhrase.value.trim();
    
    // Déterminer la source du texte
    let textToDecrypt = "";
    let sourceInfo = "";
    
    if (fileContent && fileInput.files[0]) {
        textToDecrypt = fileContent;
        sourceInfo = fileInput.files[0].name;
    } else if (textFromInput) {
        textToDecrypt = textFromInput;
        sourceInfo = textFromInput.length > 30 ? 
                     textFromInput.substring(0, 30) + "..." : 
                     textFromInput;
    } else {
        alert("Veuillez entrer un texte ou charger un fichier à décrypter.");
        return;
    }
    
    // Vérifier les clés
    if (caesarShift && vigenereKey) {
        alert("Veuillez utiliser une seule méthode de décryptage à la fois (chiffre ou phrase).");
        return;
    }
    
    if (!caesarShift && !vigenereKey) {
        alert("Veuillez fournir une clé de décryptage (chiffre ou phrase).");
        return;
    }
    
    // Effectuer le décryptage
    let result = "";
    if (vigenereKey) {
        result = vigenereDecrypt(textToDecrypt, vigenereKey);
        usedKey.textContent = "Phrase: " + vigenereKey;
    } else {
        result = caesarDecrypt(textToDecrypt, caesarShift);
        usedKey.textContent = "Chiffre: " + caesarShift;
    }
    
    // Afficher le résultat
    decryptedOutput.value = result;
    usedPhrase.textContent = sourceInfo;
}

// Fonction pour gérer le chargement d'un fichier
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    encryptedText.value = "";
    updateCharCount();
    
    const reader = new FileReader();
    reader.onload = function(event) {
        fileContent = event.target.result;
        usedPhrase.textContent = file.name;
        
        // Réinitialiser les champs de clé (important)
        decryptKey.disabled = false;
        decryptPhrase.disabled = false;
        
        // Suppression de tous les boutons de verrouillage
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.remove(); // On les supprime complètement du DOM
        });
        
        // Création de nouveaux inputs pour remplacer ceux qui posent problème
        const newDecryptKey = document.createElement('input');
        newDecryptKey.type = 'number';
        newDecryptKey.id = 'decryptKey';
        newDecryptKey.min = '1';
        newDecryptKey.value = decryptKey.value || '2';
        
        const newDecryptPhrase = document.createElement('input');
        newDecryptPhrase.type = 'text';
        newDecryptPhrase.id = 'decryptPhrase';
        newDecryptPhrase.placeholder = 'Entrez une phrase de décryptage';
        newDecryptPhrase.value = decryptPhrase.value || '';
        
        // Remplacer les anciens inputs
        decryptKey.parentNode.replaceChild(newDecryptKey, decryptKey);
        decryptPhrase.parentNode.replaceChild(newDecryptPhrase, decryptPhrase);
        
        // Mettre à jour les références
        window.decryptKey = newDecryptKey;
        window.decryptPhrase = newDecryptPhrase;
        
        alert("Fichier chargé: " + file.name + "\nVous pouvez maintenant entrer votre clé de décryptage.");
    };
    reader.onerror = function() {
        alert("Erreur lors de la lecture du fichier.");
        fileInput.value = "";
        fileContent = "";
        usedPhrase.textContent = "";
    };
    reader.readAsText(file);
}

// Fonction pour copier le texte décrypté
function copyDecryptedText() {
    if (!decryptedOutput.value) {
        alert("Aucun texte décrypté à copier.");
        return;
    }
    
    decryptedOutput.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    
    const copyBtn = document.querySelector('.copy-btn');
    copyBtn.textContent = "✓";
    setTimeout(() => {
        copyBtn.textContent = "📋";
    }, 1500);
}

// Mise à jour du compteur de caractères
function updateCharCount() {
    charCount.textContent = encryptedText.value.length;
}

// Événement pour réinitialiser le fichier quand on change le texte
encryptedText.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        fileInput.value = '';
        fileContent = "";
        
        const textPreview = this.value.trim();
        usedPhrase.textContent = textPreview.length > 30 ? 
                               textPreview.substring(0, 30) + "..." : 
                               textPreview;
    }
    updateCharCount();
});

// Fonction d'initialisation exécutée au chargement de la page
window.onload = function() {
    // Supprimer tous les boutons de verrouillage existants
    document.querySelectorAll('.key-btn').forEach(btn => {
        btn.remove();
    });
    
    // S'assurer que les champs sont toujours actifs
    decryptKey.disabled = false;
    decryptPhrase.disabled = false;
    
    // Écouteur pour le chargement de fichier
    fileInput.addEventListener('change', handleFileUpload);
    
    // Écouteur pour le compteur de caractères
    encryptedText.addEventListener('input', updateCharCount);
    
    // Réinitialiser le compteur
    updateCharCount();
    
    // Exposer decryptText globalement pour l'appel onclick depuis HTML
    window.decryptText = decryptText;
    window.copyDecryptedText = copyDecryptedText;
};