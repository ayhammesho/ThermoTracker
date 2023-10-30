const yearsBtn = document.getElementById("years");
const monthsBtn = document.getElementById("months");
const daysOfMonthBtn = document.getElementById("days-of-month");
const hoursOfDayBtn = document.getElementById("hours-of-day");
const liveBtn = document.getElementById("live");
const lasthourBtn = document.getElementById("last-hour");
const datePicker = document.getElementById("filter");

const ip = "https://vmi782673.contaboserver.net";
// const ip = "http://192.168.1.103:5001";

const chartData = {
  labels: [],
  datasets: [
    {
      label: "Sensor 1",
      backgroundColor: "#444",
      borderColor: "#444",
      data: [],
    },
  ],
};

const config = {
  type: "line",
  data: chartData,
  options: {
    maintainAspectRatio: false,
  },
};
const chartExist = Chart.getChart("myChart"); // <canvas> id
if (chartExist != undefined) chartExist.destroy();
new Chart(document.getElementById("myChart"), config);

let initMonths = [];
let initdaysdata = [];
let initHours = [];

let monthsLabels = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

let initMonthsMethod = () => {
  for (let i = 1; i <= 12; i++) {
    initMonths.push({
      time: `${i}`,
      sensor1: "0",
      sensor2: "0",
    });
  }
};
initMonthsMethod();

let initDaysOfMonthMethod = (datepick) => {
  initdaysdata = [];
  const pickerYear = datepick.split("-")[0];
  const pickermonth = datepick.split("-")[1];
  console.log(+pickerYear, +pickermonth);
  const days = daysInMonth(+pickermonth, +pickerYear);
  console.log(days);
  for (let i = 1; i <= days; i++) {
    initdaysdata.push({
      time: `${i}`,
      sensor1: "0",
      sensor2: "0",
    });
  }
};

let initHoursMethod = () => {
  for (let i = 0; i < 24; i++) {
    initHours.push({
      time: `${i}`,
      sensor1: "0",
      sensor2: "0",
    });
  }
};
initHoursMethod();
let test = [];
let i = 0;

// Notification
function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission != "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      // if (permission === "granted") {
      //   const notification = new Notification("تم تفعيل الإشعارات بنجاح");
      //   // …
      // }

    });
  }
}

notifyMe();

// testMethod();

const live = async function () {
  if (test.length > 15) {
    test.shift()
  }
  const res = await fetch(`${ip}/api/liveData`);

  // let res = await fetch("../../get.json");
  const data = await res.json();
console.log(Object.keys(data).length ==0)
  if (Object.keys(data).length ==0) {
    console.log("empty array");
  } else {




    if (test.length == 0) {
      test.push({
        time: `${data.time}`,
        sensor1: `${data.sensor1}`,
        sensor2: `${data.sensor2}`,
      });
      const chartData = {
        labels: test.map((item) => item.time),
        datasets: [
          {
            label: "Sensor 1",
            backgroundColor: "#444",
            borderColor: "#444",
            data: test.map((item) => item.sensor1),
          },
          {
            label: "Sensor 2",
            backgroundColor: "red",
            borderColor: "red",
            data: test.map((item) => item.sensor2),
          },
        ],
      };

      const config = {
        type: "line",
        data: chartData,
        options: {
          maintainAspectRatio: false,
        },
      };
      const chartExist = Chart.getChart("myChart"); // <canvas> id
      if (chartExist != undefined) chartExist.destroy();
      new Chart(document.getElementById("myChart"), config);
    } else if (test[test.length - 1].time != data.time) {
      test.push({
        time: `${data.time}`,
        sensor1: `${data.sensor1}`,
        sensor2: `${data.sensor2}`,
      });
      const chartData = {
        labels: test.map((item) => item.time),
        datasets: [
          {
            label: "Sensor 1",
            backgroundColor: "#444",
            borderColor: "#444",
            data: test.map((item) => item.sensor1),
          },
          {
            label: "Sensor 2",
            backgroundColor: "red",
            borderColor: "red",
            data: test.map((item) => item.sensor2),
          },
        ],
      };

      const config = {
        type: "line",
        data: chartData,
        options: {
          maintainAspectRatio: false,
        },
      };

      const chartExist = Chart.getChart("myChart"); // <canvas> id
      if (chartExist != undefined) chartExist.destroy();
      new Chart(document.getElementById("myChart"), config);
    }
    
    

  }

  // let testMethod =  await () => {

  // };
};

const filterByYear = async function () {
  clearInterval(window.liveMethod);

  // console.log(datePicker.value);
  const res = await fetch(
    `${ip}/api/get?date=${datePicker.value}&filter=0`
  );
  // console.log(res);
  // let res = await fetch("../../get.json");
  const data = await res.json();

  console.log(data);
  console.log(data.map((item) => item.sensor1));

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "Sensor 1 ",
        backgroundColor: "#444",
        borderColor: "#444",
        data: data.map((item) => item.sensor1),
      },
      {
        label: "Sensor 2",
        backgroundColor: "red",
        borderColor: "red",
        data: data.map((item) => item.sensor2),
      },
    ],
  };

  const config = {
    type: "line",
    data: chartData,
    options: {
      maintainAspectRatio: false,
    },
  };

  const chartExist = Chart.getChart("myChart"); // <canvas> id
  if (chartExist != undefined) chartExist.destroy();
  new Chart(document.getElementById("myChart"), config);
};

const filterByMonths = async function () {
  clearInterval(window.liveMethod);

  initMonthsMethod();
  const res = await fetch(
    `${ip}/api/get?date=${datePicker.value}&filter=1`
  );
  // let res = await fetch("../../get.json");
  const data = await res.json();
  
  console.log(data);
  await data.forEach((data) => {
    
    initMonths.forEach((data2) => {
      if (data.time == data2.time) {
        data2.sensor1 = data.sensor1;
        data2.sensor2 = data.sensor2;
      }
    });
  });

  const chartData = {
    labels: monthsLabels,
    datasets: [
      {
        label: "Sensor 1 ",
        backgroundColor: "#444",
        borderColor: "#444",
        data: initMonths.map((item) => item.sensor1),
      },
      {
        label: "Sensor 2",
        backgroundColor: "red",
        borderColor: "red",
        data: initMonths.map((item) => item.sensor2),
      },
    ],
  };

  const config = {
    type: "line",
    data: chartData,
    options: {
      maintainAspectRatio: false,
    },
  };
  const chartExist = Chart.getChart("myChart"); // <canvas> id
  if (chartExist != undefined) chartExist.destroy();
  new Chart(document.getElementById("myChart"), config);

  //   filterByDay();
  //   // filterByWeeks();
  //   // filterByYears();
  //   for (let i = 0; i <= labels.length; i++) {
  //     data.datasets[0].data.push(Math.trunc(Math.random() * 50 + 1));
  //   }
};

const filterByDaysOfMonth = async function () {
  clearInterval(window.liveMethod);

  initDaysOfMonthMethod(datePicker.value);
  // console.log(datePicker.value);
  const res = await fetch(
    `${ip}/api/get?date=${datePicker.value}&filter=2`
  );
  // let res = await fetch("../../get.json");
  const data = await res.json();
  // console.log(data);
  await data.forEach((data) => {
    initdaysdata.forEach((data2) => {
      if (data.time == data2.time) {
        data2.sensor1 = data.sensor1;
        data2.sensor2 = data.sensor2;
      }
    });
  });

  const chartData = {
    labels: initdaysdata.map((item) => item.time),
    datasets: [
      {
        label: "Sensor 1 ",
        backgroundColor: "#444",
        borderColor: "#444",
        data: initdaysdata.map((item) => item.sensor1),
      },
      {
        label: "Sensor 2",
        backgroundColor: "red",
        borderColor: "red",
        data: initdaysdata.map((item) => item.sensor2),
      },
    ],
  };

  const config = {
    type: "line",
    data: chartData,
    options: {
      maintainAspectRatio: false,
    },
  };
  const chartExist = Chart.getChart("myChart"); // <canvas> id
  if (chartExist != undefined) chartExist.destroy();
  new Chart(document.getElementById("myChart"), config);

  //   filterByDay();
  //   // filterByWeeks();
  //   // filterByYears();
  //   for (let i = 0; i <= labels.length; i++) {
  //     data.datasets[0].data.push(Math.trunc(Math.random() * 50 + 1));
  //   }
};
const filterByLastHours = async function() { 
  clearInterval(liveMethod);
  const res = await fetch(
    `${ip}/api/get?filter=4`
  );
  // let res = await fetch("../../get.json");
  const data = await res.json();
  console.log(data)

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "Sensor 1 ",
        backgroundColor: "#444",
        borderColor: "#444",
        data: data.map((item) => item.sensor1),
      },
      {
        label: "Sensor 2 ",
        backgroundColor: "red",
        borderColor: "red",
        data: data.map((item) => item.sensor2),
      },
    ],
  };

  const config = {
    type: "line",
    data: chartData,
    options: {
      maintainAspectRatio: false,
    },
  };
  const chartExist = Chart.getChart("myChart"); // <canvas> id
  if (chartExist != undefined) chartExist.destroy();
  new Chart(document.getElementById("myChart"), config);


  
}
const filterByHours = async function () {
  clearInterval(liveMethod);

  initDaysOfMonthMethod(datePicker.value);

  const res = await fetch(
    `${ip}/api/get?date=${datePicker.value}&filter=3`
  );
  // let res = await fetch("../../get.json");
  const data = await res.json();


  
  // console.log(data);
  await data.forEach((data) => {
    initHours.forEach((data2) => {
      if (data.time == data2.time) {
        data2.sensor1 = data.sensor1;
        data2.sensor2 = data.sensor2;
      }
    });
  });

  const chartData = {
    labels: initHours.map((item) => item.time),
    datasets: [
      {
        label: "Sensor 1 ",
        backgroundColor: "#444",
        borderColor: "#444",
        data: initHours.map((item) => item.sensor1),
      },
      {
        label: "Sensor 2 ",
        backgroundColor: "red",
        borderColor: "red",
        data: initHours.map((item) => item.sensor2),
      },
    ],
  };

  const config = {
    type: "line",
    data: chartData,
    options: {
      maintainAspectRatio: false,
    },
  };
  const chartExist = Chart.getChart("myChart"); // <canvas> id
  if (chartExist != undefined) chartExist.destroy();
  new Chart(document.getElementById("myChart"), config);


};

yearsBtn.addEventListener("click", filterByYear);
monthsBtn.addEventListener("click", filterByMonths);
daysOfMonthBtn.addEventListener("click", filterByDaysOfMonth);
hoursOfDayBtn.addEventListener("click", filterByHours);
lasthourBtn.addEventListener("click", filterByLastHours)
window.liveMethod = setInterval(live, 2000);

liveBtn.addEventListener("click", function () {
  test = [];
  window.liveMethod = setInterval(live, 2000);
});



setInterval(  async function(){

  const res = await fetch(`${ip}/api/liveData`);

  // let res = await fetch("../../get.json");
  const data = await res.json();
  if (Object.keys(data).length ==0) {
  
  } else {
  console.log(data)
  if (data.sensor1 >= 30 &&  data.sensor2 >= 30) { 
    const notification = new Notification(
      `high temp in sensor1 ${data.sensor1}\nhigh temp in sensor2 ${data.sensor2}`
    );  
  }
  else if (data.sensor1 >= 30) {
    const notification = new Notification(
         `high temp in sensor1 ${data.sensor1}`
       );  
  }
  else if (data.sensor2 >= 30) {
    const notification = new Notification(
      `high temp in sensor2 ${data.sensor2}`
      );
  }
  }
},10000)
// setInterval(async function(){



//   const res = await fetch(`https://${ip}/api/liveData`);
//   // let res = await fetch("../../get.json");
//   const data = await res.json();
// console.log(Object.keys(data).length ==0)
// if (Object.keys(data).length ==0) {
//   console.log("empty array");
// } else {
  
 
//   }
// },2000) 








// console.log(datePicker.value);

// function getDaysInMonth(month, year) {
//   var date = new Date(year, month, 1);
//   var days = [];
//   while (date.getMonth() === month) {
//     days.push(new Date(date));
//     date.setDate(date.getDate() + 1);
//   }

//   return days;
// }

//   filterByDay();
//   // filterByWeeks();
//   // filterByYears();
//   for (let i = 0; i <= labels.length; i++) {
//     data.datasets[0].data.push(Math.trunc(Math.random() * 50 + 1));
//   }

// let count = 0;
// let sum = 0;
// let dayAverages = [];

// const arr = [
//   {
//     time: "2",
//     temp: "34",
//   },
//   {
//     time: "6",
//     temp: "24",
//   },
//   {
//     time: "12",
//     temp: "36",
//   },
// ];

// console.log(newArr);

// fetch(
//   `https://${ip}/api/getfilterdata?date=${datePicker.value}& filter ={number}`
// )
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// const filterByYears = () => {
//   labels = [
//     "jan",
//     "feb",
//     "mar",
//     "apr",
//     "may",
//     "jun",
//     "jul",
//     "aug",
//     "sep",
//     "oct",
//     "nov",
//     "dec",
//   ];
// };

// const time = "2022/10/10 24:10:43";

// const dateAndHours = time.split(" ");

// const hour = dateAndHours[1].split(":");

// console.log(hour[0]);

// // filterByYears();
// const dATA = [];
// for (let j = 0; j < 31; j++) {
//   dATA.push(Math.trunc(Math.random() * 50 + 1));
// }

// const filterByWeeks = (month, year) => {
//   const datePickerValues = datePicker.value.split("-");
//   // console.log(datePickerValues[0]);
//   // if (year == datePickerValues[0] && month == datePickerValues[1]){}
//   if (datePickerValues[0] == 2022) {
//     // replace 2022 with the data from the backend

//     const daysOfTheMonth = getDaysInMonth(
//       +datePickerValues[1] - 1,
//       +datePickerValues[0]
//     );
//     // console.log(daysOfTheMonth);
//     const weeksOfTheMonth = Math.ceil(daysOfTheMonth.length / 7);
//     let counter = 0;
//     let sum = 0;
//     let weeksAverages = [];
//     let x = 0;
//     let y = 7;
//     let lastWeek = false;
//     for (let w = 1; w <= weeksOfTheMonth; w++) {
//       for (let d = x; d < y; d++) {
//         if (dATA[d] !== undefined) {
//           sum += dATA[d];
//         } else {
//           sum += 0;
//           counter++;
//         }
//       }
//       x += 7;
//       y += 7;
//       console.log(sum);
//       if (counter == 0) {
//         averages.push(sum / 7);
//       } else if (counter == 4) {
//         averages.push(sum / 3);
//       } else {
//         averages.push(sum / 2);
//       }

//       sum = 0;
//     }

//     console.log(weeksAverages);
//   }
// };

// const filterByDay = function () {
//   const datePickerValues = datePicker.value.split("-");
//   arr.forEach((el) => {
//     let date = el.time.split(" ")[0].split("/");
//     let hour = el.time.split(" ")[1].split(":");
//     // console.log(date, hour, datePickerValues);
//     if (
//       date[0] == datePickerValues[0] &&
//       date[1] == datePickerValues[1] &&
//       date[2] == datePickerValues[2]
//     ) {
//       // for (let i = 0; i <= 23; i++) {
//       const Davg = arr.filter(() => {
//         console.log(11 == +hour[0]);
//         return 11 == +hour[0];
//       });

//       // if (hour[0] == i) {
//       //   for (let j = 0; j < 10; j++) {
//       //     count++;
//       //     sum += +el.temp;
//       //     console.log("HI", sum, count);
//       //     dayAverages.push(sum / count);
//       //   }
//       // }
//       console.log(Davg);
//       // }
//     }
//   });
// };

// const data = {
//   labels: monthsLabels,
//   datasets: [
//     {
//       label: "Sensor 1 ",
//       backgroundColor: "#444",
//       borderColor: "#444",
//       data: [12, 51, 15, 0, 2, 18, 32],
//     },
//   ],
// };

// const monthDays = getDaysInMonth(1, 2022);
// console.log(monthDays.length);
// for (let i = 1; i <= labels.length; i++) {
//   labels.push(i);
//   data.datasets[0].data.push(Math.trunc(Math.random() * 50 + 1));
// }

// const config = {
//   type: "line",
//   data: data,
//   options: {},
// };

// const myChart = new Chart(document.getElementById("myChart"), config);

//   filterByDay();
//   // filterByWeeks();
//   // filterByYears();
//   for (let i = 0; i <= labels.length; i++) {
//     data.datasets[0].data.push(Math.trunc(Math.random() * 50 + 1));
//   }
