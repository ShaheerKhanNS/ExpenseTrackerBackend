const btnLogin = document.querySelector(".btn-login");
const URL = `http://35.78.245.211:3000`;
// const URL = `http://localhost:3000`;

btnLogin.addEventListener("click", async () => {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
      const respone = await axios({
        method: "POST",
        url: `${URL}/api/v1/users/login`,
        data: {
          email,
          password,
        },
      });

      alert(respone.data.message);
      localStorage.setItem("token", respone.data.token);
      window.location.replace(`${URL}/expensepage/expensePage.html`);
    } else {
      alert("Please Provide your registered email and password");
    }
  } catch (err) {
    document.body.innerHTML += `<div class="error" >${err.response.data.message}</div>`;
  }
});
