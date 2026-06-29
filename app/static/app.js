const API_BASE = "";

// Global State
let state = {
    token: localStorage.getItem("access_token") || null,
    user: null,
    tasks: [],
    totalTasks: 0,
    currentPage: 1,
    limit: 10,
    searchQuery: "",
    statusFilter: "",
    priorityFilter: "",
    editingTaskId: null
};

// DOM Elements
const appEl = document.getElementById("app");

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    if (state.token) {
        fetchProfileAndDashboard();
    } else {
        renderLoginView();
    }
});

// Toast Notifications
function showToast(message, isError = false) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.style.backgroundColor = isError ? "var(--danger)" : "var(--text-main)";
    toast.innerHTML = isError ? `❌ ${message}` : `✔️ ${message}`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// API Helper
async function apiRequest(endpoint, method = "GET", body = null) {
    const headers = { "Content-Type": "application/json" };
    if (state.token) {
        headers["Authorization"] = `Bearer ${state.token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (response.status === 401) {
            logout();
            showToast("Session expired. Please log in again.", true);
            return null;
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "Request failed");
        }
        return data;
    } catch (error) {
        showToast(error.message, true);
        return null;
    }
}

// Global Actions
function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem("access_token");
    renderLoginView();
    showToast("Logged out successfully");
}

async function fetchProfileAndDashboard() {
    const user = await apiRequest("/profile");
    if (user) {
        state.user = user;
        renderDashboardView();
        loadTasks();
    }
}

// Views Rendering
function renderLoginView() {
    appEl.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <h1>Task Manager</h1>
                <p class="subtitle">Welcome Back</p>
                <form id="login-form">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="login-email" class="form-control" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="login-password" class="form-control" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                <div class="auth-footer">
                    Don't have an account? <a href="#" id="go-register">Register</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const data = await apiRequest("/login", "POST", { email, password });
        if (data) {
            state.token = data.access_token;
            localStorage.setItem("access_token", data.access_token);
            showToast("Login successful!");
            fetchProfileAndDashboard();
        }
    });

    document.getElementById("go-register").addEventListener("click", (e) => {
        e.preventDefault();
        renderRegisterView();
    });
}

function renderRegisterView() {
    appEl.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <h1>Create Account</h1>
                <p class="subtitle">Get started with Task Manager</p>
                <form id="register-form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="reg-name" class="form-control" placeholder="Gokul" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="reg-email" class="form-control" placeholder="gokul@gmail.com" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="reg-password" class="form-control" placeholder="Minimum 6 characters" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="reg-confirm" class="form-control" placeholder="Confirm password" required minlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary">Register</button>
                </form>
                <div class="auth-footer">
                    Already have an account? <a href="#" id="go-login">Login</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const confirm = document.getElementById("reg-confirm").value;

        if (password !== confirm) {
            showToast("Passwords do not match!", true);
            return;
        }

        const data = await apiRequest("/register", "POST", { name, email, password });
        if (data) {
            showToast("Registration successful! Please login.");
            renderLoginView();
        }
    });

    document.getElementById("go-login").addEventListener("click", (e) => {
        e.preventDefault();
        renderLoginView();
    });
}

function renderDashboardView() {
    appEl.innerHTML = `
        <nav class="navbar">
            <div class="nav-brand">📋 Task Manager</div>
            <div class="nav-user">
                <span class="user-greeting">Welcome ${state.user ? state.user.name : ""} 👋</span>
                <button id="nav-profile-btn" class="nav-btn-link">👤 Profile</button>
                <button id="nav-logout-btn" class="nav-btn-link">🚪 Logout</button>
            </div>
        </nav>

        <div class="dashboard-container">
            <div class="welcome-section">
                <h2>Dashboard Overview</h2>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-title">Total Tasks</div>
                    <div class="stat-value" id="stat-total">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Completed</div>
                    <div class="stat-value" style="color: var(--success);" id="stat-completed">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Pending</div>
                    <div class="stat-value" style="color: #D97706;" id="stat-pending">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">High Priority</div>
                    <div class="stat-value" style="color: var(--danger);" id="stat-high">0</div>
                </div>
            </div>

            <div class="toolbar">
                <div class="search-filter-group">
                    <div class="search-box">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="search-input" class="form-control" placeholder="Search tasks...">
                    </div>
                    <select id="status-filter" class="filter-select">
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select id="priority-filter" class="filter-select">
                        <option value="">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <button id="open-create-modal" class="btn btn-primary" style="width: auto;">➕ Create Task</button>
            </div>

            <div class="table-container">
                <table class="tasks-table">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tasks-tbody">
                        <tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Loading tasks...</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="pagination-container">
                <div style="font-size: 0.9rem; color: var(--text-muted);" id="pagination-info">Showing 0 of 0</div>
                <div class="pagination-controls" id="pagination-controls"></div>
            </div>
        </div>

        <!-- Task Modal (Create & Edit) -->
        <div id="task-modal" class="modal-overlay">
            <div class="modal-card">
                <div class="modal-header">
                    <h3 id="modal-title">Create Task</h3>
                    <button id="close-task-modal" class="close-modal-btn">&times;</button>
                </div>
                <form id="task-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="task-title" class="form-control" placeholder="e.g. Learn FastAPI" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="task-desc" class="form-control" rows="3" placeholder="Complete JWT Authentication"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Priority</label>
                        <select id="task-priority" class="form-control">
                            <option value="high">High</option>
                            <option value="medium" selected>Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" id="task-duedate" class="form-control">
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="cancel-task-modal" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="width: auto;">Save Task</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Profile Modal -->
        <div id="profile-modal" class="modal-overlay">
            <div class="modal-card">
                <div class="modal-header">
                    <h3>User Profile</h3>
                    <button id="close-profile-modal" class="close-modal-btn">&times;</button>
                </div>
                <div style="margin-bottom: 1.5rem; line-height: 1.8;">
                    <div><strong>Name:</strong> <span id="prof-name"></span></div>
                    <div><strong>Email:</strong> <span id="prof-email"></span></div>
                    <div><strong>Joined:</strong> <span id="prof-joined"></span></div>
                </div>
                <div class="modal-footer">
                    <button id="profile-logout-btn" class="btn btn-danger" style="width: 100%;">🚪 Logout</button>
                </div>
            </div>
        </div>
    `;

    // Navbar events
    document.getElementById("nav-logout-btn").addEventListener("click", logout);
    document.getElementById("nav-profile-btn").addEventListener("click", openProfileModal);

    // Filter events
    document.getElementById("search-input").addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        state.currentPage = 1;
        loadTasks();
    });
    document.getElementById("status-filter").addEventListener("change", (e) => {
        state.statusFilter = e.target.value;
        state.currentPage = 1;
        loadTasks();
    });
    document.getElementById("priority-filter").addEventListener("change", (e) => {
        state.priorityFilter = e.target.value;
        state.currentPage = 1;
        loadTasks();
    });

    // Modal events
    document.getElementById("open-create-modal").addEventListener("click", () => openTaskModal());
    document.getElementById("close-task-modal").addEventListener("click", closeTaskModal);
    document.getElementById("cancel-task-modal").addEventListener("click", closeTaskModal);
    document.getElementById("task-form").addEventListener("submit", handleSaveTask);

    document.getElementById("close-profile-modal").addEventListener("click", closeProfileModal);
    document.getElementById("profile-logout-btn").addEventListener("click", () => {
        closeProfileModal();
        logout();
    });
}

// Tasks Loading & Rendering
async function loadTasks() {
    let queryParams = `?page=${state.currentPage}&limit=${state.limit}`;
    if (state.searchQuery) queryParams += `&search=${encodeURIComponent(state.searchQuery)}`;
    if (state.statusFilter) queryParams += `&status=${state.statusFilter}`;
    if (state.priorityFilter) queryParams += `&priority=${state.priorityFilter}`;

    const res = await apiRequest(`/tasks${queryParams}`);
    if (res) {
        state.tasks = res.data;
        state.totalTasks = res.total;
        renderTasksTable();
        renderPagination(res.total_pages);
        updateStats();
    }
}

function renderTasksTable() {
    const tbody = document.getElementById("tasks-tbody");
    if (!tbody) return;

    if (state.tasks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No tasks found. Click <strong>+ Create Task</strong> to add one!</td></tr>`;
        return;
    }

    tbody.innerHTML = state.tasks.map(task => {
        const isCompleted = task.status === "completed";
        const dueDateStr = task.due_date ? new Date(task.due_date).toLocaleDateString() : "No Due Date";
        
        return `
            <tr>
                <td>
                    <div style="font-weight: 600; text-decoration: ${isCompleted ? 'line-through' : 'none'}; color: ${isCompleted ? 'var(--text-muted)' : 'var(--text-main)'}">
                        ${task.title}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${task.description || ''}</div>
                </td>
                <td>
                    <span class="badge ${isCompleted ? 'badge-completed' : 'badge-pending'}">
                        ${isCompleted ? '✔ Completed' : 'Pending'}
                    </span>
                </td>
                <td>
                    <span class="badge badge-priority-${task.priority}">
                        ${task.priority.toUpperCase()}
                    </span>
                </td>
                <td style="font-size: 0.9rem; color: var(--text-muted);">${dueDateStr}</td>
                <td>
                    <div class="table-actions">
                        ${!isCompleted ? `<button class="action-icon-btn" onclick="markComplete(${task.id})" title="Mark Complete">✔</button>` : ''}
                        <button class="action-icon-btn" onclick="openTaskModal(${task.id})" title="Edit Task">✏️</button>
                        <button class="action-icon-btn" style="color: var(--danger);" onclick="deleteTask(${task.id})" title="Delete Task">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function updateStats() {
    // For demo accuracy, calculate from current list or totals
    document.getElementById("stat-total").innerText = state.totalTasks;
    const completedCount = state.tasks.filter(t => t.status === "completed").length;
    const pendingCount = state.tasks.filter(t => t.status === "pending").length;
    const highCount = state.tasks.filter(t => t.priority === "high").length;

    document.getElementById("stat-completed").innerText = completedCount;
    document.getElementById("stat-pending").innerText = pendingCount;
    document.getElementById("stat-high").innerText = highCount;
}

function renderPagination(totalPages) {
    const controlsEl = document.getElementById("pagination-controls");
    const infoEl = document.getElementById("pagination-info");
    if (!controlsEl || !infoEl) return;

    infoEl.innerText = `Showing ${state.tasks.length} of ${state.totalTasks} tasks`;

    if (totalPages <= 1) {
        controlsEl.innerHTML = "";
        return;
    }

    let buttonsHtml = `<button class="page-number-btn" ${state.currentPage === 1 ? 'disabled style="opacity:0.5;"' : ''} onclick="changePage(${state.currentPage - 1})">&lt; Previous</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        buttonsHtml += `<button class="page-number-btn ${i === state.currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    buttonsHtml += `<button class="page-number-btn" ${state.currentPage === totalPages ? 'disabled style="opacity:0.5;"' : ''} onclick="changePage(${state.currentPage + 1})">Next &gt;</button>`;

    controlsEl.innerHTML = buttonsHtml;
}

function changePage(page) {
    state.currentPage = page;
    loadTasks();
}

// Task CRUD Action Functions
function openTaskModal(taskId = null) {
    state.editingTaskId = taskId;
    const modal = document.getElementById("task-modal");
    const titleEl = document.getElementById("modal-title");
    const form = document.getElementById("task-form");

    if (taskId) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            titleEl.innerText = "Edit Task";
            document.getElementById("task-title").value = task.title;
            document.getElementById("task-desc").value = task.description || "";
            document.getElementById("task-priority").value = task.priority;
            document.getElementById("task-duedate").value = task.due_date || "";
        }
    } else {
        titleEl.innerText = "Create Task";
        form.reset();
    }
    modal.classList.add("active");
}

function closeTaskModal() {
    document.getElementById("task-modal").classList.remove("active");
    state.editingTaskId = null;
}

async function handleSaveTask(e) {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const priority = document.getElementById("task-priority").value;
    const due_date = document.getElementById("task-duedate").value || null;

    const payload = { title, description, priority, due_date };

    let res;
    if (state.editingTaskId) {
        res = await apiRequest(`/tasks/${state.editingTaskId}`, "PUT", payload);
        if (res) showToast("Task updated successfully!");
    } else {
        res = await apiRequest("/tasks", "POST", payload);
        if (res) showToast("Task created successfully!");
    }

    if (res) {
        closeTaskModal();
        loadTasks();
    }
}

async function markComplete(taskId) {
    const res = await apiRequest(`/tasks/${taskId}/complete`, "PATCH");
    if (res) {
        showToast("Task marked as completed! ✔");
        loadTasks();
    }
}

async function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        const res = await apiRequest(`/tasks/${taskId}`, "DELETE");
        if (res) {
            showToast("Task deleted.");
            loadTasks();
        }
    }
}

function openProfileModal() {
    if (!state.user) return;
    document.getElementById("prof-name").innerText = state.user.name;
    document.getElementById("prof-email").innerText = state.user.email;
    document.getElementById("prof-joined").innerText = new Date(state.user.created_at).toLocaleDateString();
    
    // Reset edit mode
    document.getElementById("prof-name-display").style.display = "block";
    document.getElementById("prof-name-edit").style.display = "none";
    document.getElementById("edit-name-input").value = state.user.name;
    
    document.getElementById("profile-modal").classList.add("active");
}

function closeProfileModal() {
    document.getElementById("profile-modal").classList.remove("active");
}
