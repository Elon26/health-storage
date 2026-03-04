const today = new Date();
const todayMidnight = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  0,
  0,
  0
).getTime();

const tomorrowMidnight = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1,
  0,
  0,
  0
).getTime();

const todayNoon = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  12,
  0,
  0
).getTime();

const todayEvening = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  18,
  0,
  0
).getTime();

export function useTodaysTimeBorders() {
  return { todayMidnight, tomorrowMidnight, todayNoon, todayEvening };
}
