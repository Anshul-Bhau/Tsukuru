document.addEventListener('DOMContentLoaded', function () {
    // Toggle password visibility
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function () {
            const passwordInput = document.getElementById('login-password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }

    // Handle tab switching
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotForm = document.getElementById('forgot-form');

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        forgotForm.classList.remove('active');
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        forgotForm.classList.remove('active');
    });

    // Handle forgot password link
    const forgotPassword = document.getElementById('forgot-password');
    const backToLogin = document.getElementById('back-to-login');

    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        forgotForm.classList.add('active');
    });

    backToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        forgotForm.classList.remove('active');
        loginForm.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // const loginForm = document.getElementById('login-form');
    const loginUrl = document.body.dataset.loginUrl;
    const dashboardUrl = document.body.dataset.dashboardUrl;

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Login successful") {
                    window.location.href = dashboardUrl;
                } else {
                    alert(data.error || "Invalid login");
                }
            })
            .catch(err => {
                console.error("Login error:", err);
                alert("An error occurred. Please try again.");
            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
    const signupUrl = document.body.dataset.signupUrl;
    const dashboardUrl = document.body.dataset.dashboardUrl;

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const confirmPassword = document.getElementById('signup-confirm').value.trim();
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        fetch(signupUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(csrfToken && { "X-CSRFToken": csrfToken })
            },
            body: JSON.stringify({ name, email, password }),
        })
        .then(async response => {
            let data;
            try {
                data = await response.json();
            } catch (err) {
                console.error("JSON parsing failed:", err);
                alert("Invalid server response.");
                return;
            }

            if (!response.ok) {
                console.error("Signup error:", data.error || data);
                alert(data.error || "Signup failed.");
                return;
            }

            console.log("Signup response JSON:", data);
            alert(data.message || "Signup successful");
            window.location.href = dashboardUrl;
        })
        .catch(error => {
            console.error("Signup fetch failed:", error);
            alert("An unexpected error occurred.");
        });
    });
});
