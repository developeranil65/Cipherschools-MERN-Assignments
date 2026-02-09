const API_URL = 'http://localhost:3000';

const complaintForm = document.getElementById('complaintForm');
if (complaintForm) {
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            location: document.getElementById('location').value,
            ward: document.getElementById('ward').value,
            citizenName: document.getElementById('citizenName').value,
            citizenContact: document.getElementById('citizenContact').value,
            citizenPhone: document.getElementById('citizenPhone').value
        };

        try {
            const response = await fetch(`${API_URL}/complaints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            const messageEl = document.getElementById('message');

            if (data.success) {
                messageEl.className = 'message success';
                messageEl.textContent = `Complaint submitted successfully! Your ID is #${data.data.id}`;
                complaintForm.reset();
                loadComplaints();

                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 5000);
            } else {
                messageEl.className = 'message error';
                messageEl.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            console.error('Error:', error);
            const messageEl = document.getElementById('message');
            messageEl.className = 'message error';
            messageEl.textContent = 'Error submitting complaint';
        }
    });
}

async function loadComplaints(filters = {}) {
    const listEl = document.getElementById('complaintsList');
    if (!listEl) return;

    listEl.innerHTML = '<p class="loading">Loading complaints...</p>';

    try {
        let url = `${API_URL}/complaints?`;
        if (filters.status) url += `status=${filters.status}&`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            listEl.innerHTML = data.data.map(complaint => `
                <div class="complaint-card">
                    <h3>#${complaint.id} - ${complaint.title}</h3>
                    <p><strong>Category:</strong> ${complaint.category} | <strong>Status:</strong> <span class="badge badge-${complaint.status}">${complaint.status}</span></p>
                    <p>${complaint.description}</p>
                    <div class="complaint-meta">
                        <span><strong>Location:</strong> ${complaint.location}</span>
                        <span><strong>Ward:</strong> ${complaint.ward}</span>
                        <span class="priority-${complaint.priority}"><strong>Priority:</strong> ${complaint.priority}</span>
                    </div>
                    <p class="complaint-date">Submitted: ${new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
            `).join('');
        } else {
            listEl.innerHTML = '<p class="no-data">No complaints found</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        listEl.innerHTML = '<p class="error">Error loading complaints</p>';
    }
}

const applyFiltersBtn = document.getElementById('applyFilters');
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
        const filters = {
            status: document.getElementById('statusFilter').value
        };
        loadComplaints(filters);
    });
}

if (document.getElementById('complaintsList')) {
    loadComplaints();
}
