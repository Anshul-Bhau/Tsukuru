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

    menu_icon.addEventListener('click', () => {
        side_panel.style.left = 0;
    })

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
});
