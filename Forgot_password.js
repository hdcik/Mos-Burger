function frogetPass() {
    const usernameInput = document.getElementById("admin_username").value.trim();

    const storedUsername = "Admin";      // Predefined admin username
    const storedPassword = "1234";       // Predefined password (for demo only)

    if (usernameInput === "") {
        alert("Please enter your username.");
        return;
    }

    if (usernameInput === storedUsername) {
        alert("Your password is: " + storedPassword);
    } else {
        alert("Username not found!");
    }
}
