// Fonction de déchiffrement César
function caesarDecrypt(text, shift) {
    shift = parseInt(shift, 10);
    if (isNaN(shift)) {
        alert("Le chiffre de décryptage doit être un nombre valide.");
        return "";
    }
    shift = shift % 26;
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

// Fonction de déchiffrement Vigenère ASCII
function vigenereDecrypt(text, key) {
    if (!key) {
        alert("Veuillez entrer une phrase de décryptage.");
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

// Fonction principale de déchiffrement
function decryptText() {
    const encryptedText = document.getElementById('encryptedText').value.trim();
    const caesarKey = document.getElementById('decryptKey').value.trim();
    const vigenereKey = document.getElementById('decryptPhrase').value.trim();
    const output = document.getElementById('decryptedOutput');

    if (!encryptedText) {
        alert("Veuillez entrer un texte à décrypter.");
        return;
    }

    if (caesarKey && vigenereKey) {
        alert("Utilisez uniquement une seule clé : chiffre pour César ou phrase pour Vigenère.");
        return;
    }

    let result = "";

    if (vigenereKey) {
        result = vigenereDecrypt(encryptedText, vigenereKey);
    } else if (caesarKey) {
        result = caesarDecrypt(encryptedText, caesarKey);
    } else {
        alert("Veuillez entrer une clé de décryptage.");
        return;
    }

    output.value = result;
}