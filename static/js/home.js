document.addEventListener("DOMContentLoaded", () => {

    const save_icons = document.querySelectorAll('.save_icon');
    const modal = document.getElementById('saveModal');
    const recipeIdInput = document.getElementById('recipeIdinput');
    const close_btn = document.querySelector('.close-button');

    save_icons.forEach(icon => {
        icon.addEventListener('click', () => {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');

            const recipeId = icon.getAttribute('data-recipe-id');
            if (recipeIdInput) recipeIdInput.value = recipeId;

            if (modal) modal.classList.remove('hidden');
        });
    });

    if (close_btn) {
        close_btn.addEventListener('click', () => {
            if (modal) modal.classList.add('hidden');
        });
    }

    const search_input = document.getElementById("search_input");
    if (search_input) {
        search_input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                localStorage.setItem("last_search", search_input.value.trim() || search_input.placeholder);
            }
        });
    }

    const last_search = localStorage.getItem("last_search");
    if (last_search) {
        const result_text = document.getElementById("result_text");
        if (result_text) result_text.textContent = `Showing results for "${last_search}"`;
        localStorage.removeItem("last_search");
    }

    const view_full_rec = document.querySelectorAll(".view_more");
    view_full_rec.forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "/recipe"
        });
    });
});
