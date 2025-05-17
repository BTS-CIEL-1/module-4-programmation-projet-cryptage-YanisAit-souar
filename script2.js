let fileContent = ""; // Contenu du fichier texte

// Déchiffrement César
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

// Déchiffrement Vigenère ASCII
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

// Déchiffrement principal
function decryptText() {
    const typedText = document.getElementById('encryptedText').value.trim();
    const caesarKey = document.getElementById('decryptKey').value.trim();
    const vigenereKey = document.getElementById('decryptPhrase').value.trim();
    const output = document.getElementById('decryptedOutput');

    const textToDecrypt = fileContent ? fileContent.trim() : typedText;

    if (!textToDecrypt) {
        alert("Veuillez entrer un texte ou charger un fichier à décrypter.");
        return;
    }

    if (caesarKey && vigenereKey) {
        alert("Veuillez utiliser une seule méthode de décryptage à la fois.");
        return;
    }

    let result = "";

    if (vigenereKey) {
        result = vigenereDecrypt(textToDecrypt, vigenereKey);
    } else if (caesarKey) {
        result = caesarDecrypt(textToDecrypt, caesarKey);
    } else {
        alert("Veuillez fournir une clé de décryptage.");
        return;
    }

    output.value = result;
}
// la partie fichier deposer decrypter //
// Chargement du fichier
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;


    const reader = new FileReader();
    reader.onload = function (event) {
        fileContent = event.target.result;
        alert("Fichier chargé avec succès !");
    };
    reader.readAsText(file);
}


// Copier le texte déchiffré
function copyDecryptedText() {
    const output = document.getElementById('decryptedOutput');
    if (!output.value) {
        alert("Aucun texte à copier.");
        return;
    }
    output.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert("Texte copié dans le presse-papiers.");
}


// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
});
