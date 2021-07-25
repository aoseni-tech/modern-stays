"use strict";
const hamburger = document.querySelector('#hamburger');
const navBar = document.querySelector('.navbar');
const navContent = document.querySelector('.nav-content');
const menu = document.querySelector('.menu');
const hamburgerLines = document.querySelectorAll('#hamburger>svg');
const new_form_inputs = document.querySelectorAll('#add-new_form input');
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
    if (e.target.classList.contains('opacity')) {
        menu.classList.remove('menu-open');
        navContent.classList.remove('opacity');
        hamburgerLines[0].classList.remove('line-one');
        hamburgerLines[1].classList.remove('line-two');
        hamburgerLines[2].classList.remove('line-three');
        body.classList.remove('overflow-hide');
    }
});
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
