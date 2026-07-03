// QR Code Generator App

class QRCodeGenerator {
    constructor() {
        this.currentType = 'url';
        this.fgColor = '#000000';
        this.bgColor = '#FFFFFF';
        this.size = 250;
        this.history = [];
        this.maxHistorySize = 5;
        this.isExampleQR = false;
        this._engagementFired = false;
        this.generationSeq = 0;
        this.generateTrackTimer = null;
        this.lastTrackedGenerateKey = '';

        this.initElements();
        this.initEventListeners();
        this.loadHistory();
        // Generate starter QR code.
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
            this._fireEngagement();
            // Clear the starter example flag when the user types.
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
                // Refresh empty-state copy after translations load.
                const emptyState = document.getElementById('empty-state-message');
                if (emptyState && emptyState.style.display !== 'none') {
                    emptyState.textContent = window.i18n.t('preview.emptyState');
                }
                // Focus the URL input after initialization.
                setTimeout(() => {
                    if (this.urlInput) {
                        this.urlInput.focus();
                    }
                }, 300);
            }).catch((e) => {
                console.warn('i18n init failed:', e);
                this.hideLoader();
                setTimeout(() => {
                    // Focus the URL input after fallback initialization.
                    if (this.urlInput) {
                        this.urlInput.focus();
                    }
                }, 300);
            });
        } else {
            this.hideLoader();
            setTimeout(() => {
                // Focus the URL input after initialization.
                if (this.urlInput) {
                    this.urlInput.focus();
                }
            }, 300);
        }
    }

    /**
     * Fire GA4 engagement event on first interaction to reduce bounce rate
     */
    _fireEngagement() {
        if (this._engagementFired) return;
        this._engagementFired = true;
        this.trackEvent('engagement', { event_label: 'first_interaction' });
    }

    trackEvent(name, params) {
        if (typeof gtag !== 'function') return;
        gtag('event', name, Object.assign({
            event_category: 'qr_generator',
            tool_id: 'qr-generator',
            page_path: '/qr-generator/',
            page_location: window.location.href,
            transport_type: 'beacon'
        }, params || {}));
    }

    scheduleGenerateEvent(data) {
        const key = `${this.currentType}:${data}:${this.size}:${this.fgColor}:${this.bgColor}`;
        window.clearTimeout(this.generateTrackTimer);
        this.generateTrackTimer = window.setTimeout(() => {
            if (key === this.lastTrackedGenerateKey) return;
            this.lastTrackedGenerateKey = key;
            this.trackEvent('generate_qr', {
                input_type: this.currentType,
                data_size: data.length,
                qr_size: this.size,
                error_correction: 'M'
            });
        }, 800);
    }

    selectType(type) {
        this._fireEngagement();
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
                // Return the starter URL while the example QR is active.
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
        const isExample = this.currentType === 'url' && this.isExampleQR && data === 'https://dopabrain.com';

        if (!isExample) {
            this.isExampleQR = false;
        }

        if (!data) {
            this.clearCanvas();
            this.updateStats(0, 1, 'L');
            // Show the empty-state message.
            this.showEmptyState();
            return;
        }

        // Hide the empty-state message.

        this.hideEmptyState();

        if (!window.QRCode || !window.QRCode.CorrectLevel) {
            this.clearCanvas();
            this.updateStats(0, 'auto', 'M');
            this.showEmptyState('QR engine is loading. Please try again in a moment.');
            return;
        }

        const generationId = ++this.generationSeq;
        const qrHost = document.createElement('div');
        qrHost.style.position = 'fixed';
        qrHost.style.left = '-9999px';
        qrHost.style.top = '0';
        qrHost.setAttribute('aria-hidden', 'true');
        document.body.appendChild(qrHost);

        try {
            new window.QRCode(qrHost, {
                text: data,
                width: this.size,
                height: this.size,
                colorDark: this.fgColor,
                colorLight: this.bgColor,
                correctLevel: window.QRCode.CorrectLevel.M
            });

            const rendered = qrHost.querySelector('canvas, img');
            if (!rendered) {
                throw new Error('QR renderer returned no drawable output');
            }

            const finalize = () => {
                if (generationId !== this.generationSeq) {
                    qrHost.remove();
                    return;
                }
                this.canvas.width = this.size;
                this.canvas.height = this.size;
                this.ctx.clearRect(0, 0, this.size, this.size);
                this.ctx.drawImage(rendered, 0, 0, this.size, this.size);
                qrHost.remove();

                this.updateStats(data.length, 'auto', 'M');
                if (!isExample) {
                    this.scheduleGenerateEvent(data);
                }
                this.addToHistory(data);
            };

            if (rendered.tagName === 'IMG' && !rendered.complete) {
                rendered.onload = finalize;
                rendered.onerror = () => {
                    qrHost.remove();
                    if (generationId !== this.generationSeq) return;
                    console.error('QR generation error: QR image failed to load');
                    this.clearCanvas();
                    this.showEmptyState('Could not generate this QR code. Please shorten the input and try again.');
                };
            } else {
                finalize();
            }
        } catch (error) {
            qrHost.remove();
            console.error('QR generation error:', error);
            this.clearCanvas();
            this.showEmptyState('Could not generate this QR code. Please shorten the input and try again.');
        }
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
        this.qrVersion.textContent = version === 'auto' ? 'auto' : `v${version}`;
        this.errorCorrection.textContent = errorLevel === 'M' ? 'M (15%)' : `${errorLevel} (7%)`;
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
            empty.textContent = window.i18n ? window.i18n.t('history.empty') : 'No generated codes yet';
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
            alert(window.i18n ? window.i18n.t('error.noData') : 'Please enter data first.');
            return;
        }

        this.trackEvent('download_qr', {
            input_type: this.currentType,
            data_size: data.length,
            qr_size: this.size
        });

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
        // Restore the starter QR after reset.
        this.urlInput.value = 'https://dopabrain.com';
        this.isExampleQR = true;
        this.generateQR();
    }

    showEmptyState(message) {
        const emptyState = document.getElementById('empty-state-message');
        if (emptyState) {
            emptyState.style.display = 'block';
            // Prefer explicit messages, otherwise use translated copy.
            if (message) {
                emptyState.textContent = message;
            } else if (window.i18n && window.i18n.t) {
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
    themeToggle.textContent = savedTheme === 'light' ? 'Dark' : 'Light';
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeToggle.textContent = next === 'light' ? 'Dark' : 'Light';
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.qrGenerator = new QRCodeGenerator();
});
