const calendars: NodeListOf<HTMLElement> = document.querySelectorAll('.calendar');
const prev = document.querySelector('.prev-btn') as HTMLElement;
const next = document.querySelector('.next-btn') as HTMLElement;
const slider = document.querySelector('.slider') as HTMLElement;
const daysList = document.querySelectorAll('.days')! as NodeListOf<HTMLElement>;
const months = document.querySelectorAll('.month')! as NodeListOf<HTMLElement>;
const firstMonth: NodeListOf<HTMLElement> = document.querySelectorAll('.calendar .month-1');
const secondMonth: NodeListOf<HTMLElement> = document.querySelectorAll('.calendar .month-2');
const gridDaysOne: NodeListOf<HTMLElement> = document.querySelectorAll('.calendar .grid-day-1');
const gridDaysTwo: NodeListOf<HTMLElement> = document.querySelectorAll('.calendar .grid-day-2');
const checkIn = document.querySelector('#check-in-date')! as HTMLElement;
const checkOut = document.querySelector('#check-out-date')! as HTMLElement;
const smallCalCheckIn = document.querySelector('#sm-cal-check-in')! as HTMLElement;
const smallCalCheckOut = document.querySelector('#sm-cal-check-out')! as HTMLElement;
const smallCalLabel = document.querySelectorAll('.sm-form-label')! as NodeListOf<HTMLElement>;
const clearCalendar = document.querySelector('.cal-clear')! as HTMLElement;
const continueBox = document.querySelector('.continue-box')! as HTMLElement;
const continueBtn = document.querySelector('.cont-btn')! as HTMLElement;
const formContainer = document.querySelector('#form-container')! as HTMLElement;
const no_of_nights = document.querySelectorAll('.no-of-nights')! as NodeListOf<HTMLElement>;
const r = document.querySelector(':root')! as HTMLHtmlElement;
const angle: number = 360 / calendars.length;
const checkInInput = document.querySelector('#checkInDate')!as HTMLInputElement;
const checkOutInput = document.querySelector('#checkOutDate')!as HTMLInputElement;
let d: Date = new Date();
let n: number = d.getMonth();
let y: number = d.getFullYear();
let todayDate: number = d.getDate();
let e: Date = new Date();
e.setDate(e.getDate() + 1);
let p = e.getMonth();
let z = e.getFullYear();
let tmrDate = e.getDate();
function getDateValues(year: number, month: number, day: number) {
  let a: string;
  let b: string;
  day < 10 ? (a = `0${day}`) : (a = `${day}`);
  month < 10 ? (b = `0${month + 1}`) : (b = `${month + 1}`);
  return `${y}-${b}-${a}`;
}
let todayValue: string = getDateValues(y, n, todayDate);
let tmrValue: string = getDateValues(z, p, tmrDate);
let nxtDayValue: string;
let isCheckin = false;
let x = 0;
let count = 0;
let startSlide = false;
let clearLocation = false;

// generateMonths
function getMonth(month: HTMLElement,index: number,monthIndex: number,gridDay:HTMLElement) {
  let monthNum = n + index + monthIndex;
  let date = new Date(y, monthNum);
  let monthNumeric = date.getMonth();
  let options: object = { month: 'long', year: 'numeric' };
  let monthText: string = date.toLocaleString('en-us', options);
  month.textContent = monthText;
  gridDay.innerHTML = '';
  let days: number = new Date(y, monthNum + 1, 0).getDate();
  let weekDay: number = new Date(y, monthNum).getDay() + 1;
  for (let i = 1; i <= days; i++) {
    let day: HTMLHeadingElement = document.createElement('p');
    day.textContent = i.toString();
    day.classList.add('day');
    let m: number = monthNumeric + 1;
    let year: string = monthText.replace(/\D/g, '');
    let dateChecker: Date = new Date(`${year}/${m}/${i + 1}`);
    let dayDate: Date = new Date(`${year}/${m}/${i}`);
    let stringOptions: object = {
      month: 'short',
      year: 'numeric',
      weekday: 'short',
      day: '2-digit',
    };
    let dateString: string = dayDate.toLocaleString('en-us', stringOptions);
    d > dateChecker && day.classList.add('past-day');
    let dataDay: string;
    let nextDay: string;
    let dataMonth: string;
    i < 10 ? (dataDay = `0${i}`) : (dataDay = `${i}`);
    i < 10 ? (nextDay = `0${i + 1}`) : (nextDay = `${i + 1}`);
    m < 10 ? (dataMonth = `0${m}`) : (dataMonth = `${m}`);
    let dateValue: string = `${year}-${dataMonth}-${dataDay}`;
    let nextDayValue: string = `${year}-${dataMonth}-${nextDay}`;
    if(isBooking) {
      getBookingDate(
        day, dateString, dateValue, nextDayValue,
        lodgeInDate,lodgeIn,lodgeInDate,
        lodgeOutDate,lodgeOut,lodgeOutDate
        );
    }else {
      getBookingDate(
        day, dateString, dateValue, nextDayValue,
        checkIn,checkInInput,checkInSection,
        checkOut,checkOutInput,checkOutSection
        );
    }
    day.dataset.date = dateValue;
    gridDay.appendChild(day);
    let grid: string = `${weekDay}/${weekDay + 1}`;
    let firstDay = gridDay.firstChild! as HTMLElement;
    firstDay.style.gridColumn = grid;
    if(isBooking) markDays(day, dateValue,lodgeIn,lodgeOut)
    else markDays(day, dateValue,checkInInput,checkOutInput);
  }
}
//function created to get booking dates
//1)create a function to mark dates
function markDays(day:HTMLElement,val: string,checkin:HTMLInputElement,checkout:HTMLInputElement) {
  day.classList.remove('stay-day', 'start-day', 'end-day');
  if (new Date(val) < new Date(checkout.value) && new Date(val) > new Date(checkin.value) ) {
    day.classList.add('stay-day');
  }
  if (checkin.value && val === checkin.value) {
    day.classList.add('start-day');
  }
  if (checkout.value && val === checkout.value) {
    day.classList.add('end-day');
  }
}

const date_diff_indays = function(date1:string, date2:string) {
  let dt1 = new Date(date1);
  let dt2 = new Date(date2);
  return  Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  }

function getBookingDate(
day:HTMLElement,dayStr:string,dateVal:string,nextDayVal:string,
checkin:HTMLElement,checkininput:HTMLInputElement,checkinsection:HTMLElement,
checkout:HTMLElement,checkoutinput:HTMLInputElement,checkoutsection:HTMLElement
) {
  if (dateVal >= todayValue) {
    day.addEventListener('click', function () {
      if (!checkininput.value || checkinsection.classList.contains('form-focus')) {
        
        checkin.textContent = dayStr;
        checkininput.value = dateVal;
        isCheckin = true;
        checkout.textContent = 'check-out';
        continueBox.classList.remove('transform-up');
        checkoutinput.value = '';
        checkinsection.classList.remove('form-focus');
        checkin.classList.add('selected-date');
        checkout.classList.remove('selected-date');
        checkoutsection.classList.add('form-focus');        
        nxtDayValue = nextDayVal;

      } else if (
        (checkininput.value && !checkoutinput.value) ||
        (checkininput.value && checkoutinput.value) 
         ) {
        let dateValChecker = dateVal;
        if (new Date(dateValChecker) < new Date(checkininput.value)) {

          checkout.textContent = 'check-out';
          checkoutinput.value = '';
          checkin.textContent = dayStr;
          checkininput.value = dateValChecker;
          isCheckin = true;
          nxtDayValue = nextDayVal;
          continueBox.classList.remove('transform-up');
          checkout.classList.remove('selected-date');
          checkinsection.classList.remove('form-focus');
          checkoutsection.classList.add('form-focus');   

        } else {

          checkout.textContent = dayStr;
          checkoutinput.value = dateValChecker;
          checkout.classList.add('selected-date'); 

        }
      }
      generateMonths(checkin,checkininput,checkout,checkoutinput);
    });
  }
}

// FUNCTION TO GIVE VALUE TO THE CHECKIN AND CHECKOUT DATE DISPLAY ON MOBILE VIEW 
function style_mobile_cal(lodge:HTMLElement,label:HTMLElement,val:HTMLElement,input:HTMLInputElement) {
  if(input.value) lodge.textContent = val.textContent
  else lodge.textContent = '';
   if(lodge.textContent !== ''||input.value) {
     lodge.classList.add('larger')
     label.classList.add('smaller')
   } else {
    lodge.classList.remove('larger')
    label.classList.remove('smaller')
   }
}

function generateMonths(
  checkin:HTMLElement,checkininput:HTMLInputElement,
  checkout:HTMLElement,checkoutinput:HTMLInputElement
) {
  if(checkoutinput.value||checkininput.value) clearCalendar.classList.add('clear-dates')
  else clearCalendar.classList.remove('clear-dates');
  
  style_mobile_cal(smallCalCheckIn,smallCalLabel[0],checkin,checkininput);
  style_mobile_cal(smallCalCheckOut,smallCalLabel[1],checkout,checkoutinput);

  if(checkininput.value!=='' && checkoutinput.value!==''){
    let nights = date_diff_indays(checkininput.value,checkoutinput.value); 
      no_of_nights.forEach(night => {
       night.textContent = `${nights} night(s)`;
      })
      continueBox.classList.add('transform-up');
      if(total_fee_display && isBooking) {
        total_fee_display.innerHTML = `$<b>${price * nights}<b>`
        totalFee.value = `${price * nights}`
      }
  } else {
    continueBox.classList.remove('transform-up');
    no_of_nights.forEach(night => {
      night.textContent = ``;
     })
  }

  if (window.innerWidth > 800) {
    if(isBooking) {
      let top = (bookingForm.offsetTop - bookingForm.clientHeight) - 2;
      scene.style.top = `${top}px`;
      scene.style.left = `2%`;  
    } 
    const calendars = document.querySelectorAll('.calendar')!as NodeListOf<HTMLElement>;
    for (let i = 0; i < calendars.length; i++) {
      if (i > 3) {
        calendars[i].remove();
      } else if (i <= 3) {
        getMonth(firstMonth[i], 0, i, gridDaysOne[i]);
        getMonth(secondMonth[i], 1, i, gridDaysTwo[i]);
      }
    }
  } else if (window.innerWidth <= 800) {
    scene.style.top = ``;
    scene.style.left = ``; 
    const daysList = document.querySelectorAll('.days')! as NodeListOf<HTMLElement>;
    const months = document.querySelectorAll('.month')! as NodeListOf<HTMLElement>;
    n = d.getMonth();
    x = 0;
    count = 0;
    for (let i = 0; i < months.length; i++) {
      getMonth(months[i], 0, i, daysList[i]);
    }
  }

}

window.addEventListener('load', ()=>{
  if(isBooking) generateMonths(lodgeInDate,lodgeIn,lodgeOutDate,lodgeOut)
  else generateMonths(checkIn,checkInInput,checkOut,checkOutInput)
});
window.addEventListener('resize',()=>{
  if(isBooking) generateMonths(lodgeInDate,lodgeIn,lodgeOutDate,lodgeOut)
  else generateMonths(checkIn,checkInInput,checkOut,checkOutInput)
});

slider.addEventListener('scroll', function () {
  if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
    let newCal = document.createElement('DIV');
    newCal.classList.add('calendar');
    newCal.innerHTML = `
           <div class="months">
              <h3 class="month-1 month"></h3>
              <h3 class="month-2 month"></h3>
            </div>
            <div class="calendar-days">
              <div class="grid-day-1 days"></div>
              <div class="grid-day-2 days"></div>
            </div>
            `;
    if(isBooking){
      this.appendChild(newCal) && generateMonths(lodgeInDate,lodgeIn,lodgeOutDate,lodgeOut)
    } else {
      this.appendChild(newCal) && generateMonths(checkIn,checkInInput,checkOut,checkOutInput)
    }    
    
  }
});

//***/

function rotateCalendars() {
  if (window.innerWidth > 800) {
    slider.style.transform = `translateZ(-290px) rotateY(${x}deg)`;
    prev.classList.add('disabled-btn');
    for (let i = 0; i < calendars.length; i++) {
      calendars[i].style.transform = `rotateY(${
        i * angle
      }deg) translateZ(290px)`;
    }
  } else if (window.innerWidth <= 800) {
    let calHeight = window.innerHeight;
    r.style.setProperty('--scene-height', `${calHeight}px`);
    slider.style.transform = `translateZ(0) rotateY(0deg)`;
    for (let i = 0; i < calendars.length; i++) {
      calendars[i].style.transform = `rotateY(0deg) translateZ(0)`;
    }
  }
}

window.addEventListener('load', rotateCalendars);
window.addEventListener('resize', rotateCalendars);

function disableBtn() {
  if (count > 0) {
    prev.classList.remove('disabled-btn');
    startSlide = true;
  } else {
    prev.classList.add('disabled-btn');
    startSlide = false;
  }
}

let currentMonth = n;
prev.addEventListener('click', function (e) {
  e.preventDefault()
  if (startSlide) {
    count--;
    n = (Math.floor(count/4)*4) + currentMonth;
    if(isBooking) generateMonths(lodgeInDate,lodgeIn,lodgeOutDate,lodgeOut) 
    else generateMonths(checkIn,checkInInput,checkOut,checkOutInput) 
    x += angle;
    slider.style.transform = `translateZ(-290px) rotateY(${x}deg)`;
    disableBtn();
  } 
});

next.addEventListener('click', (e) => {
  e.preventDefault()
  count++;
  n = (Math.floor(count/4)*4) + currentMonth;
  if(isBooking) generateMonths(lodgeInDate,lodgeIn,lodgeOutDate,lodgeOut)
  else generateMonths(checkIn,checkInInput,checkOut,checkOutInput) 
  x -= angle;
  slider.style.transform = `translateZ(-290px) rotateY(${x}deg)`;
  disableBtn();
});

const body = document.documentElement;
const scene = document.querySelector('.scene')! as HTMLElement;
const locationSection = document.querySelector('#location-section')! as HTMLElement;
const locationInput = document.querySelector('#location')! as HTMLInputElement;
const checkInSection = document.querySelector('#check-in-section')! as HTMLElement;
const checkOutSection = document.querySelector('#check-out-section')! as HTMLElement;
const closeCalendar = document.querySelector('.close-cal')! as HTMLElement;
const searchForm = document.querySelector('#search-form')! as HTMLFormElement;
const clear_location_input = document.querySelector('.clear-location')! as HTMLElement;
const close_warning_modal = document.querySelector('.orientation-warning span')! as HTMLElement;
const orientation_warning_modal = document.querySelector('.orientation-warning')! as HTMLElement;
const paginators = document.querySelectorAll('.page')!as NodeListOf<HTMLElement>;
const pages = document.querySelector('.paginators span')!as HTMLElement;
const skips = document.querySelector('#skips')!as HTMLInputElement;
const searchSection = document.querySelector('.search-form_section')!as HTMLElement;
let showCalendar: boolean = false;

// FUNCTION TO DISABLE PAGINATION BUTTONS 
function disablePaginationBtn() {
  if ((page - 1) < 0) {
    paginators[0].classList.add('disabled-btn');
  } else {
    paginators[0].classList.remove('disabled-btn');
  };

  if ((page + 1) >= no_of_pages) {
    paginators[1].classList.add('disabled-btn');
  } else {
    paginators[1].classList.remove('disabled-btn');
  }
}

let no_of_stays: string = pages?.dataset.count!
let no_of_pages:number = Math.ceil(parseFloat(no_of_stays)/10)
let page = parseFloat(skips?.value);
let staysCount = parseFloat(no_of_stays);


function paginate() {
    skips.setAttribute('form','search-form')
    sort_input.setAttribute('form','search-form')
    searchForm.submit();
}

if(pages) { 

   disablePaginationBtn();
   paginators[0].addEventListener('click',function(){
   if((page - 1) >= 0) {
    skips.value = `${page- 1}`
    paginate()
   }
   })

   paginators[1].addEventListener('click',function(){
    if((page + 1) < no_of_pages) {
     skips.value = `${page + 1}`
     paginate()
    }
    })

  };

//event listener to add focus on form element
locationSection.addEventListener('click', function (e) {
  locationInput.focus();
});
//event listener for location Input
locationInput.addEventListener('keyup', function () {
  if(this.value===' ') this.value = this.value.trim()    
});

locationInput.addEventListener('input', function () {
  if(this.value!=='')
  clear_location_input.classList.add('show-clear-location');
});

locationInput.addEventListener('focus', function () {
  if(this.value!=='')
  clear_location_input.classList.add('show-clear-location');
})

locationInput.addEventListener('blur', function(){
  clear_location_input.classList.remove('show-clear-location');
})

//eventlistener for clear location input 
clear_location_input.addEventListener('mousedown', function(e) {
      locationInput.value = '';
      this.classList.remove('show-clear-location');
      locationInput.focus();
})
//event listener to close orientation warning
close_warning_modal.addEventListener('click', function(e) {
  orientation_warning_modal.classList.add('close-modal_orientation');
})

//event listener to displayCalendar && add focus on form element
function changeCalStyle() {
  setCalPosition();
  generateMonths(checkIn,checkInInput,checkOut,checkOutInput) 
  showCalendar = true;
  lodgeInDate?.classList.remove('form-focus')
  lodgeOutDate?.classList.remove('form-focus')
  isBooking = false;
  toggleCalendarScene();
  scene.style.top = ``;
  scene.style.left = ``;
  scene.classList.remove('book-cal')
}

checkInSection.addEventListener('click', function (e) {
  changeCalStyle()
  checkOutSection.classList.remove('form-focus');
  this.classList.add('form-focus');
});

checkOutSection.addEventListener('click', function () {
  changeCalStyle()
  if (!checkInInput.value || checkInInput.value === '') {
    checkInSection.classList.add('form-focus');
  } else if (checkInInput.value || checkInInput.value !== '') {
    this.classList.add('form-focus');
    checkInSection.classList.remove('form-focus');
  }
});

//event listener to clear checkin & checkout dates
function clearCal (
  checkin:HTMLElement,checkininput:HTMLInputElement,checkinsection:HTMLElement,
  checkout:HTMLElement,checkoutinput:HTMLInputElement,checkoutsection:HTMLElement
  ) {
if (checkininput.value!=='') {
  checkin.textContent = 'check-in';
  checkout.textContent = 'check-out';
  checkout.classList.remove('selected-date');
  checkin.classList.remove('selected-date');
  checkininput.value = '';
  isCheckin = false;
  checkoutinput.value = '';
  checkinsection.classList.remove('form-focus');
  checkoutsection.classList.remove('form-focus');
  smallCalCheckOut.textContent = '';
  smallCalCheckIn.textContent = '';
  smallCalCheckOut.classList.remove('larger');
  smallCalCheckIn.classList.remove('larger');
  smallCalLabel[0].classList.remove('smaller');
  smallCalLabel[1].classList.remove('smaller');
  continueBtn.classList.remove('transform-up');
  continueBox.classList.remove('transform-up');
  no_of_nights.forEach(nights => {
    nights.textContent = '';
  }) 
  generateMonths(checkin,checkininput,checkout,checkoutinput) 
} 
}

clearCalendar.addEventListener('click', function () {
  if(isBooking) {
    clearCal(lodgeInDate,lodgeIn,lodgeInDate,lodgeOutDate,lodgeOut,lodgeOutDate)
    this.classList.remove('clear-dates');
    totalFee.value = ''
    total_fee_display.textContent=''
  } else {
    clearCal(checkIn,checkInInput,checkInSection,checkOut,checkOutInput,checkOutSection)
    this.classList.remove('clear-dates');
  }
});
//event listener to close Calendar
function closeCal() {
  showCalendar = false;
  toggleCalendarScene(); 
  checkInSection.classList.remove('form-focus');
  checkOutSection.classList.remove('form-focus');
  lodgeInDate?.classList.remove('form-focus');
  lodgeOutDate?.classList.remove('form-focus');
}

closeCalendar.addEventListener('click', closeCal);

continueBtn.addEventListener('click', closeCal);

//search form event listener
function setValueAttr() {

 if (
    (!checkOutInput.value || checkOutInput.value === '') &&
    (checkInInput.value && checkInInput.value !== '')
  ) {
    checkOutInput.value = nxtDayValue;
  } else if(
    (!checkOutInput.value || checkOutInput.value !== '') &&
    (!checkInInput.value && checkInInput.value === '')
  ) {
    checkInInput.setAttribute("disabled", "disabled")
    checkOutInput.setAttribute("disabled", "disabled")
  }

  if(!locationInput.value || !locationInput.value.replace(/\s/g, '').length) {
    locationInput.value = 'all'
  }

}
searchForm.addEventListener('submit', function () {
  setValueAttr()
});

//window event listener for other calendar on small screens
function toggleCalendarScene() {
  if (!showCalendar) {
    isBooking = false;
    scene.classList.remove('display-calendar','book-cal');
    scene.style.top = ``;
    scene.style.left = ``;
    body.classList.remove('hidden');
    navBar.classList.remove('hide');
    orientation_warning_modal.classList.add('close-modal_orientation');
  } else if (showCalendar) {
    disableBtn()    
    scene.classList.add('display-calendar');
    body.classList.add('hidden');
    navBar.classList.add('hide');
    orientation_warning_modal.classList.remove('close-modal_orientation');
  }
}


//window-listener to remove classlist when not needed
body.addEventListener('click', function (e) {
  if (!locationSection.contains(e.target as HTMLElement) ) {
    locationSection.classList.remove('form-focus');
    clear_location_input.classList.remove('show-clear-location')
  }
  if (
    !checkInSection.contains(e.target as HTMLElement) &&
    !checkOutSection.contains(e.target as HTMLElement) &&
    !lodgeInDate?.contains(e.target as HTMLElement) &&
    !lodgeOutDate?.contains(e.target as HTMLElement) &&
    !orientation_warning_modal.contains(e.target as HTMLElement) &&
    !scene.contains(e.target as HTMLElement) &&
    !(<HTMLElement>e.target).classList.contains('day') 
  ) {
    checkInSection.classList.remove('form-focus');
    checkOutSection.classList.remove('form-focus');
    lodgeInDate?.classList.remove('form-focus');
    lodgeOutDate?.classList.remove('form-focus');
    isBooking = false;
    scene.classList.remove('book-cal');
    showCalendar = false;
    toggleCalendarScene();
    setCalPosition();
  }    

});

function monthDiff(inDate:Date, dDate:string) {
  let d1 = new Date(inDate)
  let d2 = new Date(dDate)
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

let pickedMonth;

function setCalPosition() {
  if(isBooking) {

    let time = new Date(lodgeIn?.value)
    if(time.getTime() === time.getTime()) {
      count=monthDiff(d,lodgeIn?.value);
    } else {
      count = 0;
    }

  } else {

    let time = new Date(checkInInput?.value)
    if(time.getTime() === time.getTime()) {
    count = monthDiff(d,checkInInput?.value);
    } else {
      count = 0;
    }

  }
  if(window.innerWidth > 800){
    x = -(count*angle);
  } else{
    x = 0;
  } 
  if(isBooking) pickedMonth  = monthDiff(d,lodgeIn.value);
  else pickedMonth  = monthDiff(d,checkInInput.value);
  slider.scrollTop = pickedMonth * daysList[0].clientHeight
  n = (Math.floor(count/4)*4) + currentMonth;
  slider.style.transform = `translateZ(-290px) rotateY(${x}deg)`;
  if(isBooking) generateMonths(lodgeInDate,lodgeIn,lodgeOutDate,lodgeOut)
  else generateMonths(checkIn,checkInInput,checkOut,checkOutInput) 
}

//bookings
const lodgeIn = document.querySelector('#lodge-in')!as HTMLInputElement
const lodgeOut = document.querySelector('#lodge-out')!as HTMLInputElement
const lodgeInDate = document.querySelector('.lodge-in-date')!as HTMLElement
const lodgeOutDate = document.querySelector('.lodge-out-date')!as HTMLElement
const stayInfo = document.querySelector('.stay-info')!as HTMLElement
const bookingForm = document.querySelector('.book-form')!as HTMLFormElement
let isBooking = false;
const total_fee_display = document.querySelector('.totalPrice')!as HTMLElement;
const stayPrice = document.querySelector('.price')!as HTMLElement; 
const totalFee = document.querySelector('#totalFee')!as HTMLInputElement; 
const view_stay_form = document.querySelectorAll('.view-stay')!as NodeListOf<HTMLFormElement>;
const view_stay_inputs = document.querySelectorAll('.view-stay_input')!as NodeListOf<HTMLInputElement>;
let price = parseFloat(stayPrice?.textContent!);

function placeBookCal() {
   setCalPosition();
   checkOutSection.classList.remove('form-focus');
   checkInSection.classList.remove('form-focus');
   generateMonths(lodgeInDate,lodgeIn,lodgeOutDate,lodgeOut)
   showCalendar = true;
   toggleCalendarScene();
}

lodgeInDate?.addEventListener('click', function(){
  this.classList.add('form-focus')
  lodgeOutDate.classList.remove('form-focus')
  isBooking = true;
  scene.classList.add('book-cal')
  placeBookCal()
})

lodgeOutDate?.addEventListener('click', function(){
  isBooking = true;
  if(lodgeIn.value!==''){
    lodgeInDate.classList.remove('form-focus')
    this.classList.add('form-focus')
  } else {
    this.classList.remove('form-focus')
    lodgeInDate.classList.add('form-focus')
  }
  scene.classList.add('book-cal')
  placeBookCal()
})

if(lodgeIn?.value && lodgeOut?.value) {
    let totalNights = date_diff_indays(lodgeIn.value,lodgeOut.value)
    totalFee.value = `${price * totalNights}`
    total_fee_display.textContent = `$${price * totalNights}`
}

if(view_stay_form) {
  
  view_stay_form.forEach(form => {

    form.addEventListener('submit', function(){
      let formName = this.id;
      for(let i=0;i <2; i++) {
          if(!view_stay_inputs[i].value.replace(/\s/g, '').length || !view_stay_inputs[i].value){
            view_stay_inputs[i].setAttribute('form','')
            view_stay_inputs[2]?.setAttribute('form',formName)
        } else {
          view_stay_inputs[i].setAttribute('form',formName)
          view_stay_inputs[2].setAttribute('form','')
        }
      }
    })

  })

}