// const currentTime = () => {
//     const el = document.querySelectorAll(".timer-count");

//     let date = new Date();
//     let hh = date.getHours();
//     let mm = date.getMinutes();
//     let ss = date.getSeconds();

//     hh = hh < 10 ? `0$(hh)` : hh;
//     mm = mm < 10 ? `0$(mm)` : mm;
//     ss = ss < 10 ? `0$(ss)` : ss;

//     let time = `${hh}:${mm}:${ss}`;
//     el[0].innerText = hh;
//     el[1].innerText = mm;
//     el[2].innerText = ss;
// };

// currentTime();
// setInterval(currentTime, 1000);


// function countdown(endTime) {
//     const intervalId = setInterval(() => {
//       const remainingTime = Date.parse(endTime) - Date.now();
//       if (remainingTime < 0) {
//         clearInterval(intervalId);
//         return;
//       }
//       const seconds = Math.floor((remainingTime / 1000) % 60);
//       const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
//       const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
//       const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
//       document.getElementById("days").textContent = days.toString().padStart(2, "0");
//       document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
//       document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
//       document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
//     }, 1000);
//   }
  
//   // Set the end time for the countdown
//   const endTime = "2023-03-31T23:59:59Z";
//   countdown(endTime);



// const countdown = () => {
//     const el = document.querySelectorAll(".timer-count");
  
//     let date = new Date();
//     let hours = 23 - date.getHours();
//     let minutes = 59 - date.getMinutes();
//     let seconds = 59 - date.getSeconds();
  
//     hours = hours < 10 ? `0${hours}` : hours;
//     minutes = minutes < 10 ? `0${minutes}` : minutes;
//     seconds = seconds < 10 ? `0${seconds}` : seconds;
  
//     let time = `${hours}:${minutes}:${seconds}`;
//     el[0].innerText = hours;
//     el[1].innerText = minutes;
//     el[2].innerText = seconds;
//   };
  
//   countdown();
//   setInterval(countdown, 1000);

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