// Frontend Logic
let currentUser = null;

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const role = document.getElementById('role').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role })
    });

    const data = await response.json();
    if (data.success) {
        currentUser = data.user;
        showDashboard();
    }
});

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    document.getElementById('welcome-text').textContent = `Welcome, ${currentUser.username} (${currentUser.role})`;

    // Hide feedback if teacher
    if (currentUser.role === 'teacher') {
        document.getElementById('feedback-section').classList.add('hidden');
    }

    loadAssignments();
}

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    currentUser = null;
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard-screen').classList.add('hidden');
});

// Load Assignments from API
async function loadAssignments() {
    const list = document.getElementById('assignment-list');
    try {
        const response = await fetch('/api/assignments');
        const tasks = await response.json();
        list.innerHTML = tasks.map(t => `<li><strong>${t.title}</strong> - Due: ${t.due_date}</li>`).join('');
    } catch (err) {
        list.innerHTML = '<li>Error loading tasks.</li>';
    }
}

// Handle Feedback Buttons
document.querySelectorAll('.feedback-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const responseVal = button.getAttribute('data-val');
        
        await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: currentUser.username,
                subject: 'General',
                response: responseVal
            })
        });

        document.getElementById('feedback-success').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('feedback-success').classList.add('hidden');
        }, 3000);
    });
});
