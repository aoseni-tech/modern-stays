const hamburger = document.querySelector('#hamburger')! as HTMLElement;
const navBar = document.querySelector('.navbar')! as HTMLElement;
const navContent = document.querySelector('.nav-content')! as HTMLElement;
const menu = document.querySelector('.menu')! as HTMLElement;
const hamburgerLines = document.querySelectorAll('#hamburger>svg')! as NodeListOf<HTMLElement>;
const post_form = document.querySelector('.post-form')! as HTMLFormElement;
const form_inputs = document.querySelectorAll('.form_input')! as NodeListOf<HTMLInputElement>;
const feedback = document.querySelectorAll('.validity-feedback')! as NodeListOf<HTMLElement>;
const openModal = document.querySelector('.show-reviews')! as HTMLElement;
const openModalRadio = document.querySelector('#show-radio')! as HTMLInputElement;
const closeModal = document.querySelector('.hide-reviews')! as HTMLElement;
const modalCover = document.querySelector('.modal-cover')! as HTMLElement;
const doc = document.documentElement;

// hamburger animation
hamburger.addEventListener('click', function () {
  menu.classList.toggle('menu-open');
  navContent.classList.toggle('opacity');
  hamburgerLines[0].classList.toggle('line-one');
  hamburgerLines[1].classList.toggle('line-two');
  hamburgerLines[2].classList.toggle('line-three');
  doc.classList.toggle('overflow-hide');
});

//windows events
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

doc.addEventListener('click', function (e) {
  if ((<HTMLElement>e.target).classList.contains('opacity')) {
    menu.classList.remove('menu-open');
    navContent.classList.remove('opacity');
    hamburgerLines[0].classList.remove('line-one');
    hamburgerLines[1].classList.remove('line-two');
    hamburgerLines[2].classList.remove('line-three');
    doc.classList.remove('overflow-hide');
  }
});

//form validation

function validationCheck() {
  for(let i = 0; i < form_inputs.length;i++) {
    feedback[i].classList.remove('valid-feedback');
    if(!form_inputs[i].checkValidity()) {
      if(form_inputs[i].value==='') feedback[i].innerHTML=`${form_inputs[i].name} is required`
      else feedback[i].innerHTML=`${form_inputs[i].title}`
    } else {
      feedback[i].innerHTML = '&check; Looks good'
      feedback[i].classList.add('valid-feedback');
    }
  }
}

if (post_form) {
  post_form.addEventListener('submit', function (e) {
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

  //reviews modal
  if(openModal) {
    openModal.addEventListener('click', ()=>{
      modalCover.classList.add('show');
      doc.classList.add('overflow-hide');
    })  
  }

  if(closeModal) {
    closeModal.addEventListener('click', ()=> {
      modalCover.classList.remove('show');
      doc.classList.remove('overflow-hide');
    })  
  }

  if(modalCover) {
    modalCover.addEventListener('click',  function() {
      this.classList.remove('show');
      openModalRadio.checked = false;
      doc.classList.remove('overflow-hide');
    })
  }