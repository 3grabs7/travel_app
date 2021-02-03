
let optionsValues = [];
let checkboxes = document.querySelectorAll('input[type=checkbox]');

checkboxes.forEach(function(box) {
    box.addEventListener('change', function() {
        optionsValues = [];
        checkboxes.forEach(b=> optionsValues.push(b.checked));
    })
})


document.getElementById('searchbutton').addEventListener('click', () => {
    let input = document.getElementById('searchterm').value;
    if(input === '') {
        alert('Please enter a destination');
    } else {
        alert(input);
    }
})