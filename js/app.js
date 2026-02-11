// QR Code Generator App

class QRCodeGenerator {
    constructor() {
        this.currentType = 'url';
        this.fgColor = '#000000';
        this.bgColor = '#FFFFFF';
        this.size = 250;
        this.history = [];
        this.maxHistorySize = 5;
        this.isExampleQR = false; // 예시 QR 코드 플래그

        this.initElements();
        this.initEventListeners();
        this.loadHistory();
        // 예시 QR 코드 자동 생성
        this.urlInput.value = 'https://dopabrain.com';
        this.isExampleQR = true;
        this.generateQR();
    }

    initElements() {
        // Type buttons
        this.typeButtons = document.querySelectorAll('.type-btn');

        // Input elements
        this.urlInput = document.getElementById('url-input');
        this.textInput = document.getElementById('text-input');
        this.wifiSsid = document.getElementById('wifi-ssid');
        this.wifiPassword = document.getElementById('wifi-password');
        this.wifiSecurity = document.getElementById('wifi-security');
        this.contactName = document.getElementById('contact-name');
        this.contactPhone = document.getElementById('contact-phone');
        this.contactEmail = document.getElementById('contact-email');
        this.emailInput = document.getElementById('email-input');
        this.phoneInput = document.getElementById('phone-input');

        // Color elements
        this.fgColorPicker = document.getElementById('fg-color');
        this.bgColorPicker = document.getElementById('bg-color');
        this.fgValue = document.getElementById('fg-value');
        this.bgValue = document.getElementById('bg-value');

        // Size control
        this.sizeSlider = document.getElementById('size-slider');
        this.sizeDisplay = document.getElementById('size-display');

        // Canvas
        this.canvas = document.getElementById('qr-canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });

        // Stats
        this.dataSize = document.getElementById('data-size');
        this.errorCorrection = document.getElementById('error-correction');
        this.qrVersion = document.getElementById('qr-version');

        // Buttons
        this.downloadBtn = document.getElementById('download-btn');
        this.resetBtn = document.getElementById('reset-btn');

        // History
        this.historyList = document.getElementById('history-list');

        // Input groups
        this.inputGroups = document.querySelectorAll('.input-group');
    }

    initEventListeners() {
        // Type button selection
        this.typeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectType(btn.dataset.type));
        });

        // Input change listeners
        this.urlInput.addEventListener('input', () => {
            // 사용자가 입력하면 예시 플래그 해제
            if (this.isExampleQR && this.urlInput.value.trim() !== 'https://dopabrain.com') {
                this.isExampleQR = false;
            }
            this.generateQR();
        });
        this.textInput.addEventListener('input', () => this.generateQR());
        this.wifiSsid.addEventListener('input', () => this.generateQR());
        this.wifiPassword.addEventListener('input', () => this.generateQR());
        this.wifiSecurity.addEventListener('change', () => this.generateQR());
        this.contactName.addEventListener('input', () => this.generateQR());
        this.contactPhone.addEventListener('input', () => this.generateQR());
        this.contactEmail.addEventListener('input', () => this.generateQR());
        this.emailInput.addEventListener('input', () => this.generateQR());
        this.phoneInput.addEventListener('input', () => this.generateQR());

        // Color change listeners
        this.fgColorPicker.addEventListener('change', () => this.updateColors());
        this.bgColorPicker.addEventListener('change', () => this.updateColors());

        // Size slider
        this.sizeSlider.addEventListener('input', (e) => this.updateSize(e.target.value));

        // Button listeners
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
        this.resetBtn.addEventListener('click', () => this.resetForm());

        // i18n initialization
        if (window.i18n) {
            window.i18n.initI18n().then(() => {
                this.hideLoader();
                // 빈 상태 메시지 텍스트 업데이트 (표시 중인 경우)
                const emptyState = document.getElementById('empty-state-message');
                if (emptyState && emptyState.style.display !== 'none') {
                    emptyState.textContent = window.i18n.t('preview.emptyState');
                }
                // URL 입력 필드 자동 포커스
                setTimeout(() => {
                    if (this.urlInput) {
                        this.urlInput.focus();
                    }
                }, 300);
            }).catch((e) => {
                console.warn('i18n init failed:', e);
                this.hideLoader();
                // URL 입력 필드 자동 포커스
                setTimeout(() => {
                    if (this.urlInput) {
                        this.urlInput.focus();
                    }
                }, 300);
            });
        } else {
            this.hideLoader();
            // URL 입력 필드 자동 포커스
            setTimeout(() => {
                if (this.urlInput) {
                    this.urlInput.focus();
                }
            }, 300);
        }
    }

    selectType(type) {
        this.currentType = type;

        // Update button states
        this.typeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === type) {
                btn.classList.add('active');
            }
        });

        // Show/hide input groups
        this.inputGroups.forEach(group => {
            group.classList.remove('active');
            if (group.id === `input-${type}`) {
                group.classList.add('active');
            }
        });

        this.generateQR();
    }

    getInputData() {
        switch (this.currentType) {
            case 'url':
                const urlValue = this.urlInput.value.trim();
                // 입력이 없고 예시 QR 코드가 활성화되어 있으면 예시 URL 반환
                if (!urlValue && this.isExampleQR) {
                    return 'https://dopabrain.com';
                }
                return urlValue;
            case 'text':
                return this.textInput.value.trim();
            case 'wifi':
                return this.encodeWifi(
                    this.wifiSsid.value.trim(),
                    this.wifiPassword.value.trim(),
                    this.wifiSecurity.value
                );
            case 'contact':
                return this.encodeContact(
                    this.contactName.value.trim(),
                    this.contactPhone.value.trim(),
                    this.contactEmail.value.trim()
                );
            case 'email':
                return `mailto:${this.emailInput.value.trim()}`;
            case 'phone':
                return `tel:${this.phoneInput.value.trim()}`;
            default:
                return '';
        }
    }

    encodeWifi(ssid, password, security) {
        // WiFi format: WIFI:T:WPA;S:SSID;P:PASSWORD;;
        const escapedSsid = ssid.replace(/[\\;:,\"]/g, '\\$&');
        const escapedPassword = password.replace(/[\\;:,\"]/g, '\\$&');
        return `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};;`;
    }

    encodeContact(name, phone, email) {
        // vCard format (MECARD)
        return `MECARD:N:${name}${phone ? `;TEL:${phone}` : ''}${email ? `;EMAIL:${email}` : ''};;`;
    }

    generateQR() {
        const data = this.getInputData();

        if (!data) {
            this.clearCanvas();
            this.updateStats(0, 1, 'L');
            // 빈 상태 안내 표시
            this.showEmptyState();
            return;
        }

        // 빈 상태 안내 숨기기
        this.hideEmptyState();

        try {
            const qrCode = this.createQRCode(data);
            this.drawQRCode(qrCode, data);
            this.addToHistory(data);
        } catch (error) {
            console.error('QR generation error:', error);
            this.clearCanvas();
        }
    }

    createQRCode(data) {
        // Simplified QR Code generation using basic encoding
        // For production, consider using a library like qrcode.js

        const encoded = this.encodeData(data);
        const requiredModules = Math.ceil(Math.sqrt(encoded.length * 8));
        const version = Math.max(1, Math.ceil((requiredModules - 17) / 4));
        const moduleCount = version * 4 + 17;

        return {
            version: version,
            moduleCount: moduleCount,
            data: encoded,
            modules: this.generateModules(moduleCount, encoded)
        };
    }

    encodeData(data) {
        // Convert string to byte array
        const encoded = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            encoded[i] = data.charCodeAt(i);
        }
        return encoded;
    }

    generateModules(size, data) {
        // Create a basic QR-like pattern
        const modules = Array(size).fill().map(() => Array(size).fill(false));

        // Add finder patterns (3 corners)
        this.addFinderPattern(modules, 0, 0);
        this.addFinderPattern(modules, size - 7, 0);
        this.addFinderPattern(modules, 0, size - 7);

        // Add timing patterns
        for (let i = 8; i < size - 8; i++) {
            modules[6][i] = (i % 2 === 0);
            modules[i][6] = (i % 2 === 0);
        }

        // Add data
        let dataIndex = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                // Skip areas with patterns
                if (this.isPatternArea(x, y, size)) continue;
                if (modules[y][x] !== false && modules[y][x] !== true) {
                    const byteIndex = Math.floor(dataIndex / 8);
                    const bitIndex = 7 - (dataIndex % 8);
                    if (byteIndex < data.length) {
                        modules[y][x] = ((data[byteIndex] >> bitIndex) & 1) === 1;
                    }
                    dataIndex++;
                }
            }
        }

        return modules;
    }

    addFinderPattern(modules, startX, startY) {
        // 7x7 finder pattern
        const pattern = [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ];

        for (let y = 0; y < 7; y++) {
            for (let x = 0; x < 7; x++) {
                if (startY + y < modules.length && startX + x < modules[0].length) {
                    modules[startY + y][startX + x] = pattern[y][x] === 1;
                }
            }
        }

        // White border around finder pattern
        for (let y = -1; y <= 7; y++) {
            for (let x = -1; x <= 7; x++) {
                if (y === -1 || y === 7 || x === -1 || x === 7) {
                    if (startY + y >= 0 && startY + y < modules.length &&
                        startX + x >= 0 && startX + x < modules[0].length) {
                        modules[startY + y][startX + x] = false;
                    }
                }
            }
        }
    }

    isPatternArea(x, y, size) {
        // Top-left finder pattern and timing
        if (x <= 8 && y <= 8) return true;
        // Top-right finder pattern
        if (x >= size - 8 && y <= 8) return true;
        // Bottom-left finder pattern
        if (x <= 8 && y >= size - 8) return true;
        // Timing patterns
        if (x === 6 || y === 6) return true;
        return false;
    }

    drawQRCode(qrCode, data) {
        const moduleSize = this.size / qrCode.moduleCount;
        const modules = qrCode.modules;

        this.canvas.width = this.size;
        this.canvas.height = this.size;

        // Fill background
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.size, this.size);

        // Draw modules
        this.ctx.fillStyle = this.fgColor;
        for (let y = 0; y < modules.length; y++) {
            for (let x = 0; x < modules[y].length; x++) {
                if (modules[y][x]) {
                    this.ctx.fillRect(
                        x * moduleSize,
                        y * moduleSize,
                        moduleSize,
                        moduleSize
                    );
                }
            }
        }

        this.updateStats(data.length, qrCode.version, 'L');
    }

    clearCanvas() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.size, this.size);
    }

    updateColors() {
        this.fgColor = this.fgColorPicker.value.toUpperCase();
        this.bgColor = this.bgColorPicker.value.toUpperCase();
        this.fgValue.textContent = this.fgColor;
        this.bgValue.textContent = this.bgColor;
        this.generateQR();
    }

    updateSize(newSize) {
        this.size = parseInt(newSize);
        this.sizeDisplay.textContent = `${this.size}px`;
        this.generateQR();
    }

    updateStats(dataLength, version, errorLevel) {
        this.dataSize.textContent = `${dataLength} bytes`;
        this.qrVersion.textContent = `v${version}`;
        this.errorCorrection.textContent = `${errorLevel} (7%)`;
    }

    addToHistory(data) {
        // Check if already in history
        const exists = this.history.some(item => item.data === data);
        if (exists) return;

        // Add to beginning
        this.history.unshift({
            data: data,
            type: this.currentType,
            timestamp: new Date().toLocaleTimeString(),
            thumbnail: this.getCanvasDataURL()
        });

        // Keep only recent items
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }

        this.saveHistory();
        this.renderHistory();
    }

    getCanvasDataURL() {
        try {
            return this.canvas.toDataURL('image/png');
        } catch (e) {
            return null;
        }
    }

    saveHistory() {
        try {
            const simplified = this.history.map(item => ({
                data: item.data,
                type: item.type,
                timestamp: item.timestamp
            }));
            localStorage.setItem('qr-history', JSON.stringify(simplified));
        } catch (e) {
            console.warn('Failed to save history:', e);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('qr-history');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load history:', e);
        }
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';

        if (this.history.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'history-empty';
            empty.setAttribute('data-i18n', 'history.empty');
            empty.textContent = window.i18n ? window.i18n.t('history.empty') : '생성 내역이 없습니다';
            this.historyList.appendChild(empty);
            return;
        }

        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-thumbnail">
                    <canvas width="40" height="40"></canvas>
                </div>
                <div class="history-item-info">
                    <div class="history-item-text" title="${item.data}">${item.data.substring(0, 30)}${item.data.length > 30 ? '...' : ''}</div>
                    <div class="history-item-time">${item.timestamp}</div>
                </div>
            `;

            historyItem.addEventListener('click', () => this.loadFromHistory(item));
            this.historyList.appendChild(historyItem);
        });
    }

    loadFromHistory(item) {
        this.selectType(item.type);

        // Restore input based on type
        switch (item.type) {
            case 'url':
                this.urlInput.value = item.data;
                break;
            case 'text':
                this.textInput.value = item.data;
                break;
            case 'email':
                this.emailInput.value = item.data.replace('mailto:', '');
                break;
            case 'phone':
                this.phoneInput.value = item.data.replace('tel:', '');
                break;
        }

        this.generateQR();
    }

    downloadQR() {
        const data = this.getInputData();
        if (!data) {
            alert(window.i18n ? window.i18n.t('error.noData') : '데이터를 입력해주세요');
            return;
        }

        const link = document.createElement('a');
        link.href = this.canvas.toDataURL('image/png');
        link.download = `qr-code-${Date.now()}.png`;
        link.click();
    }

    resetForm() {
        this.urlInput.value = '';
        this.textInput.value = '';
        this.wifiSsid.value = '';
        this.wifiPassword.value = '';
        this.contactName.value = '';
        this.contactPhone.value = '';
        this.contactEmail.value = '';
        this.emailInput.value = '';
        this.phoneInput.value = '';

        this.fgColorPicker.value = '#000000';
        this.bgColorPicker.value = '#FFFFFF';
        this.fgColor = '#000000';
        this.bgColor = '#FFFFFF';
        this.fgValue.textContent = '#000000';
        this.bgValue.textContent = '#FFFFFF';

        this.sizeSlider.value = 250;
        this.size = 250;
        this.sizeDisplay.textContent = '250px';

        this.selectType('url');
        // 초기화 후 예시 QR 코드 다시 생성
        this.urlInput.value = 'https://dopabrain.com';
        this.isExampleQR = true;
        this.generateQR();
    }

    showEmptyState() {
        const emptyState = document.getElementById('empty-state-message');
        if (emptyState) {
            emptyState.style.display = 'block';
            // i18n이 있으면 번역 업데이트
            if (window.i18n && window.i18n.t) {
                emptyState.textContent = window.i18n.t('preview.emptyState');
            }
        }
    }

    hideEmptyState() {
        const emptyState = document.getElementById('empty-state-message');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    hideLoader() {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.qrGenerator = new QRCodeGenerator();
});
