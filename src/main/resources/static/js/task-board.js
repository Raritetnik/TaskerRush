document.addEventListener("DOMContentLoaded", () => {
    // Only when page is loaded fully

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

    // Add task
    const addTaskBtn = document.querySelector(".add-task-button[type='submit']");

    addTaskBtn.addEventListener("click", async function (e) {
        console.log('prevent');
        e.preventDefault();

        const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken"); // localStorage
        if (!token) {
            logoutUser();
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

            /* JWT check
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

    // Add Project
    const addProjectBtn = document.querySelector(".add-project-button[type='submit']");

    addProjectBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        hideProjectError();

        const token =
            localStorage.getItem("jwtToken") ||
            sessionStorage.getItem("jwtToken");

        if (!token) {
            showProjectError(
                "Your session has expired. Please log in again."
            );
            return;
        }

        const name = document
            .querySelector("#projectName")
            ?.value
            .trim();

        const description = document
            .querySelector("#projectDescription")
            ?.value
            .trim();

        if (!name) {
            showProjectError("Project name is required.");
            return;
        }

        if (!description) {
            showProjectError("Project description is required.");
            return;
        }

        const projectData = {
            title: name,
            description: description
        };

        try {
            setProjectButtonLoading(true);

            const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(projectData)
            });

            if (response.status === 401) {
                showProjectError(
                    "Your session has expired. Please log in again."
                );
                return;
            }

            if (response.status === 403) {
                showProjectError(
                    "You are not authorized to create a project."
                );
                return;
            }

            if (!response.ok) {
                const errorMessage = await getErrorMessage(response);

                throw new Error(
                    errorMessage || "Unable to create the project."
                );
            }

            const createdProject = await response.json();

            closeAddProjectModal();
            resetProjectForm();

            /*
             * Redirect directly to the new project when the API returns its ID.
             */
            if (createdProject && createdProject.id) {
                window.location.href =
                    "/dashboard/" +
                    encodeURIComponent(createdProject.id);

                return;
            }

            window.location.reload();

        } catch (error) {
            console.error("Create project error:", error);

            showProjectError(
                error.message || "An unexpected error occurred."
            );
        } finally {
            setProjectButtonLoading(false);
        }
    });

    // Edit Modal
    const editTaskModalElement = document.getElementById("editTaskModal");
    const editTaskForm = document.getElementById("editTaskForm");
    const editTaskId = document.getElementById("editTaskId");
    const editTaskTitle = document.getElementById("editTaskTitle");
    const editTaskDescription = document.getElementById("editTaskDescription");
    const editTaskStatus = document.getElementById("editTaskStatus");
    const editTaskError = document.getElementById("editTaskError");
    const saveTaskButton = document.getElementById("saveTaskButton");
    const saveButtonText = saveTaskButton?.querySelector(".button-text");
    const saveButtonLoading = saveTaskButton?.querySelector(".button-loading");


    if (!editTaskModalElement || !editTaskForm) { return; }
    const editTaskModal = bootstrap.Modal.getOrCreateInstance(editTaskModalElement);

    // Open the edit modal when a task card is clicked.
    document.addEventListener("click", event => {
        const taskCard = event.target.closest(".task-card");

        if (!taskCard) {
            return;
        }

        /*
         * Do not open the modal when clicking another
         * interactive element inside the card.
         */
        if (
            event.target.closest(
                "button, a, input, select, textarea"
            )
        ) {
            return;
        }

        clearEditTaskError();

        editTaskId.value =
            taskCard.dataset.taskId || "";

        editTaskTitle.value =
            taskCard.dataset.taskTitle || "";

        editTaskDescription.value =
            taskCard.dataset.taskDescription || "";

        editTaskStatus.value =
            taskCard.dataset.taskStatus || "PENDING";

        editTaskModal.show();
    });

    editTaskForm.addEventListener("submit", async event => {
        event.preventDefault();

        clearEditTaskError();

        const taskId = editTaskId.value;
        const title = editTaskTitle.value.trim();
        const description =
            editTaskDescription.value.trim();

        const status = editTaskStatus.value;

        if (!taskId) {
            showEditTaskError("Task ID is missing.");
            return;
        }

        if (!title) {
            showEditTaskError(
                "Task title is required."
            );

            editTaskTitle.focus();
            return;
        }

        const token =
            localStorage.getItem("jwtToken") ||
            sessionStorage.getItem("jwtToken");

        if (!token) {
            logoutUser("Your session has expired. Please log in again.");

            return;
        }

        const requestBody = {
            title,
            description,
            status
        };

        try {
            setSaveLoading(true);

            const response = await fetch(
                `/api/tasks/${encodeURIComponent(taskId)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (response.status === 401) {
                logoutUser("Your session has expired. Please log in again.");

                return;
            }

            if (response.status === 403) {
                logoutUser("You are not authorized to update this task.");

                return;
            }

            if (!response.ok) {
                const message =
                    await readErrorMessage(response);

                throw new Error(
                    message ||
                    "Unable to update the task."
                );
            }

            const updatedTask =
                await readJsonResponse(response);

            editTaskModal.hide();

            /*
             * Simplest and safest approach:
             * reload projects and filtered task lists
             * from the server.
             */
            window.location.reload();
        } catch (error) {
            console.error(
                "Task update failed:",
                error
            );

            showEditTaskError(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."
            );
        } finally {
            setSaveLoading(false);
        }
    }
    );


    /**
     *
     * Methods
     */
    function setSaveLoading(isLoading) {
        if (saveTaskButton) {
            saveTaskButton.disabled = isLoading;
        }

        saveButtonText?.classList.toggle(
            "d-none",
            isLoading
        );

        saveButtonLoading?.classList.toggle(
            "d-none",
            !isLoading
        );

        editTaskTitle.readOnly = isLoading;
        editTaskDescription.readOnly = isLoading;
        editTaskStatus.disabled = isLoading;
    }

    function showEditTaskError(message) {
        if (!editTaskError) {
            alert(message);
            return;
        }

        editTaskError.textContent = message;
        editTaskError.classList.remove("d-none");
    }

    function clearEditTaskError() {
        if (!editTaskError) {
            return;
        }

        editTaskError.textContent = "";
        editTaskError.classList.add("d-none");
    }

    async function readErrorMessage(response) {
        const contentType =
            response.headers.get("content-type") || "";

        try {
            if (contentType.includes("application/json")) {
                const body = await response.json();

                return (
                    body.message ||
                    body.error ||
                    body.detail ||
                    null
                );
            }

            return await response.text();
        } catch (error) {
            return null;
        }
    }

    async function readJsonResponse(response) {
        if (response.status === 204) {
            return null;
        }

        const contentType =
            response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            return null;
        }

        return response.json();
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

    function showProjectError(message) {
        const errorElement = document.querySelector("#addProjectError");

        if (!errorElement) {
            return;
        }

        errorElement.textContent = message;
        errorElement.classList.remove("d-none");
    }

    function hideProjectError() {
        const errorElement = document.querySelector("#addProjectError");

        if (!errorElement) {
            return;
        }

        errorElement.textContent = "";
        errorElement.classList.add("d-none");
    }

    function setProjectButtonLoading(isLoading) {
        const button = document.querySelector("#createProjectButton");

        if (!button) {
            return;
        }

        const text = button.querySelector(".button-text");
        const loading = button.querySelector(".button-loading");

        button.disabled = isLoading;

        if (text) {
            text.classList.toggle("d-none", isLoading);
        }

        if (loading) {
            loading.classList.toggle("d-none", !isLoading);
        }
    }

    function resetProjectForm() {
        const form = document.querySelector("#addProjectForm");

        if (form) {
            form.reset();
        }

        hideProjectError();
    }

    function closeAddProjectModal() {
        const modalElement = document.querySelector("#addProjectModal");

        if (!modalElement) {
            return;
        }

        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
            modal.hide();
        }
    }
});