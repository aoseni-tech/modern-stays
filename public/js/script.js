"use strict";
const hamburger = document.querySelector('#hamburger');
const navBar = document.querySelector('.navbar');
const navContent = document.querySelector('.nav-content');
const menu = document.querySelector('.menu');
const hamburgerLines = document.querySelectorAll('#hamburger>svg');
const new_listing_input = document.querySelector('.listing-form__group .input');
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
    if (e.target.classList.contains('opacity')) {
        menu.classList.remove('menu-open');
        navContent.classList.remove('opacity');
        hamburgerLines[0].classList.remove('line-one');
        hamburgerLines[1].classList.remove('line-two');
        hamburgerLines[2].classList.remove('line-three');
        body.classList.remove('overflow-hide');
    }
});
