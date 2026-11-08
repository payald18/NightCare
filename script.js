
// LOGIN
const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");
    showPage("dashboard");
    showToast("Welcome to NightCare!");
});

document.getElementById("signupLink").addEventListener("click", function (event) {
    event.preventDefault();
    showToast("Sign-up feature can be connected to an account system.");
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    app.classList.add("hidden");
    loginScreen.classList.remove("hidden");
});

// NAVIGATION
function showPage(pageName) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    document.getElementById(pageName).classList.add("active-page");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.page === pageName);
    });
}

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        showPage(this.dataset.page);
    });
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", function () {
        showPage(this.dataset.go);
    });
});

// DATE
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// TOAST
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// TASK DATA
let tasks = [
    { name: "Check patient records", time: "10:00 PM", status: "Completed" },
    { name: "Equipment inspection", time: "12:00 AM", status: "Completed" },
    { name: "Monitor patient vitals", time: "2:00 AM", status: "Completed" },
    { name: "Check system alerts", time: "3:30 AM", status: "Pending" },
    { name: "Prepare shift handover", time: "5:30 AM", status: "Overdue" }
];

function renderTasks() {
    const list = document.getElementById("taskList");
    const filter = document.getElementById("taskFilter").value;

    list.innerHTML = "";

    const filtered = tasks.filter(task =>
        filter === "all" || task.status === filter
    );

    if (filtered.length === 0) {
        list.innerHTML = '<p class="muted">No tasks in this category.</p>';
    }

    filtered.forEach(task => {
        const index = tasks.indexOf(task);
        const item = document.createElement("div");
        item.className = "task-item";

        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.status === "Completed";
        checkbox.addEventListener("change", () => {
            tasks[index].status = checkbox.checked ? "Completed" : "Pending";
            renderTasks();
        });

        const name = document.createElement("span");
        name.textContent = task.name;

        label.append(checkbox, name);

        const time = document.createElement("small");
        time.textContent = task.time;
        time.className = "muted";

        const status = document.createElement("span");
        status.className = "task-status status-" + task.status;
        status.textContent = task.status;

        const remove = document.createElement("button");
        remove.className = "delete-task";
        remove.textContent = "✕";
        remove.title = "Delete task";
        remove.addEventListener("click", () => {
            tasks.splice(index, 1);
            renderTasks();
        });

        item.append(label, time, status, remove);
        list.appendChild(item);
    });

    updateTaskStats();
}

function updateTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const overdue = tasks.filter(t => t.status === "Overdue").length;
    const percent = total ? Math.round(completed / total * 100) : 0;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("overdueTasks").textContent = overdue;
    document.getElementById("pendingStat").textContent = pending;
    document.getElementById("taskPercent").textContent = percent + "%";
    document.getElementById("taskProgressBar").style.width = percent + "%";
    document.getElementById("taskProgressText").textContent =
        completed + " completed out of " + total + " tasks";
}

document.getElementById("taskFilter").addEventListener("change", renderTasks);

document.getElementById("taskForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("taskName").value.trim();
    const date = document.getElementById("taskDate").value;
    const time = document.getElementById("taskTime").value;

    if (!name || !date || !time) return;

    const [hour, minute] = time.split(":");
    const displayTime = new Date(2000, 0, 1, hour, minute)
        .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    tasks.push({
        name: name,
        time: displayTime,
        status: "Pending"
    });

    this.reset();
    renderTasks();
    showToast("New task added!");
});

renderTasks();

// THEME SELECTION
function applyTheme(theme) {
    document.body.dataset.theme = theme;

    document.querySelectorAll(".theme-option").forEach(option => {
        option.classList.toggle("selected", option.dataset.theme === theme);
    });

    localStorage.setItem("nightcare-theme", theme);
}

document.querySelectorAll(".theme-option").forEach(option => {
    option.addEventListener("click", function () {
        applyTheme(this.dataset.theme);
        showToast(this.querySelector("strong").textContent + " enabled");
    });
});

const savedTheme = localStorage.getItem("nightcare-theme") || "dark";
applyTheme(savedTheme);

// BRIGHTNESS CONTROL
const brightness = document.getElementById("brightness");

brightness.addEventListener("input", function () {
    const value = Number(this.value);
    document.getElementById("brightnessValue").textContent = value + "%";

    document.documentElement.style.setProperty(
        "--brightness",
        value / 100
    );

    localStorage.setItem("nightcare-brightness", value);
});

const savedBrightness = localStorage.getItem("nightcare-brightness");
if (savedBrightness) {
    brightness.value = savedBrightness;
    brightness.dispatchEvent(new Event("input"));
}

// TEXT SIZE
const textSize = document.getElementById("textSize");

textSize.addEventListener("input", function () {
    const value = Number(this.value);
    document.getElementById("textSizeValue").textContent = value + "px";
    document.documentElement.style.setProperty("--font-size", value + "px");
    localStorage.setItem("nightcare-text-size", value);
});

const savedTextSize = localStorage.getItem("nightcare-text-size");
if (savedTextSize) {
    textSize.value = savedTextSize;
    textSize.dispatchEvent(new Event("input"));
}

// AUTOMATIC NIGHT THEME
const autoTheme = document.getElementById("autoTheme");

function checkAutomaticTheme() {
    if (!autoTheme.checked) return;

    const hour = new Date().getHours();
    const isNight = hour >= 22 || hour < 6;

    applyTheme(isNight ? "dark" : "light");

    document.getElementById("autoStatus").textContent =
        "Automatic switching is on. Current mode: " +
        (isNight ? "Dark Mode" : "Light Mode");
}

autoTheme.addEventListener("change", function () {
    localStorage.setItem("nightcare-auto-theme", this.checked);
    document.getElementById("autoStatus").textContent =
        this.checked ? "Automatic switching is on." : "Automatic switching is off.";

    if (this.checked) {
        checkAutomaticTheme();
        showToast("Automatic theme switching enabled");
    }
});

autoTheme.checked = localStorage.getItem("nightcare-auto-theme") === "true";

if (autoTheme.checked) {
    checkAutomaticTheme();
}

setInterval(checkAutomaticTheme, 60000);

// BREAK BUTTON
document.getElementById("breakBtn").addEventListener("click", function () {
    showToast("Your break has started. Relax and recharge!");
});

// WELLBEING CHECK-IN
document.querySelectorAll("[data-feeling]").forEach(button => {
    button.addEventListener("click", function () {
        const feeling = this.dataset.feeling;
        document.getElementById("feelingMessage").textContent =
            "Thanks for checking in! Your response: " + feeling;
        showToast("Wellbeing check-in saved for this session.");
    });
});
