const back_btn = document.getElementById("back_btn");
if (back_btn) {
    back_btn.addEventListener("click", () => {
        setTimeout(() => {
            history.back();
        }, 50);
    })
}