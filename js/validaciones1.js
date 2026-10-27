// CONECTA TCU - JAVASCRIPT 
function estaVacio(texto) {
    let cantidad = 0;

    for (let i = 0; i < texto.length; i++) {
        if (texto.charAt(i) != " ") {
            cantidad = cantidad + 1;
        }
    }

    return cantidad == 0;
}

// Revisión sencilla del formato del correo usando un ciclo for.
// Se busca una arroba y un punto después de ella, sin espacios.
function correoValido(correo) {
    let arrobas = 0;
    let posicionArroba = -1;
    let posicionPunto = -1;
    let espacios = 0;

    for (let i = 0; i < correo.length; i++) {
        if (correo.charAt(i) == "@") {
            arrobas = arrobas + 1;
            posicionArroba = i;
        }

        if (correo.charAt(i) == ".") {
            posicionPunto = i;
        }

        if (correo.charAt(i) == " ") {
            espacios = espacios + 1;
        }
    }

    if (arrobas == 1 && posicionArroba > 0 &&
        posicionPunto > posicionArroba + 1 &&
        posicionPunto < correo.length - 1 && espacios == 0) {
        return true;
    } else {
        return false;
    }
}

function validarRegistro() {
    let nombre = document.getElementById("nombre").value;
    let apellidos = document.getElementById("apellidos").value;
    let correo = document.getElementById("correo-registro").value;
    let universidad = document.getElementById("universidad").value;
    let clave = document.getElementById("clave-registro").value;
    let confirmar = document.getElementById("confirmar-clave").value;

    if (estaVacio(nombre) || estaVacio(apellidos) || estaVacio(correo) ||
        estaVacio(universidad) || estaVacio(clave) || estaVacio(confirmar)) {
        document.getElementById("mensaje-registro").innerHTML = "Completa todos los campos. No se permiten campos que tengan solo espacios.";
    } else if (correoValido(correo) == false) {
        document.getElementById("mensaje-registro").innerHTML = "Revisa el correo. Debe tener una arroba, un dominio con punto y no debe contener espacios.";
    } else if (clave.length < 8) {
        document.getElementById("mensaje-registro").innerHTML = "La contraseña debe tener al menos 8 caracteres.";
    } else if (clave != confirmar) {
        document.getElementById("mensaje-registro").innerHTML = "Las contraseñas no coinciden. Revisa ambos campos.";
    } else {
        document.getElementById("mensaje-registro").innerHTML = "Formulario completo. Esta demostración no crea una cuenta ni guarda tus datos.";
    }
}

// Cambia la explicación del acceso al seleccionar un perfil.
function actualizarPerfil() {
    let perfil = document.getElementById("perfil").value;

    if (perfil == "estudiante") {
        document.getElementById("aviso-perfil").innerHTML = "Estudiante: utiliza los datos de tu cuenta. Si todavía no tienes una, puedes registrarte.";
    } else if (perfil == "organizacion") {
        document.getElementById("aviso-perfil").innerHTML = "Organización: utiliza el usuario y la contraseña asignados previamente a tu encargado.";
    } else if (perfil == "universidad") {
        document.getElementById("aviso-perfil").innerHTML = "Universidad: utiliza el usuario y la contraseña asignados previamente al encargado universitario.";
    } else {
        document.getElementById("aviso-perfil").innerHTML = "Selecciona el perfil con el que vas a ingresar.";
    }

    document.getElementById("mensaje-ingreso").innerHTML = "";
}

// Comprueba que el formulario tenga datos; no autentica usuarios.
function validarIngreso() {
    let perfil = document.getElementById("perfil").value;
    let usuario = document.getElementById("usuario").value;
    let clave = document.getElementById("clave-ingreso").value;

    if (perfil != "estudiante" && perfil != "organizacion" && perfil != "universidad") {
        document.getElementById("mensaje-ingreso").innerHTML = "Selecciona uno de los tres perfiles disponibles.";
    } else if (estaVacio(usuario) || estaVacio(clave)) {
        document.getElementById("mensaje-ingreso").innerHTML = "Completa el usuario y la contraseña. Los campos no pueden contener solo espacios.";
    } else {
        document.getElementById("mensaje-ingreso").innerHTML = "Formulario completo. Esta demostración no verifica cuentas reales ni inicia una sesión.";
    }
}
