/* =====================================================
   Kone ERP - CLIENT API BRIDGE & ROUTING ENGINE
===================================================== */

// REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP DEPLOYMENT URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCgVOQxuSlldyEiUsKPIY2BktCsphuartrghjHctu0KaiLsQxHDg53rS773ERL1PI/exec";

let currentActiveTab = "dashboard";
const localDataCache = {};

document.addEventListener("DOMContentLoaded", function() {
  // Initial Dashboard Load
  loadDashboardData();
});

function switchTab(tabName, element) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');

  const titleElem = document.getElementById('page-title');
  titleElem.innerText = tabName.charAt(0).toUpperCase() + tabName.slice(1) + " Management";

  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));

  currentActiveTab = tabName;

  if (tabName === 'dashboard') {
    document.getElementById('view-dashboard').classList.add('active');
    loadDashboardData();
  } else if (tabName === 'scan') {
    document.getElementById('view-scan').classList.add('active');
    loadScanRecords();
  } else if (tabName === 'inventory') {
    document.getElementById('view-inventory').classList.add('active');
    loadInventoryData();
  } else if (tabName === 'labour') {
    document.getElementById('view-labour').classList.add('active');
    loadLabourData();
  }
}

function showLoader(show) {
  const loader = document.getElementById('loader');
  if (show) loader.classList.remove('hidden');
  else loader.classList.add('hidden');
}

/* =====================================================
   API FETCH WRAPPER
===================================================== */

async function callBackend(action, params = {}, method = 'GET', body = null) {
  showLoader(true);
  try {
    let url = `${APPS_SCRIPT_URL}?action=${action}`;
    
    if (method === 'GET') {
      Object.keys(params).forEach(key => {
        url += `&${key}=${encodeURIComponent(params[key])}`;
      });
    }

    const options = {
      method: method,
    };

    if (method === 'POST' && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const json = await response.json();
    showLoader(false);
    return json;
  } catch (error) {
    showLoader(false);
    console.error("Backend API Error:", error);
    alert("Connection Error: Please check Apps Script URL or Network.");
    return { success: false, message: error.toString() };
  }
}

/* =====================================================
   DASHBOARD CONTROLLER
===================================================== */

async function loadDashboardData() {
  const res = await callBackend("getDashboardCounts");
  if (res && res.success) {
    document.getElementById('cnt-today-pickup').innerText = res.todayPickup || 0;
    document.getElementById('cnt-today-return').innerText = res.todayReturn || 0;
    document.getElementById('cnt-month-pickup').innerText = res.monthPickup || 0;
    document.getElementById('cnt-month-return').innerText = res.monthReturn || 0;
  }

  const recRes = await callBackend("getRecentRecords");
  if (recRes && recRes.success) {
    const tbody = document.getElementById('dashboard-recent-table');
    tbody.innerHTML = '';
    recRes.rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.date || ''}</td>
        <td><span class="badge ${r.type === 'Pickup' ? 'badge-info' : 'badge-warning'}">${r.type}</span></td>
        <td><strong>${r.awb}</strong></td>
        <td>${r.orderId || '-'}</td>
        <td>${r.courier || '-'}</td>
        <td><span class="badge badge-success">${r.status || 'Pending'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

/* =====================================================
   SCAN & TRACKING CONTROLLER
===================================================== */

async function saveScanEntry(e) {
  e.preventDefault();
  const awb = document.getElementById('scan-awb-input').value.trim();
  const type = document.getElementById('scan-type-select').value;

  if (!awb) return alert("Please enter AWB number");

  const res = await callBackend("saveEntry", {}, 'POST', {
    action: "saveEntry",
    payload: { awb: awb, type: type }
  });

  if (res.success) {
    alert("Scan recorded successfully!");
    document.getElementById('scan-awb-input').value = "";
    loadScanRecords();
  } else {
    alert("Error: " + res.message);
  }
}

async function loadScanRecords() {
  const res = await callBackend("getTotalRecords");
  const tbody = document.getElementById('scan-table-body');
  tbody.innerHTML = '';

  if (res.success && res.rows.length) {
    res.rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.date}</td>
        <td><span class="badge ${r.type === 'Pickup' ? 'badge-info' : 'badge-warning'}">${r.type}</span></td>
        <td><strong>${r.awb}</strong></td>
        <td>${r.orderId || '-'}</td>
        <td>${r.courier || '-'}</td>
        <td><span class="badge badge-success">${r.status || 'Scanned'}</span></td>
        <td>${r.customer || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No scan records found.</td></tr>`;
  }
}

/* =====================================================
   INVENTORY CONTROLLER
===================================================== */

async function loadInventoryData() {
  const res = await callBackend("inventoryProducts");
  const tbody = document.getElementById('inventory-table-body');
  tbody.innerHTML = '';

  if (res.success && res.products) {
    res.products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.sku}</strong></td>
        <td>${p.opening}</td>
        <td>${p.inward}</td>
        <td>${p.sales}</td>
        <td>${p.salesReturn}</td>
        <td><span class="badge ${p.stock < 10 ? 'badge-danger' : 'badge-success'}">${p.stock} Pcs</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

async function saveInventoryUpdate() {
  const sku = document.getElementById('inv-sku').value.trim();
  const type = document.getElementById('inv-type').value;
  const qty = Number(document.getElementById('inv-qty').value);

  if (!sku || qty <= 0) return alert("Enter valid SKU and Quantity");

  const res = await callBackend("updateInventory", {}, 'POST', {
    action: "updateInventory",
    data: { sku: sku, type: type, quantity: qty }
  });

  if (res.success) {
    alert("Inventory Updated!");
    closeModal('inv-modal');
    loadInventoryData();
  } else {
    alert("Failed: " + res.message);
  }
}

/* =====================================================
   LABOUR CONTROLLER
===================================================== */

async function loadLabourData() {
  const res = await callBackend("getCuttingLedger");
  const tbody = document.getElementById('labour-table-body');
  tbody.innerHTML = '';

  if (res.success && res.rows) {
    res.rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.date}</td>
        <td><strong>${r.labourName}</strong></td>
        <td>${r.sku || '-'}</td>
        <td>${r.issuedQty}</td>
        <td>${r.receivedQty}</td>
        <td><span class="badge ${r.balanceQty > 0 ? 'badge-warning' : 'badge-success'}">${r.balanceQty}</span></td>
        <td>₹${r.rate}</td>
        <td><strong>₹${r.totalAmount}</strong></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

/* =====================================================
   MODAL UTILS & SEARCH
===================================================== */

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function filterTable(inputId, tableBodyId) {
  const input = document.getElementById(inputId).value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableBodyId} tr`);
  rows.forEach(r => {
    r.style.display = r.innerText.toLowerCase().includes(input) ? '' : 'none';
  });
}
