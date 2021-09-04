const hamburger = document.querySelector('#hamburger')! as HTMLElement;
const navBar = document.querySelector('.navbar')! as HTMLElement;
const stay_search_form = document.querySelector('.stays .search-form_section')! as HTMLElement;
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