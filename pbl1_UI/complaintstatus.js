document.addEventListener('DOMContentLoaded', function () {
  const complaints = JSON.parse(sessionStorage.getItem('eb_complaints') || '[]');

  const tableCard  = document.getElementById('csTableCard');
  const emptyState = document.getElementById('csEmptyState');
  const summaryBar = document.getElementById('csSummaryBar');
  const tbody      = document.getElementById('statusTableBody');

  if (!complaints.length) {
    emptyState.style.display = 'flex';
    return;
  }

  // Show table & summary
  emptyState.style.display  = 'none';
  tableCard.style.display   = 'block';
  summaryBar.style.display  = 'flex';

  // Compute stats
  const total      = complaints.length;
  const pending    = complaints.filter(c => c.status === 'Pending').length;
  const resolved   = complaints.filter(c => c.status === 'Resolved').length;
  const inprogress = total - pending - resolved;

  document.getElementById('statTotal').textContent     = total;
  document.getElementById('statPending').textContent   = pending;
  document.getElementById('statResolved').textContent  = resolved;
  document.getElementById('statInprogress').textContent= inprogress;

  // Render rows (latest first)
  const reversed = [...complaints].reverse();
  reversed.forEach(function (c) {
    const tr = document.createElement('tr');

    let badgeClass = 'badge-pending';
    if (c.status === 'Resolved')    badgeClass = 'badge-resolved';
    if (c.status === 'In Progress') badgeClass = 'badge-inprogress';

    tr.innerHTML = `
      <td style="font-weight:600;color:var(--primary);font-size:12.5px;">${escHtml(c.id)}</td>
      <td>${escHtml(c.type)}</td>
      <td>${escHtml(c.category)}</td>
      <td>${escHtml(c.consumerNo)}</td>
      <td>${escHtml(c.contactPerson)}</td>
      <td style="white-space:nowrap;font-size:12.5px;">${escHtml(c.date)}</td>
      <td><span class="badge ${badgeClass}">${escHtml(c.status)}</span></td>
    `;
    tbody.appendChild(tr);
  });
});

function escHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str || '')));
  return d.innerHTML;
}
