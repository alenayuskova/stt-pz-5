const actions = ['+', '-', '*', '/', '.', '%'];
const dashboard = document.getElementById("dashboard");

function printAction(val) {

  // --- TOGGLE +/–
  if (val === '+/-') {
    if (dashboard.value === '' || dashboard.value === '0' || dashboard.value === '-0') {
      dashboard.value = '-';
    } else if (dashboard.value === '-') {
      dashboard.value = '';
    } else if (dashboard.value[0] === '-') {
      dashboard.value = dashboard.value.slice(1);
    } else {
      dashboard.value = '-' + dashboard.value;
    }
    return;
  }

  // --- ПЕРЕВІРКА КРАПКИ (.)
  if (val === '.') {
    const match = dashboard.value.match(/([\-]?\d+(\.\d*)?)$/);

    // Якщо починається нове число (наприклад, "5+.")
    if (!match) {
      dashboard.value += '0.';
      return;
    }

    const lastNumber = match[1];

    // Заборона другої крапки
    if (lastNumber.includes('.')) return;

    dashboard.value += '.';
    return;
  }

  // --- ЛОГІКА %
  if (val === '%') {
    // Забороняємо % після оператора
    const lastChar = dashboard.value.slice(-1);
    if (actions.includes(lastChar) && lastChar !== '.') return;

    const match = dashboard.value.match(/([\d.]+)$/);
    if (!match) return;

    const base = parseFloat(match[1]);
    dashboard.value = dashboard.value.replace(/([\d.]+)$/, "") + (base / 100);
    return;
  }

  const lastChar = dashboard.value.slice(-1);

  // --- Заміна подвійного оператора (наприклад, 5+- → 5-)
  if (actions.includes(lastChar) && actions.includes(val)) {
    dashboard.value = dashboard.value.slice(0, -1) + val;
    return;
  }

  // --- Додаємо 0 перед оператором, якщо вираз починається зі знаку +, *, /
  if (dashboard.value === '' && ['+', '*', '/', '%'].includes(val)) {
    dashboard.value = '0' + val;
    return;
  }

  dashboard.value += val;
}
function printDigit(val) {

  // --- Якщо було Error — вводимо НОВЕ число
  if (dashboard.value === 'Error') {
    dashboard.value = val;
    return;
  }

  // --- Якщо має . або -0. — завжди додаємо цифру
  if (dashboard.value.endsWith('0.') || dashboard.value.endsWith('-0.')) {
    dashboard.value += val;
    return;
  }

  // --- Лідерні нулі
  if (dashboard.value === '0' && val === '0') return;

  if (dashboard.value === '0' || dashboard.value === '-0') {
    dashboard.value = dashboard.value.slice(0, -1) + val;
  } else {
    dashboard.value += val;
  }
}


function solve() {
  try {
    if (!dashboard.value || dashboard.value === 'Error') return;

    // Заборона обчислення, якщо вираз закінчується оператором
    const lastChar = dashboard.value.slice(-1);
    if (actions.includes(lastChar) && lastChar !== '.') {
      dashboard.value = 'Error';
      return;
    }

    const result = math.evaluate(dashboard.value);
    dashboard.value = String(result);
  } catch {
    dashboard.value = 'Error';
  }
}

function clr() {
  dashboard.value = '';
}

// Theme
function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.body.className = themeName;
}

function toggleTheme() {
  const current = localStorage.getItem('theme') || 'theme-one';
  const next = current === 'theme-one' ? 'theme-second' : 'theme-one';
  setTimeout(() => setTheme(next), 500);
}

// Save & Paste
function save() {
  if (dashboard.value && dashboard.value !== 'Error') {
    localStorage.setItem('result', dashboard.value);
  }
}
function printPercentage() {
  const value = dashboard.value;

  // Якщо вже є результат з точкою — друга операція % не застосовується
  if (!value || value === "Error") return;

  // Якщо % вже застосовано (у результаті є десяткова частина) — ігноруємо
  if (!isNaN(value) && value.includes(".")) {
    return;
  }

  try {
    dashboard.value = String(Number(value) / 100);
  } catch {
    dashboard.value = "Error";
  }
}


function paste() {
  const saved = localStorage.getItem('result');
  if (saved) {
    dashboard.value = saved;
  }
}

// Init theme
(function initTheme() {
  const saved = localStorage.getItem('theme');
  setTheme(saved || 'theme-one');
})();
