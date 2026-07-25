const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

let expression = '0';
let justEvaluated = false;

function updateDisplay() {
  expressionDisplay.textContent = expression;
  const preview = calculatePreview(expression);
  resultDisplay.textContent = preview;
}

function calculatePreview(input) {
  if (!input || input === '0') return '0';
  const safeExpression = input.replace(/×/g, '*').replace(/÷/g, '/');
  if (!/^[0-9.+\-*/()]+$/.test(safeExpression)) return 'Error';
  try {
    const value = Function(`"use strict"; return (${safeExpression})`)();
    return Number.isFinite(value) ? value.toString() : 'Error';
  } catch {
    return 'Error';
  }
}

function appendValue(value) {
  if (justEvaluated && /[0-9.]/.test(value)) {
    expression = value;
    justEvaluated = false;
    updateDisplay();
    return;
  }

  if (expression === '0' && value !== '.') {
    expression = value;
    updateDisplay();
    return;
  }

  if (value === '.' && /\./.test(getLastNumber())) {
    updateDisplay();
    return;
  }

  expression += value;
  justEvaluated = false;
  updateDisplay();
}

function getLastNumber() {
  const match = expression.match(/(\d*\.?\d*)$/);
  return match ? match[1] : '';
}

function handleOperator(operator) {
  if (justEvaluated) {
    justEvaluated = false;
  }

  if (expression === '0' && operator === '-') {
    expression = '-';
    updateDisplay();
    return;
  }

  if (/[+\-*/]$/.test(expression)) {
    expression = expression.slice(0, -1) + operator;
  } else {
    expression += operator;
  }

  updateDisplay();
}

function clearDisplay() {
  expression = '0';
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (expression.length <= 1) {
    expression = '0';
  } else {
    expression = expression.slice(0, -1);
  }
  justEvaluated = false;
  updateDisplay();
}

function evaluateExpression() {
  const result = calculatePreview(expression);
  if (result === 'Error') {
    expression = '0';
    resultDisplay.textContent = 'Error';
    return;
  }

  expression = result;
  justEvaluated = true;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === 'clear') {
      clearDisplay();
    } else if (action === 'delete') {
      deleteLast();
    } else if (action === 'equals') {
      evaluateExpression();
    } else if (value) {
      if (['+', '-', '*', '/'].includes(value)) {
        handleOperator(value);
      } else {
        appendValue(value);
      }
    }
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    appendValue(key);
    event.preventDefault();
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key === 'x' ? '*' : key);
    event.preventDefault();
  } else if (key === 'Enter') {
    evaluateExpression();
    event.preventDefault();
  } else if (key === 'Backspace') {
    deleteLast();
    event.preventDefault();
  } else if (key === 'Escape') {
    clearDisplay();
    event.preventDefault();
  }
});

updateDisplay();
