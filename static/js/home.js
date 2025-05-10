const save = document.getElementById('save_icon');

save.addEventListener('click', () => {
    save.classList.remove('fa-regular', 'fa-bookmark');
    save.classList.add('fa-solid', 'fa-bookmark');
});

const search_sec = document.getElementById('searched_recipes_container');

document.addEventListener('DOMContentLoaded', () => {
    search_sec.style.display = 'none';
});