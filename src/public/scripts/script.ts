const hamburger = document.querySelector('#hamburger')! as HTMLElement;
const navBar = document.querySelector('.navbar')! as HTMLElement;
const navContent = document.querySelector('.nav-content')! as HTMLElement;
const menu = document.querySelector('.menu')! as HTMLElement;
const hamburgerLines = document.querySelectorAll('#hamburger>svg')! as NodeListOf<HTMLElement>;
const listing_form = document.querySelector('.listing-form')! as HTMLFormElement;
const form_inputs = document.querySelectorAll('.listing-form_input')! as NodeListOf<HTMLInputElement>;
const feedback = document.querySelectorAll('.validity-feedback')! as NodeListOf<HTMLElement>;

// hamburger animation
hamburger.addEventListener('click', function () {
  menu.classList.toggle('menu-open');
  navContent.classList.toggle('opacity');
  hamburgerLines[0].classList.toggle('line-one');
  hamburgerLines[1].classList.toggle('line-two');
  hamburgerLines[2].classList.toggle('line-three');
  body.classList.toggle('overflow-hide');
});

//windows events
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener('click', function (e) {
  if ((<HTMLElement>e.target).classList.contains('opacity')) {
    menu.classList.remove('menu-open');
    navContent.classList.remove('opacity');
    hamburgerLines[0].classList.remove('line-one');
    hamburgerLines[1].classList.remove('line-two');
    hamburgerLines[2].classList.remove('line-three');
    body.classList.remove('overflow-hide');
  }
});

//add new-form validation

function validationCheck() {
  for(let i = 0; i < form_inputs.length;i++) {
    feedback[i].classList.remove('valid-feedback','invalid-feedback');
    if(!form_inputs[i].checkValidity()) {
      if(form_inputs[i].value==='') feedback[i].innerHTML = `${form_inputs[i].name} is required`
      else feedback[i].innerHTML=`${form_inputs[i].title}`
      feedback[i].classList.add('invalid-feedback');
    } else {
      feedback[i].innerHTML = '&check; Looks good'
      feedback[i].classList.add('valid-feedback');
    }
  }
}

if (listing_form) {

  listing_form.addEventListener('submit', function (e) {
    if (!this.checkValidity()) {
      e.preventDefault()
      e.stopPropagation()
      this.classList.add('form-validated')
      validationCheck();
      for(let i = 0; i < form_inputs.length;i++) {   
        form_inputs[i].addEventListener('input',validationCheck)
      }
    }
  });
  }

