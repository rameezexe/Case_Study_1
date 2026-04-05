const BILLS = [
  { id: 'B001', billNo: '90783', month: 'March 2026',    dueDate: '10 Apr 2026', units: 320, amount: 2240.00, status: 'Overdue' },
  { id: 'B002', billNo: '90784', month: 'February 2026', dueDate: '10 Mar 2026', units: 290, amount: 2030.00, status: 'Overdue' },
  { id: 'B003', billNo: '90785', month: 'January 2026',  dueDate: '10 Feb 2026', units: 275, amount: 1980.00, status: 'Pending' },
  { id: 'B004', billNo: '90786', month: 'December 2025', dueDate: '10 Jan 2026', units: 310, amount: 2170.00, status: 'Pending' },
  { id: 'B005', billNo: '90787', month: 'November 2025', dueDate: '10 Dec 2025', units: 260, amount: 1820.00, status: 'Pending' },
];

document.addEventListener('DOMContentLoaded', function () {
  const tbody      = document.getElementById('billBody');
  const selAllCb   = document.getElementById('selectAll');
  const totalEl    = document.getElementById('totalAmt');
  const countEl    = document.getElementById('selCount');
  const proceedBtn = document.getElementById('proceedBtn');

  BILLS.forEach(function (bill) {
    const tr = document.createElement('tr');
    tr.dataset.id = bill.id;
    const cls = bill.status === 'Overdue' ? 'badge-overdue' : 'badge-pending';
    tr.innerHTML =
      '<td class="col-chk"><input type="checkbox" class="bill-cb" data-id="' + bill.id + '" data-amount="' + bill.amount + '"/></td>' +
      '<td>' + bill.billNo + '</td>' +
      '<td>' + bill.month + '</td>' +
      '<td>' + bill.dueDate + '</td>' +
      '<td>' + bill.units + '</td>' +
      '<td><strong>₹ ' + bill.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</strong></td>' +
      '<td><span class="badge ' + cls + '">' + bill.status + '</span></td>';
    tbody.appendChild(tr);
  });

  function updateTotal() {
    const checked = document.querySelectorAll('.bill-cb:checked');
    let total = 0;
    checked.forEach(function (cb) { total += parseFloat(cb.dataset.amount); });
    totalEl.textContent = total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    countEl.textContent = checked.length;
    proceedBtn.disabled = checked.length === 0;

    document.querySelectorAll('.bill-cb').forEach(function (cb) {
      cb.closest('tr').classList.toggle('row-selected', cb.checked);
    });

    const all = document.querySelectorAll('.bill-cb');
    selAllCb.checked = checked.length === all.length;
    selAllCb.indeterminate = checked.length > 0 && checked.length < all.length;
  }

  tbody.addEventListener('change', function (e) {
    if (e.target.classList.contains('bill-cb')) updateTotal();
  });

  selAllCb.addEventListener('change', function () {
    document.querySelectorAll('.bill-cb').forEach(function (cb) { cb.checked = selAllCb.checked; });
    updateTotal();
  });

  proceedBtn.addEventListener('click', function () {
    const checked = document.querySelectorAll('.bill-cb:checked');
    const ids = Array.from(checked).map(function (cb) { return cb.dataset.id; });
    const selected = BILLS.filter(function (b) { return ids.includes(b.id); });
    sessionStorage.setItem('eb_bills', JSON.stringify(selected));
    location.href = 'payment.html';
  });
});
