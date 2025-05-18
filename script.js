// Sélection des éléments DOM nécessaires pour le cryptage
const inputText = document.getElementById('inputText');
const fileInput = document.getElementById('fileInput');
const cryptKey = document.getElementById('cryptKey');
const phraseCrypter = document.getElementById('phraseCrypter');
const outputText = document.getElementById('outputText');
const usedPhrase = document.getElementById('usedPhrase');
const usedKey = document.getElementById('usedKey');
const copyButton = document.getElementById('copyButton');
const charCount = document.getElementById('charCount');

// Fonction pour le chiffrement César
function caesarCipher(text, shift) {
    shift = parseInt(shift, 10);
    if (isNaN(shift)) {
        alert("Le chiffre de cryptage doit être un nombre.");
        return "";
    }
    
    // S'assurer que le décalage reste entre 0 et 25
    shift = ((shift % 26) + 26) % 26;

    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        
        // Lettres majuscules (A-Z)
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } 
        // Lettres minuscules (a-z)
        else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        } 
        // Autres caractères inchangés
        else {
            return char;
        }
    }).join('');
}

// Fonction pour le chiffrement Vigenère améliorée
function vigenereCipher(text, key) {
    if (!key || key.trim() === "") {
        alert("Veuillez entrer une phrase de cryptage valide.");
        return "";
    }

    let result = "";
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % key.length);
        
        // Méthode de chiffrement plus robuste
        const encryptedCharCode = (charCode + keyCharCode) % 256;
        result += String.fromCharCode(encryptedCharCode);
    }
    return result;
}

// Fonction pour gérer le cryptage (texte ou fichier)
function encrypt() {
    const text = inputText.value.trim();
    const file = fileInput.files[0];
    const shift = cryptKey.value.trim();
    const phrase = phraseCrypter.value.trim();
    
    // Vérifier qu'une seule méthode de cryptage est utilisée
    if (shift && phrase) {
        alert("Veuillez utiliser soit le chiffrement César (chiffre), soit Vigenère (phrase), mais pas les deux.");
        return;
    }
    
    // Vérifier qu'au moins une méthode de cryptage est sélectionnée
    if (!shift && !phrase) {
        alert("Veuillez fournir une clé de chiffrement (chiffre ou phrase).");
        return;
    }
    
    // Vérifier qu'au moins une source de texte est utilisée, mais pas les deux
    if (text && file) {
        alert("Veuillez choisir une seule source : soit entrer du texte, soit charger un fichier.");
        return;
    }
    
    if (!text && !file) {
        alert("Veuillez entrer du texte ou sélectionner un fichier à crypter.");
        return;
    }
    
    // Cryptage à partir du texte saisi
    if (text) {
        let encrypted = "";
        if (phrase) {
            encrypted = vigenereCipher(text, phrase);
            usedKey.textContent = phrase;
        } else {
            encrypted = caesarCipher(text, shift);
            usedKey.textContent = shift;
        }
        
        outputText.value = encrypted;
        usedPhrase.textContent = "Texte saisi"; // Indiquer la source
    }
    
    // Cryptage à partir du fichier
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            let encrypted = "";
            
            if (phrase) {
                encrypted = vigenereCipher(fileContent, phrase);
                usedKey.textContent = phrase;
            } else {
                encrypted = caesarCipher(fileContent, shift);
                usedKey.textContent = shift;
            }
            
            outputText.value = encrypted;
            usedPhrase.textContent = file.name; // Afficher le nom du fichier utilisé
        };
        
        reader.readAsText(file);
    }
}

// Fonction pour copier le texte crypté dans le presse-papiers
function copyToClipboard() {
    if (!outputText.value) {
        alert("Aucun texte crypté à copier.");
        return;
    }

    outputText.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    const originalText = copyButton.textContent;
    copyButton.textContent = "✓ Copié!";
    setTimeout(() => {
        copyButton.textContent = originalText;
    }, 1500);
}

// Fonction pour télécharger le texte crypté comme fichier
function downloadEncryptedFile() {
    const text = outputText.value;
    if (!text) {
        alert("Aucun texte chiffré à télécharger.");
        return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "texte_chiffre.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Ajout des écouteurs d'événements
document.querySelector('button[onclick="encryptFromInputOrFile()"]').addEventListener('click', encrypt);
document.getElementById('encryptButton').addEventListener('click', encrypt);
copyButton.addEventListener('click', copyToClipboard);
document.querySelector('button[onclick="downloadEncryptedFile()"]').addEventListener('click', downloadEncryptedFile);

// Ajouter des écouteurs pour effacer l'autre source lors de la saisie
inputText.addEventListener('input', function() {
    // Si on saisit du texte, effacer le fichier sélectionné
    if (this.value.trim() !== '') {
        fileInput.value = '';
    }
    updateCharCount();
});

fileInput.addEventListener('change', function() {
    // Si on sélectionne un fichier, effacer le texte saisi
    if (this.files.length > 0) {
        inputText.value = '';
        updateCharCount();
    }
});

// Mise à jour du compteur de caractères
function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = count;
}