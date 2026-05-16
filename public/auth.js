const showMessage = (msg, type = 'success') => {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.className = type;
    el.style.display = 'block';
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (response.ok) {
        showMessage(data.message || 'Success!', 'success');
        if (data.token || (data.data && data.data.token)) {
            localStorage.setItem('token', data.token || data.data.token);
        }
        return data;
    } else {
        const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : 'An error occurred');
        showMessage(errorMsg, 'error');
        throw new Error(errorMsg);
    }
};

const register = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData.entries());
    
    // Convert role to uppercase as expected by Prisma enum
    if (body.role) body.role = body.role.toUpperCase();
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        await handleResponse(response);
    } catch (err) {
        console.error(err);
    }
};

const login = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        await handleResponse(response);
    } catch (err) {
        console.error(err);
    }
};

// Toggle specialtyId field based on role
const toggleSpecialty = (role) => {
    const specialtyGroup = document.getElementById('specialty-group');
    if (specialtyGroup) {
        specialtyGroup.style.display = role === 'DOCTOR' ? 'block' : 'none';
        const input = specialtyGroup.querySelector('input');
        if (role === 'DOCTOR') {
            input.setAttribute('required', 'required');
        } else {
            input.removeAttribute('required');
        }
    }
};

// Export functions to window
window.auth = { register, login, toggleSpecialty };
