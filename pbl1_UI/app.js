document.addEventListener('DOMContentLoaded', function () {
  const raw = sessionStorage.getItem('eb_user');
  if (!raw) { location.href = 'login.html'; return; }

  const user = JSON.parse(raw);

  const navUsername = document.getElementById('navUsername');
  if (navUsername) navUsername.textContent = user.name;

  const heroName = document.getElementById('heroName');
  if (heroName) heroName.textContent = user.name;

  const sumName = document.getElementById('sumName');
  if (sumName) sumName.textContent = user.name;

  const sumCid = document.getElementById('sumCid');
  if (sumCid) sumCid.textContent = user.consumerId;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('eb_user');
      sessionStorage.removeItem('eb_bills');
      location.href = 'login.html';
    });
  }
});
