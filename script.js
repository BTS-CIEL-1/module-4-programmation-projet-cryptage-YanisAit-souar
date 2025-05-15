const btn = document.getElementById('menu-btn');
const overlay = document.getElementById('overlay');
const menu = document.getElementById('mobile-menu');
const counters = document.querySelectorAll('.counter');
let scrollStarted = false;

btn.addEventListener('click', navToggle);
document.addEventListener('scroll', scrollPage);

function navToggle() {
  btn.classList.toggle('open');
  overlay.classList.toggle('overlay-show');
  document.body.classList.toggle('stop-scrolling');
  menu.classList.toggle('show-menu');
}

function scrollPage() {
  const scrollPos = window.scrollY;

  if (scrollPos > 100 && !scrollStarted) {
    countUp();
    scrollStarted = true;
  } else if (scrollPos < 100 && scrollStarted) {
    reset();
    scrollStarted = false;
  }
}

function countUp() {
  counters.forEach((counter) => {
    counter.innerText = '0';

    const updateCounter = () => {
      // Get count target
      const target = +counter.getAttribute('data-target');
      // Get current counter value
      const c = +counter.innerText;

      // Create an increment
      const increment = target / 100;

      // If counter is less than target, add increment
      if (c < target) {
        // Round up and set counter value
        counter.innerText = `${Math.ceil(c + increment)}`;

        setTimeout(updateCounter, 75);
      } else {
        counter.innerText = target;
      }
    };

    updateCounter();
  });
}

function reset() {
  counters.forEach((counter) => (counter.innerHTML = '0'));
}



  

 const btn_rentrer = document.querySelector('.send-btn')

// solution de cryptage
        function crypter() {
            const phrase = document.getElementById('phrase').value;
            const decalage = parseInt(document.getElementById('decalage').value);
            
            const resultat = transformerTexte(phrase, decalage);
            document.getElementById('resultat').textContent = resultat;
        }
                
        function decrypter() {
            const phrase = document.getElementById('phrase').value;
            const decalage = parseInt(document.getElementById('decalage').value);
            
            const resultat = transformerTexte(phrase, -decalage);
            document.getElementById('resultat').textContent = resultat;
        }
        
        function transformerTexte(texte, decalage) {
            let resultat = '';
            
            for (let i = 0; i < texte.length; i++) {
                // Récupérer le code ASCII du caractère
                const codeAscii = texte.charCodeAt(i);
                
                // Appliquer le décalage
                let nouveauCode = codeAscii + decalage;
                
                // Convertir le nouveau code en caractère et l'ajouter au résultat
                resultat += String.fromCharCode(nouveauCode);
            }
            
            return resultat;
        }