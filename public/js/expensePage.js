// Button Elements
const btnSubmit = document.getElementById("btn");
const btnPremium = document.getElementById("btn-premium");
const btnLeader = document.getElementById("btn-leader");
const btnClose = document.getElementById("btn-close");
const btnFake = document.getElementById("btn-leader-fake");
const btnDownload = document.getElementById("btn-download-expense");
const btnLogout = document.getElementById("logout");
const btnPreviousRprt = document.getElementById("report");
const tableBody = document.getElementById("table");
const btnPageSize = document.getElementById("btn-size");
const premiumUser = document.getElementById("btn-premium-user");
const loggedUserName = document.getElementById("name");

const URL = `http://35.78.245.211:3000`;
// const URL = `http://localhost:3000`;

// Token for Authentication
const token = localStorage.getItem("token");

btnPageSize.addEventListener("click", () => {
  const size = document.getElementById("size").value;
  localStorage.setItem("pagesize", size);
});

const indianCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumSignificantDigits: 3,
});

const clearField = () => {
  document.getElementById("price").value =
    document.getElementById("description").value =
    document.getElementById("category").value =
      "";
};

btnLogout.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Are you sure you want to logout😕");
  localStorage.clear();
  window.location.replace(`${URL}/login/login.html`);
});

btnSubmit.addEventListener("click", async (e) => {
  try {
    e.preventDefault();

    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    const token = localStorage.getItem("token");

    if (price && description && category) {
      await axios({
        method: "POST",
        url: `${URL}/api/v1/expense/addexpense`,
        headers: {
          Authorization: token,
          "Cross-Origin-Resource-Policy": "cross-origin",
        },

        data: {
          price,
          description,
          category,
        },
      });
      clearField();
      window.location.reload();
    } else {
      alert("Please Fill all the required fields for better analysis🤗");
    }
  } catch (err) {
    alert(err.message);
  }
});

btnPremium.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await axios({
      method: "GET",
      url: `${URL}/api/v1/purchase/premiummembership`,
      headers: {
        Authorization: token,
        // "Cross-Origin-Embedder-Policy": "unsafe-none",
      },
    });

    console.log(response);

    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async (response) => {
        await axios({
          method: "POST",
          url: `${URL}/api/v1/purchase/premiummembership`,
          data: {
            status: true,
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          headers: { Authorization: token },
        });
        alert("You have a premium account😎");
        window.location.reload();
      },
    };

    const rzp = new Razorpay(options);

    rzp.open();

    rzp.on("payment.failed", async (error) => {
      await axios({
        method: "POST",
        url: `${URL}/api/v1/purchase/premiummembership`,
        data: {
          status: false,
          order_id: options.order_id,
          payment_id: "payment failed",
        },
        headers: {
          Authorization: token,
        },
      });
      alert(error.error.description);
    });
  } catch (err) {
    alert(err.response.data.message);
  }
});

const deleteExpense = async (e) => {
  try {
    const id = e.dataset.id;

    const response = await axios({
      method: "DELETE",
      url: `${URL}/api/v1/expense/${id}`,
      headers: { Authorization: token },
    });

    if (response.data.status === "success") {
      window.location.reload();
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    alert("Something went wrong try loggin in again🔄");
  }
};

const renderLeaderBoard = (slNo, name, totalExpense) => {
  const tableBody = document.getElementById("table-leaderBoard");

  const template = ` <tr>
      <td>${slNo}</td>
      <td>${name}</td>
      <td>${totalExpense}</td>
      </tr>`;

  tableBody.innerHTML += template;
};

const renderExpenses = (price, description, category, id, i) => {
  const template = ` <tr>
      <td>${i}</td>
      <td>${price}</td>
      <td>${description}</td>
      <td>${category}</td>
      
      <td><button data-id=${id} class="btn btn-outline-danger" onclick='deleteExpense(this)'>Delete</button>
      </td>
    </tr>`;

  tableBody.innerHTML += template;
};

const pagination = document.querySelector(".pagination");
const showPagination = (
  currentPage,
  hasNextPage,
  hasPreviousPage,
  lastPage,
  nextPage,
  previousPage
) => {
  pagination.innerHTML = "";
  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    btn2.innerHTML = previousPage;
    btn2.classList.add("btn", "btn-sm", "btn-outline-success");

    btn2.addEventListener("click", () => {
      tableBody.innerHTML = "";

      retreiveData(previousPage);
    });
    pagination.appendChild(btn2);
  }

  const btn1 = document.createElement("button");
  btn1.innerHTML = currentPage;
  btn1.classList.add("btn", "btn-sm", "btn-outline-danger");
  btn1.addEventListener("click", () => {
    // To remove the previous clutter
    tableBody.innerHTML = "";
    retreiveData(currentPage);
  });
  pagination.appendChild(btn1);

  if (hasNextPage) {
    const btn3 = document.createElement("button");
    btn3.innerHTML = nextPage;
    btn3.classList.add("btn", "btn-sm", "btn-outline-success");
    btn3.addEventListener("click", () => {
      tableBody.innerHTML = "";

      retreiveData(nextPage);
    });
    pagination.appendChild(btn3);
  }
};

const retreiveData = async (page) => {
  const size = +localStorage.getItem("pagesize");

  const expenses = await axios({
    method: "GET",
    url: `${URL}/api/v1/expense?page=${page}&size=${size}`,
    headers: {
      Authorization: token,
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  });

  loggedUserName.textContent = `Welcome ${
    expenses.data.data.name.charAt(0).toUpperCase() +
    expenses.data.data.name.slice(1)
  }✅`;

  const {
    currentPage,
    hasNextPage,
    hasPreviousPage,
    lastPage,
    nextPage,
    previousPage,
  } = expenses.data.data.page;

  if (expenses.data.data.premium === true) {
    btnPremium.classList.add("invisible");
  } else if (expenses.data.data.premium === false) {
    premiumUser.classList.add("invisible");
    btnLeader.classList.add("invisible");
    btnDownload.classList.add("invisible");
    btnPreviousRprt.classList.add("invisible");
  }

  expenses.data.data.expenses.forEach((el, i) => {
    const id = el._id;
    const formattedPrice = indianCurrency.format(el.price);
    const category = el.category.charAt(0).toUpperCase() + el.category.slice(1);
    const description =
      el.description.charAt(0).toUpperCase() + el.description.slice(1);
    // tableBody.innerHTML = "";
    renderExpenses(formattedPrice, description, category, id, i + 1);
    showPagination(
      currentPage,
      hasNextPage,
      hasPreviousPage,
      lastPage,
      nextPage,
      previousPage
    );
  });
};

const div = document.getElementById("leader-board-view");
const leaderBoardTable = document.getElementById("leader-table");

btnLeader.addEventListener("click", async (e) => {
  e.preventDefault();

  btnClose.classList.remove("invisible");

  div.classList.add("view");
  leaderBoardTable.classList.remove("invisible");

  btnLeader.classList.add("invisible");

  // Close Functionality; will be added

  const response = await axios({
    method: "GET",
    url: `${URL}/api/v1/premium/showleaderboard`,
  });

  response.data.users.forEach((data, i) => {
    const formattedPrice = indianCurrency.format(data.totalExpense);
    const name = data.name;
    renderLeaderBoard(i + 1, name, formattedPrice);
  });
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  btnClose.classList.add("invisible");

  div.classList.remove("view");
  leaderBoardTable.classList.add("invisible");

  btnFake.classList.remove("invisible");
});

btnFake.addEventListener("click", (e) => {
  e.preventDefault();

  btnClose.classList.remove("invisible");

  div.classList.add("view");
  leaderBoardTable.classList.remove("invisible");

  btnFake.classList.add("invisible");
});

btnDownload.addEventListener("click", async (e) => {
  try {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await axios({
      method: "GET",
      url: `${URL}/api/v1/users/download`,
      headers: { Authorization: token },
    });

    if (response.status === 200) {
      let a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    }
  } catch (err) {
    document.body.innerHTML += `<div class="error">Something went wrong in downloading your expense data Please try again after sometime or you can contact us via our helpline, Have a Great day!!</div>`;
  }
});

window.addEventListener("DOMContentLoaded", retreiveData);
