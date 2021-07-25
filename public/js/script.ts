const hamburger = document.querySelector('#hamburger')! as HTMLElement;
const navBar = document.querySelector('.navbar')! as HTMLElement;
const navContent = document.querySelector('.nav-content')! as HTMLElement;
const menu = document.querySelector('.menu')! as HTMLElement;
const hamburgerLines = document.querySelectorAll('#hamburger>svg')!as NodeListOf<HTMLElement>;
const new_form_inputs = document.querySelectorAll('#add-new_form input')! as NodeListOf<HTMLElement>;


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
}

  window.addEventListener('click', function (e) {
    if( (<HTMLElement>e.target).classList.contains('opacity') ) {
        menu.classList.remove('menu-open');
        navContent.classList.remove('opacity');
        hamburgerLines[0].classList.remove('line-one');
        hamburgerLines[1].classList.remove('line-two');
        hamburgerLines[2].classList.remove('line-three');
        body.classList.remove('overflow-hide');
      }
  })

  //add new-form validation 
  // class Animal {

  //   constructor(input, legs = 4, noise = 'nothing') {
  
  //     this.type = 'animal';
  //     this.name = name;
  //     this.legs = legs;
  //     this.noise = noise;
  
  //   }
  
  //   // getter
  //   get dinner() {
  //     return `${this.name} eats ${this.food || 'nothing'} for dinner.`;
  //   }
  
  // }
  // if(new_form_inputs) {

  // }