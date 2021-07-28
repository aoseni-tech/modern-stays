const hamburger = document.querySelector('#hamburger')! as HTMLElement;
const navBar = document.querySelector('.navbar')! as HTMLElement;
const navContent = document.querySelector('.nav-content')! as HTMLElement;
const menu = document.querySelector('.menu')! as HTMLElement;
const hamburgerLines = document.querySelectorAll('#hamburger>svg')! as NodeListOf<HTMLElement>;
const listing_form = document.querySelector('.listing-form')! as HTMLFormElement;
const form_inputs = document.querySelectorAll('.listing-form_input')! as NodeListOf<HTMLInputElement>;
const validationFeedback = document.querySelectorAll('.validity-feedback')! as NodeListOf<HTMLInputElement>;


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
if (listing_form) {
  class Validator {
    value:string;
    pattern:RegExp;
    name:string;

    constructor(value = '', pattern:RegExp, name:string) {
  
      this.value = value;
      this.pattern = pattern;
      this.name = name;
  
    }

    get errorMessage() {
      if(this.value === '')  return `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} is required`
      else return `Please provide a valid ${this.name}`
    }

    get isValid() {
      if(this.value === '') return false
      else return this.pattern.test(this.value);
    }
  
  }
  const pattern = [
    /^[a-zA-Z0-9\s,.'-]{3,}$/,
    /^[a-zA-Z0-9\s,.'-]{3,}$/,
    /^(ftp|http|https):\/\/[^ "]+$/,
    /^(\d{1,3})?(,?\d{3})*(\.\d{2})?$/,
    /^(?!\s*$).+/,
  ];

  const inputObjectArray:Array<any> = []

  for (let i = 0; i < form_inputs.length; i++) {
    inputObjectArray.push( 
      new Validator(form_inputs[i].value,pattern[i],form_inputs[i].getAttribute('name')!)
    );
  }

  function validationCheck() {
    for (let i = 0; i < form_inputs.length; i++) {
      inputObjectArray[i].value = form_inputs[i].value
      form_inputs[i].classList.remove('invalid-input','valid-input')
      validationFeedback[i].classList.remove('invalid-feedback','valid-feedback')
      if(!inputObjectArray[i].isValid){
        form_inputs[i].classList.add('invalid-input')
        validationFeedback[i].classList.add('invalid-feedback')
        validationFeedback[i].innerHTML = inputObjectArray[i].errorMessage
      } else {
        form_inputs[i].classList.add('valid-input')
        validationFeedback[i].classList.add('valid-feedback')
        validationFeedback[i].innerHTML = `&check; Looks good`
      }
    }
  }
  for (let i = 0; i < form_inputs.length; i++) {
        form_inputs[i].addEventListener('input', function() {
          if(form_inputs[i].classList.contains('invalid-input') || form_inputs[i].classList.contains('valid-input')){
            validationCheck();
          }
        });
  }

    listing_form.addEventListener('submit', function (e) {
      validationCheck()
      for (let i = 0; i < form_inputs.length; i++) {
        if(!inputObjectArray[i].isValid)   e.preventDefault();        
      }
    });

  }

