document.addEventListener('DOMContentLoaded', () => {
  const toolContent = document.getElementById('tool-content');
  const toolTitle = document.getElementById('tool-title');
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebar = document.querySelector('.sidebar');
  const openSidebarBtn = document.getElementById('open-sidebar');
  const closeSidebarBtn = document.getElementById('close-sidebar');

  // --- Sound Effects ---
  const playSound = (sound) => {
    // User needs to place sound files in the 'assets' directory
    // e.g., assets/click.mp3, assets/success.mp3
    try {
      new Audio(`assets/${sound}.mp3`).play();
    } catch (e) {
      console.warn("Sound files not found. Place them in the 'assets' directory.", e);
    }
  };

  // --- Sidebar Toggle ---
  openSidebarBtn.addEventListener('click', () => sidebar.classList.add('active'));
  closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('active'));

  // --- Dynamic Script Loader ---
  const loadScript = (url, callback) => {
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  };

  // --- Tool Loading ---
  const loadTool = (toolName) => {
    toolTitle.textContent = toolName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    toolContent.innerHTML = ''; // Clear previous content

    if (toolName === 'qr-code-generator') {
      loadScript('https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js', () => {
        getToolContent(toolName);
      });
    } else {
      getToolContent(toolName);
    }

    if (window.innerWidth < 992) {
      sidebar.classList.remove('active');
    }
  };

  // --- Tool Content Map ---
  const getToolContent = (toolName) => {
    const tools = {
      'age-calculator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Calculate Your Age</h5>
          <div class="mb-3"><label for="dob" class="form-label">Enter your Date of Birth:</label><input type="date" class="form-control" id="dob"></div>
          <button class="btn btn-primary" id="calculate-age">Calculate Age</button>
          <div class="mt-3" id="age-result"></div>
        </div></div>`,
      'date-difference': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Calculate Difference Between Dates</h5>
          <div class="row">
            <div class="col-md-6 mb-3"><label for="startDate" class="form-label">Start Date:</label><input type="date" class="form-control" id="startDate"></div>
            <div class="col-md-6 mb-3"><label for="endDate" class="form-label">End Date:</label><input type="date" class="form-control" id="endDate"></div>
          </div>
          <button class="btn btn-primary" id="calculate-diff">Calculate Difference</button>
          <div class="mt-3" id="diff-result"></div>
        </div></div>`,
      'bmi-calculator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">BMI Calculator</h5>
          <div class="row">
            <div class="col-md-6 mb-3"><label for="weight" class="form-label">Weight (kg):</label><input type="number" class="form-control" id="weight"></div>
            <div class="col-md-6 mb-3"><label for="height" class="form-label">Height (cm):</label><input type="number" class="form-control" id="height"></div>
          </div>
          <button class="btn btn-primary" id="calculate-bmi">Calculate BMI</button>
          <div class="mt-3" id="bmi-result"></div>
        </div></div>`,
      'loan-calculator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Loan Calculator</h5>
          <div class="mb-3"><label for="amount" class="form-label">Loan Amount ($):</label><input type="number" class="form-control" id="amount"></div>
          <div class="mb-3"><label for="interest" class="form-label">Annual Interest Rate (%):</label><input type="number" class="form-control" id="interest"></div>
          <div class="mb-3"><label for="years" class="form-label">Loan Term (Years):</label><input type="number" class="form-control" id="years"></div>
          <button class="btn btn-primary" id="calculate-loan">Calculate</button>
          <div class="mt-3" id="loan-result"></div>
        </div></div>`,
      'percentage-calculator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Percentage Calculator</h5>
          <div class="row">
            <div class="col-md-4 mb-3"><label for="percentage" class="form-label">Percentage (%):</label><input type="number" class="form-control" id="percentage"></div>
            <div class="col-md-8 mb-3"><label for="number" class="form-label">Of Number:</label><input type="number" class="form-control" id="number"></div>
          </div>
          <button class="btn btn-primary" id="calculate-percentage">Calculate</button>
          <div class="mt-3" id="percentage-result"></div>
        </div></div>`,
      'tip-calculator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Tip Calculator</h5>
          <div class="mb-3"><label for="bill-amount" class="form-label">Bill Amount ($):</label><input type="number" class="form-control" id="bill-amount"></div>
          <div class="mb-3"><label for="tip-percentage" class="form-label">Tip Percentage (%):</label><input type="number" class="form-control" id="tip-percentage" value="15"></div>
          <button class="btn btn-primary" id="calculate-tip">Calculate Tip</button>
          <div class="mt-3" id="tip-result"></div>
        </div></div>`,
      'hex-to-rgb': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">HEX to RGB Converter</h5>
          <div class="mb-3"><label for="hex-input" class="form-label">HEX Color Code:</label><input type="text" class="form-control" id="hex-input" placeholder="#ffffff"></div>
          <button class="btn btn-primary" id="convert-hex">Convert</button>
          <div class="mt-3" id="rgb-result"></div>
        </div></div>`,
      'aspect-ratio-calculator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Aspect Ratio Calculator</h5>
          <div class="row">
            <div class="col-md-6 mb-3"><label for="ratio-w1" class="form-label">Original Width:</label><input type="number" class="form-control" id="ratio-w1"></div>
            <div class="col-md-6 mb-3"><label for="ratio-h1" class="form-label">Original Height:</label><input type="number" class="form-control" id="ratio-h1"></div>
          </div>
          <div class="row align-items-center">
            <div class="col-md-6 mb-3"><label for="ratio-w2" class="form-label">New Width:</label><input type="number" class="form-control" id="ratio-w2"></div>
            <div class="col-md-6 mb-3"><label for="ratio-h2" class="form-label">New Height:</label><input type="number" class="form-control" id="ratio-h2"></div>
          </div>
          <div class="mt-3" id="ratio-result"></div>
        </div></div>`,
      'simple-interest-calculator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Simple Interest Calculator</h5>
          <div class="mb-3"><label for="principal" class="form-label">Principal Amount ($):</label><input type="number" class="form-control" id="principal"></div>
          <div class="mb-3"><label for="si-rate" class="form-label">Annual Rate (%):</label><input type="number" class="form-control" id="si-rate"></div>
          <div class="mb-3"><label for="si-time" class="form-label">Time (Years):</label><input type="number" class="form-control" id="si-time"></div>
          <button class="btn btn-primary" id="calculate-si">Calculate</button>
          <div class="mt-3" id="si-result"></div>
        </div></div>`,
      'text-case-converter': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Text Case Converter</h5>
          <textarea class="form-control" id="text-input" rows="5" placeholder="Enter text here..."></textarea>
          <div class="mt-3">
            <button class="btn btn-secondary" id="to-uppercase">Uppercase</button>
            <button class="btn btn-secondary" id="to-lowercase">Lowercase</button>
            <button class="btn btn-secondary" id="to-sentencecase">Sentence Case</button>
            <button class="btn btn-secondary" id="to-titlecase">Title Case</button>
          </div>
        </div></div>`,
      'random-number-generator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Random Number Generator</h5>
          <div class="row">
            <div class="col-md-6 mb-3"><label for="min" class="form-label">Min:</label><input type="number" class="form-control" id="min" value="1"></div>
            <div class="col-md-6 mb-3"><label for="max" class="form-label">Max:</label><input type="number" class="form-control" id="max" value="100"></div>
          </div>
          <button class="btn btn-primary" id="generate-random">Generate</button>
          <div class="mt-3 fs-3" id="random-result"></div>
        </div></div>`,
      'password-generator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Password Generator</h5>
          <div class="mb-3"><label for="length" class="form-label">Password Length:</label><input type="number" class="form-control" id="length" value="12"></div>
          <div class="form-check"><input class="form-check-input" type="checkbox" id="include-uppercase" checked><label class="form-check-label" for="include-uppercase">Include Uppercase</label></div>
          <div class="form-check"><input class="form-check-input" type="checkbox" id="include-numbers" checked><label class="form-check-label" for="include-numbers">Include Numbers</label></div>
          <div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="include-symbols" checked><label class="form-check-label" for="include-symbols">Include Symbols</label></div>
          <button class="btn btn-primary" id="generate-password">Generate Password</button>
          <div class="mt-3"><input type="text" class="form-control" id="password-result" readonly></div>
        </div></div>`,
      'qr-code-generator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">QR Code Generator</h5>
          <div class="mb-3"><label for="qr-text" class="form-label">Text or URL:</label><input type="text" class="form-control" id="qr-text"></div>
          <button class="btn btn-primary" id="generate-qr">Generate QR Code</button>
          <div class="mt-3" id="qr-code"></div>
        </div></div>`,
      'stopwatch': `
        <div class="card"><div class="card-body text-center">
          <h5 class="card-title">Stopwatch</h5>
          <div class="fs-1" id="stopwatch-display">00:00:00</div>
          <div class="mt-3">
            <button class="btn btn-success" id="start-stopwatch">Start</button>
            <button class="btn btn-danger" id="stop-stopwatch">Stop</button>
            <button class="btn btn-warning" id="reset-stopwatch">Reset</button>
          </div>
        </div></div>`,
      'countdown-timer': `
        <div class="card"><div class="card-body text-center">
          <h5 class="card-title">Countdown Timer</h5>
          <div class="row justify-content-center mb-3">
            <div class="col-auto"><input type="number" class="form-control" id="countdown-minutes" placeholder="Minutes" min="0"></div>
            <div class="col-auto"><input type="number" class="form-control" id="countdown-seconds" placeholder="Seconds" min="0" max="59"></div>
          </div>
          <div class="fs-1" id="countdown-display">00:00</div>
          <div class="mt-3">
            <button class="btn btn-success" id="start-countdown">Start</button>
            <button class="btn btn-danger" id="stop-countdown">Stop</button>
            <button class="btn btn-warning" id="reset-countdown">Reset</button>
          </div>
        </div></div>`,
      'color-picker': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Color Picker</h5>
          <input type="color" class="form-control form-control-color" id="color-input" value="#563d7c" title="Choose your color">
          <div class="mt-3" id="color-details"></div>
        </div></div>`,
      'notes': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Notes</h5>
          <textarea class="form-control" id="notes-area" rows="10" placeholder="Write your notes here..."></textarea>
          <button class="btn btn-primary mt-3" id="save-notes">Save Notes</button>
        </div></div>`,
      'screen-resolution': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Screen Resolution</h5>
          <p>Your screen resolution is: <strong id="resolution"></strong></p>
        </div></div>`,
      'char-word-counter': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Character & Word Counter</h5>
          <textarea class="form-control" id="text-counter-input" rows="5" placeholder="Type or paste text here..."></textarea>
          <div class="mt-3">
            <p>Words: <span id="word-count">0</span></p>
            <p>Characters: <span id="char-count">0</span></p>
          </div>
        </div></div>`,
    };
    toolContent.innerHTML = tools[toolName] || `<p>Select a tool from the sidebar.</p>`;
    addToolListeners(toolName);
  };

  // --- Event Listeners ---
  const addToolListeners = (toolName) => {
    // Add sound to all calculator buttons
    const buttons = toolContent.querySelectorAll('button');
    buttons.forEach(button => button.addEventListener('click', () => playSound('click')));

    switch (toolName) {
      case 'age-calculator':
        document.getElementById('calculate-age').addEventListener('click', calculateAge);
        break;
      case 'date-difference':
        document.getElementById('calculate-diff').addEventListener('click', calculateDateDifference);
        break;
      case 'bmi-calculator':
        document.getElementById('calculate-bmi').addEventListener('click', calculateBMI);
        break;
      case 'loan-calculator':
        document.getElementById('calculate-loan').addEventListener('click', calculateLoan);
        break;
      case 'percentage-calculator':
        document.getElementById('calculate-percentage').addEventListener('click', calculatePercentage);
        break;
      case 'tip-calculator':
        document.getElementById('calculate-tip').addEventListener('click', calculateTip);
        break;
      case 'hex-to-rgb':
        document.getElementById('convert-hex').addEventListener('click', convertHexToRgb);
        break;
      case 'aspect-ratio-calculator':
        document.getElementById('ratio-w1').addEventListener('input', () => calculateAspectRatio('w'));
        document.getElementById('ratio-h1').addEventListener('input', () => calculateAspectRatio('h'));
        document.getElementById('ratio-w2').addEventListener('input', () => calculateAspectRatio('w2'));
        document.getElementById('ratio-h2').addEventListener('input', () => calculateAspectRatio('h2'));
        break;
      case 'simple-interest-calculator':
        document.getElementById('calculate-si').addEventListener('click', calculateSimpleInterest);
        break;
      case 'text-case-converter':
        document.getElementById('to-uppercase').addEventListener('click', () => convertCase('upper'));
        document.getElementById('to-lowercase').addEventListener('click', () => convertCase('lower'));
        document.getElementById('to-sentencecase').addEventListener('click', () => convertCase('sentence'));
        document.getElementById('to-titlecase').addEventListener('click', () => convertCase('title'));
        break;
      case 'random-number-generator':
        document.getElementById('generate-random').addEventListener('click', generateRandomNumber);
        break;
      case 'password-generator':
        document.getElementById('generate-password').addEventListener('click', generatePassword);
        break;
      case 'qr-code-generator':
        document.getElementById('generate-qr').addEventListener('click', generateQRCode);
        break;
      case 'stopwatch':
        document.getElementById('start-stopwatch').addEventListener('click', startStopwatch);
        document.getElementById('stop-stopwatch').addEventListener('click', stopStopwatch);
        document.getElementById('reset-stopwatch').addEventListener('click', resetStopwatch);
        break;
      case 'countdown-timer':
        document.getElementById('start-countdown').addEventListener('click', startCountdown);
        document.getElementById('stop-countdown').addEventListener('click', stopCountdown);
        document.getElementById('reset-countdown').addEventListener('click', resetCountdown);
        break;
      case 'color-picker':
        document.getElementById('color-input').addEventListener('input', updateColorDetails);
        updateColorDetails(); // Initial call
        break;
      case 'notes':
        document.getElementById('save-notes').addEventListener('click', saveNotes);
        loadNotes();
        break;
      case 'screen-resolution':
        getScreenResolution();
        break;
      case 'char-word-counter':
        document.getElementById('text-counter-input').addEventListener('input', updateCharWordCount);
        break;
    }
  };
  
  const showResult = (elementId, content) => {
    const resultDiv = document.getElementById(elementId);
    resultDiv.innerHTML = content;
    resultDiv.firstChild.classList.add('animate__animated', 'animate__flipInX');
    playSound('success');
  };

  // --- Tool Logic ---

  const calculateAge = () => {
    const dobInput = document.getElementById('dob').value;
    if (!dobInput) {
      showResult('age-result', '<div class="alert alert-danger">Please enter your date of birth.</div>');
      return;
    }
    const dob = new Date(dobInput);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    showResult('age-result', `<div class="alert alert-success">You are ${years} years, ${months} months, and ${days} days old.</div>`);
  };

  const calculateDateDifference = () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (!startDate || !endDate) {
      showResult('diff-result', '<div class="alert alert-danger">Please select both dates.</div>');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    showResult('diff-result', `<div class="alert alert-success">The difference is ${diffDays} days.</div>`);
  };

  const calculateBMI = () => {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    if (!weight || !height) {
      showResult('bmi-result', '<div class="alert alert-danger">Please enter weight and height.</div>');
      return;
    }
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obesity';
    showResult('bmi-result', `<div class="alert alert-info">Your BMI is ${bmi} (${category}).</div>`);
  };

  const calculateLoan = () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const interest = parseFloat(document.getElementById('interest').value);
    const years = parseFloat(document.getElementById('years').value);
    if (!amount || !interest || !years) {
      showResult('loan-result', '<div class="alert alert-danger">Please fill all fields.</div>');
      return;
    }
    const principal = amount;
    const monthlyInterest = interest / 100 / 12;
    const numberOfPayments = years * 12;
    const x = Math.pow(1 + monthlyInterest, numberOfPayments);
    const monthlyPayment = (principal * x * monthlyInterest) / (x - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    showResult('loan-result', `
      <div class="alert alert-success">
        <p>Monthly Payment: $${monthlyPayment.toFixed(2)}</p>
        <p>Total Payment: $${totalPayment.toFixed(2)}</p>
        <p>Total Interest: $${totalInterest.toFixed(2)}</p>
      </div>`);
  };

  const calculatePercentage = () => {
    const percentage = parseFloat(document.getElementById('percentage').value);
    const number = parseFloat(document.getElementById('number').value);
    if (isNaN(percentage) || isNaN(number)) {
      showResult('percentage-result', '<div class="alert alert-danger">Please enter valid numbers.</div>');
      return;
    }
    const result = (percentage / 100) * number;
    showResult('percentage-result', `<div class="alert alert-success">${percentage}% of ${number} is ${result}.</div>`);
  };

  const calculateTip = () => {
    const billAmount = parseFloat(document.getElementById('bill-amount').value);
    const tipPercentage = parseFloat(document.getElementById('tip-percentage').value);
    if (!billAmount || !tipPercentage) {
      showResult('tip-result', '<div class="alert alert-danger">Please enter both bill amount and tip percentage.</div>');
      return;
    }
    const tipAmount = (billAmount * tipPercentage) / 100;
    const totalAmount = billAmount + tipAmount;
    showResult('tip-result', `
      <div class="alert alert-success">
        <p>Tip Amount: $${tipAmount.toFixed(2)}</p>
        <p>Total Amount: $${totalAmount.toFixed(2)}</p>
      </div>`);
  };

  const convertHexToRgb = () => {
    const hexInput = document.getElementById('hex-input').value;
    const resultDiv = document.getElementById('rgb-result');
    const hex = hexInput.startsWith('#') ? hexInput.slice(1) : hexInput;

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      showResult('rgb-result', '<div class="alert alert-danger">Invalid HEX code.</div>');
      return;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    showResult('rgb-result', `<div class="alert alert-success">RGB: rgb(${r}, ${g}, ${b})</div>`);
  };

  const calculateAspectRatio = (changed) => {
    const w1 = document.getElementById('ratio-w1');
    const h1 = document.getElementById('ratio-h1');
    const w2 = document.getElementById('ratio-w2');
    const h2 = document.getElementById('ratio-h2');

    if (!w1.value || !h1.value) return;

    if (changed === 'w2' && w2.value) {
      h2.value = Math.round((w2.value * h1.value) / w1.value);
    } else if (changed === 'h2' && h2.value) {
      w2.value = Math.round((h2.value * w1.value) / h1.value);
    }
  };

  const calculateSimpleInterest = () => {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('si-rate').value);
    const time = parseFloat(document.getElementById('si-time').value);

    if (!principal || !rate || !time) {
      showResult('si-result', '<div class="alert alert-danger">Please fill all fields.</div>');
      return;
    }

    const interest = (principal * rate * time) / 100;
    const totalAmount = principal + interest;

    showResult('si-result', `
      <div class="alert alert-success">
        <p>Simple Interest: $${interest.toFixed(2)}</p>
        <p>Total Amount: $${totalAmount.toFixed(2)}</p>
      </div>`);
  };

  const convertCase = (targetCase) => {
    const input = document.getElementById('text-input');
    let text = input.value;
    switch (targetCase) {
      case 'upper': text = text.toUpperCase(); break;
      case 'lower': text = text.toLowerCase(); break;
      case 'sentence': text = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase()); break;
      case 'title': text = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); break;
    }
    input.value = text;
  };

  const generateRandomNumber = () => {
    const min = parseInt(document.getElementById('min').value);
    const max = parseInt(document.getElementById('max').value);
    if (min >= max) {
      document.getElementById('random-result').textContent = 'Min must be less than Max';
      return;
    }
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    document.getElementById('random-result').textContent = random;
    playSound('success');
  };

  const generatePassword = () => {
    const length = parseInt(document.getElementById('length').value);
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let charPool = lowercaseChars;
    if (includeUppercase) charPool += uppercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charPool.charAt(Math.floor(Math.random() * charPool.length));
    }
    document.getElementById('password-result').value = password;
    playSound('success');
  };

  const generateQRCode = () => {
    const text = document.getElementById('qr-text').value;
    if (!text) return;
    const qrCodeContainer = document.getElementById('qr-code');
    qrCodeContainer.innerHTML = '';
    new QRCode(qrCodeContainer, {
        text: text,
        width: 128,
        height: 128,
    });
    playSound('success');
  };

  let stopwatchInterval;
  let stopwatchTime = 0;
  const startStopwatch = () => {
    if (stopwatchInterval) return;
    const startTime = Date.now() - stopwatchTime;
    stopwatchInterval = setInterval(() => {
      stopwatchTime = Date.now() - startTime;
      updateStopwatchDisplay();
    }, 10);
  };
  const stopStopwatch = () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
  };
  const resetStopwatch = () => {
    stopStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
  };
  const updateStopwatchDisplay = () => {
    const time = new Date(stopwatchTime);
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(time.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(time.getUTCMilliseconds()).padStart(3, '0').slice(0, 2);
    document.getElementById('stopwatch-display').textContent = `${minutes}:${seconds}:${milliseconds}`;
  };

  let countdownInterval;
  let countdownTime = 0;
  const startCountdown = () => {
    if (countdownInterval) return;
    const minutes = parseInt(document.getElementById('countdown-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('countdown-seconds').value) || 0;
    countdownTime = (minutes * 60 + seconds) * 1000;
    if (countdownTime <= 0) return;
    const endTime = Date.now() + countdownTime;
    countdownInterval = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        stopCountdown();
        countdownTime = 0;
      } else {
        countdownTime = remaining;
      }
      updateCountdownDisplay();
    }, 100);
  };
  const stopCountdown = () => {
    clearInterval(countdownInterval);
    countdownInterval = null;
  };
  const resetCountdown = () => {
    stopCountdown();
    countdownTime = 0;
    updateCountdownDisplay();
    document.getElementById('countdown-minutes').value = '';
    document.getElementById('countdown-seconds').value = '';
  };
  const updateCountdownDisplay = () => {
    const minutes = Math.floor(countdownTime / 60000);
    const seconds = Math.floor((countdownTime % 60000) / 1000);
    document.getElementById('countdown-display').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const updateColorDetails = () => {
    const color = document.getElementById('color-input').value;
    const rgb = parseInt(color.substring(1, 3), 16) + ', ' + parseInt(color.substring(3, 5), 16) + ', ' + parseInt(color.substring(5, 7), 16);
    document.getElementById('color-details').innerHTML = `
      <p>Hex: ${color}</p>
      <p>RGB: rgb(${rgb})</p>
    `;
  };

  const saveNotes = () => {
    localStorage.setItem('notes', document.getElementById('notes-area').value);
    showResult('notes-result', '<div class="alert alert-success">Notes saved!</div>');
  };
  const loadNotes = () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      document.getElementById('notes-area').value = savedNotes;
    }
  };

  const getScreenResolution = () => {
    document.getElementById('resolution').textContent = `${window.screen.width} x ${window.screen.height}`;
  };

  const updateCharWordCount = () => {
    const text = document.getElementById('text-counter-input').value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    document.getElementById('word-count').textContent = words;
    document.getElementById('char-count').textContent = chars;
  };

  // --- Initialization ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tool = e.target.dataset.tool;
      loadTool(tool);
      navLinks.forEach(nav => nav.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Load Age Calculator by default
  loadTool('age-calculator');
  document.querySelector('[data-tool="age-calculator"]').classList.add('active');
});
