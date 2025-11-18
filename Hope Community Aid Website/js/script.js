// Main JavaScript file for Hope Community Aid

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initAccordions();
    initImageLightbox();
    initFormValidation();
    initSmoothScrolling();
    initSearchFunctionality();
    initDatePickers();
    
    console.log('Hope Community Aid - JavaScript loaded successfully');
});

// 1. Date Picker Functionality (using jQuery UI)
function initDatePickers() {
    if (typeof jQuery !== 'undefined' && typeof $.fn.datepicker !== 'undefined') {
        $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            minDate: 0,
            showAnim: 'fadeIn'
        });
    }
}

// 2. Form Validation with Thank You Alerts
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission for demo
            
            if (validateForm(this)) {
                // Show thank you message based on form type
                showThankYouMessage(this);
                
                // Reset form after successful submission
                setTimeout(() => {
                    this.reset();
                }, 2000);
            }
        });
    });
}

function showThankYouMessage(form) {
    const formId = form.id || form.className;
    
    if (formId.includes('contact') || form.classList.contains('contact-form')) {
        // Contact form submission
        showCustomAlert('Thank you for contacting us!', 'We have received your message and will get back to you soon.');
    } else if (formId.includes('enquiry') || form.classList.contains('enquiry-form')) {
        // Enquiry form submission
        showCustomAlert('Thank you for your enquiry!', 'We appreciate your interest and will respond to you shortly.');
    } else {
        // Generic thank you message
        showCustomAlert('Thank you!', 'Your submission has been received successfully.');
    }
}

function showCustomAlert(title, message) {
    // Create custom alert modal
    const alertModal = document.createElement('div');
    alertModal.className = 'custom-alert';
    alertModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        text-align: center;
        max-width: 400px;
        width: 90%;
    `;
    
    alertModal.innerHTML = `
        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">${title}</h3>
        <p style="margin-bottom: 1.5rem;">${message}</p>
        <button class="button" onclick="this.parentElement.remove()" style="margin: 0 auto;">OK</button>
    `;
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'alert-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 2999;
    `;
    
    // Remove overlay when clicked
    overlay.addEventListener('click', function() {
        alertModal.remove();
        this.remove();
    });
    
    document.body.appendChild(overlay);
    document.body.appendChild(alertModal);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertModal.parentElement) {
            alertModal.remove();
        }
        if (overlay.parentElement) {
            overlay.remove();
        }
    }, 5000);
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(error => error.remove());
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.style.borderColor = '';
    });
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
        
        if (value === "") {
            showError(input, `${fieldName} is required`);
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    clearError(input);
    input.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorDiv);
}

function clearError(input) {
    input.style.borderColor = '';
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// 3. Accordion Functionality
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');
        
        header.addEventListener('click', () => {
            // Close all other accordions
            accordions.forEach(otherAccordion => {
                if (otherAccordion !== accordion) {
                    otherAccordion.classList.remove('active');
                    const otherContent = otherAccordion.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                    }
                }
            });
            
            // Toggle current accordion
            accordion.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

// 4. Image Lightbox Gallery
function initImageLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let images = [];
    
    // Add click events to all gallery images
    document.querySelectorAll('.gallery-image').forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    function collectImages() {
        images = Array.from(document.querySelectorAll('.gallery-image'));
    }
    
    function openLightbox(index) {
        collectImages();
        currentImageIndex = index;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxCaption.textContent = images[currentImageIndex].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxCaption.textContent = images[currentImageIndex].alt;
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxCaption.textContent = images[currentImageIndex].alt;
    }
    
    // Event listeners
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

// 5. Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 6. Search Functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (searchTerm.trim() === '') {
        showCustomAlert('Search', 'Please enter a search term');
        return;
    }
    
    // Search through service cards
    const serviceCards = document.querySelectorAll('.service-card');
    let foundResults = false;
    
    serviceCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            foundResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (!foundResults) {
        showCustomAlert('No Results', 'No results found for: ' + searchTerm);
        // Show all cards if no results
        serviceCards.forEach(card => {
            card.style.display = 'block';
        });
    }
}

// Utility function for dynamic content loading
function loadDynamicContent(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading content:', error);
        });
}