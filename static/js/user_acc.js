const menu = document.getElementById("side_menu");
const toggle = document.querySelector(".menu_toggle");

toggle.addEventListener('click', function (e) {
    e.preventDefault();
    menu.style.left = (menu.style.left == '0px') ? '-250px' : '0px'
});

document.addEventListener('click', function (e) {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        sideMenu.style.left = '-250px';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.menu_items li a');

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});