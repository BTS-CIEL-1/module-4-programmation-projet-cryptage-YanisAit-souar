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

function verifierFormulaire(){
  
 

  const email_rentrer = document.querySelector('input[name="email"]')
  const mdp_entrer = document.querySelector('input[name="password"]')
  const nom_rentrer = document.querySelector('input[name="name"]')
  const Fn_rentrer = document.querySelector('input[name="prénom"]')
  const mes_rentrer = document.querySelector('textarea[name="message"]');
  const checkbox = document.querySelector('#formCheck-1'); 
  const checkboxLabel = document.querySelector('label[for="formCheck-1"]');

  if (email_rentrer.value.length < 6){
    email_rentrer.classList.add("is-invalid")
    email_rentrer.classList.remove("is-valid")
  }else{
    const regleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (regleEmail.test(email_rentrer.value)) {
            email_rentrer.classList.add("is-valid");
            email_rentrer.classList.remove("is-invalid");
        } else {
            email_rentrer.classList.add("is-invalid");
            email_rentrer.classList.remove("is-valid");
        }
  }

  if (mdp_entrer.value.length < 8){
    mdp_entrer.classList.add("is-invalid")
    mdp_entrer.classList.remove("is-valid")
    mdp_entrer.nextElementSibling.classList.add("visible")
    mdp_entrer.nextElementSibling.classList.remove("invisible")
  }else{
    mdp_entrer.classList.add("is-valid")
    mdp_entrer.classList.remove("is-invalid")
    mdp_entrer.nextElementSibling.classList.add("invisible")
    mdp_entrer.nextElementSibling.classList.remove("visible")
  }

  if (Fn_rentrer.value.length < 1){
    Fn_rentrer.classList.add("is-invalid")
    Fn_rentrer.classList.remove("is-valid")
  }else{
    Fn_rentrer.classList.add("is-valid")
    Fn_rentrer.classList.remove("is-invalid")
  }

  if (nom_rentrer.value.length < 2){
    nom_rentrer.classList.add("is-invalid")
    nom_rentrer.classList.remove("is-valid")
  }else{
    nom_rentrer.classList.add("is-valid")
    nom_rentrer.classList.remove("is-invalid")
  }

  if (mes_rentrer.value.length < 1){
    mes_rentrer.classList.add("is-invalid")
    mes_rentrer.classList.remove("is-valid")
  }else{
    mes_rentrer.classList.add("is-valid")
    mes_rentrer.classList.remove("is-invalid")
  }

  if (!checkbox.checked) {
    checkbox.classList.add("is-invalid-checkbox");
    checkboxLabel.classList.add("is-invalid-checkbox-text"); 
  } else {
    checkbox.classList.remove("is-invalid-checkbox");
    checkboxLabel.classList.remove("is-invalid-checkbox-text"); 
  }
}
