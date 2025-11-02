import { db } from '../config/firebaseConfig.js';
import { getDatabase ,onValue, ref as refS, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { cloudinaryConfig } from '../config/cloudinaryConfig.js';

var numSerie = 0;
var marca = "";
var modelo = "";
var descripcion = "";
var urlImag = "";

function leerInputs() {
    numSerie = document.getElementById('txtNumSerie').value;
    marca = document.getElementById('txtMarca').value;
    modelo = document.getElementById('txtModelo').value;
    descripcion = document.getElementById('txtDescripcion').value;
    urlImag = document.getElementById('txtUrl').value;
}

function mostrarMensaje(mensaje) {
    var mensajeElement = document.getElementById('mensaje');
    mensajeElement.textContent = mensaje;
    mensajeElement.style.display = 'block';
    setTimeout(() => {
        mensajeElement.style.display = 'none';
    }, 1000);
}

function insertarProducto() {
    alert("Ingrese a add db");
    leerInputs();

    // validar
    if (numSerie === "" || marca === "" || modelo === "" || descripcion === "") {
        mostrarMensaje("Faltaron datos por capturar");
        return;
    }

    // funcion de Firebase para agregar registro
    set(refS(db, 'Automoviles/' + numSerie),
        {
            /*
            realizar json con los campos y datos de la tabla
            campo:valor
            */
            numSerie: numSerie,
            marca: marca,
            modelo: modelo,
            descripcion: descripcion,
            urlImag: urlImag
        })
        .then(() => {
            alert("Se agrego con exito");
            Listarproductos();
            limpiarInputs();
        })
        .catch((error) => {
            alert("Ocurrio un error");
        });
}


// // codifica ek boton de buscar
// // agregar kas siguientes funciones

function limpiarInputs() {
    document.getElementById('txtNumSerie').value = '';
    document.getElementById('txtModelo').value = '';
    document.getElementById('txtMarca').value = '';
    document.getElementById('txtDescripcion').value = '';
    document.getElementById('txtUrl').value = '';
}

function escribirInputs() {
    document.getElementById('txtModelo').value = modelo;
    document.getElementById('txtMarca').value = marca;
    document.getElementById('txtDescripcion').value = descripcion;
    document.getElementById('txtUrl').value = urlImag;
}

// --- Funciones CRUD ---

function buscarProducto() {
    // Nota: 'numSerie' no está en leerInputs() para evitar sobreescribir las globales
    let NumSerie = document.getElementById('txtNumSerie').value.trim(); 
    if (NumSerie === "") {
        mostrarMensaje("No se ingresó Num Serie");
        return;
    }

    const dbref = refS(db); // refS(db) es correcto para la referencia base
    // Usamos get(child()) para una única consulta. 'refS' es el alias correcto.
    get(child(dbref, 'Automoviles/' + NumSerie)).then((snapshot) => {
        if (snapshot.exists()) {
            // Asigna los valores a las variables globales y a los inputs del formulario
            numSerie = NumSerie; // Actualizar la global numSerie con el valor buscado
            marca = snapshot.val().marca;
            modelo = snapshot.val().modelo;
            descripcion = snapshot.val().descripcion;
            urlImag = snapshot.val().urlImag;
            
            escribirInputs();
        } else {
            limpiarInputs();
            mostrarMensaje("El producto con código " + NumSerie + " no existe.");
        }
    });
}

// Se agrego la funcion actualizar
function actualizarAutomovil() {
    leerInputs(); // Obtiene los valores de todos los inputs, incluyendo numSerie

    if (numSerie === "" || marca === "" || modelo === "" || descripcion === "") {
        mostrarMensaje("Favor de capturar toda la información.");
        return;
    }

    alert("actualizar");
    // 'refS' es el alias correcto para la función de referencia
    update(refS(db, 'Automoviles/' + numSerie), {
        numSerie: numSerie,
        marca: marca,
        modelo: modelo,
        descripcion: descripcion,
        urlImag: urlImag
    }).then(() => {
        mostrarMensaje("Se actualizó con éxito.");
        limpiarInputs();
        Listarproductos();
    }).catch((error) => {
        mostrarMensaje("Ocurrió un error: " + error);
    });
    // Se llama a Listarproductos() fuera del then/catch en el código original, 
    // pero es más seguro llamarlo solo después de una operación exitosa o fallida.
}

function eliminarAutomovil() {
    let NumSerie = document.getElementById('txtNumSerie').value.trim();
    if (NumSerie === "") {
        mostrarMensaje("No se ingresó un Código válido.");
        return;
    }

    const dbref = refS(db);
    // 1. Verificar si existe
    get(child(dbref, 'Automoviles/' + NumSerie)).then((snapshot) => {
        if (snapshot.exists()) {
            // 2. Si existe, eliminar
            remove(refS(db, 'Automoviles/' + NumSerie))
                .then(() => {
                    mostrarMensaje("Producto eliminado con éxito.");
                    limpiarInputs();
                    Listarproductos();
                })
                .catch((error) => {
                    mostrarMensaje("Ocurrió un error al eliminar el producto: " + error);
                });
        } else {
            // 3. Si no existe, notificar
            limpiarInputs();
            mostrarMensaje("El producto con ID " + NumSerie + " no existe.");
        }
    });

    // Se llama a Listarproductos() fuera del then/catch en el código original.
    // Es más limpio y seguro manejarlo dentro de las promesas.
}


// --- Listar Productos ---

function Listarproductos() {
    // 'refS' es el alias correcto para la función de referencia
    const dbRef = refS(db, 'Automoviles');
    const tabla = document.getElementById('tablaProductos');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de rellenar

    // onValue es para escuchar cambios en tiempo real. 
    // { onlyOnce: true } asegura que solo se lea una vez.
    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const data = childSnapshot.val();

            var fila = document.createElement('tr');
            
            // Columna Serie (Key)
            var celdaCodigo = document.createElement('td');
            celdaCodigo.textContent = childKey;
            fila.appendChild(celdaCodigo);

            // Columna Marca
            var celdaNombre = document.createElement('td');
            celdaNombre.textContent = data.marca;
            fila.appendChild(celdaNombre);

            // Columna Modelo
            var celdaPrecio = document.createElement('td'); // Nombre de variable 'celdaPrecio' vs contenido 'modelo'
            celdaPrecio.textContent = data.modelo;
            fila.appendChild(celdaPrecio);

            // Columna Descripción
            var celdaCantidad = document.createElement('td'); // Nombre de variable 'celdaCantidad' vs contenido 'descripcion'
            celdaCantidad.textContent = data.descripcion;
            fila.appendChild(celdaCantidad);

            // Columna Imagen
            var celdaImagen = document.createElement('td');
            var imagen = document.createElement('img');
            imagen.src = data.urlImag;
            imagen.width = 100;
            celdaImagen.appendChild(imagen);
            fila.appendChild(celdaImagen);

            tbody.appendChild(fila);
        });
    }, { onlyOnce: true }); // Se agregó { onlyOnce: true } para que solo se ejecute al inicio
}

const storageService = {
    // Inicializar el widget de carga de Cloudinary
    initUploadWidget(callback) {
        return cloudinary.createUploadWidget(cloudinaryConfig, (error, result) => {
            if (!error && result && result.event === "success") {
                callback({ 
                    success: true, 
                    url: result.info.secure_url,
                    message: 'Imagen subida correctamente'
                });
            } else if (error) {
                console.error('Error al subir la imagen:', error);
                callback({ 
                    success: false, 
                    message: 'Error al subir la imagen' 
                });
            }
        });
    },

    // Subir imagen directamente (alternativa al widget)
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                { method: 'POST', body: formData }
            );
            const data = await response.json();
            return { 
                success: true, 
                url: data.secure_url,
                message: 'Imagen subida correctamente'
            };
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            return { 
                success: false, 
                message: 'Error al subir la imagen' 
            };
        }
    }
};

// Inicialización del widget de Cloudinary
const initCloudinaryWidget = (imageInput, uploadButton) => {
    const widget = storageService.initUploadWidget((result) => {
        if (result.success) {
            txtUrl.value = result.url;
            showMessage('mensaje', result.message);
        } else {
            showMessage('mensaje', result.message, true);
        }
    });

    uploadButton.addEventListener('click', () => widget.open());

    // Manejo alternativo para el input de tipo file
    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            const result = await storageService.uploadImage(file);
            if (result.success) {
                txtUrl.value = result.url;
                showMessage('mensaje', result.message);
            } else {
                showMessage('mensaje', result.message, true);
            }
        }
    });
};



export { leerInputs, mostrarMensaje, insertarProducto, limpiarInputs, escribirInputs, buscarProducto, actualizarAutomovil, eliminarAutomovil, Listarproductos, initCloudinaryWidget };