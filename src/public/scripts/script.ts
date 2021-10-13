const hamburger = document.querySelector('#hamburger')! as HTMLElement;
const navBar = document.querySelector('.navbar')! as HTMLElement;
const stay_search_form = document.querySelector('.stays .search-form_section')! as HTMLElement;
const navContent = document.querySelector('.nav-content')! as HTMLElement;
const menu = document.querySelector('.menu')! as HTMLElement;
const hamburgerLines = document.querySelectorAll('#hamburger>svg')! as NodeListOf<HTMLElement>;
const post_form = document.querySelector('.post-form')! as HTMLFormElement;
const book_form = document.querySelector('.book-form')! as HTMLFormElement;
const form_inputs = document.querySelectorAll('.form_input')! as NodeListOf<HTMLInputElement>;
const feedback = document.querySelectorAll('.post-form .validity-feedback')! as NodeListOf<HTMLElement>;
const errorMessage = document.querySelector('.error')! as HTMLElement;
const openModal = document.querySelector('.show-reviews')! as HTMLElement;
const openModalRadio = document.querySelector('#show-radio')! as HTMLInputElement;
const closeModal = document.querySelector('.hide-reviews')! as HTMLElement;
const modalCover = document.querySelector('.modal-cover')! as HTMLElement;
const searchPage = document.querySelector('.search-page')! as HTMLElement;
const filter_container = document.querySelector('.search-page .filters')! as HTMLElement;
const doc = document.documentElement;



  // setting top for form section on stays pages 
  function set_stayTop() { 

      if(filter_container) {

      const filter_styles = window.getComputedStyle(filter_container);
      let filter_height = filter_container.clientHeight - parseFloat(filter_styles.paddingTop) - parseFloat(filter_styles.paddingBottom);

      if(window.innerWidth > 950) {
      let stayTop = navBar.clientHeight;
      let searchPage_top = navBar.clientHeight + searchForm.clientHeight + filter_height;
      if(stay_search_form) {
        searchPage.style.paddingTop = `${searchPage_top}px`
        stay_search_form.style.top = `${stayTop}px`
      }
    } else {
        if(stay_search_form) {
          searchPage.style.paddingTop = ``
          stay_search_form.style.top = ``
        }
      }

    }

  }

  window.addEventListener('resize',set_stayTop)
  window.addEventListener('load',set_stayTop)




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

  if(openModal && openModalRadio.checked) {
    this.classList.add('overflow-hide')
  } else {this.classList.remove('overflow-hide')}
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

if (post_form || book_form) {
  [post_form,book_form].forEach((form:HTMLFormElement) => {
    form?.addEventListener('submit', function (e) {
      if(errorMessage) errorMessage.remove()
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
  })
  }

  //reviews modal
  if(modalCover) {
    modalCover.addEventListener('click',  function() {
      openModalRadio.checked = false;
    })
  }

  //filter radio logics
const sort_radios = document.querySelectorAll('.sort-by input[type=radio]')! as NodeListOf<HTMLInputElement>;
const sort_options = document.querySelectorAll('.sort-by label')! as NodeListOf<HTMLInputElement>;
const sort_menu = document.querySelector('.sort-by ul')! as HTMLElement;
const sort_input = document.querySelector('.sort-by input[type=hidden]')! as HTMLInputElement;
const sort_input_text = document.querySelector('.sort-by input[type=text]')! as HTMLInputElement;

const filter_radios = document.querySelectorAll('.filter input[type=radio]')! as NodeListOf<HTMLInputElement>;
const filter_options = document.querySelectorAll('.filter label')! as NodeListOf<HTMLInputElement>;
const filter_menu = document.querySelector('.filter ul')! as HTMLElement;
const filter_input = document.querySelector('.filter input[type=hidden]')! as HTMLInputElement;
const filter_input_text = document.querySelector('.filter input[type=text]')! as HTMLInputElement;

const filtersInput = document.querySelectorAll('.filters input[type=hidden]')! as NodeListOf<HTMLInputElement>;

function dropDrown(options:NodeListOf<HTMLInputElement>,readInput:HTMLInputElement,menu:HTMLElement,radios:NodeListOf<HTMLInputElement>,textInput:HTMLInputElement){
  if(options) {

    for(let i =0; i < options.length;i++) {
      options[i].addEventListener('click',()=>{
        menu.classList.remove('show-options');
        readInput.value = radios[i].value;
        filtersInput.forEach(filterinput=>{
          filterinput.setAttribute('form','search-form');
        })
        searchForm.submit()
      })

    }   

  }

  if(textInput) {
    textInput.addEventListener('click',()=>{
      menu.classList.toggle('show-options');
    }) 

    textInput.addEventListener('focus',()=>{   
      dropDrownAccessibility();
    })
    
    window.addEventListener('click',(e)=>{
      if(!textInput.contains(e.target as HTMLElement) &&
         !menu.contains(e.target as HTMLElement)) {
        menu.classList.remove('show-options')
      }
    })

  }

  function dropDrownAccessibility() { 
    textInput.addEventListener('keydown', function (e) { 
    switch (e.code) {
    case 'ArrowUp':
    e.preventDefault()
    menu.classList.add('show-options');
    radios[radios.length - 1].focus()
    radios[radios.length - 1].checked = true;
    break;
    case 'ArrowDown':
    e.preventDefault()
    menu.classList.add('show-options');
    radios[0].focus()
    radios[0].checked = true;
    break;
    }                 
    
   })
  }

}


//call dropdown function
dropDrown(sort_options,sort_input,sort_menu,sort_radios,sort_input_text);
dropDrown(filter_options,filter_input,filter_menu,filter_radios,filter_input_text);

const flashMessage = document.querySelector('.message')!as HTMLElement;

if(flashMessage) {
  setTimeout(()=>{
   flashMessage.remove()
  }, 5000)
}

let actDeleteForm = document.querySelector('#actDelete-form')! as HTMLFormElement; 
let actDeleteBtn = document.querySelector('#actDelete-btn')! as HTMLButtonElement; 
let profileCard = document.querySelector('.profile-card')! as HTMLElement; 
let noActionBtn : HTMLElement;
let actionBtn : HTMLElement;
let confirmModal: HTMLElement; 
let deleteAct = false;
let isModal = false;
if(actDeleteForm) {
  actDeleteForm.addEventListener('submit',function(e){
    if(!isModal) {
      e.preventDefault();
      actDeleteBtn.disabled = true
      let modal = document.createElement('DIV');
      modal.classList.add('confirm-action');
      modal.setAttribute('role','alert')
      modal.innerHTML = ` 
            <small style="font-size: .75em; font-style: italic; color: #fd705d;" role="doc-notice">&ast;Accounts can not be recovered after they have been deleted,your added stays,reviews and bookings will be gone.
            </small>
            <p style="font-size: 1.5em;" role="alertdialog">Are you sure you want to delete your account?</p>
            <button class="delete-button" id="actDelete-btn" form="actDelete-form">Yes</button>
            <a class="no-btn" role="button">No</a>   
       `
      profileCard.appendChild(modal);
      isModal=true;
      noActionBtn = document.querySelector('.no-btn')! as HTMLElement; 
      confirmModal = document.querySelector('.confirm-action')! as HTMLElement;
      if(isModal) {
        noActionBtn.addEventListener('click',()=>{
          isModal = false;
          actDeleteBtn.disabled = false;
          confirmModal.remove();
        })
      } 
    }

  })
}


// STAR RATINGS   
let stars = document.querySelectorAll('.rating_stars')! as NodeListOf<HTMLSpanElement>;

if(stars) {
  stars.forEach((star:HTMLSpanElement)=>{
    let rating;
    if(star.dataset.rating && typeof parseFloat(star.dataset.rating) === 'number') {
      rating = parseFloat(star.dataset.rating)
    } else {rating = 0}

    let goldStar = (rating/5) * 100;
    
    star.style.background = `linear-gradient(90deg, #f5bd23 ${goldStar}%, #afb8c1 ${goldStar}%)`
    star.style.backgroundClip = `inherit`
  })
}

// STAR FORM SLIDER   
let starSlider = document.querySelector('#star-range')! as HTMLElement;
let sliderRating = document.querySelector('#rating')!as HTMLInputElement;

if(starSlider) {
  starSlider.style.backgroundClip = `inherit`
  starSlider.addEventListener('mousemove', function(e){
    let sliderWidth = this.clientWidth;
    let rating = (e.offsetX/sliderWidth) * 100;
    this.style.background = `linear-gradient(90deg, #f5bd23 ${rating}%, #afb8c1 ${rating}%)`
    this.style.backgroundClip = `inherit`
  })

  starSlider.addEventListener('mouseleave', function(e){
    let sliderWidth = this.clientWidth;
    let rating = (e.offsetX/sliderWidth) * 100;
    if(!sliderRating.value || parseFloat(sliderRating.value) < 1){
      this.style.background = ``
      this.style.backgroundClip = `inherit`
    }else {
      let rated = (parseFloat(sliderRating.value)/5) * 100;
      this.style.background = `linear-gradient(90deg, #f5bd23 ${rated}%, #afb8c1 ${rated}%)`
      this.style.backgroundClip = `inherit`
    }
  })

  starSlider.addEventListener('click', function(e){
    let sliderWidth = this.clientWidth;
    let rating = (e.offsetX/sliderWidth) * 100;
    sliderRating.value = `${((rating/100) * 5).toFixed(1)}`;
    if(sliderRating.value && parseFloat(sliderRating.value) > 1){
      this.style.background = `linear-gradient(90deg, #f5bd23 ${rating}%, #afb8c1 ${rating}%)`
      this.style.backgroundClip = `inherit`
    }
  })

}