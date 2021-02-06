
let optionsValues = [['weather', false], ['attraction', false], ['sort', false]];
let checkboxes = document.querySelectorAll('input[type=checkbox]');
const apikey = "8b4c15d2d0638b590c32e373ba197bbb"

document.querySelector('.search__term i').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        let returnObj = await apiCallLatLon(pos.coords.latitude, pos.coords.longitude);
        document.getElementById('searchterm').value = returnObj.name;
        document.getElementById('searchbutton').click();
    });
})

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
const clientSecret = '2RLZPVABFLJ51G0LHVOIHAC3FB5DFIIEJDJOD5PND5F4RT5Z';
const token = `client_id=${clientId}&client_secret=${clientSecret}`
let attractionURL = 'https://api.foursquare.com/v2/venues/explore/';
async function attraction(city) {
    let query = typeof city === 'object' ? `&near=${city.la},${city.lo}&limit=10&sortByPopularity=1` : `&near=${city.replace(' ', '%20')}&limit=10&sortByPopularity=1`;
    let response = await fetch(attractionURL + token + query);
    let json = await response.json();
    alert(JSON.stringify(json));
    return json;
}

function updateWeather(obj) {
    let weatherForm = document.querySelectorAll('.results__weather__details__item p');
    document.querySelector('.results__weather__top h1').innerHTML = `Weather <br> - ${obj.name}`;
    let weather = [
        obj.weather[0].description,
        `${Math.round((obj.main.temp - 273.15) * 10) / 10} C`,
        `${obj.wind.speed} m/s`,
        `${obj.clouds.all} %`,
        `${obj.visibility / 10} m`,
        `${obj.main.humidity / 10} %`
    ];
    document.getElementById('weatherimg').src = `http://openweathermap.org/img/wn/${obj.weather[0].icon.replace('n', 'd')}@2x.png`;
    weatherForm.forEach((o,i) => { o.innerHTML = weather[i]; })
}