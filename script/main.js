const apikey = "8b4c15d2d0638b590c32e373ba197bbb"

document.getElementById('searchterm').addEventListener('change', (e) => {
    if(e.currentTarget.value != '') {
        document.querySelector('#placeholder').innerHTML = "";
    } else { document.querySelector('#placeholder').innerHTML = 'Enter your destination' }
})

document.querySelector('.search__term i').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        let returnObj = await apiCallLatLon(pos.coords.latitude, pos.coords.longitude);
        document.getElementById('searchterm').value = returnObj.name;
        document.getElementById('searchbutton').click();
    });
    document.querySelector('#placeholder').innerHTML = ""
})

let checkboxes = document.querySelectorAll('input[type=checkbox]');
let optionsValues = [['weather', false], ['attraction', false], ['sort', false]];
checkboxes.forEach(function(box) {
    box.addEventListener('change', function(e) {
        let weather = document.querySelector('input[name=weather]');
        let attraction = document.querySelector('input[name=attraction]');
        if(e.currentTarget.name !== 'sort') {
            if(optionsValues[0][1] === true) { weather.checked = false; } 
            else if(optionsValues[1][1] === true) { attraction.checked = false; }
        }
        optionsValues = [];
        checkboxes.forEach(b=> optionsValues.push([b.name ,b.checked]));
    }) 
})

document.getElementById('searchbutton').addEventListener('click', async () => {
    let input = document.getElementById('searchterm').value;
    if(input === '') { alert('Please enter a destination'); } 
    else {
        let returnObj = await apiCallName(input);


        attraction(input);
        //attraction({la: "0000000", lo: "0000000"});

        updateWeather(returnObj);
    }
    if(optionsValues[0][1] === true) {
        document.querySelector('.results__weather').style.display = 'flex';
        document.querySelector('.results__attractions').style.display = 'none';
    }
    if(optionsValues[1][1] === true) {
        document.querySelector('.results__weather').style.display = 'none';
        document.querySelector('.results__attractions').style.display = 'block';  
    }
    if(optionsValues[1][1] === false && optionsValues[0][1] === false) {
        document.querySelector('.results__attractions').style.display = 'block';
        document.querySelector('.results__weather').style.display = 'flex';
    } 
})

document.getElementById('searchterm').addEventListener('keydown', (e) => {
    if(e.keyCode === 13) { document.getElementById('searchbutton').click(); }
})

async function apiCallName(city) {
    city.replace(' ', '%20');
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`);
    let json = await response.json();
    return json;
}
async function apiCallLatLon(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);
    let json = await response.json();
    return json;
}


const clientId = '5O0MIVGTSWVDRA5LG0A3MZE4QPMUA3K5BAFCHMHQ3L2SRZ1B';
const clientSecret = 'RUO5D0ZODJHNJPROXXMXCYBBY3BL4M3TRA4PFZDVKCXJEV1O';
const token = `&client_id=${clientId}&client_secret=${clientSecret}`
let attractionURL = 'https://api.foursquare.com/v2/venues/explore/';
async function attraction(city) {
    let query = typeof city === 'object' ? `near=${city.la},${city.lo}&limit=10&sortByPopularity=1` 
        : `near=${city.replace(' ', '%20')}&limit=10&sortByPopularity=1`;
    let response = await fetch(attractionURL + query + token);
    let json = await response.json();
    //alert(JSON.stringify(json));
    return json;
}

function updateWeather(obj) {
    let weatherForm = document.querySelectorAll('.results__weather__details__item p');
    let weather = [
        obj.weather[0].description,
        `${Math.round((obj.main.temp - 273.15) * 10) / 10} C`,
        `${obj.wind.speed} m/s`,
        `${obj.clouds.all} %`,
        `${obj.visibility / 10} m`,
        `${obj.main.humidity / 10} %`
    ];
    loadAnimation();
    setTimeout(()=>{
        document.querySelector('.results__weather__top h1').innerHTML = `Weather <br> - ${obj.name}`;

        document.getElementById('weatherimg').src = `http://openweathermap.org/img/wn/${obj.weather[0].icon.replace('n', 'd')}@2x.png`;
        weatherForm.forEach((o,i) => { o.innerHTML = weather[i]; })
    }, 750)
}


function loadAttractions(objArr) {
    let div = document.createElement('div');
    div.className = 'results__attractions__boxes';
    objArr.forEach((obj) => {
        let box = document.createElement('div');
        box.className = 'results__attractions__boxes__box';
        let img = document.createElement('img');
        img.src = obj.img;
        let head = document.createElement('h1');
        head.innerHTML = obj.name;
        let info = document.createElement('p');
        info.innerHTML = obj.desc;
        let link = document.createElement('a');
        link.innerHTML = 'Website goes here';
        link.href = obj.web;
        box.appendChild([img, head, info, link]);
        div.appendChild(box);
    })
}

function loadAnimation() {
    document.getElementsByTagName('hr')[0].style.animation = 'ripple 1s linear 1';
    document.querySelector('.results__weather__top h1').style.animation = 'rotateLetters 1s linear 1';
    let icons = document.querySelectorAll('.results__weather__details__item');
    for(let i = 0; i < icons.length; i++) {
        icons[i].style.animation = 'rotateIcons 1s linear 1';
    }
    setTimeout(() => {
        document.getElementsByTagName('hr')[0].style.animation = '';
        document.querySelector('.results__weather__top h1').style.animation = '';
        for(let i = 0; i < icons.length; i++) {
            icons[i].style.animation = '';
        }
    }, 1000)
    
}