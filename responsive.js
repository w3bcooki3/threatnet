/* ============================================
   OSINTRIX RESPONSIVE JAVASCRIPT
   Mobile Menu Toggle & Responsive Utilities
   ============================================ */

// Initialize responsive functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeResponsiveMenu();
    handleResponsiveResize();
    initializeMobileOptimizations();
});

/**
 * Initialize mobile menu toggle functionality
 */
function initializeResponsiveMenu() {
    // Create hamburger menu button if it doesn't exist
    let hamburgerMenu = document.querySelector('.hamburger-menu');
    if (!hamburgerMenu) {
        hamburgerMenu = document.createElement('div');
        hamburgerMenu.className = 'hamburger-menu';
        hamburgerMenu.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(hamburgerMenu);
    }

    // Create sidebar overlay if it doesn't exist
    let sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.appendChild(sidebarOverlay);
    }

    const sidebar = document.querySelector('.sidebar');
    
    // Toggle sidebar on hamburger click
    hamburgerMenu.addEventListener('click', function() {
        toggleMobileSidebar();
    });

    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', function() {
        closeMobileSidebar();
    });

    // Close sidebar when clicking nav items on mobile
    if (sidebar) {
        const navItems = sidebar.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 991) {
                    closeMobileSidebar();
                }
            });
        });
    }

    // Handle escape key to close sidebar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            closeMobileSidebar();
        }
    });

    // Show/hide hamburger menu based on screen size
    updateMenuVisibility();
}

/**
 * Toggle mobile sidebar open/closed
 */
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerIcon = document.querySelector('.hamburger-menu i');
    
    if (sidebar && overlay) {
        const isActive = sidebar.classList.toggle('active');
        overlay.classList.toggle('active', isActive);
        
        // Update hamburger icon
        if (hamburgerIcon) {
            hamburgerIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
        }
        
        // Prevent body scroll when sidebar is open on mobile
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

/**
 * Close mobile sidebar
 */
function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerIcon = document.querySelector('.hamburger-menu i');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        
        if (hamburgerIcon) {
            hamburgerIcon.className = 'fas fa-bars';
        }
        
        document.body.style.overflow = '';
    }
}

/**
 * Handle window resize events
 */
function handleResponsiveResize() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            updateMenuVisibility();
            
            // Close sidebar if window is resized to desktop
            if (window.innerWidth > 991) {
                closeMobileSidebar();
            }
        }, 250);
    });
}

/**
 * Update menu visibility based on screen size
 */
function updateMenuVisibility() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    
    if (hamburgerMenu && sidebar) {
        if (window.innerWidth <= 991) {
            hamburgerMenu.style.display = 'flex';
            // Close sidebar by default on mobile
            sidebar.classList.remove('active');
        } else {
            hamburgerMenu.style.display = 'none';
            sidebar.classList.remove('active');
        }
    }
}

/**
 * Initialize mobile-specific optimizations
 */
function initializeMobileOptimizations() {
    // Add touch-friendly hover effects
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    // Optimize scroll performance on mobile
    optimizeScrollPerformance();
    
    // Handle orientation changes
    handleOrientationChange();
    
    // Optimize form inputs for mobile
    optimizeMobileForms();
}

/**
 * Optimize scroll performance
 */
function optimizeScrollPerformance() {
    let scrollTimeout;
    const scrollElements = document.querySelectorAll('.parent-tabs, .child-tabs, .tools-grid');
    
    scrollElements.forEach(element => {
        element.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            element.classList.add('is-scrolling');
            
            scrollTimeout = setTimeout(function() {
                element.classList.remove('is-scrolling');
            }, 150);
        }, { passive: true });
    });
}

/**
 * Handle device orientation changes
 */
function handleOrientationChange() {
    window.addEventListener('orientationchange', function() {
        // Close sidebar on orientation change
        closeMobileSidebar();
        
        // Update layout after orientation change
        setTimeout(function() {
            updateMenuVisibility();
        }, 300);
    });
}

/**
 * Optimize form inputs for mobile
 */
function optimizeMobileForms() {
    if (window.innerWidth <= 767) {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="url"], textarea');
        
        inputs.forEach(input => {
            // Prevent zoom on focus for iOS
            input.addEventListener('focus', function() {
                if (this.style.fontSize !== '16px') {
                    this.setAttribute('data-original-size', this.style.fontSize || '14px');
                    this.style.fontSize = '16px';
                }
            });
            
            input.addEventListener('blur', function() {
                const originalSize = this.getAttribute('data-original-size');
                if (originalSize) {
                    this.style.fontSize = originalSize;
                }
            });
        });
    }
}

/**
 * Utility: Check if device is mobile
 */
function isMobileDevice() {
    return window.innerWidth <= 767;
}

/**
 * Utility: Check if device is tablet
 */
function isTabletDevice() {
    return window.innerWidth > 767 && window.innerWidth <= 991;
}

/**
 * Utility: Check if device is touch-enabled
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Smooth scroll to element (mobile-optimized)
 */
function smoothScrollTo(element, offset = 0) {
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Add responsive utility classes dynamically
 */
function addResponsiveClasses() {
    const body = document.body;
    
    if (isMobileDevice()) {
        body.classList.add('is-mobile');
        body.classList.remove('is-tablet', 'is-desktop');
    } else if (isTabletDevice()) {
        body.classList.add('is-tablet');
        body.classList.remove('is-mobile', 'is-desktop');
    } else {
        body.classList.add('is-desktop');
        body.classList.remove('is-mobile', 'is-tablet');
    }
    
    if (isTouchDevice()) {
        body.classList.add('is-touch');
    } else {
        body.classList.remove('is-touch');
    }
}

// Update responsive classes on load and resize
addResponsiveClasses();
window.addEventListener('resize', addResponsiveClasses);

/**
 * Handle mobile-specific modal behavior
 */
function initializeMobileModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Prevent body scroll when modal is open
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.style.display === 'flex') {
                    if (isMobileDevice()) {
                        document.body.style.overflow = 'hidden';
                    }
                } else if (mutation.target.style.display === 'none') {
                    document.body.style.overflow = '';
                }
            });
        });
        
        observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
    });
}

// Initialize modal behavior
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileModals);
} else {
    initializeMobileModals();
}

/**
 * Optimize image loading on mobile
 */
function optimizeMobileImages() {
    if (isMobileDevice()) {
        const images = document.querySelectorAll('img[data-src-mobile]');
        
        images.forEach(img => {
            const mobileSrc = img.getAttribute('data-src-mobile');
            if (mobileSrc) {
                img.src = mobileSrc;
            }
        });
    }
}

optimizeMobileImages();

/**
 * Export utility functions for use in other scripts
 */
window.OSINTrixResponsive = {
    isMobile: isMobileDevice,
    isTablet: isTabletDevice,
    isTouch: isTouchDevice,
    toggleSidebar: toggleMobileSidebar,
    closeSidebar: closeMobileSidebar,
    smoothScrollTo: smoothScrollTo
};

console.log('✓ OSINTrix Responsive System Initialized');