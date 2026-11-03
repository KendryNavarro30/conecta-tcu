const botonEditarPerfil = document.getElementById("botonEditarPerfil");
const formularioEdicion = document.getElementById("formularioEdicion");

const nombrePerfil = document.getElementById("nombre-perfil");
const apellidosPerfil = document.getElementById("apellidos-perfil");
const correoPerfil = document.getElementById("correo-perfil");
const universidadPerfil = document.getElementById("universidad-perfil");

botonEditarPerfil.addEventListener("click", function () {
    formularioEdicion.style.display = "block";
});


const botonGuardarPerfil = document.getElementById("botonGuardarPerfil");

botonGuardarPerfil.addEventListener("click", function() {

    document.getElementById("mostrarNombre").textContent = nombrePerfil.value;
    document.getElementById("mostrarApellidos").textContent = apellidosPerfil.value;
    document.getElementById("mostrarCorreo").textContent = correoPerfil.value;
    document.getElementById("mostrarUniversidad").textContent = universidadPerfil.value;

    formularioEdicion.style.display = "none";

});