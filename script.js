// script.js

const display = document.getElementById('display');
const buttons = document.querySelector('.buttons-grid');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

let currentInput = '';
let memory = 0;
let history = [];

function updateDisplay(value) {
  display.textContent = value;
}

function updateHistory() {
  historyList.innerHTML = '';
  history.forEach((item, idx) => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function addToHistory(expr, result) {
  history.push(`${expr} = ${result}`);
  updateHistory();
}

function clearAll() {
  currentInput = '';
  updateDisplay('0');
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput || '0');
}

function insertValue(val) {
  currentInput += val;
  updateDisplay(currentInput);
}

function insertOperator(op) {
  if (currentInput === '' && op !== '-') return;
  if (/[-+×÷]$/.test(currentInput)) {
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay(currentInput);
}

function handleMemory(action) {
  if (action === 'mplus') {
    try {
      const val = evaluate(currentInput);
      memory += Number(val);
    } catch {}
  } else if (action === 'mr') {
    currentInput += memory.toString();
    updateDisplay(currentInput);
  }
}

function handleEquals() {
  try {
    const expr = currentInput;
    const result = evaluate(expr);
    updateDisplay(result);
    addToHistory(expr, result);
    currentInput = result.toString();
  } catch {
    updateDisplay('Error');
    currentInput = '';
  }
}

function handlePercent() {
  try {
    const val = evaluate(currentInput);
    currentInput = (val / 100).toString();
    updateDisplay(currentInput);
  } catch {
    updateDisplay('Error');
    currentInput = '';
  }
}

function evaluate(expr) {
  // Replace symbols for JS eval
  let jsExpr = expr
    .replace(/÷/g, '/')
    .replace(/×/g, '*');
  // eslint-disable-next-line no-eval
  return Function(`'use strict'; return (${jsExpr})`)();
}

buttons.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.classList.contains('btn')) return;

  if (target.hasAttribute('data-number')) {
    insertValue(target.getAttribute('data-number'));
  } else if (target.hasAttribute('data-action')) {
    const action = target.getAttribute('data-action');
    switch (action) {
      case 'add': insertOperator('+'); break;
      case 'subtract': insertOperator('-'); break;
      case 'multiply': insertOperator('×'); break;
      case 'divide': insertOperator('÷'); break;
      case 'percent': handlePercent(); break;
      case 'equals': handleEquals(); break;
      case 'clear': clearAll(); break;
      case 'backspace': backspace(); break;
      case 'mplus': handleMemory('mplus'); break;
      case 'mr': handleMemory('mr'); break;
      default: break;
    }
  }
});

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  updateHistory();
});

clearAll();
updateHistory();

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  if (document.body.classList.contains('light')) {
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
});
// Set initial icon
if (document.body.classList.contains('light')) {
  themeToggle.textContent = '☀️';
} else {
  themeToggle.textContent = '🌙';
}