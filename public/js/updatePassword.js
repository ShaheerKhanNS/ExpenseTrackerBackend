const btnSubmit = document.querySelector(".btn");
const URL = `http://35.78.245.211:3000`;
// const URL = `http://localhost:3000`;
btnSubmit.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const password = document.getElementById("password").value;

    if (password) {
      const response = await axios({
        method: "POST",
        url: `${URL}/api/v1/password/updatePassword/`,
        data: {
          password,
        },
      });

      alert(response.data.message);
      window.location.replace(`${URL}/html/login.html`);
    }
  } catch (err) {
    console.log(err.message);
  }
});
