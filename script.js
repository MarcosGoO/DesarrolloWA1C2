// selección elementos DOM
const previousOperationElement = document.getElementById('previous-operation');
const currentOperationElement = document.getElementById('current-operation');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');

const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const decimalButton = document.querySelector('.decimal');
const negativeButton = document.getElementById('negative');

// variables para el estado de la calculadora
let currentOperation = '0';
let previousOperation = '';
let operation = undefined;
let shouldResetScreen = false;

// constante para determinar cuándo mostrar en notación científica
const DIGIT_THRESHOLD = 12; // Número de dígitos a partir del cual usamos notación científica

// funciones flecha para las operaciones matemáticas
const sumar = (num1, num2) => num1 + num2;
const restar = (num1, num2) => num1 - num2;
const multiplicar = (num1, num2) => num1 * num2;
const dividir = (num1, num2) => num1 / num2;

//  formatear números grandes
const formatNumber = (number) => {
    const numStr = number.toString();
    // Si el número es muy grande o muy pequeño, usamos notación científica
    if (Math.abs(number) >= 10 ** DIGIT_THRESHOLD || 
        (Math.abs(number) < 0.000001 && Math.abs(number) > 0)) {
        return number.toExponential(6); // 6 decimales en notación científica
    }
    // Si tiene muchos decimales, los limitamos a 10
    if (numStr.includes('.') && numStr.split('.')[1].length > 10) {
        return parseFloat(number.toFixed(10)).toString();
    }
    return numStr;
};

// función para actualizar la pantalla
const updateDisplay = () => {
    // para la visualización, formateamos el número si es necesario
    currentOperationElement.textContent = currentOperation;
    if (operation != null) {
        // template string para mostrar la operación previa
        previousOperationElement.textContent = `${previousOperation} ${operation}`;
    } else {
        previousOperationElement.textContent = previousOperation;
    }
};

// función para añadir un número al display
const appendNumber = (number) => {    
    // caso donde queremos reemplazar en vez de concatenar
    if (shouldResetScreen || currentOperation === '0') {
        currentOperation = number;
        shouldResetScreen = false; // si es false SI concatena sino NO.
    } else {
        currentOperation += number;
    }
    updateDisplay();
};

// función para añadir un punto decimal
const appendDecimal = () => {
    // si debemos resetear la pantalla, comenzamos con "0."
    if (shouldResetScreen) {
        currentOperation = '0.';
        shouldResetScreen = false;
        updateDisplay();
        return;
    }
    //validación
    // validamos que no exista ya un punto decimal, si no existe entra en este if
    // ! = negación
    if (!currentOperation.includes('.')) {
        console.log('aaaa')
        currentOperation += '.';
        updateDisplay();
    }
};

// cambiar de signo (positivo/negativo)
const toggleNegative = () => {
    if (currentOperation === '0') return;
    
    // Si comienza con signo negativo, lo quitamos,si no, lo añadimos
    if (currentOperation.startsWith('-')) {
        currentOperation = currentOperation.slice(1);
    } else {
        currentOperation = '-' + currentOperation;
    }
    updateDisplay();
};

//  seleccionar la operación
const chooseOperation = (op) => {
    // si el display está vacío, no hacemos nada
    if (currentOperation === '') return;

    // si ya hay una operación pendiente, calculamos el resultado primero
    if (previousOperation !== '') {
        calculate();
    }
    
    operation = op;
    previousOperation = currentOperation;
    shouldResetScreen = true;
    updateDisplay();
};

// funcion principal Cálculos
const calculate = () => {
    let result;
    const prev = parseFloat(previousOperation);
    const current = parseFloat(currentOperation);
    
    // validar que ambos sean números
    if (isNaN(prev) || isNaN(current)) return;
    
    //  funciones flecha según la operación
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
    
    // formatear el resultado para números grandes
    currentOperation = formatNumber(result);
    operation = undefined;
    previousOperation = '';
    updateDisplay();
    shouldResetScreen = true;
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

// event listeners para los botones numéricos
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.value);
    });
});

// event listener para el punto decimal
decimalButton.addEventListener('click', () => {
    appendDecimal();
});

// event listeners para los operadores
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.value);
    });
});

// event listener para el botón igual
equalsButton.addEventListener('click', () => {
    calculate();
});

// event listener para el botón de limpiar
clearButton.addEventListener('click', () => {
    clear();
});

// event listener para el botón de borrar
deleteButton.addEventListener('click', () => {
    deleteDigit();
});

// event listener para el botón de cambio de signo
negativeButton.addEventListener('click', () => {
    toggleNegative();
});

// event listeners para teclado
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