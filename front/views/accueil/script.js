document.addEventListener('click', function(event) {
    var isClickInsideElement = document.querySelector('.settings-container').contains(event.target);
    if (!isClickInsideElement) {
        document.getElementById('settings-menu').style.display = 'none';
    }
});

document.querySelector('.settings-icon').addEventListener('click', function(event) {
    var settingsMenu = document.getElementById('settings-menu');
    settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
});
