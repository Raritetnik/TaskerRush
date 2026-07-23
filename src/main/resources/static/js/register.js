document.querySelectorAll(".toggle-password").forEach(function (button) {
    button.addEventListener("click", function () {
        const targetId = button.dataset.passwordTarget;
        const input = document.getElementById(targetId);
        const icon = button.querySelector("i");

        if (!input) {
            return;
        }

        const showPassword = input.type === "password";

        input.type = showPassword ? "text" : "password";

        icon.classList.toggle("bi-eye", !showPassword);
        icon.classList.toggle("bi-eye-slash", showPassword);

        button.setAttribute(
            "aria-label",
            showPassword ? "Hide password" : "Show password"
        );
    });
});

    const registerForm = document.querySelector("#registerForm");
    const registerButton = document.querySelector("#registerButton");

    registerForm?.addEventListener("submit", function (event) {
    const password =
    document.querySelector("#registerPassword")?.value;

    const confirmation =
    document.querySelector("#confirmPassword")?.value;

    if (password !== confirmation) {
    event.preventDefault();

    const confirmationInput =
    document.querySelector("#confirmPassword");

    confirmationInput.setCustomValidity(
    "Passwords do not match."
    );

    confirmationInput.reportValidity();

    return;
}

    const buttonText =
    registerButton.querySelector(".button-text");

    const buttonLoading =
    registerButton.querySelector(".button-loading");

    registerButton.disabled = true;
    buttonText.hidden = true;
    buttonLoading.hidden = false;
});

    document.querySelector("#confirmPassword")
    ?.addEventListener("input", function () {
    this.setCustomValidity("");
});
