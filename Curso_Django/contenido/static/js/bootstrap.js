// ===================================
// CONFIGURACION GLOBAL
// ===================================

const CONFIG = {
    animationDuration: 300,
    scrollThreshold: 100,
    notificationDuration: 3000,
    colors: {
        primary: '#7c3aed',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    }
};

// ===================================
// UTILIDADES
// ===================================

const Utils = {
    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    addClass: (element, className) => {
        element?.classList.add(className);
    },
    
    removeClass: (element, className) => {
        element?.classList.remove(className);
    },
    
    toggleClass: (element, className) => {
        element?.classList.toggle(className);
    },
    
    hasClass: (element, className) => {
        return element?.classList.contains(className) || false;
    }
};

// ===================================
// ANIMACIONES SCROLL
// ===================================

const ScrollAnimations = {
    init: function() {
        this.elements = document.querySelectorAll('[data-animate]');
        
        if (this.elements.length === 0) {
            console.warn('No elements found with data-animate attribute');
            return;
        }
        
        window.addEventListener('scroll', this.checkAnimations.bind(this), { passive: true });
        this.checkAnimations();
    },
    
    checkAnimations: function() {
        this.elements.forEach(el => {
            if (Utils.hasClass(el, 'visible')) return;
            
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - CONFIG.scrollThreshold;
            
            if (isVisible) {
                const animationType = el.getAttribute('data-animate') || 'fadeIn';
                Utils.addClass(el, 'visible');
                Utils.addClass(el, animationType);
            }
        });
    }
};

// Inicializar animaciones scroll
document.addEventListener('DOMContentLoaded', () => {
    ScrollAnimations.init();
});

// ===================================
// BOTON SUBIR A LA PAGINA
// ===================================

const ScrollToTop = {
    button: null,
    threshold: 300,
    
    init: function() {
        this.button = document.getElementById('scrollToTop') || this.createButton();
        
        window.addEventListener('scroll', this.toggle.bind(this), { passive: true });
        this.button.addEventListener('click', this.scroll.bind(this));
    },
    
    createButton: function() {
        const btn = document.createElement('button');
        btn.id = 'scrollToTop';
        btn.className = 'flotante';
        btn.innerHTML = '↑';
        btn.setAttribute('aria-label', 'Subir al inicio');
        btn.style.display = 'none';
        document.body.appendChild(btn);
        return btn;
    },
    
    toggle: function() {
        if (window.scrollY > this.threshold) {
            this.button.style.display = 'flex';
        } else {
            this.button.style.display = 'none';
        }
    },
    
    scroll: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ScrollToTop.init();
});

// ===================================
// RELOJ DIGITAL
// ===================================

const Clock = {
    element: null,
    timeoutId: null,
    
    init: function() {
        this.element = document.getElementById('reloj');
        if (!this.element) return;
        
        this.update();
    },
    
    update: function() {
        if (!this.element) return;
        
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        this.element.textContent = `${hours}:${minutes}:${seconds}`;
        
        this.timeoutId = setTimeout(() => this.update(), 1000);
    },
    
    destroy: function() {
        clearTimeout(this.timeoutId);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Clock.init();
});

// ===================================
// NOTIFICACIONES
// ===================================

const Notifications = {
    container: null,
    
    init: function() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
    },
    
    show: function(message, type = 'info', duration = CONFIG.notificationDuration) {
        this.init();
        
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} slide-in`;
        notification.innerHTML = message;
        notification.style.cssText = `
            margin-bottom: 10px;
            min-width: 300px;
            pointer-events: auto;
            animation: slideIn 0.3s ease-out;
        `;
        
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        return notification;
    },
    
    success: function(message, duration) {
        return this.show(message, 'success', duration);
    },
    
    error: function(message, duration) {
        return this.show(message, 'danger', duration);
    },
    
    warning: function(message, duration) {
        return this.show(message, 'warning', duration);
    },
    
    info: function(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// Alias global para compatibilidad
function notificacion(texto, tipo = 'info') {
    Notifications.show(texto, tipo);
}

// ===================================
// MODO OSCURO
// ===================================

const DarkMode = {
    button: null,
    storageKey: 'darkMode',
    
    init: function() {
        this.button = document.getElementById('modo');
        if (!this.button) return;
        
        this.loadPreference();
        this.button.addEventListener('click', this.toggle.bind(this));
    },
    
    toggle: function() {
        Utils.toggleClass(document.body, 'dark');
        this.savePreference();
        
        const isDark = Utils.hasClass(document.body, 'dark');
        this.button.innerHTML = isDark ? '☀️' : '🌙';
        
        Notifications.info(isDark ? 'Modo oscuro activado' : 'Modo claro activado', 1500);
    },
    
    savePreference: function() {
        const isDark = Utils.hasClass(document.body, 'dark');
        localStorage.setItem(this.storageKey, isDark);
    },
    
    loadPreference: function() {
        const isDark = localStorage.getItem(this.storageKey) === 'true';
        if (isDark) {
            Utils.addClass(document.body, 'dark');
            this.button.innerHTML = '☀️';
        } else {
            this.button.innerHTML = '🌙';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    DarkMode.init();
});

// ===================================
// VALIDACION DE FORMULARIOS
// ===================================

const FormValidator = {
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]+$/,
        url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    },
    
    validate: function(input) {
        const type = input.getAttribute('data-validate') || input.type;
        const value = input.value.trim();
        
        if (!value) return false;
        
        const pattern = this.patterns[type];
        if (!pattern) return true;
        
        return pattern.test(value);
    },
    
    initForm: function(formSelector) {
        const form = document.querySelector(formSelector);
        if (!form) return;
        
        const inputs = form.querySelectorAll('[data-validate], input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.validateInput(input));
        });
        
        form.addEventListener('submit', (e) => {
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                Notifications.error('Por favor completa todos los campos correctamente');
            }
        });
    },
    
    validateInput: function(input) {
        const isValid = this.validate(input);
        const errorMsg = input.nextElementSibling?.classList.contains('form-error');
        
        if (isValid) {
            Utils.removeClass(input, 'is-invalid');
            if (errorMsg) {
                input.nextElementSibling.classList.add('hidden');
            }
        } else {
            Utils.addClass(input, 'is-invalid');
            if (errorMsg) {
                input.nextElementSibling.classList.remove('hidden');
            }
        }
        
        return isValid;
    }
};

// ===================================
// LAZY LOADING DE IMAGENES
// ===================================

const LazyImages = {
    init: function() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        Utils.addClass(img, 'loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores antiguos
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    LazyImages.init();
});

// ===================================
// NAVEGACION SUAVE
// ===================================

const SmoothScroll = {
    init: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SmoothScroll.init();
});

// ===================================
// MANEJO DE ERRORES GLOBAL
// ===================================

window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    Notifications.error('Ocurrió un error. Por favor recarga la página.', 5000);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada:', event.reason);
    Notifications.error('Error en la aplicación', 5000);
});