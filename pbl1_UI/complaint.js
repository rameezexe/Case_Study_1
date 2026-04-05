// ============================================================
// Category map — keyed by complaint type value
// ============================================================
const CATEGORY_MAP = {
  billing: [
    'Wrong Bill Amount',
    'Bill Not Received',
    'Duplicate Bill',
    'Excess Billing',
    'Bill Correction Request',
    'Advance Payment Adjustment',
  ],
  voltage: [
    'High Voltage',
    'Low Voltage',
    'Voltage Fluctuation',
    'Single Phase Supply',
    'No Supply',
  ],
  disruption: [
    'Frequent Power Cuts',
    'Scheduled Outage Complaint',
    'Unscheduled Power Cut',
    'Long Duration Outage',
  ],
  streetlight: [
    'Street Light Not Working',
    'Street Light On During Day',
    'New Street Light Request',
    'Damaged Street Light Pole',
    'Street Light Flickering',
  ],
  pole: [
    'Broken / Fallen Pole',
    'Tilted Pole',
    'Pole Needs Replacement',
    'Pole Obstructing Road',
  ],
  meter: [
    'Meter Not Working',
    'Fast Running Meter',
    'Reverse Running Meter',
    'Meter Burnt / Damaged',
    'Meter Seal Broken',
    'Meter Shifting Request',
  ],
  newconn: [
    'Domestic Connection',
    'Commercial Connection',
    'Industrial Connection',
    'Agricultural Connection',
    'Temporary Connection',
  ],
  name_change: [
    'Death of Consumer',
    'Sale / Transfer of Property',
    'Legal Heir Application',
    'Other Name Change',
  ],
  load_change: [
    'Load Enhancement',
    'Load Reduction',
    'Conversion of Phase',
  ],
};

// ============================================================
// DOM references
// ============================================================
const complaintTypeEl = document.getElementById('complaintType');
const categoryEl      = document.getElementById('category');
const probDescEl      = document.getElementById('probDesc');
const contactEl       = document.getElementById('contactPerson');
const cMobileEl       = document.getElementById('cMobile');
const consNoEl        = document.getElementById('consNo');
const landmarkEl      = document.getElementById('landmark');
const addressEl       = document.getElementById('address');
const submitBtn       = document.getElementById('submitComplaintBtn');
const cancelBtn       = document.getElementById('cancelComplaintBtn');

// ============================================================
// Populate category dropdown on type change
// ============================================================
complaintTypeEl.addEventListener('change', function () {
  const type = this.value;
  categoryEl.innerHTML = '';

  if (!type) {
    categoryEl.innerHTML = '<option value="">Select Type First</option>';
    categoryEl.disabled = true;
    return;
  }

  const cats = CATEGORY_MAP[type] || [];
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select Category';
  categoryEl.appendChild(placeholder);

  cats.forEach(function (cat) {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryEl.appendChild(opt);
  });

  categoryEl.disabled = false;

  // Remove invalid state if previously marked
  document.getElementById('f-ctype').classList.remove('invalid');
});

// ============================================================
// Validation helpers
// ============================================================
function markInvalid(id) {
  document.getElementById(id).classList.add('invalid');
}
function markValid(id) {
  document.getElementById(id).classList.remove('invalid');
}

function validateForm() {
  let ok = true;

  // Complaint type
  if (!complaintTypeEl.value) { markInvalid('f-ctype'); ok = false; } else markValid('f-ctype');

  // Category
  if (!categoryEl.value) { markInvalid('f-category'); ok = false; } else markValid('f-category');

  // Problem description
  if (!probDescEl.value.trim()) { markInvalid('f-probdesc'); ok = false; } else markValid('f-probdesc');

  // Contact person
  if (!contactEl.value.trim()) { markInvalid('f-contact'); ok = false; } else markValid('f-contact');

  // Mobile — exactly 10 digits
  const mobVal = cMobileEl.value.trim();
  if (!/^\d{10}$/.test(mobVal)) { markInvalid('f-mobile'); ok = false; } else markValid('f-mobile');

  // Consumer number — exactly 13 digits
  const consVal = consNoEl.value.trim();
  if (!/^\d{13}$/.test(consVal)) { markInvalid('f-consno'); ok = false; } else markValid('f-consno');

  // Address
  if (!addressEl.value.trim()) { markInvalid('f-address'); ok = false; } else markValid('f-address');

  return ok;
}

// ============================================================
// Generate a unique complaint ID  e.g. CMP-20260405-000042
// ============================================================
function generateComplaintId() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = String(Math.floor(Math.random() * 900000) + 100000);
  return 'CMP-' + datePart + '-' + rand;
}

// ============================================================
// Friendly label for complaint type
// ============================================================
const TYPE_LABELS = {
  billing:     'Billing Related',
  voltage:     'Voltage Related',
  disruption:  'Frequent Disruption',
  streetlight: 'Street Light Related',
  pole:        'Pole Related',
  meter:       'Meter Related',
  newconn:     'New Connection',
  name_change: 'Name Change',
  load_change: 'Load Change',
};

// ============================================================
// Submit complaint
// ============================================================
submitBtn.addEventListener('click', function () {
  if (!validateForm()) return;

  const complaintId = generateComplaintId();
  const now = new Date();
  const dateStr = now.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  const typeLabel = TYPE_LABELS[complaintTypeEl.value] || complaintTypeEl.value;

  // Build complaint record and store in sessionStorage
  const complaints = JSON.parse(sessionStorage.getItem('eb_complaints') || '[]');
  const newComplaint = {
    id:           complaintId,
    type:         typeLabel,
    category:     categoryEl.value,
    contactPerson: contactEl.value.trim(),
    consumerNo:   consNoEl.value.trim(),
    mobile:       cMobileEl.value.trim(),
    landmark:     landmarkEl.value.trim(),
    address:      addressEl.value.trim(),
    description:  probDescEl.value.trim(),
    status:       'Pending',
    date:         dateStr,
  };
  complaints.push(newComplaint);
  sessionStorage.setItem('eb_complaints', JSON.stringify(complaints));

  // Populate acknowledgement screen
  document.getElementById('ackComplaintId').textContent  = complaintId;
  document.getElementById('ackComplaintType').textContent = typeLabel;
  document.getElementById('ackCategory').textContent      = categoryEl.value;
  document.getElementById('ackContact').textContent       = contactEl.value.trim();
  document.getElementById('ackConsNo').textContent        = consNoEl.value.trim();
  document.getElementById('ackDate').textContent          = dateStr;

  // Show success screen
  document.getElementById('complaintFormSection').classList.add('hidden');
  document.getElementById('complaintAckSection').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// Cancel / Reset
// ============================================================
cancelBtn.addEventListener('click', function () {
  // Reset all fields
  complaintTypeEl.value = '';
  categoryEl.innerHTML  = '<option value="">Select Type First</option>';
  categoryEl.disabled   = true;
  probDescEl.value      = '';
  contactEl.value       = '';
  cMobileEl.value       = '';
  consNoEl.value        = '';
  landmarkEl.value      = '';
  addressEl.value       = '';

  // Clear validation states
  ['f-ctype','f-category','f-probdesc','f-contact','f-mobile','f-consno','f-address']
    .forEach(function (id) { markValid(id); });
});

// ============================================================
// Live numeric-only enforcement for mobile & consumer no
// ============================================================
[cMobileEl, consNoEl].forEach(function (el) {
  el.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });
});
