document.addEventListener("DOMContentLoaded", () => {

    const save_icons = document.querySelectorAll('.save_icon');
    const modal = document.getElementById('saveModal');
    const recipeIdInput = document.getElementById('recipeIdinput');
    const close_btn = document.querySelector('.close-button');
    const sugg_btn = document.querySelectorAll(".sug_ing_btn");

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

    sugg_btn.forEach(btn => {
        btn.addEventListener("click", function (event) {
            const search_input = document.getElementById("search_input");
            const search_form = document.getElementById("search_form");

            const ingredient = event.currentTarget.textContent?.trim()

            if (search_input && ingredient) {
                search_input.value = ingredient;

                setTimeout(() => {
                    search_form.submit();
                }, 100);

                if (event.button == 0) {
                    localStorage.setItem("last_search", search_input.value.trim() || search_input.placeholder);
                    console.log()
                }

            } else {
                console.warn("Ingredient or input box not found.");
            }
        })
    })

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

    const nav_img = document.getElementById("nav_pfp");
    const default_pfp = "/static/images/pfp/default-pfp.jpg";
    const saved_pfp = localStorage.getItem("selectedPfp");

    function imageExists(url, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = url;
    }

    if (saved_pfp) {
        imageExists(saved_pfp, exists => {
            const pfpToUse = exists ? saved_pfp : default_pfp;
            if (nav_img) nav_img.setAttribute("src", pfpToUse);
            if (!exists) localStorage.removeItem("selectedPfp");
        });
    } else {
        if (nav_img) nav_img.setAttribute("src", default_pfp);
    }

    document.querySelectorAll(".saveRecipeForm").forEach(form => {
        form.addEventListener("submit", function (e) {
            const search_input = document.getElementById("search_input");
            const scroll_pos = window.scrollY;

            if (search_input) {
                sessionStorage.setItem("searchQuery", search_input.value);
            }
            sessionStorage.setItem("scrollPos", scroll_pos);
        });
    });

});

window.addEventListener("DOMContentLoaded", () => {
    const savedQuery = sessionStorage.getItem("searchQuery");
    const savedScroll = sessionStorage.getItem("scrollPos");

    if (savedQuery) {
        const input = document.getElementById("search_input");
        if (input) input.value = savedQuery;
        sessionStorage.removeItem("searchQuery");
    }

    if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll));
        sessionStorage.removeItem("scrollPos");
    }
});
