import DataJSON from "../../static/timestables.json";

const phase23 = document.getElementById("phase-2-3");
const phase45 = document.getElementById("phase-4-5");
const defaultPhase = "phase-2-3";
const refreshDelay = 20000;
let refreshTimeout;

/**
 *
 * @param {Date} date
 * @returns {boolean}
 */
function isWeekDay(date) {
  const weekEndDays = [0, 6];

  if (weekEndDays.includes(date.getDay())) return false;

  return true;
}

/**
 *
 * @param {string} timeString
 * @returns {Date}
 */
function timesTables2Date(timeString) {
  const newDate = new Date();
  const [hours, minutes] = timeString.split(":");
  newDate.setHours(Number(hours));
  newDate.setMinutes(Number(minutes));
  newDate.setSeconds(0);
  return newDate;
}

/**
 *
 * @param {number} minutesLeft - minutes left before the next bus
 * @param {string} time - custom time string to be displayed, ex: 12:25pm
 * @param {HTMLElement} parent
 */
function displayTablesElement(minutesLeft, time, parent) {
  const li = document.createElement("li");
  li.classList = "tables__item";

  const countElem = document.createElement("span");
  countElem.classList = "tables__count";
  countElem.textContent = `${String(minutesLeft)} min`;

  const timeElem = document.createElement("span");
  timeElem.classList = "tables__time";
  timeElem.textContent = time;

  if (parent) {
    li.append(countElem, timeElem);
    parent.append(li);
  }
}

/**
 * @returns {string} - returns your favorite phase
 */
function getFavoritePhase() {
  return localStorage.getItem("phase") || defaultPhase;
}

function setFavoritePhase(val) {
  if (val) {
    return localStorage.setItem("phase", val);
  }

  return localStorage.setItem("phase", defaultPhase);
}

function selectPhase(val) {
  ul.innerHTML = "";
  setFavoritePhase(val);
  displayTimeTables(val);

  switch (val) {
    case "phase-2-3": {
      phase45.classList.remove("phase--active");
      phase23.classList.add("phase--active");
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(() => selectPhase(val), refreshDelay);
      break;
    }

    case "phase-4-5": {
      phase45.classList.add("phase--active");
      phase23.classList.remove("phase--active");
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(() => selectPhase(val), refreshDelay);
      break;
    }
  }
}

/**
 *
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  const hours = Math.floor(date.getHours());
  const minutes = date.getMinutes();

  return `${hours > 12 ? hours - 12 : hours}:${
    date.getMinutes() >= 10 ? minutes : "0" + String(minutes)
  } ${hours > 12 ? "pm" : "am"}`;
}
const ul = document.getElementsByClassName("tables")[0];

function displayTimeTables(selectedPhase) {
  const now = new Date();

  const timesTables = isWeekDay(now)
    ? DataJSON[selectedPhase].weekDay.map(timesTables2Date)
    : DataJSON[selectedPhase].weekEndAndPublicHoliday.map(timesTables2Date);

  const nextBusIndex = timesTables.findIndex((elem) => {
    return now.valueOf() - elem.valueOf() <= 0;
  });

  const noMoreBus = nextBusIndex === -1 ? true : false;

  if (noMoreBus) {
    document.getElementsByClassName(
      "timer__count"
    )[0].textContent = `No bus until tomorow :)`;
  } else {
    const filterTables = timesTables.slice(nextBusIndex);

    filterTables.forEach((date, idx) => {
      const seconds = (date.valueOf() - now.valueOf()) / 1000;
      const minutes = seconds / 60;
      const minutesLeft = Math.floor(minutes) + 1;

      displayTablesElement(minutesLeft, formatTime(date), ul);
      if (idx === 0) {
        document.getElementsByClassName(
          "timer__count"
        )[0].textContent = `${String(minutesLeft)} minutes`;
      }
    });
  }
}

selectPhase(getFavoritePhase());

phase23.addEventListener("click", () => {
  selectPhase("phase-2-3");
});

phase45.addEventListener("click", () => {
  selectPhase("phase-4-5");
});
