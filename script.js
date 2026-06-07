/* ============================================================
   script.js  —  BizCard Studio
   Multi-page version: index.html (login), signup.html, app.html
   ============================================================ */


/* ============================================================
   1.  GLOBAL STATE
   ============================================================ */
let state = {
  name:       'Ahmed Raza Khan',
  role:       'Senior Developer',
  company:    'TechPK Solutions',
  phone:      '0300-1234567',
  email:      'ahmed@techpk.com',
  website:    'www.techpk.com',
  accent:     '#C0392B',
  bg:         '#FDFBF8',
  scale:      1,
  template:   1,
  qrContent:  'phone',
};

let currentView = 'front';


/* ============================================================
   3.  AUTH SYSTEM
   ============================================================ */

/* ----------------------------------------------------------
   3b. HANDLE LOGIN  (used on index.html)
   ---------------------------------------------------------- */
function handleLogin(event) {
  event.preventDefault();

  var emailInput    = document.getElementById('loginEmail');
  var passwordInput = document.getElementById('loginPassword');
  var btn           = document.getElementById('loginBtn');

  var email    = emailInput.value.trim().toLowerCase();
  var password = passwordInput.value;

  if (!email || !password) {
    showAuthMessage('Please fill in all fields.', 'error');
    return;
  }

  btn.textContent = 'Logging in...';
  btn.classList.add('loading');

  setTimeout(function () {
    var accounts = getStoredAccounts();
    var match = accounts.find(function (acc) {
      return acc.email === email && acc.password === password;
    });

    if (match) {
      var session = {
        email:     match.email,
        firstName: match.firstName,
        lastName:  match.lastName,
        loginTime: new Date().toISOString(),
      };

      var rememberMe = document.getElementById('rememberMe').checked;
      if (rememberMe) {
        localStorage.setItem('bizcardSession', JSON.stringify(session));
      } else {
        sessionStorage.setItem('bizcardSession', JSON.stringify(session));
      }

      showAuthMessage('Welcome back, ' + match.firstName + '! Loading your workspace...', 'success');

      setTimeout(function () {
        window.location.href = 'app.html';
      }, 900);

    } else {
      showAuthMessage('Incorrect email or password. Please try again.', 'error');
      passwordInput.value = '';
      emailInput.classList.add('input-error');
      setTimeout(function () {
        emailInput.classList.remove('input-error');
      }, 1500);
    }

    btn.textContent = 'Login to BizCard Studio';
    btn.classList.remove('loading');

  }, 700);
}


/* ----------------------------------------------------------
   3c. HANDLE SIGNUP  (used on signup.html)
   ---------------------------------------------------------- */
function handleSignup(event) {
  event.preventDefault();

  var firstNameInput = document.getElementById('signupFirstName');
  var lastNameInput  = document.getElementById('signupLastName');
  var emailInput     = document.getElementById('signupEmail');
  var passwordInput  = document.getElementById('signupPassword');
  var confirmInput   = document.getElementById('signupConfirm');
  var agreeCheck     = document.getElementById('agreeTerms');
  var btn            = document.getElementById('signupBtn');

  var firstName = firstNameInput.value.trim();
  var lastName  = lastNameInput.value.trim();
  var email     = emailInput.value.trim().toLowerCase();
  var password  = passwordInput.value;
  var confirm   = confirmInput.value;

  if (!firstName) {
    showAuthMessage('Please enter your first name.', 'error');
    firstNameInput.focus();
    return;
  }
  if (!email) {
    showAuthMessage('Please enter a valid email address.', 'error');
    return;
  }
  if (password.length < 6) {
    showAuthMessage('Password must be at least 6 characters.', 'error');
    return;
  }
  if (password !== confirm) {
    showAuthMessage('Passwords do not match. Please try again.', 'error');
    confirmInput.value = '';
    confirmInput.focus();
    return;
  }
  if (!agreeCheck.checked) {
    showAuthMessage('Please accept the Terms & Conditions to continue.', 'error');
    return;
  }

  var accounts = getStoredAccounts();
  var alreadyExists = accounts.find(function (acc) {
    return acc.email === email;
  });
  if (alreadyExists) {
    showAuthMessage('An account with this email already exists. Please login instead.', 'error');
    return;
  }

  btn.textContent = 'Creating account...';
  btn.classList.add('loading');

  setTimeout(function () {
    var newAccount = {
      firstName: firstName,
      lastName:  lastName,
      email:     email,
      password:  password,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    localStorage.setItem('bizcardAccounts', JSON.stringify(accounts));

    var session = {
      email:     newAccount.email,
      firstName: newAccount.firstName,
      lastName:  newAccount.lastName,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem('bizcardSession', JSON.stringify(session));

    showAuthMessage('Account created! Welcome, ' + firstName + '!', 'success');

    setTimeout(function () {
      window.location.href = 'app.html';
    }, 900);

    btn.textContent = 'Create Free Account';
    btn.classList.remove('loading');

  }, 800);
}


/* ----------------------------------------------------------
   3e. HANDLE LOGOUT
   ---------------------------------------------------------- */
function handleLogout() {
  localStorage.removeItem('bizcardSession');
  sessionStorage.removeItem('bizcardSession');
  showToast('You have been logged out.');
  setTimeout(function () {
    window.location.href = 'index.html';
  }, 800);
}


/* ----------------------------------------------------------
   3f. AUTH MESSAGE HELPERS
   ---------------------------------------------------------- */
function showAuthMessage(text, type) {
  var el = document.getElementById('authMessage');
  if (!el) return;
  el.textContent = text;
  el.className   = 'auth-message ' + type;
}

function hideAuthMessage() {
  var el = document.getElementById('authMessage');
  if (!el) return;
  el.className   = 'auth-message';
  el.textContent = '';
}


/* ----------------------------------------------------------
   3g. TOGGLE PASSWORD
   ---------------------------------------------------------- */
function togglePassword(inputId, btn) {
  var input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type      = 'text';
    btn.textContent = '🙈';
  } else {
    input.type      = 'password';
    btn.textContent = '👁';
  }
}


/* ----------------------------------------------------------
   3h. PASSWORD STRENGTH
   ---------------------------------------------------------- */
function checkPasswordStrength(password) {
  var bar   = document.getElementById('pwStrengthBar');
  var label = document.getElementById('pwStrengthLabel');
  if (!bar || !label) return;

  if (!password) {
    bar.className   = 'pw-strength-bar';
    bar.style.width = '0';
    label.textContent = '';
    return;
  }

  var score = 0;
  if (password.length >= 6)               score++;
  if (password.length >= 10)              score++;
  if (/[A-Z]/.test(password))            score++;
  if (/[0-9!@#$%^&*]/.test(password))    score++;

  var levels = [
    { class: 'weak',   text: 'Weak — try adding numbers or symbols' },
    { class: 'fair',   text: 'Fair — a bit stronger' },
    { class: 'good',   text: 'Good — almost there' },
    { class: 'strong', text: 'Strong password ✓' },
  ];

  var idx   = Math.max(0, score - 1);
  var level = levels[idx];
  bar.className     = 'pw-strength-bar ' + level.class;
  label.textContent = level.text;
}


/* ----------------------------------------------------------
   3i. FORGOT PASSWORD
   ---------------------------------------------------------- */
function showForgotMessage() {
  showAuthMessage(
    '💡 Password reset is not available in this demo. Your accounts are stored locally in this browser.',
    'info'
  );
}


/* ============================================================
   4.  NAV BAR SETUP
   ============================================================ */
function setupNavBar(session) {
  var greeting = document.getElementById('navGreeting');
  var avatar   = document.getElementById('navAvatar');
  if (greeting) greeting.textContent = 'Hello, ' + session.firstName;
  if (avatar)   avatar.textContent   = (session.firstName || 'U').charAt(0).toUpperCase();
}


/* ============================================================
   5.  TEMPLATE THUMBNAILS
   ============================================================ */
var TEMPLATE_NAMES = [
  'Minimal Mono', 'Dark Luxury', 'Bold Brutalist',
  'Classic', 'Modern Split', 'Urdu Style',
];

var TEMPLATE_COLORS = [
  ['#FDFBF8', '#1A1510'],
  ['#1A1510', '#F7F4EF'],
  ['#F7F4EF', '#1A1510'],
  ['#FDFBF8', '#3D3628'],
  ['#F0EDE6', '#FDFBF8'],
  ['#F7F4EF', '#7A6E5C'],
];

function buildTemplateThumbs() {
  var grid = document.getElementById('templateGrid');
  if (!grid) return;

  var html = '';
  for (var i = 1; i <= 6; i++) {
    var selected = state.template === i ? ' selected' : '';
    var colors   = TEMPLATE_COLORS[i - 1];
    var bg       = colors[0];
    var fg       = colors[1];

    html += '<div class="tpl-thumb' + selected + '" id="tplThumb' + i + '" onclick="selectTemplate(' + i + ')">' +
              '<div class="tpl-preview" id="tplPrev' + i + '" style="background:' + bg + ';position:relative;overflow:hidden">' +
                buildThumbHTML(i, bg, fg) +
              '</div>' +
              '<div class="tpl-label">' + TEMPLATE_NAMES[i - 1] + '</div>' +
            '</div>';
  }
  grid.innerHTML = html;
}

function buildThumbHTML(templateNum, bg, fg) {
  var ac = state.accent;
  var previews = {
    1: '<div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:' + ac + '"></div>' +
       '<div style="position:absolute;left:8px;top:10px;font-size:5px;font-weight:600;color:' + fg + ';font-family:sans-serif">FULL NAME</div>' +
       '<div style="position:absolute;left:8px;top:18px;font-size:3px;color:' + ac + ';text-transform:uppercase;letter-spacing:0.1em;font-family:sans-serif">ROLE</div>' +
       '<div style="position:absolute;left:8px;top:25px;width:12px;height:1px;background:' + ac + ';opacity:0.5"></div>' +
       '<div style="position:absolute;left:8px;top:29px;font-size:3px;color:' + fg + ';opacity:0.45;font-family:sans-serif">phone · email</div>',

    2: '<div style="position:absolute;right:-4px;top:-4px;width:28px;height:28px;border-radius:50%;background:' + ac + ';opacity:0.15"></div>' +
       '<div style="position:absolute;left:7px;top:9px;font-size:6px;font-style:italic;color:#F7F4EF;font-family:Georgia,serif">Name</div>' +
       '<div style="position:absolute;left:7px;top:18px;font-size:3px;text-transform:uppercase;letter-spacing:0.1em;color:#B0A490;font-family:sans-serif">ROLE</div>' +
       '<div style="position:absolute;right:7px;top:50%;transform:translateY(-50%);text-align:right;font-size:3px;color:#B0A490;font-family:sans-serif;line-height:1.8">phone<br>email</div>' +
       '<div style="position:absolute;right:4px;bottom:5px;width:5px;height:5px;border-radius:50%;background:' + ac + '"></div>',

    3: '<div style="position:absolute;top:0;left:0;right:0;height:3px;background:' + ac + '"></div>' +
       '<div style="position:absolute;left:6px;top:7px;font-size:9px;color:' + fg + ';letter-spacing:0.5px;font-family:sans-serif;font-weight:900">NAME</div>' +
       '<div style="position:absolute;right:28px;top:4px;bottom:4px;width:1.5px;background:' + ac + '"></div>' +
       '<div style="position:absolute;right:6px;top:50%;transform:translateY(-50%);font-size:3px;color:' + fg + ';opacity:0.55;text-align:right;font-family:sans-serif">contact</div>',

    4: '<div style="position:absolute;top:0;left:0;width:11px;height:11px;border-right:1px solid ' + ac + ';border-bottom:1px solid ' + ac + ';opacity:0.7"></div>' +
       '<div style="position:absolute;bottom:0;right:0;width:11px;height:11px;border-left:1px solid ' + ac + ';border-top:1px solid ' + ac + ';opacity:0.7"></div>' +
       '<div style="position:absolute;left:50%;top:10px;transform:translateX(-50%);font-size:5px;font-family:Georgia,serif;color:' + fg + ';white-space:nowrap">Full Name</div>' +
       '<div style="position:absolute;left:50%;top:19px;transform:translateX(-50%);font-size:4px;color:' + ac + '">✦</div>' +
       '<div style="position:absolute;left:50%;bottom:7px;transform:translateX(-50%);font-size:3px;color:' + fg + ';opacity:0.45;white-space:nowrap;font-family:sans-serif">phone · email</div>',

    5: '<div style="position:absolute;left:0;top:0;bottom:0;width:40%;background:' + ac + '"></div>' +
       '<div style="position:absolute;left:5px;top:10px;font-size:13px;font-weight:300;color:#FDFBF8;font-family:sans-serif;opacity:0.85">AB</div>' +
       '<div style="position:absolute;left:44%;top:10px;font-size:3.5px;font-weight:700;color:' + ac + ';font-family:sans-serif;text-transform:uppercase;letter-spacing:0.05em">COMPANY</div>' +
       '<div style="position:absolute;left:44%;top:19px;font-size:3px;color:' + fg + ';opacity:0.45;font-family:sans-serif;line-height:1.8">phone<br>email</div>',

    6: '<div style="position:absolute;inset:4px;border:1px solid ' + ac + ';opacity:0.5;border-radius:2px"></div>' +
       '<div style="position:absolute;left:50%;top:7px;transform:translateX(-50%);font-size:4px;color:' + ac + ';letter-spacing:3px">✦ ✦ ✦</div>' +
       '<div style="position:absolute;left:50%;top:14px;transform:translateX(-50%);font-size:6px;font-family:Georgia,serif;font-style:italic;color:' + ac + ';white-space:nowrap">Name</div>' +
       '<div style="position:absolute;left:50%;bottom:7px;transform:translateX(-50%);font-size:3px;color:' + fg + ';opacity:0.45;white-space:nowrap;font-family:sans-serif">contact</div>',
  };
  return previews[templateNum] || '';
}


/* ============================================================
   6.  TEMPLATE SELECTOR
   ============================================================ */
function selectTemplate(num) {
  state.template = num;
  saveCardState();

  for (var i = 1; i <= 6; i++) {
    var thumb = document.getElementById('tplThumb' + i);
    if (!thumb) continue;
    if (i === num) { thumb.classList.add('selected'); }
    else           { thumb.classList.remove('selected'); }
  }

  for (var j = 1; j <= 6; j++) {
    var prev   = document.getElementById('tplPrev' + j);
    var colors = TEMPLATE_COLORS[j - 1];
    if (prev) prev.innerHTML = buildThumbHTML(j, colors[0], colors[1]);
  }

  update();
}


/* ============================================================
   7.  QR CODE GENERATION
   ============================================================ */
function generateQR(callback) {
  var wrap = document.getElementById('qrRender');
  if (!wrap) { if (callback) callback(); return; }

  wrap.innerHTML = '';
  var qrText = getQRText();

  if (!qrText || qrText.replace(/[:\/\n]/g, '').trim() === '') {
    if (callback) callback();
    return;
  }

  try {
    new QRCode(wrap, {
      text:         qrText,
      width:        56,
      height:       56,
      colorDark:    '#1A1510',
      colorLight:   '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M,
    });
    setTimeout(function () { if (callback) callback(); }, 80);
  } catch (e) {
    if (callback) callback();
  }
}

function getQRText() {
  switch (state.qrContent) {
    case 'phone':   return 'tel:' + state.phone;
    case 'email':   return 'mailto:' + state.email;
    case 'website': var site = state.website; return (site.startsWith('http') ? site : 'https://' + site);
    case 'vcard':
      return 'BEGIN:VCARD\nVERSION:3.0\nFN:' + state.name + '\nTITLE:' + state.role +
             '\nORG:' + state.company + '\nTEL:' + state.phone +
             '\nEMAIL:' + state.email + '\nURL:' + state.website + '\nEND:VCARD';
    default: return 'tel:' + state.phone;
  }
}

function getQRDataUrl() {
  var canvas = document.querySelector('#qrRender canvas');
  return canvas ? canvas.toDataURL('image/png') : null;
}


/* ============================================================
   8.  CARD RENDERER
   ============================================================ */
function renderCard() {
  var card = document.getElementById('bizCard');
  if (!card) return;

  var s     = state;
  var ac    = s.accent;
  var bg    = s.bg;
  var sc    = s.scale;
  var qrUrl = getQRDataUrl();

  var qrImg = qrUrl
    ? '<img src="' + qrUrl + '" style="width:48px;height:48px;display:block" alt="QR Code" />'
    : '';

  var parts     = s.name.trim().split(' ');
  var firstName = parts[0] || s.name;
  var lastName  = parts.slice(1).join(' ');
  var initials  = (firstName.charAt(0) + (parts[1] ? parts[1].charAt(0) : '')).toUpperCase();

  card.className        = 'tpl-' + s.template;
  card.style.background = bg;

  var html = '';

  switch (s.template) {

    case 1:
      html =
        '<div class="t-accent-bar" style="background:' + ac + '"></div>' +
        '<div class="t-name" style="font-size:' + (20 * sc) + 'px">' + esc(s.name) + '</div>' +
        '<div class="t-role" style="font-size:' + (10 * sc) + 'px">' + esc(s.role) + '</div>' +
        '<div class="t-company" style="font-size:' + (11 * sc) + 'px">' + esc(s.company) + '</div>' +
        '<div class="t-divider" style="background:' + ac + ';opacity:0.5"></div>' +
        (s.phone   ? '<div class="t-phone"   style="font-size:' + (9.5 * sc) + 'px">📞 ' + esc(s.phone)   + '</div>' : '') +
        (s.email   ? '<div class="t-email"   style="font-size:' + (9.5 * sc) + 'px;top:' + (s.phone ? 133 : 118) + 'px">✉ ' + esc(s.email)   + '</div>' : '') +
        (s.website ? '<div class="t-website" style="font-size:' + (9.5 * sc) + 'px;top:' + (s.phone && s.email ? 148 : s.phone || s.email ? 133 : 118) + 'px">🌐 ' + esc(s.website) + '</div>' : '') +
        (qrImg ? '<div class="t-qr">' + qrImg + '</div>' : '');
      break;

    case 2:
      card.style.background = '#1A1510';
      html =
        '<div class="t-geo" style="background:' + ac + '"></div>' +
        '<div class="t-name" style="font-size:' + (22 * sc) + 'px">' +
          esc(firstName) + '<br><em style="color:' + ac + '">' + esc(lastName) + '</em>' +
        '</div>' +
        '<div class="t-role"    style="font-size:' + (9  * sc) + 'px">' + esc(s.role)    + '</div>' +
        '<div class="t-company" style="font-size:' + (11 * sc) + 'px">' + esc(s.company) + '</div>' +
        '<div class="t-line"></div>' +
        '<div class="t-contact-block">' +
          (s.phone   ? '<div class="t-phone"   style="font-size:' + (9.5 * sc) + 'px">' + esc(s.phone)   + '</div>' : '') +
          (s.email   ? '<div class="t-email"   style="font-size:' + (9.5 * sc) + 'px">' + esc(s.email)   + '</div>' : '') +
          (s.website ? '<div class="t-website" style="font-size:' + (9.5 * sc) + 'px">' + esc(s.website) + '</div>' : '') +
        '</div>' +
        '<div class="t-dot" style="background:' + ac + '"></div>' +
        (qrImg ? '<div class="t-qr" style="filter:invert(1)">' + qrImg + '</div>' : '');
      break;

    case 3:
      var nameSize3 = s.name.length > 14 ? 26 * sc : 34 * sc;
      var roleTop3  = s.name.length > 14 ? 74 : 90;
      var compTop3  = s.name.length > 14 ? 92 : 108;
      html =
        '<div class="t-topbar" style="background:' + ac + '"></div>' +
        '<div class="t-name" style="font-size:' + nameSize3 + 'px;top:20px">' + esc(s.name.toUpperCase()) + '</div>' +
        '<div class="t-role"    style="font-size:' + (11 * sc) + 'px;top:' + roleTop3 + 'px">' + esc(s.role)    + '</div>' +
        '<div class="t-company" style="font-size:' + (11 * sc) + 'px;top:' + compTop3 + 'px">' + esc(s.company) + '</div>' +
        '<div class="t-vline" style="background:' + ac + '"></div>' +
        '<div class="t-contact-block">' +
          (s.phone   ? '<div class="t-phone"   style="font-size:' + (9 * sc) + 'px">' + esc(s.phone)   + '</div>' : '') +
          (s.email   ? '<div class="t-email"   style="font-size:' + (9 * sc) + 'px">' + esc(s.email)   + '</div>' : '') +
          (s.website ? '<div class="t-website" style="font-size:' + (9 * sc) + 'px">' + esc(s.website) + '</div>' : '') +
        '</div>' +
        (qrImg ? '<div class="t-qr">' + qrImg + '</div>' : '');
      break;

    case 4:
      html =
        '<div class="t-corner-tl" style="border-color:' + ac + ';opacity:0.65"></div>' +
        '<div class="t-corner-br" style="border-color:' + ac + ';opacity:0.65"></div>' +
        '<div class="t-name" style="font-size:' + (s.name.length > 20 ? 14 * sc : 18 * sc) + 'px">' + esc(s.name) + '</div>' +
        '<div class="t-ornament" style="color:' + ac + '">✦</div>' +
        '<div class="t-role" style="font-size:' + (9 * sc) + 'px">' + esc(s.role) + '</div>' +
        '<div class="t-company" style="font-size:' + (10 * sc) + 'px;color:' + ac + '">' + esc(s.company) + '</div>' +
        '<div class="t-hline" style="width:' + (80 * sc) + 'px;background:' + ac + ';opacity:0.45"></div>' +
        '<div class="t-contact-row">' +
          (s.phone   ? '<span class="t-phone"   style="font-size:' + (8.5 * sc) + 'px">' + esc(s.phone)   + '</span><span class="t-sep">·</span>' : '') +
          (s.email   ? '<span class="t-email"   style="font-size:' + (8.5 * sc) + 'px">' + esc(s.email)   + '</span><span class="t-sep">·</span>' : '') +
          (s.website ? '<span class="t-website" style="font-size:' + (8.5 * sc) + 'px">' + esc(s.website) + '</span>' : '') +
        '</div>' +
        (qrImg ? '<div class="t-qr" style="position:absolute;right:60px;bottom:20px">' + qrImg + '</div>' : '');
      break;

    case 5:
      html =
        '<div class="t-left-panel" style="background:' + ac + '">' +
          '<div class="t-initial" style="font-size:' + (52 * sc) + 'px;color:' + bg + '">' + initials + '</div>' +
          '<div class="t-name" style="font-size:' + (11 * sc) + 'px;color:' + bg + '">' + esc(s.name) + '</div>' +
          '<div class="t-role" style="font-size:' + (9  * sc) + 'px;color:' + bg + ';opacity:0.7">' + esc(s.role) + '</div>' +
        '</div>' +
        '<div class="t-right-panel">' +
          '<div class="t-company" style="font-size:' + (13 * sc) + 'px;color:' + ac + '">' + esc(s.company) + '</div>' +
          '<div class="t-divider-h" style="background:' + ac + ';opacity:0.3"></div>' +
          (s.phone   ? '<div class="t-phone"   style="font-size:' + (9 * sc) + 'px">' + esc(s.phone)   + '</div>' : '') +
          (s.email   ? '<div class="t-email"   style="font-size:' + (9 * sc) + 'px">' + esc(s.email)   + '</div>' : '') +
          (s.website ? '<div class="t-website" style="font-size:' + (9 * sc) + 'px">' + esc(s.website) + '</div>' : '') +
        '</div>' +
        (qrImg ? '<div class="t-qr" style="position:absolute;right:14px;bottom:14px">' + qrImg + '</div>' : '');
      break;

    case 6:
      var nameSize6 = s.name.length > 18 ? 17 * sc : 22 * sc;
      html =
        '<div class="t-border-frame" style="border-color:' + ac + ';opacity:0.55"></div>' +
        '<div class="t-top-ornament" style="color:' + ac + '">✦ ✦ ✦</div>' +
        '<div class="t-name-urdu" style="font-size:' + nameSize6 + 'px;color:' + ac + '">' + esc(s.name) + '</div>' +
        '<div class="t-role" style="font-size:' + (9 * sc) + 'px">' + esc(s.role) + '</div>' +
        '<div class="t-company" style="font-size:' + (10.5 * sc) + 'px">' + esc(s.company) + '</div>' +
        '<div class="t-wave" style="color:' + ac + ';opacity:0.45">— — —</div>' +
        '<div class="t-contact-row">' +
          (s.phone   ? '<span class="t-phone"   style="font-size:' + (8.5 * sc) + 'px">' + esc(s.phone)   + '</span><span class="t-sep">·</span>' : '') +
          (s.email   ? '<span class="t-email"   style="font-size:' + (8.5 * sc) + 'px">' + esc(s.email)   + '</span><span class="t-sep">·</span>' : '') +
          (s.website ? '<span class="t-website" style="font-size:' + (8.5 * sc) + 'px">' + esc(s.website) + '</span>' : '') +
        '</div>' +
        (qrImg ? '<div class="t-qr" style="position:absolute;right:20px;bottom:18px">' + qrImg + '</div>' : '');
      break;
  }

  card.innerHTML = html;
}


/* ============================================================
   9.  VIEW SWITCHER
   ============================================================ */
function switchView(view, btn) {
  currentView = view;
  var tabs = document.querySelectorAll('.view-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  if (btn) btn.classList.add('active');
  renderView();
}

function renderView() {
  var area = document.getElementById('canvasArea');
  if (!area) return;

  var ac    = state.accent;
  var qrUrl = getQRDataUrl();

  var frontCardHTML =
    '<div class="card-wrapper">' +
      '<div id="bizCard" class="tpl-' + state.template + '"></div>' +
    '</div>';

  var backCardHTML =
    '<div class="card-wrapper">' +
      '<div style="width:380px;height:217px;border-radius:8px;overflow:hidden;background:' + ac + ';display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;position:relative;">' +
        '<div style="position:absolute;inset:0;opacity:0.07;background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);background-size:14px 14px"></div>' +
        (qrUrl
          ? '<div style="background:#fff;padding:10px;border-radius:8px;position:relative;z-index:1"><img src="' + qrUrl + '" style="width:90px;height:90px;display:block" alt="QR Code" /></div>' +
            '<div style="color:#fff;font-family:DM Sans,sans-serif;font-size:11px;opacity:0.8;position:relative;z-index:1;text-align:center;">' + esc(state.name) + '<br><span style="opacity:0.6;font-size:9.5px">Scan to connect</span></div>'
          : '<div style="color:#fff;font-size:13px;font-family:DM Sans,sans-serif;opacity:0.55">Add phone/email for QR</div>') +
      '</div>' +
    '</div>';

  if (currentView === 'front') {
    area.innerHTML = '<div class="fade-in">' + frontCardHTML + '</div>';
    renderCard();

  } else if (currentView === 'back') {
    area.innerHTML =
      '<div class="fade-in" style="display:flex;flex-direction:column;align-items:center;gap:6px">' +
        '<div class="card-side-label">Back of Card</div>' + backCardHTML +
      '</div>';

  } else if (currentView === 'both') {
    area.innerHTML =
      '<div class="fade-in card-flip-area">' +
        '<div><div class="card-side-label">Front</div>' + frontCardHTML + '</div>' +
        '<div><div class="card-side-label">Back (QR Side)</div>' +
          '<div class="card-wrapper">' +
            '<div style="width:380px;height:217px;border-radius:8px;overflow:hidden;background:' + ac + ';display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;position:relative">' +
              '<div style="position:absolute;inset:0;opacity:0.07;background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);background-size:14px 14px"></div>' +
              (qrUrl
                ? '<div style="background:#fff;padding:8px;border-radius:6px;position:relative;z-index:1"><img src="' + qrUrl + '" style="width:72px;height:72px;display:block" alt="QR" /></div>' +
                  '<div style="color:#fff;font-family:DM Sans,sans-serif;font-size:10px;opacity:0.75;position:relative;z-index:1;text-align:center">' + esc(state.name) + '</div>'
                : '<div style="color:#fff;font-size:11px;opacity:0.5;font-family:DM Sans,sans-serif">QR code here</div>') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    renderCard();
  }
}


/* ============================================================
   10. FORM ↔ STATE SYNC
   ============================================================ */
function readForm() {
  state.name      = document.getElementById('fName').value      || 'Your Name';
  state.role      = document.getElementById('fRole').value      || '';
  state.company   = document.getElementById('fCompany').value   || '';
  state.phone     = document.getElementById('fPhone').value     || '';
  state.email     = document.getElementById('fEmail').value     || '';
  state.website   = document.getElementById('fWebsite').value   || '';
  state.accent    = document.getElementById('fAccent').value;
  state.bg        = document.getElementById('fBg').value;
  state.scale     = parseFloat(document.getElementById('fScale').value);
  state.qrContent = document.getElementById('fQrContent').value;
}

function syncFormToState() {
  document.getElementById('fName').value      = state.name;
  document.getElementById('fRole').value      = state.role;
  document.getElementById('fCompany').value   = state.company;
  document.getElementById('fPhone').value     = state.phone;
  document.getElementById('fEmail').value     = state.email;
  document.getElementById('fWebsite').value   = state.website;
  document.getElementById('fAccent').value    = state.accent;
  document.getElementById('fBg').value        = state.bg;
  document.getElementById('fScale').value     = String(state.scale);
  document.getElementById('fQrContent').value = state.qrContent;
}

function update() {
  readForm();
  saveCardState();
  generateQR(function () {
    renderCard();
    renderView();
    refreshThumbnailAccents();
  });
}

function refreshThumbnailAccents() {
  for (var i = 1; i <= 6; i++) {
    var prev   = document.getElementById('tplPrev' + i);
    var colors = TEMPLATE_COLORS[i - 1];
    if (prev) prev.innerHTML = buildThumbHTML(i, colors[0], colors[1]);
  }
}


/* ============================================================
   11. LOCALSTORAGE PERSISTENCE
   ============================================================ */
function getStorageKey() {
  var session = getActiveSession();
  return 'bizcardState_' + (session ? session.email : 'guest');
}

function saveCardState() {
  localStorage.setItem(getStorageKey(), JSON.stringify(state));
}

function loadCardState(email) {
  var key = 'bizcardState_' + (email || 'guest');
  var raw = localStorage.getItem(key);
  if (!raw) return;
  try {
    var saved = JSON.parse(raw);
    Object.assign(state, saved);
  } catch (e) {}
}

function getStoredAccounts() {
  var raw = localStorage.getItem('bizcardAccounts');
  if (!raw) return [];
  try { return JSON.parse(raw); } catch (e) { return []; }
}

function getActiveSession() {
  var raw = localStorage.getItem('bizcardSession') || sessionStorage.getItem('bizcardSession');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}


/* ============================================================
   12. EXPORT: DOWNLOAD PNG
   ============================================================ */
function downloadPNG() {
  var card = document.getElementById('bizCard');
  if (!card) { showToast('Card preview not ready.'); return; }

  showToast('Generating PNG...');

  html2canvas(card, {
    scale: 3.5, useCORS: true, allowTaint: true,
    backgroundColor: null, logging: false, width: 380, height: 217,
  })
  .then(function (canvas) {
    var link      = document.createElement('a');
    var filename  = (state.name || 'business').replace(/\s+/g, '-') + '-card.png';
    link.download = filename;
    link.href     = canvas.toDataURL('image/png', 1.0);
    link.click();
    showToast('Downloaded! ✓');
  })
  .catch(function (err) { showToast('Error: ' + err.message); });
}


/* ============================================================
   13. EXPORT: COPY TO CLIPBOARD
   ============================================================ */
function copyToClipboard() {
  var card = document.getElementById('bizCard');
  if (!card || !navigator.clipboard || !navigator.clipboard.write) {
    showToast('Copy not supported in this browser.'); return;
  }
  showToast('Copying image...');
  html2canvas(card, { scale: 2, backgroundColor: null, logging: false })
    .then(function (canvas) {
      canvas.toBlob(function (blob) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          .then(function () { showToast('Image copied to clipboard! 📋'); })
          .catch(function () { showToast('Copy failed — try downloading instead.'); });
      });
    })
    .catch(function (err) { showToast('Error: ' + err.message); });
}


/* ============================================================
   14. RESET CARD
   ============================================================ */
function resetCard() {
  if (!confirm('Reset card to default? All your current data will be cleared.')) return;

  state.name = 'Your Name'; state.role = 'Your Designation'; state.company = 'Your Company';
  state.phone = '0300-0000000'; state.email = 'you@email.com'; state.website = 'www.yoursite.com';
  state.accent = '#C0392B'; state.bg = '#FDFBF8'; state.scale = 1;
  state.template = 1; state.qrContent = 'phone';

  localStorage.removeItem(getStorageKey());
  syncFormToState();
  buildTemplateThumbs();
  update();
  showToast('Card reset to default. ↺');
}


/* ============================================================
   15. TOAST
   ============================================================ */
var toastTimer = null;

function showToast(message) {
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2800);
}


/* ============================================================
   16. UTILITY
   ============================================================ */
function esc(str) {
  return String(str || '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
