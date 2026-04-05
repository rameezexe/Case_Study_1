
function generateConsumerId() {
  const min = 1000000000000;
  const max = 9999999999999;
  return Math.floor(min + Math.random() * (max - min)).toString();
}


function setValid(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.remove('invalid');
}

function setInvalid(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.add('invalid');
}

function validateForm() {
  let isValid = true;

  const consumerId = document.getElementById('consumerId').value.trim();
  if (/^\d{13}$/.test(consumerId)) {
    setValid('f-cid');
  } else {
    setInvalid('f-cid');
    isValid = false;
  }

  const billNo = document.getElementById('billNo').value.trim();
  if (/^\d{5}$/.test(billNo)) {
    setValid('f-bill');
  } else {
    setInvalid('f-bill');
    isValid = false;
  }

  const title = document.getElementById('title').value;
  if (title !== '') {
    setValid('f-title');
  } else {
    setInvalid('f-title');
    isValid = false;
  }

  const custName = document.getElementById('custName').value.trim();
  if (custName.length > 0 && custName.length <= 50) {
    setValid('f-name');
  } else {
    setInvalid('f-name');
    isValid = false;
  }

  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    setValid('f-email');
  } else {
    setInvalid('f-email');
    isValid = false;
  }


  const countryCode = document.getElementById('countryCode').value;
  const mobile = document.getElementById('mobile').value.trim();
  if (countryCode !== '' && /^\d{10}$/.test(mobile)) {
    setValid('f-mobile');
  } else {
    setInvalid('f-mobile');
    isValid = false;
  }

  
  const userId = document.getElementById('userId').value.trim();
  if (userId.length >= 5 && userId.length <= 20) {
    setValid('f-uid');
  } else {
    setInvalid('f-uid');
    isValid = false;
  }


  const pwd = document.getElementById('pwd').value;
  if (pwd.length > 0 && pwd.length <= 30) {
    setValid('f-pwd');
  } else {
    setInvalid('f-pwd');
    isValid = false;
  }

  
  const cpwd = document.getElementById('cpwd').value;
  if (cpwd.length > 0 && cpwd === pwd) {
    setValid('f-cpwd');
  } else {
    setInvalid('f-cpwd');
    isValid = false;
  }

  return isValid;
}


function resetForm() {
  const inputs = ['consumerId', 'billNo', 'custName', 'email', 'mobile', 'userId', 'pwd', 'cpwd'];
  const selects = ['title', 'countryCode'];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  selects.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });

  const allFields = ['f-cid', 'f-bill', 'f-title', 'f-name', 'f-email', 'f-mobile', 'f-uid', 'f-pwd', 'f-cpwd'];
  allFields.forEach(id => setValid(id));
}

function submitForm() {
  if (!validateForm()) return;

  const generatedId = generateConsumerId();
  const custName    = document.getElementById('custName').value.trim();
  const email       = document.getElementById('email').value.trim();
  const userId      = document.getElementById('userId').value.trim();
  const password    = document.getElementById('pwd').value;

  // ── Populate acknowledgement screen ──────────────────────────
  document.getElementById('ack-cid').textContent   = generatedId;
  document.getElementById('ack-name').textContent  = custName;
  document.getElementById('ack-email').textContent = email;

  // ── Save user to sessionStorage so login works ────────────────
  const registeredUsers = JSON.parse(localStorage.getItem('eb_registered_users') || '[]');
  registeredUsers.push({
    userId:     userId,
    password:   password,
    name:       custName,
    consumerId: generatedId,
  });
  localStorage.setItem('eb_registered_users', JSON.stringify(registeredUsers));

  document.getElementById('formPage').classList.add('hidden');
  document.getElementById('ackPage').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


document.addEventListener('DOMContentLoaded', function () {

  document.getElementById('registerBtn').addEventListener('click', submitForm);

  document.getElementById('resetBtn').addEventListener('click', resetForm);

  document.getElementById('newRegBtn').addEventListener('click', function () {
    resetForm();
    document.getElementById('ackPage').classList.add('hidden');
    document.getElementById('formPage').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const fieldMap = {
    'consumerId': 'f-cid',
    'billNo':     'f-bill',
    'title':      'f-title',
    'custName':   'f-name',
    'email':      'f-email',
    'mobile':     'f-mobile',
    'countryCode':'f-mobile',
    'userId':     'f-uid',
    'pwd':        'f-pwd',
    'cpwd':       'f-cpwd',
  };

  Object.keys(fieldMap).forEach(inputId => {
    const el = document.getElementById(inputId);
    if (el) {
      el.addEventListener('blur', function () {
       
        const fid = fieldMap[inputId];
        validateSingleField(inputId, fid);
      });
    }
  });
});

function validateSingleField(inputId, fieldId) {
  switch (inputId) {
    case 'consumerId': {
      const v = document.getElementById('consumerId').value.trim();
      /^\d{13}$/.test(v) ? setValid(fieldId) : setInvalid(fieldId);
      break;
    }
    case 'billNo': {
      const v = document.getElementById('billNo').value.trim();
      /^\d{5}$/.test(v) ? setValid(fieldId) : setInvalid(fieldId);
      break;
    }
    case 'title': {
      const v = document.getElementById('title').value;
      v !== '' ? setValid(fieldId) : setInvalid(fieldId);
      break;
    }
    case 'custName': {
      const v = document.getElementById('custName').value.trim();
      (v.length > 0 && v.length <= 50) ? setValid(fieldId) : setInvalid(fieldId);
      break;
    }
    case 'email': {
      const v = document.getElementById('email').value.trim();
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? setValid(fieldId) : setInvalid(fieldId);
      break;
    }
    case 'mobile':
    case 'countryCode': {
      const cc  = document.getElementById('countryCode').value;
      const mob = document.getElementById('mobile').value.trim();
      (cc !== '' && /^\d{10}$/.test(mob)) ? setValid('f-mobile') : setInvalid('f-mobile');
      break;
    }
    case 'userId': {
      const v = document.getElementById('userId').value.trim();
      (v.length >= 5 && v.length <= 20) ? setValid(fieldId) : setInvalid(fieldId);
      break;
    }
    case 'pwd': {
      const v = document.getElementById('pwd').value;
      (v.length > 0 && v.length <= 30) ? setValid(fieldId) : setInvalid(fieldId);
      break;
    }
    case 'cpwd': {
      const pwd  = document.getElementById('pwd').value;
      const cpwd = document.getElementById('cpwd').value;
      (cpwd.length > 0 && cpwd === pwd) ? setValid(fieldId) : setInvalid(fieldId);
      break;
    }
  }
}
