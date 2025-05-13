const saveIcons = document.querySelectorAll('.save_icon');
const modal = document.getElementById('saveModal');
const recipeIdInput = document.getElementById('recipeIdinput');
const closeBtn = document.querySelector('.close-button');

saveIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');

        // Set recipe ID in hidden input
        const recipeId = icon.getAttribute('data-recipe-id');
        recipeIdInput.value = recipeId;

        // Show modal
        modal.classList.remove('hidden');
    });
});

function closeSaveModal() {
    modal.classList.add('hidden');
}

const search_sec = document.getElementById('searched_recipes_container');
