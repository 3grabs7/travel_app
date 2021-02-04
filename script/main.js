
let optionsValues = [['weather', false], ['attraction', false], ['sort', false]];
let checkboxes = document.querySelectorAll('input[type=checkbox]');
const apikey = "8b4c15d2d0638b590c32e373ba197bbb"

document.querySelector('.search__term i').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((pos) => {
        document.getElementById('searchterm').value = `${pos.coords.latitude}, ${pos.coords.longitude}`;
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
    if(input === '') {
        alert('Please enter a destination');
    } else {
        let returnStr = await apiCall(input);
        alert(returnStr);
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

async function apiCall(city) {
    city.replace(' ', '%20');
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`);
    let json = await response.json();
    return JSON.stringify(json);
}


