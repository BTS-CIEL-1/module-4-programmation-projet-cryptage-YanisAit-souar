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
const phraseCrypter = document.getElementById('phraseCrypter'); 

// partie fichier a crypter//
const textArea = document.getElementById('inputText');
const fileInput = document.getElementById('fileInput');
const shift = document.getElementById('cryptKey').value;
const phrase = document.getElementById('phraseCrypter').value;
const output = document.getElementById('outputText');

let isKeyLocked = false;

function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = count;
}

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

function encryptText() {
    const text = inputText.value.trim();
    const shift = cryptKey.value.trim();
    const phrase = phraseCrypter ? phraseCrypter.value.trim() : "";
    let result;

    if (!text) {
        alert("Veuillez entrer un texte à crypter.");
        return;
    }

    // ❌ Empêcher l'utilisation des deux clés en même temps
    if (shift && phrase) {
        alert("Veuillez utiliser uniquement une seule clé de cryptage : soit un chiffre, soit une phrase, mais pas les deux.🙂");
        return;
    }

    if (phrase) {
        result = vigenereCipher(text, phrase);
        usedKey.textContent = phrase;
    } else if (shift) {
        result = caesarCipher(text, shift);
        usedKey.textContent = shift;
    } else {
        alert("Veuillez entrer une clé de cryptage (chiffre ou phrase).");
        return;
    }

    outputText.value = result;
    usedPhrase.textContent = text;
}

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

inputText.addEventListener('input', updateCharCount);
encryptButton.addEventListener('click', encryptText);
copyButton.addEventListener('click', copyToClipboard);
keyLock.addEventListener('click', toggleKeyLock);

updateCharCount();



                                                               //partie pour deposer un fichier .txt//
function caesarCipher(text, shift) {
    shift = parseInt(shift, 10);
    if (isNaN(shift)) {
        alert("Le chiffre de cryptage doit être un nombre.");
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

function vigenereCipher(text, key) {
    if (!key) {
        alert("Veuillez entrer une phrase de cryptage.");
        return "";
    }

    let result = "";
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % key.length);
        result += String.fromCharCode((charCode + keyCharCode) % 256);
    }
    return result;
}

function encryptFromInputOrFile() {
    // Ne pas autoriser les deux méthodes de chiffrement à la fois
    if (shift && phrase) {
        alert("Veuillez utiliser soit le chiffrement César soit Vigenère, pas les deux.");
        return;
    }

    // Vérifie source de texte : manuel ou fichier
    const manualText = textArea.value.trim();
    const file = fileInput.files[0];

    if (!manualText && !file) {
        alert("Veuillez entrer un texte ou charger un fichier.");
        return;
    }

    // Si manuel : utiliser directement
    if (manualText) {
        let encrypted = "";
        if (phrase) {
            encrypted = vigenereCipher(manualText, phrase);
        } else if (shift) {
            encrypted = caesarCipher(manualText, shift);
        } else {
            alert("Veuillez fournir une clé de chiffrement.");
            return;
        }
        output.value = encrypted;
    }

    // Si fichier : lire puis chiffrer
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target.result;
            let encrypted = "";

            if (phrase) {
                encrypted = vigenereCipher(fileContent, phrase);
            } else if (shift) {
                encrypted = caesarCipher(fileContent, shift);
            } else {
                alert("Veuillez fournir une clé de chiffrement.");
                return;
            }

            output.value = encrypted;
        };
        reader.readAsText(file);
    }
}

function downloadEncryptedFile() {
    const text = document.getElementById('outputText').value;
    if (!text) {
        alert("Aucun texte chiffré à télécharger.");
        return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "texte_chiffre.txt";
    a.click();
    URL.revokeObjectURL(url);
}
