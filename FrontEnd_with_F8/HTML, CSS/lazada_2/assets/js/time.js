const countdown = () => {
    const el = document.querySelectorAll(".timer-count");
  
    let date = new Date();
    let hours = 23 - date.getHours();
    let minutes = 59 - date.getMinutes();
    let seconds = 59 - date.getSeconds();
  
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
  
    let time = `${hours}:${minutes}:${seconds}`;
    el[0].innerText = hours;
    el[1].innerText = minutes;
    el[2].innerText = seconds;
  };
  
  countdown();
  setInterval(countdown, 1000);