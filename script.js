// JavaScript Application for ITServicePro

// 1. Initial Data Models (JS Arrays & LocalStorage Persistence)
let services = JSON.parse(localStorage.getItem('itsm_services')) || [
    { id: 1, name: 'Desktop Support', description: 'On-site and remote desktop support', category: 'Desktop Support', price: '$50/hr', sla_time: '4 Hours', status: 'Active' },
    { id: 2, name: 'Network Configuration', description: 'Router, switch and firewall setup', category: 'Network Services', price: '$120/hr', sla_time: '2 Hours', status: 'Active' },
    { id: 3, name: 'Cloud Server Provisioning', description: 'AWS/Azure instance configuration', category: 'Cloud Services', price: '$200/flat', sla_time: '1 Hour', status: 'Active' },
    { id: 4, name: 'Cybersecurity Audit', description: 'Vulnerability scanning & penetration check', category: 'Cybersecurity', price: '$350/flat', sla_time: '12 Hours', status: 'Active' }
];

let tickets = JSON.parse(localStorage.getItem('itsm_tickets')) || [
    { id: 'INC-1001', title: 'Email Server Down', description: 'Unable to access corporate email', client_id: 'Acme Corp', priority: 'Critical', status: 'Open', created_date: '2026-10-08', resolved_date: '', assigned_to: 'John Doe' },
    { id: 'INC-1002', title: 'Software License Request', description: 'Adobe Creative Cloud license needed', client_id: 'TechCorp', priority: 'Medium', status: 'In Progress', created_date: '2026-10-07', resolved_date: '', assigned_to: 'Jane Smith' }
];

let serviceRequests = JSON.parse(localStorage.getItem('itsm_requests')) || [
    { id: 'SR-501', client: 'Acme Corp', service: 'Desktop Support', request_date: '2026-10-08', status: 'Pending', details: 'Install 5 workstations' }
];

let assets = JSON.parse(localStorage.getItem('itsm_assets')) || [
    { id: 'AST-101', name: 'Dell Latitude 5420', type: 'Hardware', serial_no: 'SN-99120', assigned_to: 'John Doe', status: 'Assigned', purchase_date: '2025-01-10' },
    { id: 'AST-102', name: 'Cisco Catalyst 9300', type: 'Network Device', serial_no: 'NET-4412', assigned_to: 'Server Room', status: 'In Stock', purchase_date: '2024-11-15' }
];

let clients = JSON.parse(localStorage.getItem('itsm_clients')) || [
    { id: 'CL-1', name: 'Acme Corp', contact: 'Alice Johnson', email: 'alice@acme.com', phone: '+1 555-0192' },
    { id: 'CL-2', name: 'TechCorp', contact: 'Bob Martin', email: 'bob@techcorp.com', phone: '+1 555-0283' }
];

let kbArticles = JSON.parse(localStorage.getItem('itsm_kb')) || [
    { id: 1, title: 'How to Reset Your Domain Password', category: 'Account Management', content: 'Navigate to portal settings -> Security -> Reset Password link.' },
    { id: 2, title: 'Corporate VPN Connection Guide', category: 'Network', content: 'Download Cisco AnyConnect, enter vpn.company.com and use 2FA token.' },
    { id: 3, title: 'Troubleshooting Outlook Email Crashes', category: 'Desktop Support', content: 'Run outlook.exe /safe command in windows Run dialog to disable add-ins.' }
];

let currentUser = { username: 'John Developer', role: 'Admin' };

// Save Data Helper
function saveData() {
    localStorage.setItem('itsm_services', JSON.stringify(services));
    localStorage.setItem('itsm_tickets', JSON.stringify(tickets));
    localStorage.setItem('itsm_requests', JSON.stringify(serviceRequests));
    localStorage.setItem('itsm_assets', JSON.stringify(assets));
    localStorage.setItem('itsm_clients', JSON.stringify(clients));
    localStorage.setItem('itsm_kb', JSON.stringify(kbArticles));
}

// UI Navigation Helpers
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(el => el.classList.remove('active'));

    const activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.classList.add('active');

    // Highlight menu
    const menuLinks = document.querySelectorAll('.nav-links li a');
    menuLinks.forEach(a => {
        if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(tabId)) {
            a.parentElement.classList.add('active');
        }
    });

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }

    renderAllData();
}

// Render Core Data Views
function renderAllData() {
    renderDashboard();
    renderServiceCatalog();
    renderTickets();
    renderRequests();
    renderAssets();
    renderClients();
    renderKB();
    renderReports();
    populateDropdowns();
}

function renderDashboard() {
    document.getElementById('stat-total-tickets').innerText = tickets.length;
    document.getElementById('stat-open-tickets').innerText = tickets.filter(t => t.status !== 'Resolved').length;
    document.getElementById('stat-total-assets').innerText = assets.length;
}

function renderServiceCatalog() {
    const grid = document.getElementById('serviceCatalogGrid');
    grid.innerHTML = '';
    services.forEach(s => {
        grid.innerHTML += `
            <div class="catalog-card">
                <h3>${s.name}</h3>
                <small style="color: var(--color-text-muted);">${s.category}</small>
                <p style="margin: 10px 0; font-size: 0.9rem;">${s.description}</p>
                <div class="price-tag">${s.price}</div>
                <p style="font-size: 0.85rem; color: var(--color-text-muted);">SLA: <strong>${s.sla_time}</strong></p>
                <br>
                <button class="btn btn-primary btn-block" onclick="quickRequestService('${s.name}')">Request Service</button>
            </div>
        `;
    });
}

function renderTickets() {
    const tbody = document.getElementById('ticketsTableBody');
    tbody.innerHTML = '';
    tickets.forEach((t, i) => {
        const pBadge = `badge-${t.priority.toLowerCase()}`;
        tbody.innerHTML += `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td>${t.title}</td>
                <td>${t.client_id}</td>
                <td><span class="badge ${pBadge}">${t.priority}</span></td>
                <td><span class="badge badge-open">${t.status}</span></td>
                <td>${t.created_date}</td>
                <td>${t.assigned_to || 'Unassigned'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="toggleResolveTicket(${i})">
                        ${t.status === 'Resolved' ? 'Reopen' : 'Resolve'}
                    </button>
                    <button class="btn btn-sm" style="background:#EF4444; color:white;" onclick="deleteTicket(${i})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function renderRequests() {
    const tbody = document.getElementById('requestsTableBody');
    tbody.innerHTML = '';
    serviceRequests.forEach((r, i) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${r.id}</strong></td>
                <td>${r.client}</td>
                <td>${r.service}</td>
                <td>${r.request_date}</td>
                <td><span class="badge badge-progress">${r.status}</span></td>
                <td><button class="btn btn-sm" style="background:#EF4444; color:white;" onclick="deleteRequest(${i})">Cancel</button></td>
            </tr>
        `;
    });
}

function renderAssets() {
    const tbody = document.getElementById('assetsTableBody');
    tbody.innerHTML = '';
    assets.forEach((a, i) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${a.id}</strong></td>
                <td>${a.name}</td>
                <td>${a.type}</td>
                <td>${a.serial_no}</td>
                <td>${a.assigned_to}</td>
                <td><span style="color: green; font-weight: bold;">${a.status}</span></td>
                <td><button class="btn btn-sm" style="background:#EF4444; color:white;" onclick="deleteAsset(${i})">Remove</button></td>
            </tr>
        `;
    });
}

function renderClients() {
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = '';
    clients.forEach((c, i) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${c.id}</strong></td>
                <td>${c.name}</td>
                <td>${c.contact}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td><button class="btn btn-sm" style="background:#EF4444; color:white;" onclick="deleteClient(${i})">Delete</button></td>
            </tr>
        `;
    });
}

function renderKB() {
    const grid = document.getElementById('kbGrid');
    grid.innerHTML = '';
    kbArticles.forEach(a => {
        grid.innerHTML += `
            <div class="kb-card">
                <h3>${a.title}</h3>
                <small style="color: var(--color-blue); font-weight: bold;">${a.category}</small>
                <p style="margin-top: 10px; font-size: 0.9rem; color: var(--color-text-muted);">${a.content}</p>
            </div>
        `;
    });
}

function renderReports() {
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
    document.getElementById('reportResolvedCount').innerText = resolvedCount;

    const div = document.getElementById('priorityDistribution');
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    tickets.forEach(t => counts[t.priority] = (counts[t.priority] || 0) + 1);

    div.innerHTML = `
        <p>Critical: <strong>${counts.Critical}</strong></p>
        <p>High: <strong>${counts.High}</strong></p>
        <p>Medium: <strong>${counts.Medium}</strong></p>
        <p>Low: <strong>${counts.Low}</strong></p>
    `;
}

function populateDropdowns() {
    const tClientSelect = document.getElementById('tClientId');
    const srClientSelect = document.getElementById('srClientSelect');
    const srServiceSelect = document.getElementById('srServiceSelect');

    if (tClientSelect) {
        tClientSelect.innerHTML = clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }
    if (srClientSelect) {
        srClientSelect.innerHTML = clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }
    if (srServiceSelect) {
        srServiceSelect.innerHTML = services.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    }
}

// Action Handlers
function createTicket(e) {
    e.preventDefault();
    const title = document.getElementById('tTitle').value;
    const client = document.getElementById('tClientId').value;
    const priority = document.getElementById('tPriority').value;
    const assigned = document.getElementById('tAssigned').value;
    const desc = document.getElementById('tDesc').value;

    tickets.push({
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        title: title,
        description: desc,
        client_id: client,
        priority: priority,
        status: 'Open',
        created_date: new Date().toISOString().split('T')[0],
        assigned_to: assigned
    });

    saveData();
    renderAllData();
    document.getElementById('ticketForm').reset();
    alert('Ticket Created Successfully!');
}

function createServiceRequest(e) {
    e.preventDefault();
    const service = document.getElementById('srServiceSelect').value;
    const client = document.getElementById('srClientSelect').value;
    const details = document.getElementById('srDetails').value;

    serviceRequests.push({
        id: `SR-${Math.floor(100 + Math.random() * 900)}`,
        client: client,
        service: service,
        request_date: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        details: details
    });

    saveData();
    renderAllData();
    document.getElementById('requestForm').reset();
    alert('Service Request Submitted!');
}

function createAsset(e) {
    e.preventDefault();
    assets.push({
        id: `AST-${Math.floor(100 + Math.random() * 900)}`,
        name: document.getElementById('aName').value,
        type: document.getElementById('aType').value,
        serial_no: document.getElementById('aSerial').value,
        assigned_to: document.getElementById('aAssigned').value,
        status: 'Assigned',
        purchase_date: new Date().toISOString().split('T')[0]
    });

    saveData();
    renderAllData();
    document.getElementById('assetForm').reset();
    alert('Asset Registered Successfully!');
}

function createClient(e) {
    e.preventDefault();
    clients.push({
        id: `CL-${clients.length + 1}`,
        name: document.getElementById('cName').value,
        contact: document.getElementById('cContact').value,
        email: document.getElementById('cEmail').value,
        phone: document.getElementById('cPhone').value
    });

    saveData();
    renderAllData();
    document.getElementById('clientForm').reset();
    alert('Client Profile Saved!');
}

function toggleResolveTicket(index) {
    tickets[index].status = tickets[index].status === 'Resolved' ? 'Open' : 'Resolved';
    saveData();
    renderAllData();
}

function deleteTicket(index) {
    tickets.splice(index, 1);
    saveData();
    renderAllData();
}

function deleteRequest(index) {
    serviceRequests.splice(index, 1);
    saveData();
    renderAllData();
}

function deleteAsset(index) {
    assets.splice(index, 1);
    saveData();
    renderAllData();
}

function deleteClient(index) {
    clients.splice(index, 1);
    saveData();
    renderAllData();
}

function quickRequestService(serviceName) {
    switchTab('requests');
    document.getElementById('srServiceSelect').value = serviceName;
}

function handleLogin(e) {
    e.preventDefault();
    currentUser.username = document.getElementById('loginUsername').value;
    currentUser.role = document.getElementById('loginRole').value;

    document.getElementById('navUserName').innerText = currentUser.username;
    document.getElementById('navUserRole').innerText = `(${currentUser.role})`;

    alert(`Logged in as ${currentUser.username} [${currentUser.role}]`);
    switchTab('dashboard');
}

function filterKB() {
    const val = document.getElementById('kbSearch').value.toLowerCase();
    const filtered = kbArticles.filter(a => a.title.toLowerCase().includes(val) || a.content.toLowerCase().includes(val));
    const grid = document.getElementById('kbGrid');
    grid.innerHTML = '';
    filtered.forEach(a => {
        grid.innerHTML += `
            <div class="kb-card">
                <h3>${a.title}</h3>
                <small style="color: var(--color-blue); font-weight: bold;">${a.category}</small>
                <p style="margin-top: 10px; font-size: 0.9rem; color: var(--color-text-muted);">${a.content}</p>
            </div>
        `;
    });
}

function filterGlobal() {
    const query = document.getElementById('globalSearch').value.toLowerCase();
    if(query.length > 2) {
        switchTab('tickets');
    }
}

// Initialize on Load
window.onload = function() {
    renderAllData();
};
