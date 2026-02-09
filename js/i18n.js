// i18n - Internationalization Module

class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
        this.currentLang = this.detectLanguage();
        this.loaded = false;
    }

    detectLanguage() {
        // Try localStorage first
        const saved = localStorage.getItem('language');
        if (saved && this.supportedLanguages.includes(saved)) {
            return saved;
        }

        // Try browser language
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }

        // Default to English
        return 'en';
    }

    async initI18n() {
        await this.setLanguage(this.currentLang);
        this.setupLanguageButtons();
        this.loaded = true;
        return Promise.resolve();
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('Translation load error:', error);
            this.translations = {};
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (typeof value === 'object' && value !== null) {
                value = value[k];
            } else {
                return key; // Return key if not found
            }
        }

        return typeof value === 'string' ? value : key;
    }

    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            lang = 'en';
        }

        this.currentLang = lang;
        localStorage.setItem('language', lang);

        await this.loadTranslations(lang);
        this.updateUI();

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    updateUI() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update title and meta tags
        this.updateMetaTags();
    }

    updateMetaTags() {
        const titleKey = 'app.title';
        const descKey = 'app.subtitle';

        const title = document.querySelector('title');
        if (title) {
            // Keep original title format but could be customized per language
        }

        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta && this.t(descKey) !== descKey) {
            descMeta.setAttribute('content', this.t(descKey));
        }
    }

    setupLanguageButtons() {
        const langToggle = document.getElementById('lang-toggle');
        const langMenu = document.getElementById('lang-menu');
        const langOptions = document.querySelectorAll('.lang-option');

        if (!langToggle || !langMenu) return;

        // Toggle menu
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
        });

        // Close menu on outside click
        document.addEventListener('click', () => {
            langMenu.classList.add('hidden');
        });

        // Language selection
        langOptions.forEach(option => {
            option.addEventListener('click', async (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                await this.setLanguage(lang);
                this.updateActiveLanguage();
                langMenu.classList.add('hidden');
            });
        });

        this.updateActiveLanguage();
    }

    updateActiveLanguage() {
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === this.currentLang) {
                option.classList.add('active');
            }
        });
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getLanguageName(lang) {
        const names = {
            ko: '한국어',
            en: 'English',
            zh: '中文',
            hi: 'हिन्दी',
            ru: 'Русский',
            ja: '日本語',
            es: 'Español',
            pt: 'Português',
            id: 'Bahasa Indonesia',
            tr: 'Türkçe',
            de: 'Deutsch',
            fr: 'Français'
        };
        return names[lang] || lang;
    }
}

// Create global i18n instance
window.i18n = new I18n();
