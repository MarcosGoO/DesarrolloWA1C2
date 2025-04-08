// Selección de elementos DOM
const previousOperationElement = document.getElementById('previous-operation');
const currentOperationElement = document.getElementById('current-operation');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const decimalButton = document.querySelector('.decimal');
const negativeButton = document.getElementById('negative');

// Variables para el estado de la calculadora
let currentOperation = '0';
let previousOperation = '';
let operation = undefined;
let shouldResetScreen = false;

// Funciones flecha para las operaciones matemáticas
const sumar = (num1, num2) => num1 + num2;
const restar = (num1, num2) => num1 - num2;
const multiplicar = (num1, num2) => num1 * num2;
const dividir = (num1, num2) => num1 / num2;

// Función para actualizar la pantalla
const updateDisplay = () => {
    currentOperationElement.textContent = currentOperation;
    
    if (operation != null) {
        // Usar template string para mostrar la operación previa
        previousOperationElement.textContent = `${previousOperation} ${operation}`;
    } else {
        previousOperationElement.textContent = previousOperation;
    }
};

// Función para añadir un número al display
const appendNumber = (number) => {
    // Si debemos resetear la pantalla, reemplazamos el valor en lugar de añadir
    if (shouldResetScreen || currentOperation === '0') {
        currentOperation = number;
        shouldResetScreen = false;
    } else {
        currentOperation += number;
    }
    updateDisplay();
};

// Función para añadir un punto decimal (con validación)
const appendDecimal = () => {
    // Si debemos resetear la pantalla, comenzamos con "0."
    if (shouldResetScreen) {
        currentOperation = '0.';
        shouldResetScreen = false;
        updateDisplay();
        return;
    }
    
    // Validamos que no exista ya un punto decimal
    if (!currentOperation.includes('.')) {
        currentOperation += '.';
        updateDisplay();
    }
};

// Función para cambiar de signo (positivo/negativo)
const toggleNegative = () => {
    if (currentOperation === '0') return;
    
    // Si comienza con signo negativo, lo quitamos; si no, lo añadimos
    if (currentOperation.startsWith('-')) {
        currentOperation = currentOperation.slice(1);
    } else {
        currentOperation = '-' + currentOperation;
    }
    updateDisplay();
};

// Función para seleccionar la operación
const chooseOperation = (op) => {
    // Si el display está vacío, no hacemos nada
    if (currentOperation === '') return;
    
    // Si ya hay una operación pendiente, calculamos el resultado primero
    if (previousOperation !== '') {
        calculate();
    }
    
    operation = op;
    previousOperation = currentOperation;
    shouldResetScreen = true;
    updateDisplay();
};

// Función para realizar el cálculo
const calculate = () => {
    let result;
    const prev = parseFloat(previousOperation);
    const current = parseFloat(currentOperation);
    
    // Validar que ambos sean números
    if (isNaN(prev) || isNaN(current)) return;
    
    // Usar las funciones flecha según la operación
    switch(operation) {
        case '+':
            result = sumar(prev, current);
            break;
        case '-':
            result = restar(prev, current);
            break;
        case '*':
            result = multiplicar(prev, current);
            break;
        case '/':
            // Validar división por cero
            if (current === 0) {
                alert('Error: No se puede dividir por cero');
                clear();
                return;
            }
            result = dividir(prev, current);
            break;
        default:
            return;
    }
    
    // Usar template string para mostrar el resultado
    currentOperation = `${result}`;
    operation = undefined;
    previousOperation = '';
    updateDisplay();
};

// Función para limpiar la calculadora
const clear = () => {
    currentOperation = '0';
    previousOperation = '';
    operation = undefined;
    updateDisplay();
};

// Función para borrar el último dígito
const deleteDigit = () => {
    if (currentOperation === '0' || shouldResetScreen) return;
    
    // Si solo queda un dígito o un signo negativo, ponemos 0
    if (currentOperation.length === 1 || (currentOperation.length === 2 && currentOperation.startsWith('-'))) {
        currentOperation = '0';
    } else {
        currentOperation = currentOperation.slice(0, -1);
    }
    updateDisplay();
};

// Event listeners para los botones numéricos
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.value);
    });
});

// Event listener para el punto decimal
decimalButton.addEventListener('click', () => {
    appendDecimal();
});

// Event listeners para los operadores
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.value);
    });
});

// Event listener para el botón igual
equalsButton.addEventListener('click', () => {
    calculate();
});

// Event listener para el botón de limpiar
clearButton.addEventListener('click', () => {
    clear();
});

// Event listener para el botón de borrar
deleteButton.addEventListener('click', () => {
    deleteDigit();
});

// Event listener para el botón de cambio de signo
negativeButton.addEventListener('click', () => {
    toggleNegative();
});

// Event listeners para teclado
document.addEventListener('keydown', (e) => {
    if (/[0-9]/.test(e.key)) {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendDecimal();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        chooseOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        deleteDigit();
    } else if (e.key === 'Escape') {
        clear();
    }
});

// Inicializar la pantalla
updateDisplay();