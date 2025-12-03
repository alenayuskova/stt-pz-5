const actions = ['+', '-', '*', '/', '.', '%'];
const dashboard = document.getElementById("dashboard");

function isOperator(ch) {
  return ['+', '-', '*', '/', '%'].includes(ch);
}

function printDigit(val) {
  if (dashboard.value === "Error") {
    dashboard.value = val;
    return;
  }

  // Лідерні нулі типу 0 → 5 = 5
  if (dashboard.value === "0") {
    dashboard.value = val;
    return;
  }

  dashboard.value += val;
}

function printAction(val) {
  let v = dashboard.value;

  if (v === "Error") return;

  // ============================
  //        КНОПКА +/-
  // ============================
  if (val === '+/-') {
    if (v === '') {
      dashboard.value = '-';
      return;
    }

    if (v[0] === '-') {
      dashboard.value = v.slice(1);
    } else {
      dashboard.value = '-' + v;
    }
    return;
  }

  // ============================
  //           КНОПКА "."
  // ============================
  if (val === '.') {
    if (v === '' || isOperator(v[v.length - 1])) {
      dashboard.value += '0.';
      return;
    }

    let last = v.split(/[\+\-\*\/]/).pop();
    if (last.includes('.')) return;

    dashboard.value += '.';
    return;
  }

  // ============================
  //     КНОПКА "%": x → x/100
  // ============================
  if (val === '%') {
    if (v === '' || isOperator(v[v.length - 1])) return;

    let number = parseFloat(v);
    let converted = number / 100;
    dashboard.value = converted.toString();
    return;
  }

  // ============================
  //  Заміна подвійних операторів
  // ============================
  if (isOperator(val)) {
    if (v === '') {
      dashboard.value = '0' + val;
      return;
    }

    if (isOperator(v[v.length - 1])) {
      dashboard.value = v.slice(0, -1) + val;
      return;
    }
  }

  dashboard.value += val;
}

function solve() {
  let exp = dashboard.value;

  if (exp === '' || isOperator(exp[exp.length - 1])) {
    dashboard.value = "Error";
    return;
  }

  try {
    let result = math.evaluate(exp);
    if (result === Infinity || result === -Infinity || isNaN(result)) {
      dashboard.value = "Infinity";
    } else {
      dashboard.value = result.toString();
    }
  } catch {
    dashboard.value = "Error";
  }
}

function clr() {
  dashboard.value = '';
}

function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.body.className = themeName;
}

function toggleTheme() {
  let theme = localStorage.getItem('theme');
  theme = theme === 'theme-second' ? 'theme-one' : 'theme-second';
  setTimeout(() => setTheme(theme), 500);
}

function save() {
  if (dashboard.value !== "Error") {
    localStorage.setItem('result', dashboard.value);
  }
}

function paste() {
  let saved = localStorage.getItem('result');
  if (saved) printDigit(saved);
}

setTheme('theme-one');
