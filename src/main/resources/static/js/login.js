document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberMeInput = document.getElementById("rememberMe");

    const togglePasswordButton =
        document.getElementById("togglePassword");

    const loginButton = document.getElementById("loginButton");

    const buttonText =
        loginButton?.querySelector(".button-text");

    const buttonLoading =
        loginButton?.querySelector(".button-loading");

    const usernameError =
        document.getElementById("usernameError");

    const passwordError =
        document.getElementById("passwordError");

    const loginMessage =
        document.getElementById("loginMessage");

    setLoadingState(false);

    togglePasswordButton?.addEventListener("click", () => {
        if (!passwordInput) {
            return;
        }

        const passwordIsHidden =
            passwordInput.type === "password";

        passwordInput.type =
            passwordIsHidden ? "text" : "password";

        togglePasswordButton.setAttribute(
            "aria-pressed",
            String(passwordIsHidden)
        );

        togglePasswordButton.setAttribute(
            "aria-label",
            passwordIsHidden
                ? "Hide password"
                : "Show password"
        );

        const icon =
            togglePasswordButton.querySelector("i");

        if (icon) {
            icon.className = passwordIsHidden
                ? "bi bi-eye-slash"
                : "bi bi-eye";
        }
    });

    loginForm?.addEventListener("submit", async event => {
        event.preventDefault();

        clearErrors();

        const username =
            usernameInput?.value.trim() ?? "";

        const password =
            passwordInput?.value ?? "";

        if (!validateForm(username, password)) {
            return;
        }

        setLoadingState(true);

        try {
            const response = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const responseData =
                await readResponseBody(response);

            if (!response.ok) {
                const message =
                    responseData?.message ||
                    responseData?.error ||
                    responseData?.detail ||
                    "Invalid username or password.";

                showLoginError(message);
                return;
            }

            const token =
                responseData?.token ||
                responseData?.accessToken;

            if (!token) {
                throw new Error(
                    "The server authenticated the user but did not return a JWT token."
                );
            }

            clearStoredAuthentication();

            const storage = rememberMeInput?.checked
                ? localStorage
                : sessionStorage;

            storage.setItem("jwtToken", token);

            if (responseData.expiresAt) {
                storage.setItem(
                    "jwtExpiresAt",
                    responseData.expiresAt
                );
            }

            window.location.href =
                responseData.redirectUrl || "/dashboard";

        } catch (error) {
            console.error("Login request failed:", error);

            showLoginError(
                error instanceof Error
                    ? error.message
                    : "Unable to connect to the server."
            );
        } finally {
            setLoadingState(false);
        }
    });

    window.addEventListener("pageshow", () => {
        setLoadingState(false);
    });

    function validateForm(username, password) {
        let isValid = true;

        if (!username) {
            if (usernameError) {
                usernameError.textContent =
                    "Username or email is required.";
            }

            usernameInput?.classList.add("input-error");
            isValid = false;
        }

        if (!password) {
            if (passwordError) {
                passwordError.textContent =
                    "Password is required.";
            }

            passwordInput?.classList.add("input-error");
            isValid = false;
        }

        return isValid;
    }

    function clearErrors() {
        if (usernameError) {
            usernameError.textContent = "";
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        usernameInput?.classList.remove("input-error");
        passwordInput?.classList.remove("input-error");

        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.className = "login-message";
        }
    }

    function showLoginError(message) {
        if (loginMessage) {
            loginMessage.textContent = message;
            loginMessage.className =
                "login-message login-message-error";
            return;
        }

        alert(message);
    }

    function setLoadingState(isLoading) {
        if (loginButton) {
            loginButton.disabled = isLoading;
        }

        buttonText?.classList.toggle(
            "d-none",
            isLoading
        );

        buttonLoading?.classList.toggle(
            "d-none",
            !isLoading
        );

        if (usernameInput) {
            usernameInput.readOnly = isLoading;
        }

        if (passwordInput) {
            passwordInput.readOnly = isLoading;
        }

        if (rememberMeInput) {
            rememberMeInput.style.pointerEvents =
                isLoading ? "none" : "";
        }
    }

    async function readResponseBody(response) {
        const contentType =
            response.headers.get("content-type") || "";

        try {
            if (contentType.includes("application/json")) {
                return await response.json();
            }

            const text = await response.text();

            return text
                ? { message: text }
                : {};
        } catch (error) {
            console.error(
                "Unable to read login response:",
                error
            );

            return {};
        }
    }

    function clearStoredAuthentication() {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
        localStorage.removeItem("jwtExpiresAt");

        sessionStorage.removeItem("jwtToken");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("jwtExpiresAt");
    }
});
