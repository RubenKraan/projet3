const loginUrl = "http://localhost:5678/api/users/login";
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const submitButton = document.querySelector("input[type='submit']");
const form = document.getElementById("loginForm");
const loginError = document.querySelector(".loginError");
const passwordError = document.querySelector(".passwordError");

submitButton.addEventListener("click", loginUser);
async function loginUser(e) {
  e.preventDefault()
  try {
    const logUser = {
      email: inputEmail.value,
      password: inputPassword.value,
    };
    await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logUser),
    })
      .then((response) => response.json())
      .then((responseData) => {
        data = responseData;
        console.log(data);
      });
    if (data.message) {
      loginError.textContent = "Erreur dans l’identifiant !!";
      inputEmail.style.color = "red";
      console.log(logUser);
    } else if (data.error) {
      passwordError.textContent = "Erreur dans le mot de passe !!";
      loginError.textContent = "";
      inputPassword.style.color = "red";
      inputEmail.style.color = "#1d6154";

      console.log(logUser);
    } else {
      inputPassword.style.color = "#1d6154";
      console.log("LogAdmin OK");
      console.log(logUser);
      localStorage.setItem("token", data.token);
      window.location.href = "../index.html";
    }
  } catch (error) {
    console.log(error);
  }
}
