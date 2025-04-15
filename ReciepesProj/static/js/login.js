// // Tab switching functionality
// const loginTab = document.getElementById('login-tab');
// const signupTab = document.getElementById('signup-tab');
// const loginForm = document.getElementById('login-form');
// const signupForm = document.getElementById('signup-form');
// const forgotForm = document.getElementById('forgot-form');
// const forgotPassword = document.getElementById('forgot-password');
// const backToLogin = document.getElementById('back-to-login');

// loginTab.addEventListener('click', () => {
//   loginTab.classList.add('active');
//   signupTab.classList.remove('active');
//   loginForm.classList.add('active');
//   signupForm.classList.remove('active');
//   forgotForm.classList.remove('active');
// });

// signupTab.addEventListener('click', () => {
//   signupTab.classList.add('active');
//   loginTab.classList.remove('active');
//   signupForm.classList.add('active');
//   loginForm.classList.remove('active');
//   forgotForm.classList.remove('active');
// });

// // Forgot password functionality
// forgotPassword.addEventListener('click', (e) => {
//   e.preventDefault();
//   loginForm.classList.remove('active');
//   signupForm.classList.remove('active');
//   forgotForm.classList.add('active');
//   loginTab.classList.remove('active');
//   signupTab.classList.remove('active');
// });

// backToLogin.addEventListener('click', (e) => {
//   e.preventDefault();
//   forgotForm.classList.remove('active');
//   loginForm.classList.add('active');
//   loginTab.classList.add('active');
// });

// // Form submission handling (for demonstration purposes)
// loginForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const email = document.getElementById('login-email').value;
//   const password = document.getElementById('login-password').value;
//   const remember = document.getElementById('remember').checked;

//   console.log('Login attempt:', { email, password, remember });

//   if (remember) {
//     // In a real application, you would set cookies or localStorage
//     localStorage.setItem('rememberedEmail', email);
//   }

//   alert('Login successful! (Demo only)');
// });

// signupForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const name = document.getElementById('signup-name').value;
//   const email = document.getElementById('signup-email').value;
//   const password = document.getElementById('signup-password').value;
//   const confirm = document.getElementById('signup-confirm').value;

//   if (password !== confirm) {
//     alert('Passwords do not match!');
//     return;
//   }

//   console.log('Signup attempt:', { name, email, password });
//   alert('Account created successfully! (Demo only)');
// });

// forgotForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const email = document.getElementById('forgot-email').value;

//   console.log('Password reset requested for:', email);
//   alert('Password reset email sent! (Demo only)');

//   // Switch back to login form
//   forgotForm.classList.remove('active');
//   loginForm.classList.add('active');
//   loginTab.classList.add('active');
// });

// // Check for remembered email on page load
// window.addEventListener('DOMContentLoaded', () => {
//   const rememberedEmail = localStorage.getItem('rememberedEmail');
//   if (rememberedEmail) {
//     document.getElementById('login-email').value = rememberedEmail;
//     document.getElementById('remember').checked = true;
//   }
// });

// // Password visibility toggle
// document.addEventListener('DOMContentLoaded', () => {
//   const togglePasswordIcons = document.querySelectorAll('.password-toggle-icon');

//   togglePasswordIcons.forEach(icon => {
//     icon.addEventListener('click', function () {
//       // Get the previous sibling which is the password input
//       const passwordInput = this.previousElementSibling;

//       if (passwordInput.type === "password") {
//         passwordInput.type = "text";
//         passwordInput.classList.add('password-visible');
//         this.classList.remove('fa-eye');
//         this.classList.add('fa-eye-slash');
//       } else {
//         passwordInput.type = "password";
//         passwordInput.classList.remove('password-visible');
//         this.classList.remove('fa-eye-slash');
//         this.classList.add('fa-eye');
//       }
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', function() {
  // Toggle password visibility
  const toggleLoginPassword = document.getElementById('toggleLoginPassword');
  if (toggleLoginPassword) {
      toggleLoginPassword.addEventListener('click', function() {
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



// document.addEventListener('DOMContentLoaded', function() {
//   // Basic UI handlers (password toggle, tabs)
//   // ... (keep your existing UI handlers)

//   // Handle login form submission as JSON
//   const loginForm = document.getElementById('login-form');
//   loginForm.addEventListener('submit', function(event) {
//       event.preventDefault();
      
//       const email = document.getElementById('login-email').value;
//       const password = document.getElementById('login-password').value;
      
//       const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      
//       fetch('{% url "user_login" %}', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'X-CSRFToken': csrfToken
//           },
//           body: JSON.stringify({
//               email: email,
//               password: password
//           })
//       })
//       .then(response => response.json())
//       .then(data => {
//           if (data.message === "Login successful") {
//               window.location.href = '{% url "dashboard" %}';
//           } else {
//               alert(data.error || 'Login failed');
//           }
//       })
//       .catch(error => {
//           console.error('Error:', error);
//           alert('An error occurred during login');
//       });
//   });
// });

document.addEventListener('DOMContentLoaded', function () {
  // const loginForm = document.getElementById('login-form');
  const loginUrl = document.body.dataset.loginUrl;
  const dashboardUrl = document.body.dataset.dashboardUrl;

  loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

      fetch("{% url 'user_login' %}", {
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
              window.location.href = "{% url 'dashboard' %}";
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
