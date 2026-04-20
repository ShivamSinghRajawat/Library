// Run after page loads
window.onload = function () {
  // Hide home page initially
  document.getElementById("homePage").style.display = "none";
};

// Login function
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Simple validation
  if (username === "" || password === "") {
    alert("Please enter username and password");
    return;
  }

  // Dummy login credentials
  if (username === "Vedansh" && password === "Kartik") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
  } else {
    alert("Invalid username or password");
  }
}

// Logout function
function logout() {
  document.getElementById("homePage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";

  // Clear input fields
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}
