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

// document.addEventListener('DOMContentLoaded', () => {
//     search_sec.style.display = 'none';
// });

// document.querySelectorAll('[name=boardOption]').forEach(radio => {
//     radio.addEventListener('change', function () {
//         const isNew = this.value === 'new';
//         document.getElementById('newBoardTitle').disabled = !isNew;
//         document.getElementById('existingBoards').disabled = isNew;
//     });
// });

// document.getElementById('saveRecipeForm').addEventListener('submit', function (e) {
//     e.preventDefault();

//     const boardOption = document.querySelector('[name=boardOption]:checked').value;
//     const boardTitle = boardOption === 'new'
//         ? document.getElementById('newBoardTitle').value.trim()
//         : document.getElementById('existingBoards').value;

//     const recipeId = document.getElementById('recipeIdField').value;

//     fetch('/save-to-board/', {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": csrfToken,
//         },
//         body: JSON.stringify({ board_title: boardTitle, recipe_id: recipeId }),
//     })
//         .then(res => res.json())
//         .then(data => {
//             alert(data.message || data.error);
//             document.getElementById('saveModal').classList.add('hidden');
//         });
// });



