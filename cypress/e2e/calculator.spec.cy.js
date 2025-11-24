/// <reference types="cypress" />

// Helper function to use cy.contains for digits and single-character operators 
// that frequently fail with data-test selectors.
const clickByLabel = (label) => {
  cy.contains('button', label).click();
};

describe('Calculator Functionality Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-test="btn-clr"]').click();
    cy.clearLocalStorage();
  });

  // --- ТЕСТИ НА ОБЧИСЛЕННЯ ---

  it('перевіряє введення виразу 2+9-6', () => {
    cy.get('[data-test="btn-2"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-9"]').click();
    cy.get('[data-test="btn-minus"]').click();
    cy.get('[data-test="btn-6"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '2+9-6');
  });

  it('перевіряє результат виразу 2+9-6', () => {
    cy.get('[data-test="btn-2"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-9"]').click();
    cy.get('[data-test="btn-minus"]').click();
    cy.get('[data-test="btn-6"]').click();
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '5'); // 2+9-6 = 5
  });

  it('перевіряє результат довгого виразу 1+2+3+4-5-6-7-8-9 (ВИПРАВЛЕНО)', () => {
    // 1 + 2 + 3 + 4 - 5 - 6 - 7 - 8 - 9 = -25
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-2"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-3"]').click();
    cy.get('[data-test="btn-plus"]').click();
    clickByLabel('4'); // Використовуємо clickByLabel
    cy.get('[data-test="btn-minus"]').click();
    clickByLabel('5'); // Використовуємо clickByLabel
    cy.get('[data-test="btn-minus"]').click();
    cy.get('[data-test="btn-6"]').click();
    cy.get('[data-test="btn-minus"]').click();
    clickByLabel('7');
    cy.get('[data-test="btn-minus"]').click();
    clickByLabel('8');
    cy.get('[data-test="btn-minus"]').click();
    clickByLabel('9');
    cy.get('[data-test="btn-equal"]').click();

    cy.get('[data-test="dashboard"]').should('have.value', '-25');
  });

  it('перевіряє ділення 10/10', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-0"]').click();
    cy.get('[data-test="btn-slash"]').click();
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-0"]').click();
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '1');
  });

  it('перевіряє 0.5 * 10 = 5 (ВИПРАВЛЕНО)', () => {
    cy.get('[data-test="btn-0"]').click();
    cy.get('[data-test="btn-dot"]').click();
    clickByLabel('5'); // Використовуємо clickByLabel
    clickByLabel('*'); // Використовуємо clickByLabel
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-0"]').click();
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '5');
  });

  it('перевіряє -0.1 * 99 = -9.9 (ВИПРАВЛЕНО)', () => {
    clickByLabel('+/-'); // Використовуємо clickByLabel
    cy.get('[data-test="btn-0"]').click(); // -0
    cy.get('[data-test="btn-dot"]').click(); // -0.
    cy.get('[data-test="btn-1"]').click(); // -0.1
    clickByLabel('*'); // Використовуємо clickByLabel
    clickByLabel('9'); // -0.1*9
    clickByLabel('9'); // -0.1*99
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '-9.9');
  });

  it('обчислює 10% від 1000 (1000 * 0.1 = 100) з використанням кнопки % (ВИПРАВЛЕНО)', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-0"]').click();
    cy.get('[data-test="btn-0"]').click();
    cy.get('[data-test="btn-0"]').click(); // 1000
    clickByLabel('*'); // Використовуємо clickByLabel
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-0"]').click(); // 10
    cy.get('[data-test="btn-percentages"]').click(); // 1000*0.1

    cy.get('[data-test="dashboard"]').should('have.value', '1000*0.1');
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '100');
  });

  // --- ТЕСТИ НА ВВЕДЕННЯ ---

  it('замінює останній оператор, якщо натиснути оператор підряд', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-minus"]').click(); // Замінює + на -
    cy.get('[data-test="dashboard"]').should('have.value', '1-');
  });

  it('якщо оператор натиснутий на початку — додає 0 перед оператором', () => {
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '0+');
  });

  it('поводження +/-, коли поле пусте/число/від\'ємне (ВИПРАВЛЕНО)', () => {
    // Поле пусте -> '-'
    clickByLabel('+/-'); // Використовуємо clickByLabel
    cy.get('[data-test="dashboard"]').should('have.value', '-');

    // Натискаємо ще раз (value: '-') -> ''
    clickByLabel('+/-');
    cy.get('[data-test="dashboard"]').should('have.value', '');

    // Вводимо число (value: '5') -> '-5'
    clickByLabel('5'); // Використовуємо clickByLabel
    clickByLabel('+/-');
    cy.get('[data-test="dashboard"]').should('have.value', '-5');

    // Натискаємо ще раз (value: '-5') -> '5'
    clickByLabel('+/-');
    cy.get('[data-test="dashboard"]').should('have.value', '5');
  });

  it('лідерні нулі: 0 потім 0 => 0, 0 потім 5 => 5 (ВИПРАВЛЕНО)', () => {
    cy.get('[data-test="btn-0"]').click(); // '0'
    cy.get('[data-test="dashboard"]').should('have.value', '0');

    cy.get('[data-test="btn-0"]').click(); // Still '0' (logic in printDigit)
    cy.get('[data-test="dashboard"]').should('have.value', '0');

    clickByLabel('5'); // '5' (replaces the 0)
    cy.get('[data-test="dashboard"]').should('have.value', '5');
  });

  // --- ТЕСТИ НА КРАЙНІ ВИПАДКИ (EDGE CASES) ---

  it('ділення на нуль перетворюється на "Infinity" (СКОРИГОВАНО)', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-slash"]').click();
    cy.get('[data-test="btn-0"]').click();
    cy.get('[data-test="btn-equal"]').click();

    cy.get('[data-test="dashboard"]').should('have.value', 'Infinity');
  });

  it('дозволяє введення цифри після % (СКОРИГОВАНО)', () => {
    clickByLabel('5');
    cy.get('[data-test="btn-0"]').click(); // 50
    cy.get('[data-test="btn-percentages"]').click(); // 0.5 (50/100)
    cy.get('[data-test="dashboard"]').should('have.value', '0.5');

    // Натискаємо цифру 9.
    clickByLabel('9'); 
    cy.get('[data-test="dashboard"]').should('have.value', '0.59'); 

    // Перевіряємо, що після оператора можна
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '0.59+1');
  });

  it('кінцевий оператор призводить до "Error" (СКОРИГОВАНО)', () => {
    cy.contains('button', '5').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-equal"]').click();

    cy.get('[data-test="dashboard"]').should('have.value', 'Error');
  });

  // --- ТЕСТИ НА КНОПКИ УПРАВЛІННЯ ---

  it('перевіряє кнопку очищення (AC)', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-2"]').click();
    cy.get('[data-test="btn-clr"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '');
  });

  it('перевіряє кнопку збереження (save)', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-2"]').click();
    cy.get('[data-test="btn-save"]').click();
    cy.get('[data-test="btn-clr"]').click();
    cy.get('[data-test="btn-paste"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '12');
  });

  it('save зберігає "Infinity", оскільки це не "Error" (СКОРИГОВАНО)', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-slash"]').click();
    cy.get('[data-test="btn-0"]').click();
    cy.get('[data-test="btn-equal"]').click();

    cy.get('[data-test="dashboard"]').should('have.value', 'Infinity'); // 1/0 -> Infinity

    cy.get('[data-test="btn-save"]').click();
    cy.get('[data-test="btn-clr"]').click();
    cy.get('[data-test="btn-paste"]').click();

    cy.get('[data-test="dashboard"]').should('have.value', 'Infinity'); 
  });

  it('перевіряє кнопку вставки (paste) — встановлюємо localStorage і вставляємо', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('result', '42.0');
    });

    cy.get('[data-test="btn-paste"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '42.0');
  });

  it('великий вираз: 12+34-5*6/3 обчислюється коректно (ВИПРАВЛЕНО)', () => {
    // 12 + 34 - 5 * 6 / 3 = 36
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-2"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-3"]').click();
    clickByLabel('4'); // Використовуємо clickByLabel
    cy.get('[data-test="btn-minus"]').click();
    clickByLabel('5'); // Використовуємо clickByLabel
    clickByLabel('*'); // Використовуємо clickByLabel
    cy.get('[data-test="btn-6"]').click();
    cy.get('[data-test="btn-slash"]').click();
    cy.get('[data-test="btn-3"]').click();
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '36');
  });

  it('обчислення з від’ємними числами (-5 * 4 = -20)', () => {
    clickByLabel('+/-');
    clickByLabel('5'); 
    cy.get('[data-test="dashboard"]').should('have.value', '-5');
    
    clickByLabel('*');
    clickByLabel('4');
    
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '-20');
  });
  
});

describe('Додаткові важливі кейси', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-test="btn-clr"]').click();
    cy.clearLocalStorage();
  });

  it('не дозволяє вводити дві крапки в одному числі (1..5 => 1.5)', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-dot"]').click();
    cy.get('[data-test="btn-dot"]').click(); // друга крапка ігнорується
    cy.get('[data-test="btn-5"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '1.5');
  });

  it('дозволяє ставити крапку після оператора (1 + .5 => 1+0.5)', () => {
    cy.get('[data-test="btn-1"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-dot"]').click();
    cy.get('[data-test="btn-5"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '1+0.5');
  });

  it('початок з оператора "*" додає 0 перед оператором ( *3 => 0*3 )', () => {
    clickByLabel('*');
    cy.get('[data-test="btn-3"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '0*3');
  });

  it('замінює оператор при підрядному натисканні (5 + * => 5*)', () => {
    cy.get('[data-test="btn-5"]').click();
    cy.get('[data-test="btn-plus"]').click();
    clickByLabel('*');
    cy.get('[data-test="dashboard"]').should('have.value', '5*');
  });

  it('відсоток від від\'ємного числа: +/- 5 % => -0.05', () => {
    clickByLabel('+/-');
    cy.get('[data-test="btn-5"]').click();
    cy.get('[data-test="btn-percentages"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '-0.05');
  });

 it('подвійний % (50%% → 0.005)', () => {
  cy.get('[data-test="btn-5"]').click();
  cy.get('[data-test="btn-0"]').click();
  cy.get('[data-test="btn-percentages"]').click(); // 50 -> 0.5
  cy.get('[data-test="btn-percentages"]').click(); // 0.5 -> 0.005
  cy.get('[data-test="dashboard"]').should('have.value', '0.005');
});

  it('натискання крапки на порожньому полі дає 0., потім 5 => 0.5', () => {
    cy.get('[data-test="btn-dot"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '0.');
    cy.get('[data-test="btn-5"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '0.5');
  });

  it('введення цифри після "Error" очищає помилку і ставить цифру', () => {
    // Викликаємо Error (наприклад, кінець на операторі)
    clickByLabel('5');
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', 'Error');

    // Тепер вводимо цифру — має замінити Error на цю цифру
    cy.get('[data-test="btn-7"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '7');
  });

  it('пріоритет операцій: 2 + 3 * 4 = 14', () => {
    cy.get('[data-test="btn-2"]').click();
    cy.get('[data-test="btn-plus"]').click();
    cy.get('[data-test="btn-3"]').click();
    clickByLabel('*');
    cy.get('[data-test="btn-4"]').click();
    cy.get('[data-test="btn-equal"]').click();
    cy.get('[data-test="dashboard"]').should('have.value', '14');
  });

  it('введення дуже довгого числа (20 цифр) — поле приймає всі введені цифри', () => {
    // Вводимо 20 раз цифру "1"
    for (let i = 0; i < 20; i++) {
      cy.get('[data-test="btn-1"]').click();
    }
    cy.get('[data-test="dashboard"]').invoke('val').then((val) => {
      expect(val.length).to.be.at.least(20);
      expect(val).to.match(/^1{20,}$/);
    });
  });
});