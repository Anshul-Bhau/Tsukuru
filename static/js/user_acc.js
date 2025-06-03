document.addEventListener('DOMContentLoaded', () => {
    const menu_icon = document.getElementById("menu_btn");
    const side_panel = document.getElementById("sidebar");
    const menuLinks = document.querySelectorAll('.menu_items li a');
    const side_text = document.getElementById('side_title');
    const profileImg = document.getElementById("profile_img");
    const profileSectionImg = document.getElementById("profile_sec_img");
    const chooser = document.getElementById("pfp_chooser");
    const chooseBtn = document.getElementById("pfp_choice_btn");
    const defaultPfp = "/static/images/pfp/default-pfp.jpg";
    const savedPfp = localStorage.getItem("selectedPfp");
    const boards = document.querySelectorAll(".board");
    const fav_boards = document.querySelector(".fav_boards");
    const recipe_boards = document.querySelectorAll(".recipe_boards");
    const close_board_btn = document.querySelectorAll(".close_board_view");


    function imageExists(url, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = url;
    }


    if (savedPfp) {
        imageExists(savedPfp, exists => {
            const pfpToUse = exists ? savedPfp : defaultPfp;
            if (profileImg) profileImg.setAttribute("src", pfpToUse);
            if (profileSectionImg) profileSectionImg.setAttribute("src", pfpToUse);
            if (!exists) localStorage.removeItem("selectedPfp");
        });
    } else {
        if (profileImg) profileImg.setAttribute("src", defaultPfp);
        if (profileSectionImg) profileSectionImg.setAttribute("src", defaultPfp);
    }


    chooseBtn.addEventListener("click", () => {
        chooser.classList.toggle("show");
    });


    document.querySelectorAll(".pfp_option").forEach(img => {
        img.addEventListener("click", () => {
            const newSrc = img.getAttribute("src");

            if (profileImg) profileImg.setAttribute("src", newSrc);
            if (profileSectionImg) profileSectionImg.setAttribute("src", newSrc);

            localStorage.setItem("selectedPfp", newSrc);

            const hiddenInput = document.getElementById("selected_pfp");
            if (hiddenInput) hiddenInput.value = newSrc;

            console.log("Avatar clicked:", img.src);

            chooser.classList.remove("show");
        });
    });

    let panel_open = false;

    menu_icon.addEventListener('click', (e) => {
        e.stopPropagation();
        panel_open = !panel_open;
        side_panel.style.left = panel_open ? '0' : '-220px';
    });

    document.addEventListener('click', (e) => {
        if (panel_open && !side_panel.contains(e.target) && e.target !== menu_icon) {
            side_panel.style.left = '-220px';
            panel_open = false;
        }
    });

    side_panel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    const sections = document.querySelectorAll('.panel_section');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const newTitle = link.getAttribute('data-title');
            const targetID = link.getAttribute('data-section');

            side_text.textContent = newTitle;
            sections.forEach(section => {
                section.style.display = (section.id == targetID) ? 'block' : 'none';
            });
        });
    });


    const edit = document.getElementById('edit_btn');
    const save = document.getElementById('save_btn');

    edit.addEventListener('click', function () {
        document.getElementById('username_field').removeAttribute('readonly');
        document.getElementById('email_field').removeAttribute('readonly');
        document.getElementById('password_field').removeAttribute('readonly');
        edit.style.display = 'none';
        save.style.display = 'inline-block';
    });

    save.addEventListener('click', function () {
        document.getElementById('user_form').submit();
    });

    boards.forEach(board => {
        board.addEventListener("click", () => {
            const boardID = board.getAttribute("data-board-id");

            recipe_boards.forEach(recipe_board => {
                recipe_board.style.display = "none";
            });

            const target_board = document.querySelector(`.recipe_boards[data-board-id="${boardID}"]`);
            if (target_board) {
                target_board.style.display = "block";
                fav_boards.style.display = "none";
            }
        })
    });

    close_board_btn.forEach(close_btn => {
        close_btn.addEventListener("click", () => {
            const board_div = close_btn.closest(".recipe_boards");
            if (board_div) {
                board_div.style.display = "none";
                fav_boards.style.display = "flex";
            }
        })
    });
    document.querySelectorAll('.save_icon.saved').forEach(icon => {
        icon.addEventListener('click', function () {
            const recipeId = this.dataset.recipeId;
            const boardId = this.dataset.boardId;

            fetch(`/unsave_recipe/${recipeId}/${boardId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.message) {
                        console.log(data.message);
                        this.classList.remove('saved');
                        this.closest('.card').remove();
                    } else {
                        console.error(data.error || "Unknown error");
                    }
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                });
        });

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    cookie = cookie.trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.startsWith(name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }


    });
});
