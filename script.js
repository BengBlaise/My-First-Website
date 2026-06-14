// Smooth scrolling for navigation links
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

// Highlight active navigation link based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Contact form validation and submission with EmailJS
const contactForm = document.querySelector('.contact-form');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form values
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Clear previous status
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        // Validate inputs
        if (!name) {
            showFormStatus('Please enter your name', 'error');
            nameInput.focus();
            return;
        }

        if (!email || !isValidEmail(email)) {
            showFormStatus('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }

        if (!message) {
            showFormStatus('Please enter a message', 'error');
            messageInput.focus();
            return;
        }

        // Show loading state
        const button = this.querySelector('button');
        const originalButtonText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;

        try {
            // Try to send via EmailJS if available, otherwise use fallback
            if (typeof emailjs !== 'undefined') {
                await sendEmailViaEmailJS(name, email, message);
            } else {
                // Fallback: Log to console and show success (for testing without backend)
                console.log('Form submitted:', { name, email, message });
                await simulateEmailSend(name, email, message);
            }

            // Show success message
            showFormStatus(`Thank you, ${name}! Your message has been received. I'll get back to you soon at ${email}`, 'success');

            // Clear form
            this.reset();
        } catch (error) {
            console.error('Error sending message:', error);
            showFormStatus('Failed to send message. Please try again later.', 'error');
        } finally {
            // Restore button state
            button.textContent = originalButtonText;
            button.disabled = false;
        }
    });
}

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form status message
function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.setAttribute('role', 'alert');
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        }, 5000);
    }
}

// Simulate email sending (fallback for testing)
function simulateEmailSend(name, email, message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

// Send email via EmailJS (requires setup at emailjs.com)
async function sendEmailViaEmailJS(name, email, message) {
    // Initialize EmailJS with your Public Key
    // Get this from https://dashboard.emailjs.com/admin
    // emailjs.init('YOUR_PUBLIC_KEY');

    const templateParams = {
        to_email: 'your-email@example.com', // Replace with your email
        from_name: name,
        from_email: email,
        message: message
    };

    // This requires EmailJS to be set up with a template
    // For now, we'll just resolve without sending
    return Promise.resolve();
}

// Add hover effect to service and project cards
const cards = document.querySelectorAll('.service-card, .project-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
    });
});

// Scroll to top button functionality
const scrollButton = document.createElement('button');
scrollButton.id = 'scrollToTop';
scrollButton.innerHTML = '↑';
scrollButton.setAttribute('aria-label', 'Scroll to top');
scrollButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    z-index: 1000;
    font-size: 20px;
    transition: background-color 0.3s ease;
`;

document.body.appendChild(scrollButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
});

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollButton.addEventListener('mouseenter', function () {
    this.style.backgroundColor = '#555';
});

scrollButton.addEventListener('mouseleave', function () {
    this.style.backgroundColor = '#333';
});

scrollButton.addEventListener('focus', function () {
    this.style.outline = '2px solid #ded35b';
    this.style.outlineOffset = '2px';
});

scrollButton.addEventListener('blur', function () {
    this.style.outline = 'none';
});
