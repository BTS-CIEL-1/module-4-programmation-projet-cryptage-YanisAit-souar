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

// CORRECTION POUR TOUJOURS PERMETTRE L'ÉDITION DES CLÉS
// Suppression complète des fonctions de verrouillage/déverrouillage
// Les champs seront TOUJOURS accessibles

// Déchiffrement César
function caesarDecrypt(text, shift) {
    shift = parseInt(shift, 10);
    if (isNaN(shift)) {
        alert("Le chiffre de décryptage doit être un nombre valide.");
        return "";
    }
    
    // Normaliser le décalage pour qu'il soit toujours positif
    shift = ((shift % 26) + 26) % 26;
    
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // Lettres majuscules
            return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) { // Lettres minuscules
            return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
        } else {
            return char; // Caractères non alphabétiques
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
        // Ajout de 256 pour éviter les nombres négatifs
        const decryptedCharCode = (charCode - keyCharCode + 256) % 256;
        result += String.fromCharCode(decryptedCharCode);
    }
    return result;
}

// Fonction principale de décryptage
function decryptText() {
    const textFromInput = encryptedText.value.trim();
    const caesarShift = decryptKey.value.trim();
    const vigenereKey = decryptPhrase.value.trim();
    
    // Déterminer la source du texte à décrypter (champ de texte ou fichier)
    let textToDecrypt = "";
    let sourceInfo = "";
    
    if (fileContent && fileInput.files[0]) {
        textToDecrypt = fileContent;
        sourceInfo = fileInput.files[0].name; // Nom du fichier
    } else if (textFromInput) {
        textToDecrypt = textFromInput;
        sourceInfo = textFromInput.length > 30 ? 
                     textFromInput.substring(0, 30) + "..." : 
                     textFromInput; // Affiche les 30 premiers caractères du texte
    } else {
        alert("Veuillez entrer un texte ou charger un fichier à décrypter.");
        return;
    }
    
    // Vérifier qu'une seule méthode de décryptage est utilisée
    if (caesarShift && vigenereKey) {
        alert("Veuillez utiliser une seule méthode de décryptage à la fois (chiffre ou phrase).");
        return;
    }
    
    // Vérifier qu'au moins une méthode de décryptage est spécifiée
    if (!caesarShift && !vigenereKey) {
        alert("Veuillez fournir une clé de décryptage (chiffre ou phrase).");
        return;
    }
    
    // Effectuer le décryptage approprié
    let result = "";
    if (vigenereKey) {
        result = vigenereDecrypt(textToDecrypt, vigenereKey);
        usedKey.textContent = "Phrase: " + vigenereKey;
    } else {
        result = caesarDecrypt(textToDecrypt, caesarShift);
        usedKey.textContent = "Chiffre: " + caesarShift;
    }
    
    // Afficher le résultat et mettre à jour les informations
    decryptedOutput.value = result;
    usedPhrase.textContent = sourceInfo;
}

// Fonction pour gérer le chargement d'un fichier
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Effacer le texte saisi manuellement
    encryptedText.value = "";
    updateCharCount();
    
    const reader = new FileReader();
    reader.onload = function(event) {
        fileContent = event.target.result;
        // Afficher le nom du fichier dans la section d'informations
        usedPhrase.textContent = file.name;
        
        // IMPORTANT: S'assurer que les champs sont TOUJOURS accessibles
        decryptKey.disabled = false;
        decryptPhrase.disabled = false;
        
        // Cacher les boutons de verrouillage qui causent des problèmes
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.style.display = 'none';
        });
        
        alert("Fichier chargé avec succès : " + file.name + "\nVous pouvez maintenant entrer votre clé de décryptage (chiffre ou phrase).");
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
    
    // Feedback visuel
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✓";
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 1500);
}

// Fonction pour mettre à jour le compteur de caractères
function updateCharCount() {
    const count = encryptedText.value.length;
    charCount.textContent = count;
}

// Réinitialiser le contenu du fichier quand on écrit du texte
encryptedText.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        fileInput.value = '';
        fileContent = "";
        
        // Mettre à jour la section d'informations avec le texte saisi
        const textPreview = this.value.trim();
        usedPhrase.textContent = textPreview.length > 30 ? 
                               textPreview.substring(0, 30) + "..." : 
                               textPreview;
    }
    updateCharCount();
});

// Écouteurs d'événements
window.addEventListener('DOMContentLoaded', () => {
    // Écouteur pour le chargement de fichier
    fileInput.addEventListener('change', handleFileUpload);
    
    // Écouteur pour le compteur de caractères
    encryptedText.addEventListener('input', updateCharCount);
    
    // SUPPRESSION DU SYSTÈME DE VERROUILLAGE QUI CAUSE TROP DE PROBLÈMES
    // Cacher tous les boutons de verrouillage
    document.querySelectorAll('.key-btn').forEach(btn => {
        btn.style.display = 'none';
    });
    
    // S'assurer que les champs sont TOUJOURS accessibles
    decryptKey.disabled = false;
    decryptPhrase.disabled = false;
    
    // Initialisation du compteur de caractères
    updateCharCount();
});