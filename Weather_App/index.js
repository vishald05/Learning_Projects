let gen = document.querySelector(".gen");
let cityname = document.querySelector(".cityinput");
const contentBox = document.querySelector(".Contents");
const imageBox = document.querySelector(".WPic");
const card = document.querySelector(".Card");

contentBox.innerHTML = "";
imageBox.innerHTML = "";
card.style.display = "none";

const myAPI = "72e80ca8d2aa80d652b957a6deeaab81";

gen.addEventListener("click",getData);

async function getData(params){
    const city = cityname.value;
    contentBox.innerHTML = "";
    imageBox.innerHTML = "";

    if(!city){
        displayerror();
        throw new Error("Enter Some City");
    }
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${myAPI}`);

    Data = await response.json();

    displayData(Data);
}

function displayData(Data){

    const { main : {temp, humidity},
            name : city,
            weather : [{id, description}],
        } = Data;

    const citynameDis = document.createElement("h1");
    const Temperature = document.createElement("p");
    const Humidity = document.createElement("p");
    const descDis = document.createElement("p");

    const Pic = document.createElement("img");

    citynameDis.textContent = city;
    Temperature.textContent = `Temperature : ${(temp - 273.15).toFixed(1)}'C`;
    Humidity.textContent = `Humidity : ${humidity}`;
    descDis.textContent = description;

    citynameDis.classList.add("citynameDis");
    Temperature.classList.add("Details");
    Humidity.classList.add("Details");
    descDis.classList.add("descDis");
    
    contentBox.appendChild(citynameDis);
    contentBox.appendChild(Temperature);
    contentBox.appendChild(Humidity);
    contentBox.appendChild(descDis);

    card.style.display = 'flex';

    Pic.src = `Weather_icons/${imageSelector(id)}.jpeg`;
    imageBox.appendChild(Pic);
}

function imageSelector(id) {
    if (id >= 200 && id < 300) return '200 to 300';
    else if (id >= 300 && id < 400) return '300 to 400';
    else if (id >= 500 && id < 600) return '500 to 600';
    else if (id >= 600 && id < 700) return '600 to 700';
    else if (id >= 700 && id < 800) return '700 to 800';
    else if (id === 800) return '800';
    else if (id >= 801 && id < 810) return '801 to 810';
    else return 'Default';
}
