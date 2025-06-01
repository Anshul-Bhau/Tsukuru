const back_btn = document.getElementById("back_btn");
if (back_btn) {
    back_btn.addEventListener("click", () => {
        setTimeout(() => {
            history.back();
        }, 50);
    })
}

document.addEventListener("DOMContentLoaded", () => {
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
})