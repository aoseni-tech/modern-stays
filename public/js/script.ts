const hamburger = document.querySelector('#hamburger')! as HTMLElement;
const navBar = document.querySelector('.navbar')! as HTMLElement;
const navContent = document.querySelector('.nav-content')! as HTMLElement;
const menu = document.querySelector('.menu')! as HTMLElement;
const hamburgerLines = document.querySelectorAll('#hamburger>svg')!as NodeListOf<HTMLElement>;
const new_listing_input = document.querySelector('.listing-form__group .input')! as HTMLElement;

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