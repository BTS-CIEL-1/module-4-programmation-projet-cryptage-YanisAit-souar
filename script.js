// Sélection des éléments DOM
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const cryptKey = document.getElementById('cryptKey');
const charCount = document.getElementById('charCount');
const encryptButton = document.getElementById('encryptButton');
const copyButton = document.getElementById('copyButton');
const keyLock = document.getElementById('keyLock');
const usedPhrase = document.getElementById('usedPhrase');
const usedKey = document.getElementById('usedKey');

// Variables de l'application
let isKeyLocked = false;

// Fonction de mise à jour du compteur de caractères
function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = count;
}

// Fonction de cryptage César 
function caesarCipher(text, shift) {
    // Conversion de la chaîne de caractères en nombre
    shift = parseInt(shift, 10);
    
    // Vérification que le décalage est un nombre
    if (isNaN(shift)) {
        alert("Le chiffre de cryptage doit être un nombre valide.");
        return "";
    }
    
    // Assurer que le décalage reste dans une plage raisonnable
    shift = shift % 26;
    
    return text.split('').map(char => {
        // Obtenir le code ASCII du caractère
        const code = char.charCodeAt(0);
        
        // Lettres majuscules (A-Z : 65-90)
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        // Lettres minuscules (a-z : 97-122)
        else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        // Caractères spéciaux et chiffres (pas de modification)
        else {
            return char;
        }
    }).join('');
}

// Fonction de cryptage du texte
function encryptText() {
    const text = inputText.value;
    const shift = cryptKey.value;
    
    // Vérifier si le texte et la clé sont valides
    if (!text) {
        alert("Veuillez entrer un texte à crypter.");
        return;
    }
    
    if (!shift || shift < 1) {
        alert("Veuillez entrer un chiffre de cryptage valide (supérieur ou égal à 1).");
        return;
    }
    
    // Crypter le texte
    const encrypted = caesarCipher(text, shift);
    outputText.value = encrypted;
    
    // Mettre à jour les informations utilisées
    usedPhrase.textContent = text;
    usedKey.textContent = shift;
}

// Fonction pour copier le texte crypté
function copyToClipboard() {
    if (!outputText.value) {
        alert("Aucun texte crypté à copier.");
        return;
    }
    
    outputText.select();
    document.execCommand('copy');
    
    // Désélectionner le texte
    window.getSelection().removeAllRanges();
    
    // Afficher une confirmation visuelle temporaire
    const originalText = copyButton.textContent;
    copyButton.textContent = "✓";
    setTimeout(() => {
        copyButton.textContent = originalText;
    }, 1500);
}

// Fonction pour verrouiller/déverrouiller la clé de cryptage
function toggleKeyLock() {
    isKeyLocked = !isKeyLocked;
    cryptKey.disabled = isKeyLocked;
    
    if (isKeyLocked) {
        keyLock.textContent = "🔒";
        keyLock.title = "Déverrouiller le chiffre";
    } else {
        keyLock.textContent = "🔓";
        keyLock.title = "Verrouiller le chiffre";
    }
}

// Ajout des écouteurs d'événements
inputText.addEventListener('input', updateCharCount);
encryptButton.addEventListener('click', encryptText);
copyButton.addEventListener('click', copyToClipboard);
keyLock.addEventListener('click', toggleKeyLock);

// Initialisation du compteur de caractères
updateCharCount();