
var event_name_string = 'heroic_race';
var current_lap = 1; 

function local_storage_value(localStorageName, localStorageValue) {
    if (typeof localStorageValue === 'undefined') {
        localStorageValue = 'default';
    }
    if (localStorageValue == 'default') {
        return localStorage.getItem(localStorageName);
    } else {
        localStorage.setItem(localStorageName, localStorageValue);
        return "set localstorage name '" + localStorageName + "' to value '" + localStorageValue + "'";
    }
}

function changeLap(direction) {
    var currentLapNum = parseInt(current_lap);
    var newLap = currentLapNum + direction;
    if (newLap < 1) newLap = 1;
    if (newLap > 29) newLap = 29;
    document.getElementById('lp_select').value = newLap;
    update_laps(newLap);
    updateButtonStates();
}

function updateButtonStates() {
    var currentLapNum = parseInt(current_lap);
    var prevButton = document.getElementById('prev_lap');
    var nextButton = document.getElementById('next_lap');
    prevButton.disabled = currentLapNum <= 1;
    nextButton.disabled = currentLapNum >= 29;
    prevButton.style.opacity = currentLapNum <= 1 ? '0.5' : '1';
    nextButton.style.opacity = currentLapNum >= 29 ? '0.5' : '1';
}

// Update the existing update_laps function to call updateButtonStates
function update_laps(value) {
    for (let i = 1; i <= 29; i++) {
        var lapElement = document.getElementById('hl' + i);
        if (lapElement) {
            lapElement.style.display = 'none';
        }
    }

    var selectedLap = document.getElementById('hl' + value);
    if (selectedLap) {
        selectedLap.style.display = 'block';
    }
    current_lap = value;
    local_storage_value(event_name_string + '_lap_js', current_lap);
    updateButtonStates();
}

function load_defaults() {
    var default_lap = local_storage_value(event_name_string + '_lap_js');

    if (default_lap == null || default_lap == '' || isNaN(default_lap)) {
        default_lap = 1;
    }

    default_lap = String(default_lap);
    document.getElementById('lp_select').value = default_lap;
    update_laps(default_lap);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load_defaults);
} else {
    load_defaults();
}
