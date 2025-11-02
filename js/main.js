import { insertarProducto, buscarProducto, actualizarAutomovil, eliminarAutomovil, Listarproductos, initCloudinaryWidget } from './functions/functions.js';


const btnAgregar = document.getElementById('btnAgregar');
btnAgregar.addEventListener('click', insertarProducto);

const btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', buscarProducto);

const btnActualizar = document.getElementById('btnActualizar');
btnActualizar.addEventListener('click', actualizarAutomovil);

const btnBorrar = document.getElementById('btnBorrar');
btnBorrar.addEventListener('click', eliminarAutomovil);

const imageInput = document.getElementById('imageInput');
const uploadButton = document.getElementById('uploadButton');

document.addEventListener('DOMContentLoaded', Listarproductos);

initCloudinaryWidget(imageInput, uploadButton);