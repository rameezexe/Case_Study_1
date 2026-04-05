document.addEventListener('DOMContentLoaded', function () {
  const raw = sessionStorage.getItem('eb_bills');
  if (!raw) { location.href = 'paybill.html'; return; }

  const bills    = JSON.parse(raw);
  const billAmt  = bills.reduce(function (s, b) { return s + b.amount; }, 0);
  const pgCharge = parseFloat((billAmt * 0.02).toFixed(2));
  const total    = parseFloat((billAmt + pgCharge).toFixed(2));

  const listEl = document.getElementById('billSummaryList');
  bills.forEach(function (b) {
    const div = document.createElement('div');
    div.className = 'bill-summary-item';
    div.innerHTML =
      '<div><div>Bill No. ' + b.billNo + '</div><div class="bill-sum-month">' + b.month + '</div></div>' +
      '<div class="bill-sum-amt">₹ ' + b.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</div>';
    listEl.appendChild(div);
  });

  document.getElementById('dispBillAmt').textContent  = '₹ ' + billAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  document.getElementById('dispPgCharge').textContent = '₹ ' + pgCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  document.getElementById('dispTotal').textContent    = '₹ ' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  document.getElementById('cardPayAmt').textContent   = '₹ ' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  document.getElementById('payNowBtn').addEventListener('click', function () {
    document.getElementById('paymentSummarySection').classList.add('hidden');
    document.getElementById('cardSection').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('backToSummaryBtn').addEventListener('click', function () {
    clearCardErrors();
    document.getElementById('cardSection').classList.add('hidden');
    document.getElementById('paymentSummarySection').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const cardNoEl = document.getElementById('cardNo');
  cardNoEl.addEventListener('input', function () {
    var v = this.value.replace(/\D/g, '').slice(0, 16);
    this.value = v.replace(/(.{4})/g, '$1 ').trim();
  });

  const expiryEl = document.getElementById('expiry');
  expiryEl.addEventListener('input', function () {
    var v = this.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    this.value = v.slice(0, 5);
  });

  function setInvalid(id) { document.getElementById(id).classList.add('invalid'); }
  function setValid(id)   { document.getElementById(id).classList.remove('invalid'); }

  function clearCardErrors() {
    ['f-cardno', 'f-chname', 'f-expiry', 'f-cvv'].forEach(setValid);
  }

  function validateCard() {
    var ok = true;
    var num = document.getElementById('cardNo').value.replace(/\s/g, '');
    if (!/^\d{16}$/.test(num)) { setInvalid('f-cardno'); ok = false; } else setValid('f-cardno');

    var name = document.getElementById('cardHolder').value.trim();
    if (name.length < 10) { setInvalid('f-chname'); ok = false; } else setValid('f-chname');

    var exp = document.getElementById('expiry').value;
    if (!/^\d{2}\/\d{2}$/.test(exp)) { setInvalid('f-expiry'); ok = false; } else setValid('f-expiry');

    var cvv = document.getElementById('cvv').value;
    if (!/^\d{3}$/.test(cvv)) { setInvalid('f-cvv'); ok = false; } else setValid('f-cvv');

    return ok;
  }

  document.getElementById('makePaymentBtn').addEventListener('click', function () {
    if (!validateCard()) return;

    const userRaw  = sessionStorage.getItem('eb_user');
    const user     = userRaw ? JSON.parse(userRaw) : { name: 'Customer', consumerId: 'N/A' };
    const mode     = document.querySelector('input[name="payMode"]:checked').value;
    const modeLabel = mode === 'credit' ? 'Credit Card' : 'Debit Card';
    const txnId    = 'TXN' + Date.now().toString().slice(-10).toUpperCase();
    const now      = new Date();
    const dateStr  = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    document.getElementById('txnId').textContent      = txnId;
    document.getElementById('txnCid').textContent     = user.consumerId;
    document.getElementById('txnName').textContent    = user.name;
    document.getElementById('txnBillAmt').textContent = '₹ ' + billAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    document.getElementById('txnPg').textContent      = '₹ ' + pgCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    document.getElementById('txnTotal').textContent   = '₹ ' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    document.getElementById('txnMode').textContent    = modeLabel;
    document.getElementById('txnDate').textContent    = dateStr;

    document.getElementById('cardSection').classList.add('hidden');
    document.getElementById('txnSection').classList.remove('hidden');
    sessionStorage.removeItem('eb_bills');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('downloadBtn').addEventListener('click', function () {
      var content =
        'ELECTRICITY BOARD — PAYMENT RECEIPT\n' +
        '=====================================\n' +
        'Transaction ID    : ' + txnId + '\n' +
        'Consumer ID       : ' + user.consumerId + '\n' +
        'Customer Name     : ' + user.name + '\n' +
        'Bill Amount       : Rs. ' + billAmt.toFixed(2) + '\n' +
        'PG Charge (2%)    : Rs. ' + pgCharge.toFixed(2) + '\n' +
        'Total Paid        : Rs. ' + total.toFixed(2) + '\n' +
        'Payment Mode      : ' + modeLabel + '\n' +
        'Date & Time       : ' + dateStr + '\n' +
        '=====================================\n' +
        'Bills Paid:\n';

      bills.forEach(function (b) {
        content += '  - Bill No. ' + b.billNo + ' (' + b.month + ') : Rs. ' + b.amount.toFixed(2) + '\n';
      });

      content += '=====================================\n';
      content += 'Thank you for your payment.\n';

      var blob = new Blob([content], { type: 'text/plain' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href   = url;
      a.download = 'EB_Receipt_' + txnId + '.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });
});
