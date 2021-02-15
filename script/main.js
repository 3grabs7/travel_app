
// Remove placeholder while search contains searchterm
document.getElementById('searchterm').addEventListener('input', (e) => {
    let placeholder = document.querySelector('#placeholder');
    if(e.currentTarget.value === '') {
       placeholder.innerHTML = 'Enter your destination';
    } 
})

// Get ll and convert to name with location button
document.querySelector('.search__term i').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        // use API and update searchterm with name of location as provided by API
        let returnObj = await apiCallLatLon(pos.coords.latitude, pos.coords.longitude);
        document.getElementById('searchterm').value = returnObj.name;
        document.getElementById('searchbutton').click();
    });
    document.querySelector('#placeholder').innerHTML = '';
})

// Event for checkboxes, both weather and attraction can't be true @same time
let checkboxes = Array.from(document.querySelectorAll('input[type=checkbox]')).slice(0,3);
// Array to keep track of status of checkboxes
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

// Initate search, call methods for API calls
document.getElementById('searchbutton').addEventListener('click', async () => {
    let input = document.getElementById('searchterm').value;
    let placeholder = document.querySelector('#placeholder');
    if(input === '') { 
        // Placeholder blink animation when no user input is given
        for(let i = 1; i < 6; i++) {
            setTimeout(() => {
                placeholder.style = 'opacity:0;transition opacity 0.5s';
                setTimeout(() => {
                    placeholder.style = 'opacity:1;transition opacity 0.5s';
                }, 150 * i);
            }, 150 * i);
        }
    } 
    else {
        // Make API calls and catch if response fails 
        try {
            let returnObj = await apiCallName(input);
            clearAttractions();
            attraction(input);
            updateWeather(returnObj);
            // Update placeholder
            placeholder.innerHTML = '';
        }
        // Update placeholder to inform that search yielded no results
        catch {
            placeholder.innerHTML = 'Destination not found';
            // Transition for placeholder, prompt user for search term
            setTimeout(() => {
                placeholder.innerHTML = 'Enter your destination';
            }, 3000)
        }
    }
    let weather = document.querySelector('.results__weather');
    let attractions = document.querySelector('.results__attractions')
    // Show results based on weather/attraction checkbox
    if(optionsValues[0][1] === true) {
        weather.style.display = 'flex';
        attractions.style.display = 'none';
    }
    if(optionsValues[1][1] === true) {
        weather.style.display = 'none';
        attractions.style.display = 'block';  
    }
    if(optionsValues[1][1] === false && optionsValues[0][1] === false) {
        attractions.style.display = 'block';
        weather.style.display = 'flex';
    } 
    if(optionsValues[2][1] === true) { sorted = true; }
    else { sorted = false; }
})
// Event listener to call when user hits enter
document.getElementById('searchterm').addEventListener('keydown', (e) => {
    if(e.keyCode === 13) { document.getElementById('searchbutton').click(); }
})

// Weather API
const apikey = "8b4c15d2d0638b590c32e373ba197bbb"
async function apiCallName(city) {
    // Replace any blank spaces
    city.replace(' ', '%20');
    // Wait for response
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`);
    // When response recieved promise to convert to json then return
    let json = await response.json();
    return json;
}
// API call when searching based of geolocation
async function apiCallLatLon(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);
    let json = await response.json();
    return json;
}
// Update weather with info from json object
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
    // Start animation for weather info change
    loadAnimation();
    // Set timeout so that info updates 75% through animation
    setTimeout(()=>{
        document.querySelector('.results__weather__top h1').innerHTML = `Weather <br> <span style="font-size:60px">${obj.name}</span>`;
        document.getElementById('weatherimg').src = `http://openweathermap.org/img/wn/${obj.weather[0].icon.replace('n', 'd')}@2x.png`;
        weatherForm.forEach((o,i) => { o.innerHTML = weather[i]; })
    }, 750)
}

// Set todays date for API
let date = new Date();
let dd = String(date.getDate()).padStart(2, '0');
let mm = String(date.getMonth() + 1).padStart(2, '0');
let yyyy = date.getFullYear();
let today = `${yyyy}${mm}${dd}`;
// create base URL with id, secret and date
const clientId = '5O0MIVGTSWVDRA5LG0A3MZE4QPMUA3K5BAFCHMHQ3L2SRZ1B';
const clientSecret = 'RUO5D0ZODJHNJPROXXMXCYBBY3BL4M3TRA4PFZDVKCXJEV1O';
const token = `&client_id=${clientId}&client_secret=${clientSecret}&v=${today}`
let attractionURL = 'https://api.foursquare.com/v2/venues/search?';
// Array with APIs category ids and state of category checkboxes
let categories = [
    {name:'art_entertainment', id:'4d4b7104d754a06370d81259', checked:false},
    {name:'event', id:'4d4b7105d754a06373d81259', checked:false},
    {name:'food', id:'4d4b7105d754a06374d81259', checked:false},
    {name:'nightlife', id:'4d4b7105d754a06376d81259', checked:false},
    {name:'recreation', id:'4d4b7105d754a06377d81259', checked:false},
    {name:'shop_service', id:'4d4b7105d754a06378d81259', checked:false},
    {name:'travel_transport', id:'4d4b7105d754a06379d81259', checked:false}
        ];
// Event listeners for checkboxes to update array with status 
// Change background style and hover color when checked
let catboxes = document.querySelectorAll('.search__categories');
for(let i = 0; i < catboxes[0].children.length; i++) {
    catboxes[0].children[i].addEventListener('change', (e) => {
        let checkbox = e.currentTarget;
        for(let i = 0; i < categories.length; i++) {
            if(categories[i].name === checkbox.name) {
                if (categories[i].checked === true) {
                    categories[i].checked = false; 
                    checkbox.nextElementSibling.style = 'background-color:none;color:rgb(151, 117, 252)';
                    checkbox.nextElementSibling.addEventListener('mouseover', (e) => {
                        e.currentTarget.style.color = 'rgb(151, 117, 252)';
                    })
                    checkbox.nextElementSibling.addEventListener('mouseout', (e) => {
                        e.currentTarget.style.color = 'white';
                    })  
                } else { 
                    categories[i].checked = true;
                    checkbox.nextElementSibling.style = 'background-color:rgb(92, 145, 243);color:black';
                    checkbox.nextElementSibling.addEventListener('mouseover', (e) => {
                        e.currentTarget.style.color = 'black';
                    })
                    checkbox.nextElementSibling.addEventListener('mouseout', (e) => {
                        e.currentTarget.style.color = 'white';
                    })
                }
            }
        }
    })
}
// API call to get venues
async function attraction(city) {
    // Repeat search for each category == true, if all categories are unchecked, search in every category
    if(categories.filter(c=>c.checked === true).length === 0) {
        // Update query with search term
        let query = `near=${city.replace(' ', '%20')}&limit=116&sortByPopularity=1`;
        // Send request
        let response = await fetch(`${attractionURL}${query}${token}`);
        // Await response and convert to json
        let json = await response.json();
        // Create object with name, category and adress from response
        let venues = {
            name:json.response.venues.map(v=>v.name),
            category:json.response.venues.map(v=> v.categories[0]).map(i=> i?.name ?? 'Unknown'),
            address:json.response.venues.map(v=> v.location.address),
            icon:json.response.venues.map(v=> v.categories[0]).map(i=> i?.icon ?? 'Unknown')
        }
        // Update results based on the object we created from response
        loadAttractions(venues);
        // Else -> make one API call per category checked, 6 results per call
    } else {
        for(let i = 0; i < categories.length; i++) {
            if(categories[i].checked === true) {
                // Update query with search term
                let query = `near=${city.replace(' ', '%20')}&limit=62&sortByPopularity=1`;
                // Add query for category
                let category = `&categoryId=${categories[i].id}` 
                // Send request
                let response = await fetch(`${attractionURL}${query}${category}${token}`);
                // Await response and convert to json
                let json = await response.json();
                // Create object with name, category and adress
                // We don't need to care about catching map error here 'cause we only search through categories supplied by API
                let venues = {
                    name:json.response.venues.map(v=>v.name),
                    category:json.response.venues.map(v=> v.categories[0]).map(i=>i.name),
                    address:json.response.venues.map(v=> v.location.address),
                    icon:json.response.venues.map(v=> v.categories[0]).map(i=>i.icon)
                }
                // Update results based on the object we got
                loadAttractions(venues);
            }
        }
    }
}
// Clear attractions
function clearAttractions() {
    Array.from(document.querySelector('.results__attractions__boxes').childNodes).forEach(e => e.remove());
}
// Update results with attractions from API response
function loadAttractions(obj) {
    let src = document.querySelector('.results__attractions__boxes');
    // If sorted checked -> sort venues
    // ENVISHETEN VANN!!!! JAG GJORDE DET!!!!!!!!! SKRYYYYYYYYYYYT!!!!!!
    if(optionsValues[2][1] === true) { 
        let length = obj.name.length;
        let min = 0;
        for(let i = 0; i < length; i++) {
            min = i;
            for(let j = i+1; j < length; j++) {
                if(obj.name[j] < obj.name[min]) {
                    min = j;
                }
            }
            for(const arr in obj) {
                let temp = obj[arr][i];
                obj[arr][i] = obj[arr][min];
                obj[arr][min] = temp
            }
        }
    }
    // Add attraction to search result
    for(let i = 0; i < obj.name.length; i++) {
        let box = document.createElement('div');
        box.className = 'results__attractions__boxes__box';
        let head = document.createElement('h1');
        if(obj.name[i].length > 30) {
            obj.name[i] = `${obj.name[i].slice(0, 30)}...`;
        }
        head.innerHTML = obj.name[i]?? 'No name found';
        let category = document.createElement('p');
        category.innerHTML = obj.category[i];
        let address = document.createElement('p');
        address.innerHTML = obj.address[i]?? 'No adress found';
        // Sizes 32, 44, 64, 88
        let icon = document.createElement('img');
        if(typeof obj.icon[i] != 'string') {
            icon.src = `${obj.icon[i].prefix}88${obj.icon[i].suffix}`
        } else {
            // Icon not found
            icon.src = 'https://www.freeiconspng.com/uploads/exclamation-point-error-simple-black-background-pictures-18.png';
            icon.style = 'filter:invert(1)';
        }
        box.appendChild(head);
        box.appendChild(icon);
        box.appendChild(category);
        box.appendChild(address);
        src.appendChild(box);
    }
}

// Animation that occurs when weather is updated
function loadAnimation() {
    document.getElementsByTagName('hr')[1].style.animation = 'ripple 1s linear 1';
    document.querySelector('.results__weather__top h1').style.animation = 'rotateLetters 1s linear 1';
    let icons = document.querySelectorAll('.results__weather__details__item');
    for(let i = 0; i < icons.length; i++) {
        icons[i].style.animation = 'rotateIcons 1s linear 1';
    }
    setTimeout(() => {
        document.getElementsByTagName('hr')[1].style.animation = '';
        document.querySelector('.results__weather__top h1').style.animation = '';
        for(let i = 0; i < icons.length; i++) {
            icons[i].style.animation = '';
        }
    }, 1000)
}

// Transition for attraction elements when scrolled and elements are in window view
let i = 0;
window.addEventListener('scroll', () => {
    var scrollpos = window.scrollY; 
    var wh = window.innerHeight-50; 
    let boxes = document.querySelectorAll('.results__attractions__boxes__box') ?? undefined;
    if(boxes != undefined) {
        Array.from(boxes).forEach((b)=>{
            if(scrollpos > (b.offsetTop - wh) - 20){
                if(i < 3) {
                    if(b.style.animation === '') {
                        // Delay for each 3 elements in one row, transition left to right
                        b.style.animation = `enterattraction 0.7s ${i / 10 }s linear 1 forwards`;
                        i++;
                    }
                } else { i = 0; }
            } 
        })
    }
})

