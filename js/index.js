const APP_ID = `40ee978929d4d63f0f0a10752664d887`;
/* */
const DEFAULT_VALUE = "---";
const cityName = document.querySelector(".city-name");
const weatherState = document.querySelector(".weather-state");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
/* */
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const humidity = document.querySelector(".humidity");
const windspeed = document.querySelector(".wind-speed");
/* */
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("change", function (e) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`
  ).then(async (res) => {
    const data = await res.json();
    // console.log("data la:", data);
    /* hiển thị dữ liệu */
    cityName.innerHTML = data.name || DEFAULT_VALUE; /* nếu k có ra mặc định */
    weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
    weatherIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    ) || DEFAULT_VALUE;
    /* */
    temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;
    sunset.innerHTML =
      moment.unix(data.sys.sunset).format("H:mm") || DEFAULT_VALUE;
    sunrise.innerHTML =
      moment.unix(data.sys.sunrise).format("H:mm") || DEFAULT_VALUE;
    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
    windspeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
  });
});
/*-------------Trợ Lý Ảo------------- */
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis; // giọng nói
const microphone = document.querySelector(".microphone");
// config giọng nói tiếng việt
recognition.lang = "vi-VI";
// kết quả trả về ngay khi tìm kiếm bằng giọng nói
recognition.continuous = false;
//-------------//
const speak = (text) => {
  if (synth.speaking) {
    console.error("busy", "speaking....");
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.onend = () => {
    console.log("SpeechSynthesisUtterance.onend");
  };
  utter.onerror = (err) => {
    console.log("SpeechSynthesisUtterance.onerror", err);
  };
  synth.speak(utter);
};
//--------------------------------------------//
const handleVoice = (text) => {
  console.log("text", text);

  // vd: thời tiết tại hà nội =>["thời tiết tại","hà nội"]
  const handledText = text.toLowerCase();
  if (handledText.includes("thời tiết tại")) {
    const location = handledText.split("tại")[1].trim();
    console.log("location", location);
    searchInput.value = location;
    const changeEvent = new Event("change");
    searchInput.dispatchEvent(changeEvent);
    return;
  }
  /*thay đổi màu nền */
  if (handledText.includes("thay đổi màu nền")) {
    const color = handledText.split("màu nền")[1].trim();
    const container = document.querySelector(".container");
    container.style.backgroundColor = color;
    return;
  }
  /*reset màu */
  if (handledText.includes("màu nền mặc định")) {
    container.style.backgroundColor = "";
    return;
  }
  /*thời gian hiện tại  */
  if (handledText.includes("mấy giờ")) {
    const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
  }
  speak("Try again"); // khi k có các trường hợp trên
};
//--------------------------------------------//
/*event microphone */
microphone.addEventListener("click", (e) => {
  e.preventDefault();
  recognition.start(); // hỏi truy cập microphone
  microphone.classList.add("recording");
});
/*hoàn thành việc speech */
recognition.onspeechend = () => {
  recognition.stop();
  microphone.classList.remove("recording");
};
/*khi có lỗi xảy ra */
recognition.onerror = (err) => {
  console.error(err);
  microphone.classList.remove("recording");
};
/*khi có kết quả trả về */
recognition.onresult = (e) => {
  console.log("onresult", e);
  const text = e.result[0][0].transcript;
  handleVoice(text);
};
