const USERS = [
  { userId: 'john123', password: 'pass123', name: 'John Smith', consumerId: '1101132490783' },
  { userId: 'jane456', password: 'pass456', name: 'Jane Doe', consumerId: '1101132490784' },
  { userId: 'admin', password: 'admin123', name: 'Admin User', consumerId: '1101132490785' },
];

document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('loginBtn');
  const loginError = document.getElementById('loginError');

  function setInvalid(id) { document.getElementById(id).classList.add('invalid'); }
  function setValid(id) { document.getElementById(id).classList.remove('invalid'); }

  function doLogin() {
    const userId = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPwd').value;
    loginError.classList.add('hidden');

    let ok = true;
    if (!userId) { setInvalid('f-uid'); ok = false; } else setValid('f-uid');
    if (!password) { setInvalid('f-pwd'); ok = false; } else setValid('f-pwd');
    if (!ok) return;


    const registered = JSON.parse(localStorage.getItem('eb_registered_users') || '[]');
    const allUsers = USERS.concat(registered);

    const user = allUsers.find(u => u.userId === userId && u.password === password);
    if (!user) { loginError.classList.remove('hidden'); return; }

    sessionStorage.setItem('eb_user', JSON.stringify(user));
    location.href = 'home.html';
  }

  loginBtn.addEventListener('click', doLogin);
  document.getElementById('loginPwd').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') doLogin();
  });
});
