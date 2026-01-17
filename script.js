// script.js - Código optimizado y corregido

// Variables globales para el zoom
let currentZoomIndex = 0;
let currentCarouselId = '';
let zoomedImages = [];
let currentScale = 1;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Iniciando scripts...');
    
    // Inicializar todas las funcionalidades
    initNavigation();
    initCarousels();
    initModals();
    initModalCarousels();
    initZoomModal();
    
    console.log('Todos los scripts inicializados correctamente');
});

// ===== NAVEGACIÓN =====
function initNavigation() {
    console.log('Iniciando navegación...');
    
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    console.log('menuBtn encontrado:', menuBtn);
    console.log('navLinks encontrado:', navLinks);
    
    if (!menuBtn || !navLinks) {
        console.error('No se encontraron elementos del menú');
        return;
    }
    
    // Mostrar en consola los estilos actuales
    console.log('Estilos de navLinks (display):', window.getComputedStyle(navLinks).display);
    console.log('Estilos de menuBtn (display):', window.getComputedStyle(menuBtn).display);
    
    menuBtn.addEventListener('click', function() {
        console.log('Botón hamburguesa clickeado');
        navLinks.classList.toggle('active');
        console.log('Clase active toggled. Ahora tiene active?', navLinks.classList.contains('active'));
    });
    
    // Cerrar menú al hacer clic en enlaces (en móviles)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                console.log('Enlace clickeado en móvil, cerrando menú');
                navLinks.classList.remove('active');
            }
        });
    });
    
    console.log('Navegación inicializada correctamente');
}

// ===== CARRUSELES DE PROYECTOS =====
function initCarousels() {
    const carousels = document.querySelectorAll('.project-carousel');
    console.log('Encontrados', carousels.length, 'carruseles de proyectos');
    
    carousels.forEach(carousel => {
        const carouselId = carousel.id.split('-')[1];
        const items = carousel.querySelectorAll('.carousel-item');
        const dots = document.querySelectorAll(`.carousel-dot[data-carousel="${carouselId}"]`);
        
        // Ocultar controles si solo hay una imagen
        if (items.length <= 1) {
            const nav = carousel.parentElement.querySelector('.carousel-nav');
            if (nav) nav.style.display = 'none';
            return;
        }
        
        let currentIndex = 0;
        let autoScrollInterval;
        
        function showSlide(index) {
            // Asegurar índice dentro de límites
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;
            
            // Mover carrusel
            carousel.style.transform = `translateX(-${index * 100}%)`;
            
            // Actualizar dots
            dots.forEach(dot => dot.classList.remove('active'));
            const activeDot = document.querySelector(`.carousel-dot[data-index="${index}"][data-carousel="${carouselId}"]`);
            if (activeDot) activeDot.classList.add('active');
            
            currentIndex = index;
        }
        
        // Event listeners para dots
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                showSlide(index);
                resetAutoScroll();
            });
        });
        
        // Navegación automática
        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                showSlide(currentIndex + 1);
            }, 5000);
        }
        
        function resetAutoScroll() {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        }
        
        // Pausar/reanudar auto-scroll
        carousel.parentElement.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
        
        carousel.parentElement.addEventListener('mouseleave', () => {
            startAutoScroll();
        });
        
        // Iniciar
        showSlide(0);
        startAutoScroll();
    });
}

// ===== CARRUSELES DE MODALES =====
function initModalCarousels() {
    const modalCarousels = document.querySelectorAll('.modal-project-carousel-inner');
    console.log('Encontrados', modalCarousels.length, 'carruseles de modales');
    
    modalCarousels.forEach(carousel => {
        const carouselId = carousel.id;
        const items = carousel.querySelectorAll('.modal-project-carousel-item');
        const dots = document.querySelectorAll(`.modal-project-carousel-dot[data-carousel="${carouselId}"]`);
        const counter = carousel.parentElement.querySelector('.carousel-counter');
        
        if (items.length <= 1) {
            // Ocultar controles si solo hay una imagen
            const arrows = carousel.parentElement.querySelectorAll('.carousel-project-arrow');
            const nav = carousel.parentElement.querySelector('.modal-project-carousel-nav');
            const counterElement = carousel.parentElement.querySelector('.carousel-counter');
            
            arrows.forEach(arrow => arrow.style.display = 'none');
            if (nav) nav.style.display = 'none';
            if (counterElement) counterElement.style.display = 'none';
            return;
        }
        
        let currentIndex = 0;
        
        function showModalSlide(index) {
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;
            
            // Mover carrusel
            carousel.style.transform = `translateX(-${index * 100}%)`;
            
            // Actualizar dots
            dots.forEach(dot => dot.classList.remove('active'));
            const activeDot = document.querySelector(`.modal-project-carousel-dot[data-index="${index}"][data-carousel="${carouselId}"]`);
            if (activeDot) activeDot.classList.add('active');
            
            // Actualizar contador
            if (counter) {
                counter.textContent = `${index + 1}/${items.length}`;
            }
            
            currentIndex = index;
        }
        
        // Event listeners para dots
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                showModalSlide(index);
            });
        });
        
        // Inicializar
        showModalSlide(0);
    });
}

// Función global para mover carrusel de modales
function moveModalCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) {
        console.error('Carrusel no encontrado:', carouselId);
        return;
    }
    
    const items = carousel.querySelectorAll('.modal-project-carousel-item');
    const dots = document.querySelectorAll(`.modal-project-carousel-dot[data-carousel="${carouselId}"]`);
    const counter = carousel.parentElement.querySelector('.carousel-counter');
    
    let currentIndex = 0;
    const activeDot = document.querySelector(`.modal-project-carousel-dot.active[data-carousel="${carouselId}"]`);
    if (activeDot) {
        currentIndex = parseInt(activeDot.getAttribute('data-index'));
    }
    
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;
    
    // Mover carrusel
    carousel.style.transform = `translateX(-${newIndex * 100}%)`;
    
    // Actualizar dots
    dots.forEach(dot => dot.classList.remove('active'));
    const activeNewDot = document.querySelector(`.modal-project-carousel-dot[data-index="${newIndex}"][data-carousel="${carouselId}"]`);
    if (activeNewDot) activeNewDot.classList.add('active');
    
    // Actualizar contador
    if (counter) {
        counter.textContent = `${newIndex + 1}/${items.length}`;
    }
}

// ===== MODALES =====
function initModals() {
    console.log('Inicializando modales...');
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-project')) {
            closeAllModals();
        }
    });
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Inicializar carruseles de modales cuando se abren
    document.querySelectorAll('.view-project-btn').forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(initModalCarousels, 100);
        });
    });
}

function openProjectModal(modalId) {
    console.log('Abriendo modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Reiniciar carruseles del modal
        setTimeout(initModalCarousels, 100);
    } else {
        console.error('Modal no encontrado:', modalId);
    }
}

function closeProjectModal(modalId) {
    console.log('Cerrando modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    console.log('Cerrando todos los modales');
    const modals = document.querySelectorAll('.modal-project');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// ===== ZOOM MODAL =====
function initZoomModal() {
    console.log('Inicializando modal de zoom...');
    
    // Agregar evento de clic para abrir modal de zoom
    document.addEventListener('click', function(e) {
        if (e.target.matches('.modal-project-carousel-item img')) {
            const img = e.target;
            const carousel = img.closest('.modal-project-carousel-inner');
            if (carousel) {
                const carouselId = carousel.id;
                openZoomModal(img, carouselId);
            }
        }
    });
    
    // Cerrar modal de zoom al hacer clic fuera del contenido
    document.addEventListener('click', function(e) {
        const zoomModal = document.getElementById('image-zoom-modal');
        if (e.target === zoomModal) {
            closeZoomModal();
        }
    });
    
    // Cerrar modal de zoom con tecla Escape
    document.addEventListener('keydown', function(e) {
        const zoomModal = document.getElementById('image-zoom-modal');
        
        if (e.key === 'Escape' && zoomModal.style.display === 'flex') {
            closeZoomModal();
        }
        
        // Navegación con teclado solo si el modal está abierto
        if (zoomModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                navigateZoom(-1);
            } else if (e.key === 'ArrowRight') {
                navigateZoom(1);
            } else if (e.key === '0' || e.key === 'r') {
                // Tecla 0 o R para resetear zoom
                resetZoom();
            } else if (e.key === '+' || e.key === '=') {
                // Tecla + para acercar
                zoomImage(1.25);
            } else if (e.key === '-' || e.key === '_') {
                // Tecla - para alejar
                zoomImage(0.8);
            }
        }
    });
    
    // Zoom con rueda del mouse (más suave)
    const zoomModal = document.getElementById('image-zoom-modal');
    if (zoomModal) {
        zoomModal.addEventListener('wheel', function(e) {
            if (zoomModal.style.display === 'flex') {
                e.preventDefault();
                if (e.deltaY < 0) {
                    // Scroll up - zoom in (más suave)
                    zoomImage(1.1);
                } else {
                    // Scroll down - zoom out (más suave)
                    zoomImage(0.9);
                }
            }
        }, { passive: false });
    }
}

// Función para abrir modal de imagen ampliada
function openZoomModal(img, carouselId) {
    console.log('Abriendo zoom para imagen del carrusel:', carouselId);
    currentCarouselId = carouselId;
    currentScale = 1; // Empezar con zoom normal (100%)
    
    // Obtener todas las imágenes del carrusel
    const carousel = document.getElementById(carouselId);
    if (!carousel) {
        console.error('Carrusel no encontrado para zoom:', carouselId);
        return;
    }
    
    const images = carousel.querySelectorAll('img');
    zoomedImages = Array.from(images);
    
    // Encontrar el índice de la imagen clickeada
    currentZoomIndex = zoomedImages.indexOf(img);
    if (currentZoomIndex === -1) currentZoomIndex = 0;
    
    // Mostrar la imagen en el modal
    const zoomedImage = document.getElementById('zoomed-image');
    const zoomModal = document.getElementById('image-zoom-modal');
    
    if (zoomedImage && zoomModal) {
        zoomedImage.src = img.src;
        zoomedImage.alt = img.alt;
        zoomedImage.style.transform = 'scale(1)'; // Sin zoom inicial
        
        // Actualizar contador y nivel de zoom
        updateZoomCounter();
        updateZoomLevel();
        
        // Mostrar modal
        zoomModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Función para cerrar modal de imagen ampliada
function closeZoomModal() {
    console.log('Cerrando modal de zoom');
    const zoomModal = document.getElementById('image-zoom-modal');
    if (zoomModal) {
        zoomModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentScale = 1; // Resetear zoom al cerrar
    }
}

// Función para navegar entre imágenes en el modal de zoom
function navigateZoom(direction) {
    currentZoomIndex += direction;
    currentScale = 1; // Resetear zoom al cambiar imagen
    
    if (currentZoomIndex < 0) {
        currentZoomIndex = zoomedImages.length - 1;
    } else if (currentZoomIndex >= zoomedImages.length) {
        currentZoomIndex = 0;
    }
    
    // Actualizar imagen
    const zoomedImage = document.getElementById('zoomed-image');
    if (zoomedImage && zoomedImages[currentZoomIndex]) {
        zoomedImage.src = zoomedImages[currentZoomIndex].src;
        zoomedImage.alt = zoomedImages[currentZoomIndex].alt;
        zoomedImage.style.transform = 'scale(1)';
        
        // Actualizar contador y nivel de zoom
        updateZoomCounter();
        updateZoomLevel();
    }
}

// Función para hacer zoom en la imagen
function zoomImage(scaleFactor) {
    const zoomedImage = document.getElementById('zoomed-image');
    if (!zoomedImage) return;
    
    currentScale *= scaleFactor;
    
    // Limitar el zoom entre 25% y 400%
    currentScale = Math.max(0.25, Math.min(4, currentScale));
    
    zoomedImage.style.transform = `scale(${currentScale})`;
    zoomedImage.style.transition = 'transform 0.3s ease';
    
    updateZoomLevel();
}

// Función para resetear el zoom
function resetZoom() {
    currentScale = 1;
    const zoomedImage = document.getElementById('zoomed-image');
    if (zoomedImage) {
        zoomedImage.style.transform = 'scale(1)';
        zoomedImage.style.transition = 'transform 0.3s ease';
        updateZoomLevel();
    }
}

// Función para actualizar el contador en el modal de zoom
function updateZoomCounter() {
    const counter = document.getElementById('zoom-counter');
    if (counter) {
        counter.textContent = `${currentZoomIndex + 1} / ${zoomedImages.length}`;
    }
}

// Función para actualizar el indicador de nivel de zoom
function updateZoomLevel() {
    const level = document.getElementById('zoom-level');
    if (level) {
        const zoomLevel = Math.round(currentScale * 100);
        level.textContent = `${zoomLevel}%`;
    }
}

// Hacer funciones globales
window.moveModalCarousel = moveModalCarousel;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.openZoomModal = openZoomModal;
window.closeZoomModal = closeZoomModal;
window.navigateZoom = navigateZoom;
window.zoomImage = zoomImage;
window.resetZoom = resetZoom;

console.log('Script.js cargado completamente');