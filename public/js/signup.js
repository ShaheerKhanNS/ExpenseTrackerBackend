const btnSignup = document.querySelector(".btn-signup");
const URL = `http://35.78.245.211:3000`;
// const URL = `http://localhost:3000`;
const clearField = () => {
  document.getElementById("name").value =
    document.getElementById("email").value =
    document.getElementById("password").value =
      "";
};

btnSignup.addEventListener("click", async () => {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (name && email && password) {
      await axios({
        method: "POST",
        url: `${URL}/api/v1/users`,
        data: {
          name,
          email,
          password,
        },
      });
      clearField();
      window.location.replace(`${URL}/login/login.html`);
    }
  } catch (err) {
    document.body.innerHTML += `<div class="error">${err.response.data.message}</div>`;
  }
});
