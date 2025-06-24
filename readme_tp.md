Prompts utilizados
Modelos usados:

ChatGPT

DeepSeek

Prompts destacados:

“Analiza este error y dime las causas y las posibles soluciones.”

“Analiza como si fueras un programador experto y explícame cómo funciona este bloque de código.”

“Analiza estos tres archivos que te pasé y decime cómo hago para que me guarde las nuevas carreras que se registran correctamente en el archivo career.json.”

“Posiciónate como un programador profesional y analizá estos códigos, luego explícame el flujo y cómo están declaradas las funciones.”

“Analiza este código y cambia todos los alert por SweetAlert.”

Comentarios sobre el uso:

ChatGPT brindó explicaciones detalladas, sugirió múltiples causas de errores y ofreció soluciones claras. Fue útil para comprender el flujo y funcionamiento del código.

DeepSeek resultó efectivo para detectar y corregir problemas de forma técnica y directa, aunque requiere un lenguaje de consulta más específico

Resumen del flujo del código
HTML (Interfaz con formularios o botones)

Eventos (onclick, etc.)

Funciones secundarias (recolección/validación de datos)

Funciones de servicios (comunicación con la API)

API (procesamiento y modificación de datos en JSON)

Respuesta

Actualización visual o alerta

<!-- COMO FUNCIONA A NIVEL FLUJO -->
<!-- 1. El usuario completa el formulario en `index.html` (campos: `registerName`, `registerCareer`, etc.) -->
<!-- 2. Al hacer clic en el botón, se dispara el evento `onclick` que llama a la función `registerStudent()` en `app.js`. -->
<!-- 3. Esta función recolecta los datos y llama a `registerStudentService()`. -->
<!-- 4. `registerStudentService()` realiza una petición POST a `/api/students` enviando los datos. -->
<!-- 5. La API (archivo `index.js`) procesa la solicitud y guarda la información en `students.json`. -->
<!-- 6. Se recibe una respuesta desde la API. -->
<!-- 7. Se muestra un mensaje de éxito o error mediante `Swal.fire()`. -->
