// aplicación de gestión estudiantil //
// Se comunica con la API backend (index.js) y maneja:
// * Registro/consulta/eliminación de estudiantes
// * Gestión de carreras académicas
// * Administración de categorías 
// * Interfaz de usuario y navegación//
// Estructura:
// 1. Constantes y configuración
// 2. Servicios para estudiantes
// 3. Servicios para carreras
// 4. Servicios para categorías
// 5. Funciones de interfaz
// 6. Inicialización //

// CONSTANTES DECLARADAS: estas constantes son las direcciones URL que se encuentran en la API//
const API_STUDENTS_URL = "http://localhost:5001/api/students";
const API_CAREERS_URL = "http://localhost:5001/api/careers";
const API_CATEGORIES_URL = "http://localhost:5001/api/categories";
const API_KEY = "12345ABCDEF";

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};

// servicios para estudiantes (servicios que se comunican con la api)//
// Esta función asincrónica registra un nuevo estudiante en el sistema. //
// Recibe un objeto con los datos del estudiante y retorna una promesa que resuelve con la respuesta del servidor. //
async function registerStudentService(studentData) {
    const response = await fetch(API_STUDENTS_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(studentData)
    });
    return response.json();
}

// Esta función asincrónica obtiene los datos de un estudiante específico a partir de su ID//
// recibe el identicicador desde desde getstudenbyid() y realiza una peticion GET al edpoint que se encuentra en la api//
// retorna una promesa que resuelve con los datos del estudiante.//
async function getStudentByIdService(id) {
    const response = await fetch(`${API_STUDENTS_URL}/${id}`, { headers });
    return response.json();
}

// Esta función asincrónica obtiene una lista de estudiantes filtrados por carrera.//
// recibe los datos desde getStudentBycareer() y realiza una peticion GET al edpoint que se encuentra en la api.//
// retorna una promesa que resuelve con los datos de estudiantes registrados en esa carrera solicitada.//
async function getStudentsByCareerService(career) {
    const response = await fetch(`${API_STUDENTS_URL}?career=${encodeURIComponent(career)}`, { headers });
    return response.json();
}

// Esta función asincrónica elimina un estudiante del sistema utilizando su ID.//
// Recibe el identificador desde deleteStudent() y realiza una petición DELETE al endpoint que se encuentra en la api.//
// retorna una promesa que resuelve con el resultado de la operacion (exito o fracaso)//
async function deleteStudentService(id) {
    const response = await fetch(`${API_STUDENTS_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}
//.....SERVICIOS PARA CARRERAS.....// 

// Esta función asincrónica registra una nueva carrera//
// Recibe un objeto con los datos de la carrera y realiza una peticion POST al servidor//
// retorna una promesa con la respuesta de la api y lanza un error si falta algun campo requerido//
async function registerCareerService(careerData) {
    if (!careerData.code || !careerData.category) {
        throw new Error("Código y categoría son requeridos");
    }
    
    const response = await fetch(API_CAREERS_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(careerData)
    });
    return response.json();
}

// Esta función asincrónica obtiene todas las carreras registradas en el sistema.//
// no realiza una peticion GET a la api que retorna una promesa que resuelve en un la lista con las carreras caradas//
async function getAllCareersService() {
    try {
        const response = await fetch(API_CAREERS_URL, { headers });
        const data = await response.json();
        
        return data.map(career => ({
            id: career.id || Date.now().toString(),
            name: career.name || "Sin nombre",
            code: career.code || "SC-000",
            category: career.category || "General",
            duration: career.duration || 0
        }));
    } catch (error) {
        console.error("Error obteniendo carreras:", error);
        return [];
    }
}

// Esta función asincrónica elimina una carrera del sistema utilizando su ID//
// Recibe el identificador de la carrera y realiza una petición DELETE a la api//
// retornando una promesa de exito o fracaso segun la respuesta de la api//
async function deleteCareerService(id) {
    const response = await fetch(`${API_CAREERS_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}
// .....SERVICIOS PARA CATEGORÍAS..... //

// Esta función asincrónica registra una nueva categoría//
// recibe un objeto con los datos de la categoria y realiza una peticion post a la api//
// retorna una promesa con la respuesta que resive de la api//
async function registerCategoryService(categoryData) {
    const response = await fetch(API_CATEGORIES_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(categoryData)
    });
    return response.json();
}

// esta funcion obtiene las categorias cargadas//
// realiza una peticion GET a la api para obtener las categorias disponibles//
async function getAllCategoriesService() {
    const response = await fetch(API_CATEGORIES_URL, { headers });
    return response.json();
}

// Esta función asincrónica elimina una categoría del sistema utilizando su ID.//
// recibe el id de la categoria y realiza una peticion DELETE a la api retornando una promesa con la respuesta que esta da//
async function deleteCategoryService(id) {
    const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}

/* ========== FUNCIONES DE INTERFAZ - ESTUDIANTES ========== */

// Esta función maneja el registro de nuevos estudiantes
// Recoge los datos del formulario, valida campos obligatorios y muestra feedback al usuario
// Utiliza registerStudentService para enviar los datos al backend
async function registerStudent() {
    // Obtiene y prepara los datos del formulario
    const studentData = {
        name: document.getElementById('registerName').value.trim(),
        dni: document.getElementById('registerDNI').value.trim(),
        career: document.getElementById('registerCareer').value.trim(),
        age: document.getElementById('registerEdad').value.trim()
    };

    // Validación de campos requeridos
    if (!studentData.name || !studentData.career) {
        Swal.fire('Error', 'Por favor complete nombre y carrera', 'error');
        return;
    }

    try {
        // Llama al servicio de registro
        const result = await registerStudentService(studentData);
        // Muestra mensaje de éxito con datos del estudiante registrado
        Swal.fire('Éxito', `Estudiante ${result.student.name} registrado con ID: ${result.student.id}`, 'success');
        document.querySelector('form').reset(); // Limpia el formulario
    } catch (error) {
        Swal.fire('Error', 'No se pudo registrar el estudiante', 'error');
        console.error(error);
    }
}

// Esta función busca un estudiante por su ID y muestra los resultados
// Valida que se haya ingresado un ID antes de hacer la consulta
// Utiliza getStudentByIdService para obtener los datos del backend
async function getStudentById() {
    const id = document.getElementById('studentId').value.trim();
    
    if (!id) {
        Swal.fire('Error', 'Ingrese un ID válido', 'error');
        return;
    }

    try {
        // Obtiene los datos del estudiante
        const student = await getStudentByIdService(id);
        
        if (student.error) {
            Swal.fire('Error', student.error, 'error');
        } else {
            // Muestra los datos del estudiante en un formato legible
            Swal.fire({
                title: 'Estudiante encontrado',
                html: `ID: ${student.id}<br>Nombre: ${student.name}<br>Carrera: ${student.career}`,
                icon: 'success'
            });
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo obtener el estudiante', 'error');
        console.error(error);
    }
}

// Esta función busca estudiantes por carrera y muestra los resultados
// Valida que se haya ingresado una carrera antes de hacer la consulta
// Utiliza getStudentsByCareerService para obtener la lista de estudiantes
async function getStudentsByCareer() {
    const career = document.getElementById('careerFilter').value.trim();
    
    if (!career) {
        Swal.fire('Error', 'Ingrese una carrera para buscar', 'error');
        return;
    }

    try {
        // Obtiene la lista de estudiantes de la carrera especificada
        const students = await getStudentsByCareerService(career);
        
        if (students.length === 0) {
            Swal.fire('Info', 'No se encontraron estudiantes para esa carrera', 'info');
            return;
        }

        // Formatea la lista de estudiantes para mostrarla
        const studentsList = students.map(s => `
            • <strong>${s.name}</strong> (ID: ${s.id})<br>
            Carrera: ${s.career}<br>
            ${s.dni ? `DNI: ${s.dni}<br>` : ''}
        `).join('');

        // Muestra la lista de estudiantes encontrados
        Swal.fire({
            title: `Estudiantes en ${career}`,
            html: studentsList,
            icon: 'info'
        });
    } catch (error) {
        Swal.fire('Error', 'Error al buscar estudiantes', 'error');
        console.error(error);
    }
}

// Esta función maneja la eliminación de estudiantes con confirmación previa
// Valida que se haya ingresado un ID y muestra diálogo de confirmación
// Utiliza deleteStudentService para realizar la eliminación en el backend
async function deleteStudent() {
    const id = document.getElementById('deleteId').value.trim();
    
    if (!id) {
        Swal.fire('Error', 'Ingrese un ID válido', 'error');
        return;
    }

    try {
        // Muestra diálogo de confirmación
        const confirm = await Swal.fire({
            title: '¿Eliminar estudiante?',
            text: `Esta acción borrará al estudiante con ID ${id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            // Ejecuta la eliminación si el usuario confirma
            await deleteStudentService(id);
            Swal.fire('Éxito', `Estudiante con ID ${id} eliminado`, 'success');
            document.getElementById('deleteId').value = ''; // Limpia el campo
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el estudiante', 'error');
        console.error(error);
    }
}
/* ========== FUNCIONES DE INTERFAZ - CARRERAS ========== */

// Esta función maneja el registro de nuevas carreras académicas
// Recoge los datos del formulario, valida los campos requeridos y muestra feedback al usuario
// Utiliza registerCareerService para comunicarse con la API
async function registerCareer() {
    const careerData = {
        name: document.getElementById('careerName').value.trim(),
        category: document.getElementById('careerCategory').value.trim(),
        code: document.getElementById('careerCode').value.trim().toUpperCase(),
        duration: parseInt(document.getElementById('careerDuration').value) || 0
    };

    // Validación de campos requeridos
    const errors = [];
    if (!careerData.name) errors.push("Nombre es requerido");
    if (!careerData.category) errors.push("Categoría es requerida");
    if (!careerData.code) errors.push("Código es requerido");
    if (careerData.duration <= 0) errors.push("Duración debe ser mayor a 0");

    if (errors.length > 0) {
        Swal.fire('Error', errors.join('<br>'), 'error');
        return;
    }

    try {
        // Llamada al servicio de registro de carreras
        const result = await registerCareerService(careerData);
        Swal.fire('Éxito', `Carrera "${result.career.name}" registrada`, 'success');
        document.getElementById('careerForm').reset();
        loadCareersList(); // Actualiza la lista de carreras
    } catch (error) {
        Swal.fire('Error', error.message || 'Error al registrar carrera', 'error');
    }
}

// Esta función carga y muestra la lista de carreras disponibles
// Actualiza el contenedor UI con los datos obtenidos de getAllCareersService
// Maneja estados de carga, vacío y error
async function loadCareersList() {
    const listContainer = document.querySelector('#careersListContainer ul');
    listContainer.innerHTML = '<li class="list-group-item">Cargando carreras...</li>';

    try {
        const careers = await getAllCareersService();
        
        if (careers.length === 0) {
            listContainer.innerHTML = '<li class="list-group-item">No hay carreras registradas</li>';
            return;
        }

        // Genera el HTML para cada carrera con su información
        listContainer.innerHTML = careers.map(career => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="career-info">
                    <h5 class="mb-1">${career.name}</h5>
                    <div class="d-flex gap-3">
                        <small class="text-muted"><strong>Código:</strong> ${career.code}</small>
                        <small class="text-muted"><strong>Duración:</strong> ${career.duration} años</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-primary rounded-pill">${career.category}</span>
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="deleteCareer('${career.id}', '${career.name.replace("'", "\\'")}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
    } catch (error) {
        listContainer.innerHTML = '<li class="list-group-item text-danger">Error cargando carreras</li>';
        console.error("Error:", error);
    }
}

// Esta función maneja la eliminación de carreras con confirmación previa
// Recibe el ID y nombre de la carrera, muestra diálogo de confirmación
// Utiliza deleteCareerService para la operación y actualiza la lista
async function deleteCareer(careerId, careerName) {
    const confirm = await Swal.fire({
        title: '¿Eliminar carrera?',
        html: `Estás por eliminar la carrera:<br><strong>${careerName}</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
        try {
            await deleteCareerService(careerId);
            Swal.fire('Éxito', `Carrera "${careerName}" eliminada`, 'success');
            loadCareersList(); // Actualiza la lista después de eliminar
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar la carrera', 'error');
        }
    }
}

/* ========== FUNCIONES DE INTERFAZ - CATEGORÍAS ========== */

// Esta función maneja el registro de nuevas categorías
// Valida los campos requeridos y muestra feedback al usuario
// Utiliza registerCategoryService para comunicarse con la API
async function registerCategory() {
    const categoryData = {
        name: document.getElementById('categoryName').value.trim(),
        description: document.getElementById('categoryDescription').value.trim()
    };

    if (!categoryData.name) {
        Swal.fire('Error', 'El nombre de la categoría es requerido', 'error');
        return;
    }

    try {
        const result = await registerCategoryService(categoryData);
        Swal.fire('Éxito', `Categoría "${result.category.name}" registrada`, 'success');
        loadCategoriesList(); // Actualiza la lista de categorías
    } catch (error) {
        Swal.fire('Error', 'Error al registrar categoría', 'error');
        console.error(error);
    }
}

// Esta función carga y muestra la lista de categorías disponibles
// Actualiza el contenedor UI con los datos obtenidos de getAllCategoriesService
async function loadCategoriesList() {
    try {
        const categories = await getAllCategoriesService();
        const listContainer = document.querySelector('#categoriesListContainer ul');
        
        if (categories.length === 0) {
            listContainer.innerHTML = '<li class="list-group-item">No hay categorías registradas</li>';
            return;
        }

        // Genera el HTML para cada categoría con su información
        listContainer.innerHTML = categories.map(category => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${category.name}</strong>
                    ${category.description ? `<small class="d-block text-muted">${category.description}</small>` : ''}
                </div>
                <button class="btn btn-sm btn-outline-danger" 
                        onclick="deleteCategory('${category.id}', '${category.name.replace("'", "\\'")}')">
                    <i class="bi bi-trash"></i>
                </button>
            </li>
        `).join('');
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

// Esta función maneja la eliminación de categorías con confirmación previa
// Recibe el ID y nombre de la categoría, muestra diálogo de confirmación
// Utiliza deleteCategoryService para la operación y actualiza la lista
async function deleteCategory(categoryId, categoryName) {
    try {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar la categoría "${categoryName}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            await deleteCategoryService(categoryId);
            Swal.fire('Éxito', `Categoría "${categoryName}" eliminada`, 'success');
            loadCategoriesList(); // Actualiza la lista después de eliminar
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
        console.error(error);
    }
}

/* ========== FUNCIONES AUXILIARES ========== */

// Esta función carga las categorías disponibles en un elemento select
// Utilizado para poblar dropdowns en formularios
// Recibe el ID del elemento select a poblar
async function loadCategoriesIntoSelect(selectId) {
    try {
        const categories = await getAllCategoriesService();
        const select = document.getElementById(selectId);
        
        select.innerHTML = '<option value="" selected disabled>Seleccione Categoría</option>';
        
        // Añade cada categoría como opción en el select
        categories.forEach(category => {
            const option = new Option(category.name, category.name);
            select.add(option);
        });
    } catch (error) {
        console.error("Error cargando categorías en select:", error);
    }
}

// Esta función carga las carreras disponibles en un elemento select
// Utilizado para poblar dropdowns en formularios
// Recibe el ID del elemento select a poblar
async function loadCareersIntoSelect(selectId) {
    try {
        const careers = await getAllCareersService();
        const select = document.getElementById(selectId);
        
        // Limpia el select manteniendo la primera opción
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Añade cada carrera como opción en el select
        careers.forEach(career => {
            const option = new Option(career.name, career.name);
            select.add(option);
        });
    } catch (error) {
        console.error("Error cargando carreras en select:", error);
    }
}

/* ========== INICIALIZACIÓN ========== */

// Esta función inicializa la aplicación cuando el DOM está completamente cargado
// Configura los listeners y carga los datos iniciales necesarios
document.addEventListener('DOMContentLoaded', function() {
    // Carga listas según los contenedores presentes en la página
    if (document.getElementById('careersListContainer')) {
        loadCareersList();
    }
    
    if (document.getElementById('categoriesListContainer')) {
        loadCategoriesList();
    }
    
    // Pobla selects de carreras en formularios
    if (document.getElementById('registerCareer')) {
        loadCareersIntoSelect('registerCareer');
    }
    if (document.getElementById('careerFilter')) {
        loadCareersIntoSelect('careerFilter');
    }
    
    // Pobla selects de categorías en formularios
    if (document.getElementById('careerCategory')) {
        loadCategoriesIntoSelect('careerCategory');
    }
});

// Esta función maneja el efecto visual en la barra de navegación al hacer scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-glass');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});