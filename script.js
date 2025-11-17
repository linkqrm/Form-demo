// ==========================================
// FORMULARIO PROFESIONAL - JAVASCRIPT
// Archivo: script.js
// Descripción: Funcionalidad completa del formulario
// ==========================================

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let selectedFile = null;

// ==========================================
// INICIALIZACIÓN
// Ejecutar cuando el DOM esté completamente cargado
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Formulario profesional cargado');
    
    // Inicializar todas las funcionalidades
    initFileUpload();
    initFormValidation();
    initFormSubmission();
    initResetButton();
    initScrollToTop();
    initSaturdaySchedule();
});

// ==========================================
// FUNCIÓN: INICIALIZAR UPLOAD DE ARCHIVO
// Maneja la selección, preview y eliminación de imagen
// ==========================================
function initFileUpload() {
    const fileInput = document.getElementById('profilePhoto');
    const fileUploadDisplay = document.querySelector('.file-upload-display');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImage');

    // Click en el área de upload
    if (fileUploadDisplay) {
        fileUploadDisplay.addEventListener('click', function() {
            fileInput.click();
        });
    }

    // Cuando se selecciona un archivo
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                showError('Por favor, seleccione un archivo de imagen válido');
                fileInput.value = '';
                return;
            }

            // Validar tamaño (máximo 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB en bytes
            if (file.size > maxSize) {
                showError('La imagen es muy grande. Por favor, seleccione una imagen menor a 10MB');
                fileInput.value = '';
                return;
            }

            // Guardar referencia al archivo
            selectedFile = file;

            // Mostrar preview
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.classList.remove('hidden');
                fileUploadDisplay.style.display = 'none';
            };
            reader.readAsDataURL(file);

            console.log('📷 Imagen seleccionada:', file.name);
        }
    });

    // Botón para eliminar imagen
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se dispare el click del contenedor
            removeSelectedImage();
        });
    }

    // Drag and drop functionality
    if (fileUploadDisplay) {
        // Prevenir comportamiento por defecto
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadDisplay.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Highlight cuando se arrastra sobre el área
        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadDisplay.addEventListener(eventName, function() {
                fileUploadDisplay.style.borderColor = 'var(--primary-color)';
                fileUploadDisplay.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadDisplay.addEventListener(eventName, function() {
                fileUploadDisplay.style.borderColor = '';
                fileUploadDisplay.style.backgroundColor = '';
            });
        });

        // Manejar el drop
        fileUploadDisplay.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                fileInput.files = files;
                // Disparar el evento change manualmente
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    }
}

// ==========================================
// FUNCIÓN: REMOVER IMAGEN SELECCIONADA
// ==========================================
function removeSelectedImage() {
    const fileInput = document.getElementById('profilePhoto');
    const fileUploadDisplay = document.querySelector('.file-upload-display');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    // Limpiar el input
    fileInput.value = '';
    selectedFile = null;

    // Ocultar preview y mostrar área de upload
    imagePreview.classList.add('hidden');
    previewImg.src = '';
    fileUploadDisplay.style.display = 'flex';

    console.log('🗑️ Imagen eliminada');
}

// ==========================================
// FUNCIÓN: INICIALIZAR VALIDACIÓN DEL FORMULARIO
// Validación en tiempo real de los campos
// ==========================================
function initFormValidation() {
    const form = document.getElementById('professionalForm');
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        // Validar al perder el foco
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Limpiar error al empezar a escribir
        input.addEventListener('input', function() {
            removeFieldError(this);
        });
    });

    // Validación especial para horarios
    initScheduleValidation();
}

// ==========================================
// FUNCIÓN: VALIDAR UN CAMPO ESPECÍFICO
// ==========================================
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    // Si el campo es requerido y está vacío
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }

    // Validación específica por tipo
    if (value) {
        switch (field.type) {
            case 'email':
                if (!isValidEmail(value)) {
                    showFieldError(field, 'Por favor, ingrese un email válido');
                    return false;
                }
                break;
            case 'url':
                if (!isValidURL(value)) {
                    showFieldError(field, 'Por favor, ingrese una URL válida');
                    return false;
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    showFieldError(field, 'Por favor, ingrese un número válido');
                    return false;
                }
                break;
        }
    }

    // Si llegamos aquí, el campo es válido
    removeFieldError(field);
    return true;
}

// ==========================================
// FUNCIÓN: INICIALIZAR HORARIO DE SÁBADO
// Mostrar/ocultar horarios del sábado según checkbox
// ==========================================
function initSaturdaySchedule() {
    const saturdayCheckbox = document.getElementById('saturdayEnabled');
    const saturdaySchedule = document.getElementById('saturdaySchedule');
    const saturdayInputs = saturdaySchedule.querySelectorAll('input[type="time"]');

    // Cambiar visibilidad al hacer clic en el checkbox
    saturdayCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Mostrar horarios del sábado con animación
            saturdaySchedule.classList.remove('hidden');
            setTimeout(() => {
                saturdaySchedule.style.opacity = '1';
            }, 10);
            
            console.log('📅 Horario de sábado habilitado');
        } else {
            // Ocultar y limpiar horarios del sábado
            saturdaySchedule.style.opacity = '0';
            setTimeout(() => {
                saturdaySchedule.classList.add('hidden');
                // Limpiar valores de los inputs
                saturdayInputs.forEach(input => {
                    input.value = '';
                    removeFieldError(input);
                });
            }, 300);
            
            console.log('📅 Horario de sábado deshabilitado');
        }
    });

    // Validación de horarios del sábado
    const satMorningFrom = document.getElementById('saturdayMorningFrom');
    const satMorningTo = document.getElementById('saturdayMorningTo');
    const satAfternoonFrom = document.getElementById('saturdayAfternoonFrom');
    const satAfternoonTo = document.getElementById('saturdayAfternoonTo');

    // Validar horario matutino del sábado
    satMorningTo.addEventListener('change', function() {
        if (satMorningFrom.value && satMorningTo.value) {
            if (satMorningTo.value <= satMorningFrom.value) {
                showFieldError(satMorningTo, 'La hora de finalización debe ser posterior a la de inicio');
            } else {
                removeFieldError(satMorningTo);
            }
        }
    });

    // Validar horario vespertino del sábado
    satAfternoonTo.addEventListener('change', function() {
        if (satAfternoonFrom.value && satAfternoonTo.value) {
            if (satAfternoonTo.value <= satAfternoonFrom.value) {
                showFieldError(satAfternoonTo, 'La hora de finalización debe ser posterior a la de inicio');
            } else {
                removeFieldError(satAfternoonTo);
            }
        }
    });
}

// ==========================================
// FUNCIÓN: VALIDACIÓN DE HORARIOS
// Asegurar que el horario "hasta" sea posterior al "desde"
// ==========================================
function initScheduleValidation() {
    const morningFrom = document.getElementById('morningFrom');
    const morningTo = document.getElementById('morningTo');
    const afternoonFrom = document.getElementById('afternoonFrom');
    const afternoonTo = document.getElementById('afternoonTo');

    // Validar horario matutino
    morningTo.addEventListener('change', function() {
        if (morningFrom.value && morningTo.value) {
            if (morningTo.value <= morningFrom.value) {
                showFieldError(morningTo, 'La hora de finalización debe ser posterior a la de inicio');
            } else {
                removeFieldError(morningTo);
            }
        }
    });

    // Validar horario vespertino
    afternoonTo.addEventListener('change', function() {
        if (afternoonFrom.value && afternoonTo.value) {
            if (afternoonTo.value <= afternoonFrom.value) {
                showFieldError(afternoonTo, 'La hora de finalización debe ser posterior a la de inicio');
            } else {
                removeFieldError(afternoonTo);
            }
        }
    });
}

// ==========================================
// FUNCIÓN: MOSTRAR ERROR EN CAMPO
// ==========================================
function showFieldError(field, message) {
    // Remover error previo si existe
    removeFieldError(field);

    // Añadir clase de error al campo
    field.classList.add('border-red-500');

    // Crear elemento de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    // Insertar después del campo
    field.parentNode.appendChild(errorDiv);
}

// ==========================================
// FUNCIÓN: REMOVER ERROR DE CAMPO
// ==========================================
function removeFieldError(field) {
    field.classList.remove('border-red-500');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ==========================================
// FUNCIÓN: VALIDADORES
// ==========================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function isValidPhone(phone) {
    // Permitir números, espacios, guiones y paréntesis
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

// ==========================================
// FUNCIÓN: INICIALIZAR ENVÍO DEL FORMULARIO
// Maneja el envío con validación y feedback al usuario
// ==========================================
function initFormSubmission() {
    const form = document.getElementById('professionalForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    const submitBtnLoading = document.getElementById('submitBtnLoading');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Ocultar mensajes previos
        hideMessages();

        // Validar todos los campos antes de enviar
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let allValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            showError('Por favor, complete todos los campos requeridos correctamente');
            // Scroll al primer error
            const firstError = document.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Validar que se haya seleccionado una imagen
        if (!selectedFile && !document.getElementById('profilePhoto').files[0]) {
            showError('Por favor, seleccione una foto de perfil');
            document.getElementById('profilePhoto').scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Mostrar estado de carga
        submitBtn.disabled = true;
        submitBtnText.classList.add('hidden');
        submitBtnLoading.classList.remove('hidden');

        try {
            // Crear FormData con todos los campos
            const formData = new FormData(form);

            console.log('📤 Enviando formulario...');
            console.log('Datos del formulario:');
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}:`, value.name, `(${(value.size / 1024).toFixed(2)} KB)`);
                } else {
                    console.log(`${key}:`, value);
                }
            }
            
            // Log especial para horarios del sábado
            const saturdayEnabled = formData.get('saturdayEnabled');
            if (saturdayEnabled === 'on') {
                console.log('📅 Horario de sábado incluido:');
                console.log('  Matutino:', formData.get('saturdayMorningFrom'), '-', formData.get('saturdayMorningTo'));
                console.log('  Vespertino:', formData.get('saturdayAfternoonFrom'), '-', formData.get('saturdayAfternoonTo'));
            }

            // IMPORTANTE: Enviar al webhook
            // Nota: El formulario se envía automáticamente por el método POST
            // pero si necesitas procesamiento adicional antes, puedes usar fetch:
            
            /*
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en el servidor');
            }

            const result = await response.json();
            console.log('✅ Respuesta del servidor:', result);
            */

            // Por ahora, simular envío exitoso (comentar cuando uses el webhook real)
            await simulateSubmission();

            // Mostrar mensaje de éxito
            showSuccess();

            // Limpiar formulario después de 2 segundos
            setTimeout(() => {
                resetForm();
            }, 2000);

        } catch (error) {
            console.error('❌ Error al enviar formulario:', error);
            showError('Ha ocurrido un error al enviar el formulario. Por favor, intente nuevamente.');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtnText.classList.remove('hidden');
            submitBtnLoading.classList.add('hidden');
        }
    });
}

// ==========================================
// FUNCIÓN: SIMULAR ENVÍO (PARA PRUEBAS)
// Eliminar esta función cuando uses el webhook real
// ==========================================
function simulateSubmission() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 2000); // Simular 2 segundos de carga
    });
}

// ==========================================
// FUNCIÓN: INICIALIZAR BOTÓN DE RESET
// ==========================================
function initResetButton() {
    const resetBtn = document.getElementById('resetBtn');
    
    resetBtn.addEventListener('click', function() {
        if (confirm('¿Está seguro de que desea limpiar todo el formulario?')) {
            resetForm();
        }
    });
}

// ==========================================
// FUNCIÓN: RESETEAR FORMULARIO
// ==========================================
function resetForm() {
    const form = document.getElementById('professionalForm');
    
    // Resetear formulario HTML
    form.reset();
    
    // Remover imagen seleccionada
    removeSelectedImage();
    
    // Limpiar todos los errores
    const errorFields = form.querySelectorAll('.border-red-500');
    errorFields.forEach(field => {
        removeFieldError(field);
    });
    
    // Ocultar mensajes
    hideMessages();
    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('🔄 Formulario reiniciado');
}

// ==========================================
// FUNCIÓN: MOSTRAR MENSAJE DE ÉXITO
// ==========================================
function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==========================================
// FUNCIÓN: MOSTRAR MENSAJE DE ERROR
// ==========================================
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==========================================
// FUNCIÓN: OCULTAR MENSAJES
// ==========================================
function hideMessages() {
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
}

// ==========================================
// FUNCIÓN: SCROLL TO TOP (OPCIONAL)
// ==========================================
function initScrollToTop() {
    // Agregar botón de scroll to top si no existe
    let scrollBtn = document.getElementById('scrollToTopBtn');
    
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scrollToTopBtn';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.className = 'fixed bottom-6 right-6 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 opacity-0 pointer-events-none';
        scrollBtn.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(scrollBtn);
    }

    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            scrollBtn.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    // Click en el botón
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// FUNCIÓN: AUTOGUARDADO EN LOCALSTORAGE (OPCIONAL)
// Descomentar si deseas guardar progreso automáticamente
// ==========================================
/*
function initAutoSave() {
    const form = document.getElementById('professionalForm');
    const inputs = form.querySelectorAll('input:not([type="file"]), textarea');
    
    // Cargar datos guardados
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue && input.type !== 'file') {
            input.value = savedValue;
        }
    });
    
    // Guardar al cambiar
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            localStorage.setItem(`form_${this.name}`, this.value);
            console.log('💾 Progreso guardado');
        });
    });
}

// Limpiar localStorage al enviar exitosamente
function clearAutoSave() {
    const form = document.getElementById('professionalForm');
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        localStorage.removeItem(`form_${input.name}`);
    });
}
*/

// ==========================================
// MANEJO DE ERRORES GLOBAL
// ==========================================
window.addEventListener('error', function(e) {
    console.error('❌ Error capturado:', e.message);
});

// ==========================================
// LOG DE INICIALIZACIÓN
// ==========================================
console.log(`
╔══════════════════════════════════════════╗
║   FORMULARIO PROFESIONAL INICIALIZADO   ║
║         Versión 1.0 - 2024              ║
╚══════════════════════════════════════════╝

✅ Validación de formulario: Activa
✅ Upload de archivos: Activo
✅ Drag & Drop: Activo
✅ Validación en tiempo real: Activa
✅ Listo para enviar a webhook

📝 Nota: Recuerda configurar la URL del webhook en el HTML
   Busca: [YOUR_N8N_WEBHOOK_URL]
`);
