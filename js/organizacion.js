
// Evita aceptar campos que solamente tengan espacios.
function orgEstaVacio(texto) {
    let cantidad = 0;
    for (let i = 0; i < texto.length; i++) {
        if (texto.charAt(i) != " " && texto.charAt(i) != "\n" && texto.charAt(i) != "\t" && texto.charAt(i) != "\r") {
            cantidad++;
        }
    }
    return cantidad == 0;
}

// Validación sencilla del formato: no comprueba que el correo exista.
function orgCorreoValido(correo) {
    let arrobas = 0;
    let posicionArroba = -1;
    let posicionPunto = -1;
    let espacios = 0;
    for (let i = 0; i < correo.length; i++) {
        if (correo.charAt(i) == "@") {
            arrobas++;
            posicionArroba = i;
        }
        if (correo.charAt(i) == ".") {
            posicionPunto = i;
        }
        if (correo.charAt(i) == " " || correo.charAt(i) == "\t" || correo.charAt(i) == "\n" || correo.charAt(i) == "\r") {
            espacios++;
        }
    }
    return arrobas == 1 && posicionArroba > 0 && posicionPunto > posicionArroba + 1 && posicionPunto < correo.length - 1 && espacios == 0;
}

// Recorre los caracteres y comprueba que todos sean dígitos.
function orgSoloDigitos(texto) {
    if (orgEstaVacio(texto)) {
        return false;
    }
    for (let i = 0; i < texto.length; i++) {
        if (texto.charAt(i) < "0" || texto.charAt(i) > "9") {
            return false;
        }
    }
    return true;
}

// Los textos escritos por el usuario deben mostrarse como texto,
// aunque contengan símbolos de HTML. Se usa el mismo for de clase.
function orgTextoSeguro(texto) {
    let resultado = "";
    for (let i = 0; i < texto.length; i++) {
        if (texto.charAt(i) == "&") {
            resultado += "&amp;";
        } else if (texto.charAt(i) == "<") {
            resultado += "&lt;";
        } else if (texto.charAt(i) == ">") {
            resultado += "&gt;";
        } else if (texto.charAt(i) == '"') {
            resultado += "&quot;";
        } else if (texto.charAt(i) == "'") {
            resultado += "&#39;";
        } else {
            resultado += texto.charAt(i);
        }
    }
    return resultado;
}

function orgPublicarProyecto() {
    let nombre = document.getElementById("org-nombre-proyecto").value;
    let area = document.getElementById("org-area").value;
    let modalidad = document.getElementById("org-modalidad").value;
    let ubicacion = document.getElementById("org-ubicacion").value;
    let cupos = document.getElementById("org-cupos").value;
    let descripcion = document.getElementById("org-descripcion-proyecto").value;
    let actividades = document.getElementById("org-actividades").value;
    let requisitos = document.getElementById("org-requisitos").value;
    document.getElementById("org-resultado-publicacion").innerHTML = "";

    if (orgEstaVacio(nombre) || orgEstaVacio(area) || orgEstaVacio(modalidad) || orgEstaVacio(ubicacion) || orgEstaVacio(cupos) || orgEstaVacio(descripcion) || orgEstaVacio(actividades) || orgEstaVacio(requisitos)) {
        document.getElementById("org-mensaje-publicar").innerHTML = "Completá todos los campos del proyecto.";
    } else if (!orgSoloDigitos(cupos) || cupos < 1 || cupos > 10) {
        document.getElementById("org-mensaje-publicar").innerHTML = "Ingresá una cantidad entera entre 1 y 10 cupos.";
    } else {
        document.getElementById("org-mensaje-publicar").innerHTML = "Publicación simulada. Revisá la vista previa; todavía no se guarda en el listado de proyectos.";
        document.getElementById("org-resultado-publicacion").innerHTML = '<div class="org-mini-publicacion"><p class="etiqueta">VISTA PREVIA DEL PROYECTO</p><h3>' + orgTextoSeguro(nombre) + '</h3><p><strong>Área:</strong> ' + orgTextoSeguro(area) + '</p><p><strong>Modalidad:</strong> ' + orgTextoSeguro(modalidad) + '</p><p><strong>Ubicación:</strong> ' + orgTextoSeguro(ubicacion) + '</p><p><strong>Cupos:</strong> ' + orgTextoSeguro(cupos) + '</p><p><strong>Necesidad:</strong> ' + orgTextoSeguro(descripcion) + '</p><p><strong>Actividades:</strong> ' + orgTextoSeguro(actividades) + '</p><p><strong>Requisitos:</strong> ' + orgTextoSeguro(requisitos) + '</p></div>';
    }
}

// Todos los datos que se usan en esta tabla son ejemplos fijos.
function orgFilaPostulacion(nombre, carrera, proyecto, codigo) {
    return '<tr><th scope="row"><strong>' + nombre + '</strong><span class="org-secundario">' + carrera + '</span></th><td>' + proyecto + '</td><td><span class="org-estado">Pendiente</span></td><td><a class="org-enlace-tabla" href="organizacion-revision.html#postulante-' + codigo + '">Revisar postulación →</a></td></tr>';
}

function orgFiltrarPostulaciones() {
    let filtro = document.getElementById("org-filtro-proyecto").value;
    let filas = "";
    let cantidad = 0;
    if (filtro == "todos" || filtro == "inventario") {
        filas += orgFilaPostulacion("Lucía Mora", "Ingeniería en Sistemas", "Sistema de inventario solidario", "lucia");
        filas += orgFilaPostulacion("Daniel Solís", "Ingeniería Informática", "Sistema de inventario solidario", "daniel");
        cantidad += 2;
    }
    if (filtro == "todos" || filtro == "web") {
        filas += orgFilaPostulacion("Andrea Rojas", "Ingeniería en Sistemas", "Sitio web para nuestra comunidad", "andrea");
        cantidad++;
    }
    if (cantidad == 0) {
        filas = '<tr><td colspan="4"><div class="org-vacio">Este proyecto todavía no tiene postulaciones.</div></td></tr>';
    }
    document.getElementById("org-lista-postulaciones").innerHTML = filas;
    if (cantidad == 1) {
        document.getElementById("org-cantidad-postulaciones").innerHTML = "1 postulación para revisar.";
    } else {
        document.getElementById("org-cantidad-postulaciones").innerHTML = cantidad + " postulaciones para revisar.";
    }
}

function orgRegistrarDecision(codigo) {
    let decision = document.getElementById("org-decision-" + codigo).value;
    if (decision == "seleccionar") {
        document.getElementById("org-estado-" + codigo).innerHTML = '<span class="org-estado-aprobado">Seleccionado · falta aprobación universitaria</span>';
        document.getElementById("org-mensaje-" + codigo).innerHTML = "Selección simulada registrada en esta pantalla. El estudiante debe solicitar la aprobación a su universidad; el proyecto aún no está asignado.";
    } else if (decision == "no-seleccionar") {
        document.getElementById("org-estado-" + codigo).innerHTML = '<span class="org-estado-cerrado">No seleccionado</span>';
        document.getElementById("org-mensaje-" + codigo).innerHTML = "Decisión simulada registrada en esta pantalla. No se ha enviado ninguna notificación.";
    } else if (decision == "pendiente") {
        document.getElementById("org-estado-" + codigo).innerHTML = "Pendiente de revisión";
        document.getElementById("org-mensaje-" + codigo).innerHTML = "La postulación se mantiene pendiente de revisión en esta pantalla.";
    } else {
        document.getElementById("org-mensaje-" + codigo).innerHTML = "Seleccioná una decisión antes de registrarla.";
    }
}

function orgGuardarPerfil() {
    let nombre = document.getElementById("org-perfil-nombre").value;
    let tipo = document.getElementById("org-perfil-tipo").value;
    let encargado = document.getElementById("org-perfil-encargado").value;
    let correo = document.getElementById("org-perfil-correo").value;
    let telefono = document.getElementById("org-perfil-telefono").value;
    let direccion = document.getElementById("org-perfil-direccion").value;
    let descripcion = document.getElementById("org-perfil-descripcion").value;

    if (orgEstaVacio(nombre) || orgEstaVacio(tipo) || orgEstaVacio(encargado) || orgEstaVacio(correo) || orgEstaVacio(telefono) || orgEstaVacio(direccion) || orgEstaVacio(descripcion)) {
        document.getElementById("org-mensaje-perfil").innerHTML = "Completá todos los campos del perfil.";
    } else if (!orgCorreoValido(correo)) {
        document.getElementById("org-mensaje-perfil").innerHTML = "Revisá el formato del correo electrónico.";
    } else if (telefono.length != 8 || !orgSoloDigitos(telefono)) {
        document.getElementById("org-mensaje-perfil").innerHTML = "Ingresá un teléfono de 8 dígitos, sin espacios ni guiones.";
    } else {
        document.getElementById("org-vista-nombre").innerHTML = orgTextoSeguro(nombre);
        document.getElementById("org-vista-tipo").innerHTML = orgTextoSeguro(tipo);
        document.getElementById("org-vista-encargado").innerHTML = orgTextoSeguro(encargado);
        document.getElementById("org-vista-correo").innerHTML = orgTextoSeguro(correo);
        document.getElementById("org-vista-telefono").innerHTML = orgTextoSeguro(telefono);
        document.getElementById("org-vista-direccion").innerHTML = orgTextoSeguro(direccion);
        document.getElementById("org-vista-descripcion").innerHTML = orgTextoSeguro(descripcion);
        document.getElementById("org-mensaje-perfil").innerHTML = "Vista del perfil actualizada. Los cambios son temporales y se reinician al recargar o cambiar de página.";
    }
}

if (document.getElementById("org-boton-publicar") != null) {
    document.getElementById("org-boton-publicar").addEventListener("click", function() {
        orgPublicarProyecto();
    });
}
if (document.getElementById("org-filtro-proyecto") != null) {
    document.getElementById("org-filtro-proyecto").addEventListener("change", function() {
        orgFiltrarPostulaciones();
    });
}
if (document.getElementById("org-guardar-lucia") != null) {
    document.getElementById("org-guardar-lucia").addEventListener("click", function() {
        orgRegistrarDecision("lucia");
    });
    document.getElementById("org-guardar-daniel").addEventListener("click", function() {
        orgRegistrarDecision("daniel");
    });
    document.getElementById("org-guardar-andrea").addEventListener("click", function() {
        orgRegistrarDecision("andrea");
    });
}
if (document.getElementById("org-boton-perfil") != null) {
    document.getElementById("org-boton-perfil").addEventListener("click", function() {
        orgGuardarPerfil();
    });
}
