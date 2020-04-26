const monthNames = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

export const formatDate = (date, part = 'full') => {
  const year = `${new Date(date).getFullYear()}`;

  const month = `${new Date(date).getMonth() + 1}`;
  const formattedMonth = monthNames[month];

  const day = `${new Date(date).getDate()}`;
  // const formattedDay = day < 10 ? `0${day}` : day;

  const hour = `${new Date(date).getHours()}`;
  const formattedHours = hour < 10 ? `0${hour}` : hour;

  const minutes = `${new Date(date).getMinutes()}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  if (part === 'full') {
    return `<span class="day">${day}</span>
            <span class="month">${formattedMonth}</span>
            <span class="year">${year}</span>`
  }

  if (part === 'dm') {
    return `<span class="day">${day}</span><span class="month">${formattedMonth}</span>`
  }
};