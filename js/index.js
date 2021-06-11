const today = new Date();

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

fetch("./public/timestables.json")
  .then((data) => data.json())
  .then((data) => {
    const timesTables = isWeekDay(today)
      ? data.weekDay.map(timesTables2Date)
      : data.weekEndAndPublicHoliday.map(timesTables2Date);

    const nextBusIndex = timesTables.findIndex((elem) => {
      return today.valueOf() - elem.valueOf() <= 0;
    });

    const p1 = document.createElement("p");
    p1.innerText = formatTime(timesTables[nextBusIndex]);
    const p2 = document.createElement("p");
    p2.innerText = formatTime(timesTables[nextBusIndex + 1]);
    document.body.append(p1, p2);
  });
