
        // State variables to manage the calculator logic
        let displayValue = '0';
        let firstOperand = null;
        let operator = null;
        let waitingForSecondOperand = false;

        const MAX_DIGITS = 9; // Limit display length

        /**
         * Updates the calculator display element.
         */
        function updateDisplay() {
            const display = document.getElementById('display');
            display.textContent = displayValue.slice(0, MAX_DIGITS);
        }

        /**
         * Handles number and decimal point inputs.
         * @param {string} inputDigit - The digit or decimal point pressed.
         */
        function inputDigit(inputDigit) {
            if (waitingForSecondOperand === true) {
                displayValue = inputDigit;
                waitingForSecondOperand = false;
            } else {
                if (inputDigit === '.') {
                    // Prevent multiple decimal points
                    if (!displayValue.includes('.')) {
                        displayValue = displayValue + inputDigit;
                    }
                } else {
                    // Prevent leading zero if not just '0'
                    displayValue = displayValue === '0' ? inputDigit : displayValue + inputDigit;
                }
            }
            updateDisplay();
        }

        /**
         * Handles the AC (All Clear) button press.
         */
        function resetCalculator() {
            displayValue = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            updateDisplay();
        }

        /**
         * Executes the calculation when a new operator or '=' is pressed.
         * @param {number} num1 - The first operand (stored value).
         * @param {number} num2 - The second operand (current display value).
         * @param {string} op - The arithmetic operator.
         * @returns {number|string} The result or an error string.
         */
        function performCalculation(num1, num2, op) {
            let result;
            switch (op) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
                    if (num2 === 0) {
                        return 'Error';
                    }
                    result = num1 / num2;
                    break;
                default:
                    return num2;
            }
            // Limit result length and fix floating point issues
            return parseFloat(result.toFixed(MAX_DIGITS));
        }

        /**
         * Handles operator (+, -, *, /) and equals (=) button presses.
         * @param {string} nextOperator - The operator pressed.
         */
        function handleOperator(nextOperator) {
            const inputValue = parseFloat(displayValue);

            if (operator && waitingForSecondOperand) {
                // Allows chaining: if operator is pressed twice, it updates the stored operator
                operator = nextOperator;
                return;
            }

            if (firstOperand === null) {
                // Store the current display value as the first operand
                firstOperand = inputValue;
            } else if (operator) {
                // Execute the pending calculation
                const result = performCalculation(firstOperand, inputValue, operator);
                
                // If it's an error, reset the state
                if (result === 'Error') {
                    displayValue = result;
                    resetCalculator();
                } else {
                    // Store the result as the new first operand for chaining
                    displayValue = String(result);
                    firstOperand = result;
                }
            }

            waitingForSecondOperand = true;
            operator = nextOperator; // Store the new operator
            updateDisplay();
        }

        /**
         * Main function to route all button clicks.
         * @param {string} input - The value from the button's onclick attribute.
         */
        function handleInput(input) {
            if (input === 'clear') {
                resetCalculator();
                return;
            }

            if (input === '+' || input === '-' || input === '*' || input === '/' || input === '=') {
                handleOperator(input);
                return;
            }

            // Input is a number or decimal point
            inputDigit(input);
        }

        // Initialize display on load
        window.onload = updateDisplay;