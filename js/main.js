const menuBtn = document.querySelector('.hamburger');
const menuBar = document.querySelector('.menu-bar');
const menuList = document.querySelector('.nav-menu');

menuBtn.addEventListener('click', showMenu);

function showMenu(){
    menuBtn.classList.toggle('is-active');
    menuBar.classList.toggle('is-active');
    menuList.classList.toggle('is-active');
}

// Active navigation based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

// Set "About" as active by default on page load
function setDefaultActive() {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#about') {
            link.classList.add('active');
        }
    });
}

function setActiveNav() {
    const scrollY = window.pageYOffset;
    let foundActive = false;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            foundActive = true;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // If no section is active (top of page), activate "About"
    if (!foundActive && scrollY < 100) {
        setDefaultActive();
    }
}

// Set About as active on load
window.addEventListener('load', () => {
    setDefaultActive();
    setActiveNav();
});

window.addEventListener('scroll', setActiveNav);

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('is-active');
        menuBar.classList.remove('is-active');
        menuList.classList.remove('is-active');
    });
});

// CV Dropdown functionality for mobile
const cvDropdown = document.querySelector('.cv-dropdown');
const cvTrigger = document.querySelector('.cv-trigger');
const cvButtonWrapper = document.querySelector('.cv-button-wrapper');
const cvTriggerMain = document.querySelector('.cv-trigger-main');

// Toggle dropdown on click for mobile (navigation)
if (cvTrigger) {
    cvTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        cvDropdown.classList.toggle('dropdown-active');
    });
}

// Toggle dropdown on click for mobile (hero section)
if (cvTriggerMain) {
    cvTriggerMain.addEventListener('click', (e) => {
        cvButtonWrapper.classList.toggle('dropdown-active');
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (cvDropdown && !cvDropdown.contains(e.target)) {
        cvDropdown.classList.remove('dropdown-active');
    }
    if (cvButtonWrapper && !cvButtonWrapper.contains(e.target)) {
        cvButtonWrapper.classList.remove('dropdown-active');
    }
});
