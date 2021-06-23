const now = new Date();

const weekEndDays = [0, 6];

function isWeekDay(date) {
  const weekEndDays = [0, 6];

  if (weekEndDays.includes(date.getDay())) return false;

  return true;
}

function timesTables2Date(timeString) {
  const newDate = new Date();
  const [hours, minutes] = timeString.split(":");
  newDate.setHours(Number(hours));
  newDate.setMinutes(Number(minutes));
  newDate.setSeconds(0);
  return newDate;
}

function formatTime(date) {
  return `${date.getHours()}:${
    date.getMinutes() >= 10
      ? date.getMinutes()
      : "0" + String(date.getMinutes())
  }`;
}

/**
 *
 * @param {number} timeLeft
 * @param {string} time
 */
function displayTablesElement(timeLeft, time, parent) {
  const li = document.createElement("li");
  li.classList = "tables__item";

  const countElem = document.createElement("span");
  countElem.classList = "tables__count";
  countElem.textContent = `${String(timeLeft)} min`;

  const timeElem = document.createElement("span");
  timeElem.classList = "tables__time";
  timeElem.textContent = time;

  if (parent) {
    li.append(countElem, timeElem);
    parent.append(li);
  }
}

function formatTime(date) {
  const hours = Math.floor(date.getHours());
  const minutes = date.getMinutes();

  return `${hours > 12 ? hours - 12 : hours}:${minutes} ${
    hours > 12 ? "pm" : "am"
  }`;
}
const ul = document.getElementsByClassName("tables")[0];

fetch("./public/timestables.json")
  .then((data) => data.json())
  .then((data) => {
    const timesTables = isWeekDay(now)
      ? data.weekDay.map(timesTables2Date)
      : data.weekEndAndPublicHoliday.map(timesTables2Date);

    const nextBusIndex = timesTables.findIndex((elem) => {
      return now.valueOf() - elem.valueOf() <= 0;
    });

    const filterTables = timesTables.slice(nextBusIndex);

    filterTables.forEach((date, idx) => {
      const seconds = (date.valueOf() - now.valueOf()) / 1000;
      const minutes = seconds / 60;
      const minutesLeft = Math.floor(minutes) + 1;
      console.log(minutesLeft + 1);
      displayTablesElement(minutesLeft, formatTime(date), ul);
      if (idx === 0) {
        document.getElementsByClassName(
          "timer__count"
        )[0].textContent = `${String(minutesLeft)} minutes`;
      }
    });
  });
