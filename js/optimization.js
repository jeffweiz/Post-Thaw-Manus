// Performance optimization script
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    lazyLoadImages();
    
    // Add dark mode toggle
    addDarkModeToggle();
    
    // Add print functionality
    addPrintButton();
    
    // Add font size controls for accessibility
    addFontSizeControls();
    
    // Preload critical resources
    preloadCriticalResources();
});

function lazyLoadImages() {
    // Create IntersectionObserver to lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Target all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

function addDarkModeToggle() {
    // Create dark mode toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'btn btn-sm btn-outline-secondary dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.setAttribute('title', 'Toggle Dark Mode');
    darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
    
    // Add to navbar
    const navbar = document.querySelector('.navbar-nav');
    const darkModeItem = document.createElement('li');
    darkModeItem.className = 'nav-item ml-2';
    darkModeItem.appendChild(darkModeToggle);
    navbar.appendChild(darkModeItem);
    
    // Check for user preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    
    // Set initial state
    if (savedMode === 'dark' || (savedMode === null && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Add event listener
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'light');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('darkMode') === null) {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                } else {
                    document.body.classList.remove('dark-mode');
                    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                }
            }
        });
    }
}

function addPrintButton() {
    // Create print button
    const printButton = document.createElement('button');
    printButton.className = 'btn btn-sm btn-outline-secondary';
    printButton.innerHTML = '<i class="fas fa-print"></i>';
    printButton.setAttribute('title', 'Print Report');
    printButton.setAttribute('aria-label', 'Print Report');
    
    // Add to navbar
    const navbar = document.querySelector('.navbar-nav');
    const printItem = document.createElement('li');
    printItem.className = 'nav-item ml-2';
    printItem.appendChild(printButton);
    navbar.appendChild(printItem);
    
    // Add event listener
    printButton.addEventListener('click', function() {
        window.print();
    });
}

function addFontSizeControls() {
    // Create font size controls
    const fontControls = document.createElement('div');
    fontControls.className = 'font-size-controls nav-item ml-2 d-flex align-items-center';
    
    const decreaseButton = document.createElement('button');
    decreaseButton.className = 'btn btn-sm btn-outline-secondary';
    decreaseButton.innerHTML = '<i class="fas fa-minus"></i>';
    decreaseButton.setAttribute('title', 'Decrease Font Size');
    decreaseButton.setAttribute('aria-label', 'Decrease Font Size');
    
    const increaseButton = document.createElement('button');
    increaseButton.className = 'btn btn-sm btn-outline-secondary ml-1';
    increaseButton.innerHTML = '<i class="fas fa-plus"></i>';
    increaseButton.setAttribute('title', 'Increase Font Size');
    increaseButton.setAttribute('aria-label', 'Increase Font Size');
    
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-sm btn-outline-secondary ml-1';
    resetButton.innerHTML = '<i class="fas fa-undo"></i>';
    resetButton.setAttribute('title', 'Reset Font Size');
    resetButton.setAttribute('aria-label', 'Reset Font Size');
    
    fontControls.appendChild(decreaseButton);
    fontControls.appendChild(increaseButton);
    fontControls.appendChild(resetButton);
    
    // Add to navbar
    const navbar = document.querySelector('.navbar-nav');
    navbar.appendChild(fontControls);
    
    // Get content element
    const content = document.getElementById('content');
    
    // Set default font size
    let currentFontSize = parseInt(window.getComputedStyle(content).fontSize);
    const defaultFontSize = currentFontSize;
    
    // Check for saved preference
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        content.style.fontSize = savedFontSize + 'px';
        currentFontSize = savedFontSize;
    }
    
    // Add event listeners
    decreaseButton.addEventListener('click', function() {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            content.style.fontSize = currentFontSize + 'px';
            localStorage.setItem('fontSize', currentFontSize);
        }
    });
    
    increaseButton.addEventListener('click', function() {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            content.style.fontSize = currentFontSize + 'px';
            localStorage.setItem('fontSize', currentFontSize);
        }
    });
    
    resetButton.addEventListener('click', function() {
        currentFontSize = defaultFontSize;
        content.style.fontSize = currentFontSize + 'px';
        localStorage.removeItem('fontSize');
    });
}

function preloadCriticalResources() {
    // Add preload links for critical resources
    const head = document.head;
    
    // Preload critical CSS
    const cssPreload = document.createElement('link');
    cssPreload.rel = 'preload';
    cssPreload.href = 'css/styles.css';
    cssPreload.as = 'style';
    head.appendChild(cssPreload);
    
    // Preload critical fonts
    const fontAwesomePreload = document.createElement('link');
    fontAwesomePreload.rel = 'preload';
    fontAwesomePreload.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/webfonts/fa-solid-900.woff2';
    fontAwesomePreload.as = 'font';
    fontAwesomePreload.type = 'font/woff2';
    fontAwesomePreload.crossOrigin = 'anonymous';
    head.appendChild(fontAwesomePreload);
}

// Add CSS for optimization features
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .dark-mode-toggle, .font-size-controls button {
            width: 38px;
            height: 38px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        @media (max-width: 767.98px) {
            .font-size-controls {
                margin-top: 10px;
            }
        }
    `;
    document.head.appendChild(style);
});
