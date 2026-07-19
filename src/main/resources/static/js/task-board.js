document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("taskSearch");
    const kanbanBoard = document.querySelector(".kanban-board");
    const noSearchResults = document.getElementById("noSearchResults");

    const sidebar = document.getElementById("projectSidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const openSidebar = () => {
        sidebar?.classList.add("open");
        sidebarOverlay?.classList.add("visible");
        document.body.style.overflow = "hidden";
    };

    const closeSidebar = () => {
        sidebar?.classList.remove("open");
        sidebarOverlay?.classList.remove("visible");
        document.body.style.overflow = "";
    };

    sidebarToggle?.addEventListener("click", () => {
        const isOpen = sidebar?.classList.contains("open");

        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebarOverlay?.addEventListener("click", closeSidebar);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            closeSidebar();
        }
    });

    searchInput?.addEventListener("input", () => {
        const searchValue = searchInput.value
            .trim()
            .toLowerCase();

        const taskCards = Array.from(
            document.querySelectorAll(".task-card")
        );

        let visibleTaskCount = 0;

        taskCards.forEach((taskCard) => {
            const title =
                taskCard.dataset.taskTitle?.toLowerCase() ?? "";

            const description =
                taskCard.dataset.taskDescription?.toLowerCase() ?? "";

            const matchesSearch =
                searchValue.length === 0 ||
                title.includes(searchValue) ||
                description.includes(searchValue);

            taskCard.classList.toggle("d-none", !matchesSearch);

            if (matchesSearch) {
                visibleTaskCount++;
            }
        });

        updateColumnCounts();

        const shouldShowNoResults =
            searchValue.length > 0 &&
            visibleTaskCount === 0;

        kanbanBoard?.classList.toggle(
            "d-none",
            shouldShowNoResults
        );

        noSearchResults?.classList.toggle(
            "d-none",
            !shouldShowNoResults
        );
    });

    function updateColumnCounts() {
        const taskColumns = document.querySelectorAll(".task-column");

        taskColumns.forEach((column) => {
            const visibleTasks = column.querySelectorAll(
                ".task-card:not(.d-none)"
            );

            const countElement =
                column.querySelector(".task-count");

            if (countElement) {
                countElement.textContent =
                    String(visibleTasks.length);
            }
        });
    }

    // Mode task blocks between section


    // Add task
    const addTaskBtn = document.querySelector(".add-task-button[type='submit']");

    addTaskBtn.addEventListener("click", async function (e) {
        console.log('prevent');
        e.preventDefault();

        const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken"); // localStorage
        console.log(token);
        if (!token) {
            //logoutUser();
            return;
        }

        const projectId = document.querySelector(
            'input[name="projectId"]'
        )?.value;

        const title = document.querySelector("#taskTitle")?.value.trim();
        const description = document.querySelector(
            "#taskDescription"
        )?.value.trim();

        const status = document.querySelector("#taskStatus")?.value;

        const priority = document.querySelector("#taskPriority")?.value;

        if (!projectId) {
            showTaskError("Project is required.");
            return;
        }

        if (!title) {
            showTaskError("Task title is required.");
            return;
        }

        if (!status) {
            showTaskError("Task status is required.");
            return;
        }

        const taskData = {
            projectId: Number(projectId),
            title,
            description,
            status,
            priority
        };

        try {
            setTaskButtonLoading(true);

            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(taskData)
            });

            /*
             * 401: token is missing, invalid, or expired.
             * 403: authenticated user is not allowed.
             */
            if (response.status === 401) {
                logoutUser("Your session has expired. Please log in again.");
                return;
            }

            if (response.status === 403) {
                logoutUser("You are no longer authorized. Please log in again.");
                return;
            }

            if (!response.ok) {
                const errorMessage = await getErrorMessage(response);

                throw new Error(
                    errorMessage || "Unable to create the task."
                );
            }

            const createdTask = await response.json();

            closeAddTaskModal();
            resetTaskForm();
            window.location.reload();

        } catch (error) {
            console.error("Create task error:", error);

            showTaskError(
                error.message || "An unexpected error occurred."
            );
        } finally {
            setTaskButtonLoading(false);
        }
    });



    function logoutUser(message = null) {
        localStorage.removeItem("jwtToken");
        sessionStorage.removeItem("jwtToken");

        if (message) {
            sessionStorage.setItem("loginMessage", message);
        }

        window.location.href = "/login";
    }

    async function getErrorMessage(response) {
        const contentType = response.headers.get("content-type") || "";

        try {
            if (contentType.includes("application/json")) {
                const errorBody = await response.json();

                return (
                    errorBody.message ||
                    errorBody.error ||
                    errorBody.detail ||
                    null
                );
            }

            return await response.text();
        } catch (error) {
            console.error("Cannot read server error response:", error);
            return null;
        }
    }

    function showTaskError(message) {
        const errorElement = document.querySelector("#taskFormError");

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove("d-none");
            return;
        }

        alert(message);
    }

    function clearTaskError() {
        const errorElement = document.querySelector("#taskFormError");

        if (!errorElement) {
            return;
        }

        errorElement.textContent = "";
        errorElement.classList.add("d-none");
    }

    function setTaskButtonLoading(isLoading) {
        const button = document.querySelector("#addtask_btn");

        if (!button) {
            return;
        }

        button.disabled = isLoading;

        const buttonText = button.querySelector(".button-text");
        const buttonLoading = button.querySelector(".button-loading");

        if (buttonText) {
            buttonText.classList.toggle("d-none", isLoading);
        }

        if (buttonLoading) {
            buttonLoading.classList.toggle("d-none", !isLoading);
        }
    }

    function closeAddTaskModal() {
        const modalElement = document.querySelector("#addTaskModal");

        if (!modalElement || typeof bootstrap === "undefined") {
            return;
        }

        const modal =
            bootstrap.Modal.getInstance(modalElement) ||
            bootstrap.Modal.getOrCreateInstance(modalElement);

        modal.hide();
    }

    function resetTaskForm() {
        const form = document.querySelector("#addTaskForm");

        if (form) {
            form.reset();
        }

        clearTaskError();
    }
});