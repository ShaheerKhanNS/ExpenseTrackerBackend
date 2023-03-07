const btnReset = document.querySelector(".btn");
const URL = `http://35.78.245.211:3000`;
// const URL = `http://localhost:3000`;

btnReset.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  try {
    const response = await axios({
      method: "POST",
      url: `${URL}/api/v1/password/forgotpassword`,

      data: {
        email,
      },
    });
    alert(response.data.message);
    document.getElementById("email").value = "";
  } catch (err) {
    document.body.innerHTML += `<div class='error'>${err.response.data.message}</div>`;
  }
});
