const menu = document.getElementById("sidebar");
const toggle = document.querySelector(".menu_toggle");

toggle.addEventListener('click', function (e) {
    e.preventDefault();
    menu.classList.toggle('open');
});

document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.menu_items li a');
    const side_text = document.getElementById('side_title');
    const profileImg = document.getElementById("profile_img");
    const profileSectionImg = document.getElementById("profile_sec_img");
    const savedPfp = localStorage.getItem("selectedPfp");

    if (savedPfp) {
        if (profileImg) profileImg.setAttribute("src", savedPfp);
        if (profileSectionImg) profileSectionImg.setAttribute("src", savedPfp);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const newTitle = link.getAttribute('data-title');
            side_text.textContent = newTitle;
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

    const chooser = document.getElementById("pfp_chooser");
    const chooseBtn = document.getElementById("pfp_choice_btn");

    chooseBtn.addEventListener("click", () => {
        chooser.style.display = chooser.style.display === "none" ? "block" : "none";
    });

    document.querySelectorAll(".pfp_option").forEach(img => {
        img.addEventListener("click", () => {
            const newSrc = img.getAttribute("src");

            if (profileImg) profileImg.setAttribute("src", newSrc);
            if (profileSectionImg) profileSectionImg.setAttribute("src", newSrc);

            localStorage.setItem("selectedPfp", newSrc);

            const hiddenInput = document.getElementById("selected_pfp");
            if (hiddenInput) hiddenInput.value = newSrc;

            chooser.style.display = "none";
        });
    });
});
