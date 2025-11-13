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
      'password-manager': `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Add New Password</h5>
            <form id="password-form">
              <div class="mb-3">
                <label for="website" class="form-label">Website</label>
                <input type="text" class="form-control" id="website" required>
              </div>
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Save Password</button>
            </form>
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-body">
            <h5 class="card-title">Saved Passwords</h5>
            <div class="d-flex justify-content-between mb-3">
              <input type="text" id="password-search" class="form-control me-2" placeholder="Search by website...">
              <div class="btn-group">
                <button class="btn btn-outline-success" id="import-btn">Import</button>
                <button class="btn btn-outline-info" id="export-btn">Export</button>
              </div>
              <input type="file" id="import-file-input" class="d-none" accept=".txt">
            </div>
            <ul class="list-group" id="password-list"></ul>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" id="delete-confirm-modal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete this password? This action cannot be undone.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirm-delete-btn">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Copy Options Modal -->
        <div class="modal fade" id="copy-options-modal" tabindex="-1" aria-labelledby="copyModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-sm">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="copyModalLabel">Copy Options</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-center">
                <button type="button" class="btn btn-primary mb-2 w-100" id="copy-username-btn">Copy Username</button>
                <button type="button" class="btn btn-primary w-100" id="copy-password-btn">Copy Password</button>
              </div>
            </div>
          </div>
        </div>
      `,
      'lorem-ipsum-generator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Lorem Ipsum Generator</h5>
          <div class="mb-3"><label for="lorem-paragraphs" class="form-label">Number of Paragraphs:</label><input type="number" class="form-control" id="lorem-paragraphs" value="5"></div>
          <button class="btn btn-primary" id="generate-lorem">Generate</button>
          <textarea class="form-control mt-3" id="lorem-result" rows="10" readonly></textarea>
        </div></div>`,
      'hash-generator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Hash Generator</h5>
          <textarea class="form-control" id="hash-input" rows="5" placeholder="Enter text here..."></textarea>
          <div class="mt-3">
            <button class="btn btn-secondary" id="generate-md5">MD5</button>
            <button class="btn btn-secondary" id="generate-sha256">SHA-256</button>
          </div>
          <div class="mt-3"><input type="text" class="form-control" id="hash-result" readonly></div>
        </div></div>`,
      'base64-converter': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Base64 Converter</h5>
          <textarea class="form-control" id="base64-input" rows="5" placeholder="Enter text here..."></textarea>
          <div class="mt-3">
            <button class="btn btn-primary" id="base64-encode">Encode</button>
            <button class="btn btn-primary" id="base64-decode">Decode</button>
          </div>
          <textarea class="form-control mt-3" id="base64-result" rows="5" readonly></textarea>
        </div></div>`,
      'url-converter': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">URL Encoder/Decoder</h5>
          <textarea class="form-control" id="url-input" rows="5" placeholder="Enter URL here..."></textarea>
          <div class="mt-3">
            <button class="btn btn-primary" id="url-encode">Encode</button>
            <button class="btn btn-primary" id="url-decode">Decode</button>
          </div>
          <textarea class="form-control mt-3" id="url-result" rows="5" readonly></textarea>
        </div></div>`,
      'timestamp-converter': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Timestamp Converter</h5>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="timestamp-input" class="form-label">Timestamp:</label>
              <input type="number" class="form-control" id="timestamp-input" placeholder="Enter timestamp...">
              <button class="btn btn-primary mt-2" id="timestamp-to-date">Convert to Date</button>
            </div>
            <div class="col-md-6 mb-3">
              <label for="date-input" class="form-label">Date:</label>
              <input type="datetime-local" class="form-control" id="date-input">
              <button class="btn btn-primary mt-2" id="date-to-timestamp">Convert to Timestamp</button>
            </div>
          </div>
          <div class="mt-3" id="timestamp-result"></div>
        </div></div>`,
      'simple-calculator': `
        <div class="card"><div class="card-body">
          <h5 class="card-title">Simple Calculator</h5>
          <input type="text" class="form-control text-end fs-3 mb-3" id="calc-display" readonly>
          <div class="row g-2">
            <div class="col-3"><button class="btn btn-secondary w-100" id="calc-clear">C</button></div>
            <div class="col-3"><button class="btn btn-secondary w-100" id="calc-backspace"><i class="bi bi-backspace"></i></button></div>
            <div class="col-3"><button class="btn btn-secondary w-100" id="calc-op-divide">/</button></div>
            <div class="col-3"><button class="btn btn-secondary w-100" id="calc-op-multiply">*</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-7">7</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-8">8</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-9">9</button></div>
            <div class="col-3"><button class="btn btn-secondary w-100" id="calc-op-subtract">-</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-4">4</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-5">5</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-6">6</button></div>
            <div class="col-3"><button class="btn btn-secondary w-100" id="calc-op-add">+</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-1">1</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-2">2</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-num-3">3</button></div>
            <div class="col-3"><button class="btn btn-primary w-100" id="calc-equals" rowspan="2">=</button></div>
            <div class="col-6"><button class="btn btn-light w-100" id="calc-num-0">0</button></div>
            <div class="col-3"><button class="btn btn-light w-100" id="calc-decimal">.</button></div>
          </div>
        </div></div>`,
        'unit-converter': `
        <div class="card"><div class="card-body">
            <h5 class="card-title">Unit Converter</h5>
            <div class="row">
                <div class="col-md-5">
                    <input type="number" class="form-control" id="unit-input" placeholder="Enter value">
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="unit-from">
                        <option value="m">Meters</option>
                        <option value="km">Kilometers</option>
                        <option value="cm">Centimeters</option>
                        <option value="mm">Millimeters</option>
                        <option value="mi">Miles</option>
                        <option value="yd">Yards</option>
                        <option value="ft">Feet</option>
                        <option value="in">Inches</option>
                        <option value="kg">Kilograms</option>
                        <option value="g">Grams</option>
                        <option value="lb">Pounds</option>
                        <option value="oz">Ounces</option>
                        <option value="c">Celsius</option>
                        <option value="f">Fahrenheit</option>
                    </select>
                </div>
                <div class="col-md-1 text-center">to</div>
                <div class="col-md-3">
                    <select class="form-select" id="unit-to">
                        <!-- Options will be populated by JS -->
                    </select>
                </div>
            </div>
            <button class="btn btn-primary mt-3" id="unit-convert">Convert</button>
            <div class="mt-3" id="unit-result"></div>
        </div></div>`
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
      case 'password-manager':
        document.getElementById('password-form').addEventListener('submit', savePassword);
        document.getElementById('password-list').addEventListener('click', handlePasswordActions);
        document.getElementById('password-search').addEventListener('input', (e) => renderPasswords(e.target.value));
        document.getElementById('confirm-delete-btn').addEventListener('click', executeDelete);
        document.getElementById('export-btn').addEventListener('click', exportPasswordsTXT);
        document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file-input').click());
        document.getElementById('import-file-input').addEventListener('change', importPasswordsTXT);
        document.getElementById('copy-username-btn').addEventListener('click', handleCopyAction);
        document.getElementById('copy-password-btn').addEventListener('click', handleCopyAction);
        
        if (!deleteModal) {
          deleteModal = new bootstrap.Modal(document.getElementById('delete-confirm-modal'));
        }
        if (!copyModal) {
          copyModal = new bootstrap.Modal(document.getElementById('copy-options-modal'));
        }
        
        renderPasswords();
        break;
      case 'lorem-ipsum-generator':
        document.getElementById('generate-lorem').addEventListener('click', generateLoremIpsum);
        break;
      case 'hash-generator':
        document.getElementById('generate-md5').addEventListener('click', () => generateHash('md5'));
        document.getElementById('generate-sha256').addEventListener('click', () => generateHash('sha256'));
        break;
      case 'base64-converter':
        document.getElementById('base64-encode').addEventListener('click', () => convertBase64('encode'));
        document.getElementById('base64-decode').addEventListener('click', () => convertBase64('decode'));
        break;
      case 'url-converter':
        document.getElementById('url-encode').addEventListener('click', () => convertUrl('encode'));
        document.getElementById('url-decode').addEventListener('click', () => convertUrl('decode'));
        break;
      case 'timestamp-converter':
        document.getElementById('timestamp-to-date').addEventListener('click', convertTimestampToDate);
        document.getElementById('date-to-timestamp').addEventListener('click', convertDateToTimestamp);
        break;
      case 'simple-calculator':
        document.getElementById('calc-clear').addEventListener('click', () => calculatorAction('clear'));
        document.getElementById('calc-backspace').addEventListener('click', () => calculatorAction('backspace'));
        document.getElementById('calc-op-divide').addEventListener('click', () => calculatorAction('op', '/'));
        document.getElementById('calc-op-multiply').addEventListener('click', () => calculatorAction('op', '*'));
        document.getElementById('calc-op-subtract').addEventListener('click', () => calculatorAction('op', '-'));
        document.getElementById('calc-op-add').addEventListener('click', () => calculatorAction('op', '+'));
        document.getElementById('calc-equals').addEventListener('click', () => calculatorAction('equals'));
        document.getElementById('calc-decimal').addEventListener('click', () => calculatorAction('num', '.'));
        for (let i = 0; i <= 9; i++) {
          document.getElementById(`calc-num-${i}`).addEventListener('click', () => calculatorAction('num', i));
        }
        break;
      case 'unit-converter':
        document.getElementById('unit-convert').addEventListener('click', convertUnits);
        document.getElementById('unit-from').addEventListener('change', populateUnitToOptions);
        populateUnitToOptions();
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

  // --- Password Manager Logic ---
  let deleteModal = null;
  let copyModal = null;
  const getPasswords = () => {
    return JSON.parse(localStorage.getItem('passwords')) || [];
  };

  const savePasswords = (passwords) => {
    localStorage.setItem('passwords', JSON.stringify(passwords));
  };

  const renderPasswords = (searchTerm = '') => {
    const passwordList = document.getElementById('password-list');
    if (!passwordList) return;
    
    const passwords = getPasswords();
    const filteredPasswords = passwords.filter(p => p.website.toLowerCase().includes(searchTerm.toLowerCase()));

    passwordList.innerHTML = '';
    filteredPasswords.forEach((p, index) => {
      const originalIndex = passwords.findIndex(orig => orig.website === p.website && orig.username === p.username && orig.password === p.password);
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${p.website}</strong><br>
            <small class="text-muted">${p.username} / <span class="password-text" data-password="${p.password}">${'*'.repeat(p.password.length)}</span></small>
          </div>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary copy-password" data-index="${originalIndex}" title="Copy..."><i class="bi bi-clipboard-plus"></i></button>
            <button class="btn btn-sm btn-outline-secondary toggle-visibility" title="Show/Hide Password"><i class="bi bi-eye"></i></button>
            <button class="btn btn-sm btn-outline-danger delete-password" data-index="${originalIndex}" title="Delete Password"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      `;
      passwordList.appendChild(li);
    });
  };

  const savePassword = (e) => {
    e.preventDefault();
    const websiteInput = document.getElementById('website');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const newPassword = {
      website: websiteInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
    };
    const passwords = getPasswords();
    passwords.push(newPassword);
    savePasswords(passwords);
    renderPasswords();
    e.target.reset();
    playSound('success');
  };

  const openDeleteConfirmation = (index) => {
    const confirmBtn = document.getElementById('confirm-delete-btn');
    confirmBtn.dataset.deleteIndex = index;
    if (!deleteModal) {
      deleteModal = new bootstrap.Modal(document.getElementById('delete-confirm-modal'));
    }
    deleteModal.show();
  };

  const executeDelete = () => {
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const index = confirmBtn.dataset.deleteIndex;
    const passwords = getPasswords();
    passwords.splice(index, 1);
    savePasswords(passwords);
    renderPasswords(document.getElementById('password-search').value);
    deleteModal.hide();
    playSound('click');
  };

  const openCopyOptionsModal = (index) => {
    const passwords = getPasswords();
    const passwordData = passwords[index];
    const copyUsernameBtn = document.getElementById('copy-username-btn');
    const copyPasswordBtn = document.getElementById('copy-password-btn');

    copyUsernameBtn.dataset.copyValue = passwordData.username;
    copyPasswordBtn.dataset.copyValue = passwordData.password;

    copyModal.show();
  };

  const handleCopyAction = (e) => {
    const valueToCopy = e.target.dataset.copyValue;
    copyToClipboard(valueToCopy);
    copyModal.hide();
  };

  const exportPasswordsTXT = () => {
    const passwords = getPasswords();
    if (passwords.length === 0) {
      alert('No passwords to export.');
      return;
    }
    const fileContent = passwords.map(p => `Website: ${p.website}, Username: ${p.username}, Password: ${p.password}`).join('\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'passwords.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    playSound('success');
  };

  const importPasswordsTXT = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const existingPasswords = getPasswords();
        let importedCount = 0;

        lines.forEach(line => {
          const websiteMatch = line.match(/Website: (.*?)(,|$)/);
          const usernameMatch = line.match(/Username: (.*?)(,|$)/);
          const passwordMatch = line.match(/Password: (.*)/);

          if (websiteMatch && usernameMatch && passwordMatch) {
            const newPassword = {
              website: websiteMatch[1].trim(),
              username: usernameMatch[1].trim(),
              password: passwordMatch[1].trim(),
            };
            existingPasswords.push(newPassword);
            importedCount++;
          }
        });

        if (importedCount > 0) {
          savePasswords(existingPasswords);
          renderPasswords();
          alert(`${importedCount} passwords imported successfully!`);
        } else {
          alert('No valid passwords found in the file. Please check the format.');
        }
      } catch (error) {
        alert('An error occurred while importing the file.');
        console.error('Import error:', error);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      playSound('success');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handlePasswordActions = (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    const index = target.dataset.index;

    if (target.classList.contains('delete-password')) {
      openDeleteConfirmation(index);
    } else if (target.classList.contains('copy-password')) {
      openCopyOptionsModal(index);
    } else if (target.classList.contains('toggle-visibility')) {
      const passwordSpan = target.closest('.list-group-item').querySelector('.password-text');
      const icon = target.querySelector('i');
      const password = passwordSpan.dataset.password;
      if (passwordSpan.textContent === password) {
        passwordSpan.textContent = '*'.repeat(password.length);
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      } else {
        passwordSpan.textContent = password;
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      }
    }
  };

  const showToast = (message, type = 'info') => {
    const toastContainer = document.querySelector('.toast-container');
    const toastEl = document.createElement('div');
    toastEl.classList.add('toast', `bg-${type}`);
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Notification</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;
    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  };

  const generateLoremIpsum = () => {
    const paragraphs = parseInt(document.getElementById('lorem-paragraphs').value);
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Proin sed libero. Duis mi. Nulla et est. Sed ac est. Sed venenatis. Integer sed metus. Integer id quam. Integer id quam. Integer id quam. Integer id quam.';
    let result = '';
    for (let i = 0; i < paragraphs; i++) {
      result += lorem + '\n\n';
    }
    document.getElementById('lorem-result').value = result;
  };

  const generateHash = (type) => {
    const input = document.getElementById('hash-input').value;
    if (!input) {
      showToast('Please enter some text to hash.', 'danger');
      return;
    }
    let hash;
    if (type === 'md5') {
      hash = CryptoJS.MD5(input).toString();
    } else if (type === 'sha256') {
      hash = CryptoJS.SHA256(input).toString();
    }
    document.getElementById('hash-result').value = hash;
    showToast(`${type.toUpperCase()} hash generated!`, 'success');
  };

  const convertBase64 = (type) => {
    const input = document.getElementById('base64-input').value;
    if (!input) {
      showToast('Please enter some text.', 'danger');
      return;
    }
    let result;
    try {
      if (type === 'encode') {
        result = btoa(input);
      } else if (type === 'decode') {
        result = atob(input);
      }
      document.getElementById('base64-result').value = result;
      showToast(`Text ${type}d successfully!`, 'success');
    } catch (e) {
      showToast('Invalid input for Base64 decoding.', 'danger');
    }
  };

  const convertUrl = (type) => {
    const input = document.getElementById('url-input').value;
    if (!input) {
      showToast('Please enter a URL.', 'danger');
      return;
    }
    let result;
    if (type === 'encode') {
      result = encodeURIComponent(input);
    } else if (type === 'decode') {
      result = decodeURIComponent(input);
    }
    document.getElementById('url-result').value = result;
    showToast(`URL ${type}d successfully!`, 'success');
  };

  const convertTimestampToDate = () => {
    const timestamp = document.getElementById('timestamp-input').value;
    if (!timestamp) {
      showToast('Please enter a timestamp.', 'danger');
      return;
    }
    const date = new Date(timestamp * 1000);
    document.getElementById('date-input').value = date.toISOString().slice(0, 16);
    showResult('timestamp-result', `<div class="alert alert-success">Converted to: ${date.toLocaleString()}</div>`);
  };

  const convertDateToTimestamp = () => {
    const date = document.getElementById('date-input').value;
    if (!date) {
      showToast('Please select a date.', 'danger');
      return;
    }
    const timestamp = new Date(date).getTime() / 1000;
    document.getElementById('timestamp-input').value = timestamp;
    showResult('timestamp-result', `<div class="alert alert-success">Converted to: ${timestamp}</div>`);
  };

  let calcDisplay = '';
  const calculatorAction = (type, value) => {
    const display = document.getElementById('calc-display');
    if (type === 'num') {
      calcDisplay += value;
    } else if (type === 'op') {
      calcDisplay += ` ${value} `;
    } else if (type === 'clear') {
      calcDisplay = '';
    } else if (type === 'backspace') {
      calcDisplay = calcDisplay.slice(0, -1);
    } else if (type === 'equals') {
      try {
        calcDisplay = eval(calcDisplay).toString();
      } catch (e) {
        calcDisplay = 'Error';
      }
    }
    display.value = calcDisplay;
  };

  const unitConversionRates = {
    length: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        mi: 1609.34,
        yd: 0.9144,
        ft: 0.3048,
        in: 0.0254
    },
    mass: {
        kg: 1,
        g: 0.001,
        lb: 0.453592,
        oz: 0.0283495
    },
    temperature: {
        c: 'c',
        f: 'f'
    }
  };

  const unitCategories = {
      m: 'length', km: 'length', cm: 'length', mm: 'length', mi: 'length', yd: 'length', ft: 'length', in: 'length',
      kg: 'mass', g: 'mass', lb: 'mass', oz: 'mass',
      c: 'temperature', f: 'temperature'
  };

  const populateUnitToOptions = () => {
      const fromUnit = document.getElementById('unit-from').value;
      const toUnitSelect = document.getElementById('unit-to');
      const category = unitCategories[fromUnit];
      
      toUnitSelect.innerHTML = '';
      if (!category) return;

      const units = Object.keys(unitConversionRates[category]);
      units.forEach(unit => {
          if (unit !== fromUnit) {
              const option = document.createElement('option');
              option.value = unit;
              option.textContent = unit.charAt(0).toUpperCase() + unit.slice(1) + 's';
              toUnitSelect.appendChild(option);
          }
      });
  };

  const convertUnits = () => {
      const fromUnit = document.getElementById('unit-from').value;
      const toUnit = document.getElementById('unit-to').value;
      const inputValue = parseFloat(document.getElementById('unit-input').value);
      const resultDiv = document.getElementById('unit-result');

      if (isNaN(inputValue)) {
          showResult('unit-result', '<div class="alert alert-danger">Please enter a valid number.</div>');
          return;
      }

      const fromCategory = unitCategories[fromUnit];
      const toCategory = unitCategories[toUnit];

      if (fromCategory !== toCategory) {
          showResult('unit-result', '<div class="alert alert-danger">Cannot convert between different unit types.</div>');
          return;
      }

      let result;
      if (fromCategory === 'temperature') {
          if (fromUnit === 'c' && toUnit === 'f') {
              result = (inputValue * 9/5) + 32;
          } else if (fromUnit === 'f' && toUnit === 'c') {
              result = (inputValue - 32) * 5/9;
          }
      } else {
          const fromRate = unitConversionRates[fromCategory][fromUnit];
          const toRate = unitConversionRates[fromCategory][toUnit];
          result = inputValue * fromRate / toRate;
      }

      showResult('unit-result', `<div class="alert alert-success">${inputValue} ${fromUnit} is ${result.toFixed(4)} ${toUnit}</div>`);
  };

  // --- Initialization ---
  const themeSwitch = document.getElementById('theme-switch');

  const applyTheme = (isLight) => {
    if (isLight) {
      document.body.classList.add('light-mode');
      themeSwitch.checked = true;
    } else {
      document.body.classList.remove('light-mode');
      themeSwitch.checked = false;
    }
  };

  themeSwitch.addEventListener('change', (e) => {
    const isLight = e.target.checked;
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    applyTheme(isLight);
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme === 'light');

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
