// document.addEventListener("DOMContentLoaded", function () {
//     // Handle tab switching
//     const loginTab = document.getElementById('login-tab');
//     const signupTab = document.getElementById('signup-tab');
//     const loginForm = document.getElementById('login-form');
//     const signupForm = document.getElementById('signup-form');
//     const forgotForm = document.getElementById('forgot-form');

//     loginTab.addEventListener('click', () => {
//         loginTab.classList.add('active');
//         signupTab.classList.remove('active');
//         loginForm.classList.add('active');
//         signupForm.classList.remove('active');
//         forgotForm.classList.remove('active');
//     });

//     signupTab.addEventListener('click', () => {
//         signupTab.classList.add('active');
//         loginTab.classList.remove('active');
//         signupForm.classList.add('active');
//         loginForm.classList.remove('active');
//         forgotForm.classList.remove('active');
//     });


//   // Optional: forgot password form toggle
//   const forgotLink = document.getElementById("forgot-password");
//   const backToLogin = document.getElementById("back-to-login");

//   if (forgotLink && forgotForm && loginForm) {
//     forgotLink.addEventListener("click", (e) => {
//       e.preventDefault();
//       forgotForm.classList.add("active");
//       loginForm.classList.remove("active");
//       signupForm.classList.remove("active");
//       loginTab?.classList.remove("active");
//       signupTab?.classList.remove("active");
//     });
//   }

//   if (backToLogin && forgotForm && loginForm) {
//     backToLogin.addEventListener("click", (e) => {
//       e.preventDefault();
//       forgotForm.classList.remove("active");
//       loginForm.classList.add("active");
//       loginTab?.classList.add("active");
//       signupTab?.classList.remove("active");
//     });
//   }
// });
