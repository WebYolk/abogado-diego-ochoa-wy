// 1. CURSOR PERSONALIZADO Y MAGNÉTICO (Optimizado)
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTargets = document.querySelectorAll('.hover-target');
const magneticBtns = document.querySelectorAll('.btn-magnetic');

if (window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Interpolación suave para el outline sin saturar la memoria
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => cursorOutline?.classList.add('cursor-hover'));
        target.addEventListener('mouseleave', () => cursorOutline?.classList.remove('cursor-hover'));
    });

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3; 
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}

// 2. NAVEGACIÓN DEL SLIDER
const sliderTrack = document.getElementById('sliderTrack');
const btnPrev = document.getElementById('sliderPrev');
const btnNext = document.getElementById('sliderNext');

if (sliderTrack && btnPrev && btnNext) {
    let currentIndex = 0;
    const images = sliderTrack.querySelectorAll('.slider-img');
    const totalImages = images.length;
    
    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateSlider();
    });
    
    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateSlider();
    });
}

// 3. BARRA DE PROGRESO DE LECTURA
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) progressBar.style.width = `${scrolled}%`;
});

// 4. EFECTO MÁQUINA DE ESCRIBIR
const textsToType = [
    "defensa penal.",
    "causas de familia.",
    "juicios laborales.",
    "litigios civiles."
];
let textIndex = 0; let charIndex = 0; let isDeleting = false;
const typedTextElement = document.getElementById("typed-text");

function typeEffect() {
    if (!typedTextElement) return;
    const currentText = textsToType[textIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; 
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; 
        textIndex = (textIndex + 1) % textsToType.length; 
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => { 
    if (typedTextElement) setTimeout(typeEffect, 1000); 
});

// 5. MODO OSCURO CON PERSISTENCIA
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// 6. LÓGICA DE MODALES
function cerrarModalGeneral(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto'; 
}

function abrirModalSkill(titulo, iconoClass, desc) {
    document.getElementById('skill-modal-titulo').innerText = titulo;
    document.getElementById('skill-modal-desc').innerText = desc;
    document.getElementById('skill-modal-icon').innerHTML = `<i class="${iconoClass}"></i>`;
    document.getElementById('modalSkill').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function abrirModalTimeline(puesto, empresa, fechas, descripcionHTML) {
    document.getElementById('timeline-modal-titulo').innerText = puesto;
    document.getElementById('timeline-modal-empresa').innerText = empresa;
    document.getElementById('timeline-modal-date').innerText = fechas;
    document.getElementById('timeline-modal-desc').innerHTML = descripcionHTML;
    document.getElementById('modalTimeline').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            cerrarModalGeneral(modal.id);
        });
    }
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarModalGeneral(overlay.id);
    });
});

// 7. ANIMACIONES SCROLL
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((element) => { observer.observe(element); });