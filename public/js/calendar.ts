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
const checkIn = document.querySelector('#check-in-date') as HTMLElement;
const checkOut = document.querySelector('#check-out-date') as HTMLElement;
const smallCalCheckIn = document.querySelector('#sm-cal-check-in') as HTMLElement;
const smallCalCheckOut = document.querySelector('#sm-cal-check-out') as HTMLElement;
const smallCalLabel = document.querySelectorAll('.sm-form-label')! as NodeListOf<HTMLElement>;
const clearCalendar = document.querySelector('.cal-clear')! as HTMLElement;
const continueBox = document.querySelector('.continue-box')! as HTMLElement;
const continueBtn = document.querySelector('.cont-btn')! as HTMLElement;
const formContainer = document.querySelector('#form-container')! as HTMLElement;
const no_of_nights = document.querySelectorAll('.no-of-nights')! as NodeListOf<HTMLElement>;
const r = document.querySelector(':root')! as HTMLHtmlElement;
const angle: number = 360 / calendars.length;
let checkInValue: string;
let checkOutValue: string;
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
let click = 0;
let count = 0;
let savedAngle = 0;
let savedCount = 0;
let savedClick = 0;
let savedMonth = d.getMonth();
let scrollTop = 0;
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
    getBookingDate(day, dateString, dateValue, nextDayValue);
    day.dataset.date = dateValue;
    gridDay.appendChild(day);
    let grid: string = `${weekDay}/${weekDay + 1}`;
    let firstDay = gridDay.firstChild! as HTMLElement;
    firstDay.style.gridColumn = grid;
    markDays(day, dateValue);
  }
}
//function created to get booking dates
//1)create a function to mark dates
function markDays(day: HTMLHeadingElement, val: string) {
  day.classList.remove('stay-day', 'start-day', 'end-day');
  if (
    new Date(val) < new Date(checkOutValue) &&
    new Date(val) > new Date(checkInValue)
  ) {
    day.classList.add('stay-day');
  }
  if (checkInValue && val === checkInValue) {
    day.classList.add('start-day');
  }
  if (checkOutValue && val === checkOutValue) {
    day.classList.add('end-day');
  }
}

const date_diff_indays = function(date1:string, date2:string) {
  let dt1 = new Date(date1);
  let dt2 = new Date(date2);
  return `${Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24))} night(s)`;
  }

function getBookingDate(day:HTMLElement,dayStr:string,dateVal:string,nextDayVal:string) {
  if (!day.classList.contains('past-day')) {
    day.addEventListener('click', function () {
      if (!checkInValue || checkInSection.classList.contains('form-focus')) {
        checkIn.textContent = dayStr;
        checkInValue = dateVal;
        isCheckin = true;
        savedCalData ()
        checkOut.textContent = 'Depart';
        smallCalCheckIn.textContent = dayStr;
        smallCalCheckOut.textContent = '';
        smallCalCheckOut.classList.remove('larger');
        smallCalCheckIn.classList.add('larger');
        smallCalLabel[0].classList.add('smaller');
        smallCalLabel[1].classList.remove('smaller');
        continueBox.classList.remove('transform-up');
        checkOutValue = '';
        clearCalendar.classList.add('clear-dates');
        checkInSection.classList.remove('form-focus');
        checkIn.classList.add('selected-date');
        checkOut.classList.remove('selected-date');
        checkOutSection.classList.add('form-focus');
        nxtDayValue = nextDayVal;
      } else if (
        (checkInValue && !checkOutValue) ||
        (checkInValue && checkOutValue)
      ) {
        let dateValChecker = dateVal;
        if (new Date(dateValChecker) < new Date(checkInValue)) {
          checkOut.textContent = 'Depart';
          checkOutValue = '';
          checkIn.textContent = dayStr;
          checkInValue = dateValChecker;
          isCheckin = true;
          savedCalData ()
          nxtDayValue = nextDayVal;
          smallCalCheckIn.textContent = dayStr;
          smallCalCheckOut.textContent = '';
          smallCalCheckOut.classList.remove('larger');
          smallCalCheckIn.classList.add('larger');
          smallCalLabel[0].classList.add('smaller');
          smallCalLabel[1].classList.remove('smaller');
          clearCalendar.classList.remove('clear-dates');
          continueBox.classList.remove('transform-up');
          checkOut.classList.remove('selected-date');
          checkInSection.classList.remove('form-focus');
          checkOutSection.classList.add('form-focus');
        } else {
          checkOut.textContent = dayStr;
          checkOutValue = dateValChecker;
          smallCalCheckOut.textContent = dayStr;
          smallCalCheckOut.classList.add('larger');
          smallCalLabel[1].classList.add('smaller');
          clearCalendar.classList.add('clear-dates');
          checkOut.classList.add('selected-date');
          continueBox.classList.add('transform-up');
          locationInput.classList.remove('form-light');
          no_of_nights.forEach(nights => {
            nights.textContent = date_diff_indays(checkInValue,checkOutValue);
          })  
        }
      }
      generateMonths();
    });
  }
}

function generateMonths() {
  if (window.innerWidth > 770) {
    const calendars = document.querySelectorAll('.calendar')!as NodeListOf<HTMLElement>;
    for (let i = 0; i < calendars.length; i++) {
      if (i > 3) {
        calendars[i].remove();
      } else if (i <= 3) {
        getMonth(firstMonth[i], 0, i, gridDaysOne[i]);
        getMonth(secondMonth[i], 1, i, gridDaysTwo[i]);
      }
    }
  } else if (window.innerWidth <= 770) {
    const daysList = document.querySelectorAll('.days')! as NodeListOf<HTMLElement>;
    const months = document.querySelectorAll('.month')! as NodeListOf<HTMLElement>;
    n = d.getMonth();
    x = 0;
    click = 0;
    count = 0;
    for (let i = 0; i < months.length; i++) {
      getMonth(months[i], 0, i, daysList[i]);
    }
  }
}
window.addEventListener('load', generateMonths);
window.addEventListener('resize', generateMonths);

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
    this.appendChild(newCal) && generateMonths();
  }
});

//***/

function rotateCalendars() {
  if (window.innerWidth > 770) {
    slider.style.transform = `translateZ(-290px) rotateY(${x}deg)`;
    prev.classList.add('disabled-btn');
    for (let i = 0; i < calendars.length; i++) {
      calendars[i].style.transform = `rotateY(${
        i * angle
      }deg) translateZ(290px)`;
    }
  } else if (window.innerWidth <= 770) {
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

prev.addEventListener('click', function () {
  if (startSlide) {
    count--;
    if (click > 0) {
      click--;
    } else if (click === 0) {
      click = 3;
    }
    if (click === 3) {
      n = n - 4;
      setTimeout(function(){ generateMonths(); }, 100);      
    }
    x += angle;
    slider.style.transform = `translateZ(-290px) rotateY(${x}deg)`;
    disableBtn();
  } 
});

next.addEventListener('click', () => {
  count++;
  if (click < 3) {
    click++;
  } else {
    click = 0;
  }
  if (click === 0) {
    n = n + 4;
    generateMonths();
  }
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
let showCalendar: boolean = false;

//event listener to add focus on form element
locationSection.addEventListener('click', function (e) {
  locationInput.focus();
});
//event listener for location Input
locationInput.addEventListener('keyup', function () {
   this.value = this.value.trim()    
});

locationInput.addEventListener('input', function () {
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
checkInSection.addEventListener('click', function (e) {
  showCalendar = true;
  toggleCalendarScene();
  checkOutSection.classList.remove('form-focus');
  this.classList.add('form-focus');
});

checkOutSection.addEventListener('click', function () {
  showCalendar = true;
  toggleCalendarScene();
  if (!checkInValue || checkInValue === '') {
    checkInSection.classList.add('form-focus');
  } else if (checkInValue || checkInValue !== '') {
    this.classList.add('form-focus');
    checkInSection.classList.remove('form-focus');
  }
});

//event listener to clear checkin & checkout dates
clearCalendar.addEventListener('click', function () {
  if (clearCalendar.classList.contains('clear-dates')) {
    checkIn.textContent = 'Arrive';
    checkOut.textContent = 'Depart';
    checkInValue = '';
    isCheckin = false;
    checkOutValue = '';
    savedCalData();
    smallCalCheckOut.textContent = '';
    smallCalCheckIn.textContent = '';
    smallCalCheckOut.classList.remove('larger');
    smallCalCheckIn.classList.remove('larger');
    smallCalLabel[0].classList.remove('smaller');
    smallCalLabel[1].classList.remove('smaller');
    continueBtn.classList.remove('transform-up');
    checkOut.classList.remove('selected-date');
    checkIn.classList.remove('selected-date');
    checkInSection.classList.remove('form-focus');
    checkOutSection.classList.remove('form-focus');
    this.classList.remove('clear-dates');
    continueBox.classList.remove('transform-up');
    no_of_nights.forEach(nights => {
      nights.textContent = '';
    }) 
    generateMonths();
  }
});

//event listener to close Calendar
function closeCal() {
  showCalendar = false;
  reloadCalendar();
  toggleCalendarScene(); 
  checkInSection.classList.remove('form-focus');
  checkOutSection.classList.remove('form-focus');
}

closeCalendar.addEventListener('click', closeCal);

continueBtn.addEventListener('click', closeCal);
//search form event listener
searchForm.addEventListener('submit', function () {
  if (!checkInValue || checkInValue === '') {
    checkInValue = todayValue;
  }
  if (
    (!checkOutValue || checkOutValue === '') &&
    (!checkInValue || checkInValue === todayValue)
  ) {
    checkOutValue = tmrValue;
  } else if (
    (!checkOutValue || checkOutValue === '') &&
    checkInValue &&
    checkInValue !== ''
  ) {
    checkOutValue = nxtDayValue;
  }

  let checkInInput = document.createElement('INPUT');
  checkInInput.setAttribute('name', 'checkInDate');
  checkInInput.setAttribute('type', 'hidden');
  checkInInput.setAttribute('value', checkInValue);
  this.appendChild(checkInInput);

  let checkOutInput = document.createElement('INPUT');
  checkOutInput.setAttribute('name', 'checkOutDate');
  checkOutInput.setAttribute('type', 'hidden');
  checkOutInput.setAttribute('value', checkOutValue);
  this.appendChild(checkOutInput);
});



//window event listener for other calendar on small screens
function toggleCalendarScene() {
  if (!showCalendar) {
    scene.classList.remove('display-calendar');
    body.classList.remove('hidden');
    navBar.classList.remove('hide');
    orientation_warning_modal.classList.add('close-modal_orientation');
  } else if (showCalendar) {
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
    !orientation_warning_modal.contains(e.target as HTMLElement) &&
    !scene.contains(e.target as HTMLElement) &&
    !(<HTMLElement>e.target).classList.contains('day') 
  ) {
    checkInSection.classList.remove('form-focus');
    checkOutSection.classList.remove('form-focus');
    showCalendar = false;
    toggleCalendarScene();
    reloadCalendar();
  }    

});


function reloadCalendar() {
  x = savedAngle;
  click = savedClick;
  count = savedCount;
  n = savedMonth;
  slider.scrollTop = scrollTop;
  slider.style.transform = `translateZ(-290px) rotateY(${x}deg)`;
  generateMonths();
  disableBtn();
}

function savedCalData() {
  if(isCheckin) {
    savedAngle = x;
    savedClick = click;
    savedCount = count;
    savedMonth = n;
    scrollTop = slider.scrollTop;
  } else {
    savedAngle = 0;
    savedCount = 0;
    savedClick = 0;
    savedMonth = d.getMonth();
    scrollTop = 0;
  }
}