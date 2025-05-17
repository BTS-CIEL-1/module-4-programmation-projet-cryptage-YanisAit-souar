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

// 👉 AJOUT : Sélection du champ phraseCrypter
const phraseCrypter = document.getElementById('phraseCrypter'); // Champ HTML à ajouter

// Variables de l'application
let isKeyLocked = false;

// Fonction de mise à jour du compteur de caractères
function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = count;
}

// Fonction de cryptage César 
function caesarCipher(text, shift) {
    shift = parseInt(shift, 10);
    if (isNaN(shift)) {
        alert("Le chiffre de cryptage doit être un nombre valide.");
        return "";
    }
    shift = shift % 26;
    
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        } else {
            return char;
        }
    }).join('');
}

// 👉 AJOUT : Fonction de chiffrement façon Vigenère ASCII
function vigenereCipher(text, key) {
    if (!key) {
        alert("Veuillez entrer une phrase de cryptage.");
        return "";
    }

    let result = "";
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % key.length);
        const encryptedCharCode = (charCode + keyCharCode) % 256;
        result += String.fromCharCode(encryptedCharCode);
    }
    return result;
}

// 🔄 MODIFIÉ : Fonction de cryptage du texte
function encryptText() {
    const text = inputText.value;
    const shift = cryptKey.value;
    const phrase = phraseCrypter ? phraseCrypter.value : "";
    let result;

    if (!text) {
        alert("Veuillez entrer un texte à crypter.");
        return;
    }

    if (phrase) {
        // 👉 Si une phrase est fournie, on utilise Vigenère
        result = vigenereCipher(text, phrase);
        cryptKey.value = ""; // On ignore le chiffre si phrase utilisée
        usedKey.textContent = phrase;
    } else {
        if (!shift || shift < 1) {
            alert("Veuillez entrer un chiffre de cryptage valide (supérieur ou égal à 1).");
            return;
        }
        result = caesarCipher(text, shift);
        usedKey.textContent = shift;
    }

    outputText.value = result;
    usedPhrase.textContent = text;
}

// Fonction pour copier le texte crypté
function copyToClipboard() {
    if (!outputText.value) {
        alert("Aucun texte crypté à copier.");
        return;
    }
    
    outputText.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    
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
