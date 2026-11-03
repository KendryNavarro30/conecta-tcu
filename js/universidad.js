/* Conecta TCU - Funciones para las pantallas de la Persona 3.
   Demostración de interfaz: los datos se guardan solo en este navegador. */

var CLAVE_SOLICITUDES = 'conecta_tcu_solicitudes_persona3';
var CLAVE_PERFIL = 'conecta_tcu_universidad_persona3';
var CLAVE_ESTUDIANTE = 'conecta_tcu_correo_estudiante_persona3';

function datosEjemplo() {
    return [
        { id: 1, estudiante: 'Ana Ramírez', correo: 'ana@gmail.com', 
            universidad: 'Universidad Fidélitas', carrera: 'Ingeniería en Sistemas',
             proyecto: 'Sistema de inventario comunitario', organizacion: 'Asociación Manos Unidas',
              actividades: 'Crear una herramienta sencilla para registrar materiales y existencias.',
               horas: '150', documento: 'propuesta-ana.pdf', fecha: '28/10/2026', estado: 'Pendiente', observaciones: '' },
        { id: 2, estudiante: 'Max Zamora', correo: 'max@gmail.com',
             universidad: 'Universidad Fidélitas', carrera: 'Ingeniería en Sistemas',
              proyecto: 'Sitio web para una fundación', organizacion: 'Fundación Crecer',
               actividades: 'Diseñar un sitio web para mostrar las actividades de la fundación.',
                horas: '150', documento: 'propuesta-max.pdf', fecha: '26/10/2026', estado: 'Aprobada',
                 observaciones: 'La propuesta cumple con lo solicitado.' },
        { id: 3, estudiante: 'Amber Navarro', correo: 'amber@gmail.com',
             universidad: 'Universidad Fidélitas', carrera: 'Ingeniería en Sistemas',
              proyecto: 'Registro de voluntariado', organizacion: 'Comunidad Verde',
               actividades: 'Organizar un registro digital de personas voluntarias.',
                horas: '120', documento: 'propuesta-amber.pdf', fecha: '24/10/2026',
                 estado: 'Rechazada', observaciones: 'Se necesita ampliar la descripción de las actividades.' }
    ];
}

function obtenerSolicitudes() {
    var guardadas = localStorage.getItem(CLAVE_SOLICITUDES);
    if (guardadas === null) {
        var ejemplos = datosEjemplo();
        localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(ejemplos));
        return ejemplos;
    }
    try {
        var resultado = JSON.parse(guardadas);
        if (Array.isArray(resultado)) { return resultado; }
    } catch (error) { /* Si los datos no se pueden leer, se usa una lista vacía. */ }
    return [];
}

function guardarSolicitudes(solicitudes) {
    localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes));
}

function obtenerPerfil() {
    var guardado = localStorage.getItem(CLAVE_PERFIL);
    if (guardado !== null) {
        try { return JSON.parse(guardado); } catch (error) { /* Se utiliza el perfil inicial. */ }
    }
    return {
        nombre: 'Universidad Fidélitas',
        encargado: 'Coordinación de TCU',
        correo: 'tcu@gmail.com',
        telefono: '0000-0000',
        sede: 'San José, Costa Rica'
    };
}

function mostrarMensaje(id, texto, tipo) {
    var elemento = document.getElementById(id);
    if (!elemento) { return; }
    elemento.textContent = texto;
    elemento.className = 'mensaje ' + tipo;
}

function crearElemento(etiqueta, texto, clase) {
    var elemento = document.createElement(etiqueta);
    if (texto !== undefined && texto !== null) { elemento.textContent = texto; }
    if (clase) { elemento.className = clase; }
    return elemento;
}

function crearEstado(estado) {
    var clase = 'estado-pendiente';
    if (estado === 'Aprobada') { clase = 'estado-aprobada'; }
    if (estado === 'Rechazada') { clase = 'estado-rechazada'; }
    return crearElemento('span', estado, 'estado ' + clase);
}

function agregarDetalle(lista, titulo, valor, completo) {
    var bloque = crearElemento('div');
    if (completo) { bloque.className = 'fila-entera'; }
    bloque.appendChild(crearElemento('dt', titulo));
    bloque.appendChild(crearElemento('dd', valor || 'No indicado'));
    lista.appendChild(bloque);
}

function solicitudesDeUniversidad() {
    var todas = obtenerSolicitudes();
    var nombre = obtenerPerfil().nombre;
    var filtradas = [];
    for (var i = 0; i < todas.length; i++) {
        if (todas[i].universidad === nombre) { filtradas.push(todas[i]); }
    }
    return filtradas;
}

function iniciarSolicitud() {
    var formulario = document.getElementById('formularioSolicitud');
    var correoAnterior = localStorage.getItem(CLAVE_ESTUDIANTE);
    if (correoAnterior) { document.getElementById('correo').value = correoAnterior; }

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        var solicitudes = obtenerSolicitudes();
        var siguienteId = 1;
        for (var i = 0; i < solicitudes.length; i++) {
            if (solicitudes[i].id >= siguienteId) { siguienteId = solicitudes[i].id + 1; }
        }
        var archivos = document.getElementById('documento').files;
        var nombresArchivos = [];
        for (var j = 0; j < archivos.length; j++) { nombresArchivos.push(archivos[j].name); }
        var nueva = {
            id: siguienteId,
            estudiante: document.getElementById('estudiante').value.trim(),
            correo: document.getElementById('correo').value.trim().toLowerCase(),
            universidad: document.getElementById('universidad').value,
            carrera: document.getElementById('carrera').value.trim(),
            proyecto: document.getElementById('proyecto').value.trim(),
            organizacion: document.getElementById('organizacion').value.trim(),
            actividades: document.getElementById('actividades').value.trim(),
            horas: document.getElementById('horas').value,
            documento: nombresArchivos.length > 0 ? nombresArchivos.join(', ') : 'No adjuntado',
            fecha: new Date().toLocaleDateString('es-CR'),
            estado: 'Pendiente',
            observaciones: ''
        };
        solicitudes.unshift(nueva);
        guardarSolicitudes(solicitudes);
        localStorage.setItem(CLAVE_ESTUDIANTE, nueva.correo);
        mostrarMensaje('mensajeSolicitud', '¡Solicitud enviada! Se registró con el número #' + nueva.id + '. Puedes consultar su estado con tu correo.', 'exito');
        formulario.reset();
        document.getElementById('verEstado').classList.remove('oculto');
        document.getElementById('verEstado').focus();
    });
}

function mostrarEstadoEstudiante() {
    var correo = document.getElementById('buscarCorreo').value.trim().toLowerCase();
    var contenedor = document.getElementById('resultadoEstado');
    contenedor.innerHTML = '';
    if (!correo) {
        contenedor.appendChild(crearElemento('p', 'Escribe tu correo para consultar tus solicitudes.', 'resumen'));
        return;
    }
    localStorage.setItem(CLAVE_ESTUDIANTE, correo);
    var todas = obtenerSolicitudes();
    var cantidad = 0;
    for (var i = 0; i < todas.length; i++) {
        var solicitud = todas[i];
        if (solicitud.correo.toLowerCase() !== correo) { continue; }
        cantidad++;
        var tarjeta = crearElemento('article', '', 'solicitud-tarjeta');
        var cabecera = crearElemento('div', '', 'solicitud-cabecera');
        cabecera.appendChild(crearElemento('h3', solicitud.proyecto));
        cabecera.appendChild(crearEstado(solicitud.estado));
        tarjeta.appendChild(cabecera);
        tarjeta.appendChild(crearElemento('p', 'Solicitud #' + solicitud.id + ' · ' + solicitud.universidad + ' · ' + solicitud.fecha));
        tarjeta.appendChild(crearElemento('p', 'Organización: ' + solicitud.organizacion));
        tarjeta.appendChild(crearElemento('strong', 'Observaciones de la universidad:'));
        tarjeta.appendChild(crearElemento('p', solicitud.observaciones || 'Todavía no hay observaciones.'));
        contenedor.appendChild(tarjeta);
    }
    if (cantidad === 0) {
        contenedor.appendChild(crearElemento('p', 'No se encontraron solicitudes para ese correo. Verifica que sea el mismo que utilizaste en el formulario.', 'resumen'));
    }
}

function iniciarEstado() {
    var correo = localStorage.getItem(CLAVE_ESTUDIANTE);
    if (correo) {
        document.getElementById('buscarCorreo').value = correo;
        mostrarEstadoEstudiante();
    }
    document.getElementById('formularioConsulta').addEventListener('submit', function(evento) {
        evento.preventDefault();
        mostrarEstadoEstudiante();
    });
}

function crearFila(solicitud, cuerpo) {
    var fila = crearElemento('tr');
    var valores = [ '#' + solicitud.id, solicitud.estudiante, solicitud.proyecto, solicitud.fecha ];
    for (var j = 0; j < valores.length; j++) {
        fila.appendChild(crearElemento('td', valores[j]));
    }
    var celdaEstado = crearElemento('td');
    celdaEstado.appendChild(crearEstado(solicitud.estado));
    fila.appendChild(celdaEstado);
    var celdaEnlace = crearElemento('td');
    var enlace = crearElemento('a', 'Revisar', 'boton boton-azul boton-pequeno');
    enlace.href = 'universidad-revision.html?id=' + solicitud.id;
    celdaEnlace.appendChild(enlace);
    fila.appendChild(celdaEnlace);
    cuerpo.appendChild(fila);
}

function iniciarPanel() {
    var perfil = obtenerPerfil();
    document.getElementById('nombreUniversidad').textContent = perfil.nombre;
    var solicitudes = solicitudesDeUniversidad();
    var pendientes = 0;
    var aprobadas = 0;
    var rechazadas = 0;
    for (var i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].estado === 'Pendiente') { pendientes++; }
        if (solicitudes[i].estado === 'Aprobada') { aprobadas++; }
        if (solicitudes[i].estado === 'Rechazada') { rechazadas++; }
    }
    document.getElementById('total').textContent = solicitudes.length;
    document.getElementById('pendientes').textContent = pendientes;
    document.getElementById('aprobadas').textContent = aprobadas;
    document.getElementById('rechazadas').textContent = rechazadas;
    var cuerpo = document.getElementById('tablaPanel');
    if (solicitudes.length === 0) {
        document.getElementById('panelVacio').classList.remove('oculto');
    }
    for (var j = 0; j < solicitudes.length && j < 5; j++) { crearFila(solicitudes[j], cuerpo); }
}

function dibujarSolicitudes() {
    var solicitudes = solicitudesDeUniversidad();
    var busqueda = document.getElementById('filtroTexto').value.toLowerCase().trim();
    var estado = document.getElementById('filtroEstado').value;
    var cuerpo = document.getElementById('tablaSolicitudes');
    cuerpo.innerHTML = '';
    var cantidad = 0;
    for (var i = 0; i < solicitudes.length; i++) {
        var actual = solicitudes[i];
        var texto = (actual.estudiante + ' ' + actual.proyecto + ' ' + actual.organizacion).toLowerCase();
        if (busqueda && texto.indexOf(busqueda) === -1) { continue; }
        if (estado !== 'Todas' && actual.estado !== estado) { continue; }
        crearFila(actual, cuerpo);
        cantidad++;
    }
    document.getElementById('cantidadResultados').textContent = cantidad + ' solicitud(es) encontrada(s).';
    document.getElementById('tablaVacia').className = cantidad === 0 ? 'mensaje info' : 'oculto';
}

function iniciarListado() {
    document.getElementById('universidadListado').textContent = obtenerPerfil().nombre;
    document.getElementById('filtroTexto').addEventListener('input', dibujarSolicitudes);
    document.getElementById('filtroEstado').addEventListener('change', dibujarSolicitudes);
    dibujarSolicitudes();
}

function iniciarRevision() {
    var parametros = new URLSearchParams(window.location.search);
    var id = Number(parametros.get('id'));
    var solicitudes = obtenerSolicitudes();
    var solicitud = null;
    for (var i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].id === id && solicitudes[i].universidad === obtenerPerfil().nombre) {
            solicitud = solicitudes[i];
        }
    }
    if (!solicitud) {
        document.getElementById('revisionNoEncontrada').classList.remove('oculto');
        document.getElementById('contenidoRevision').classList.add('oculto');
        return;
    }
    var lista = document.getElementById('detallesSolicitud');
    agregarDetalle(lista, 'Número de solicitud', '#' + solicitud.id);
    agregarDetalle(lista, 'Fecha', solicitud.fecha);
    agregarDetalle(lista, 'Estudiante', solicitud.estudiante);
    agregarDetalle(lista, 'Correo', solicitud.correo);
    agregarDetalle(lista, 'Universidad', solicitud.universidad);
    agregarDetalle(lista, 'Carrera', solicitud.carrera);
    agregarDetalle(lista, 'Proyecto', solicitud.proyecto);
    agregarDetalle(lista, 'Organización', solicitud.organizacion);
    agregarDetalle(lista, 'Horas estimadas', solicitud.horas + ' horas');
    agregarDetalle(lista, 'Documentos indicados', solicitud.documento);
    agregarDetalle(lista, 'Actividades propuestas', solicitud.actividades, true);
    agregarDetalle(lista, 'Observaciones actuales', solicitud.observaciones || 'Sin observaciones', true);
    document.getElementById('estadoRevision').appendChild(crearEstado(solicitud.estado));
    document.getElementById('observaciones').value = solicitud.observaciones || '';

    document.getElementById('aprobar').addEventListener('click', function() {
        guardarDecision('Aprobada');
    });
    document.getElementById('rechazar').addEventListener('click', function() {
        guardarDecision('Rechazada');
    });

    function guardarDecision(estado) {
        var observaciones = document.getElementById('observaciones').value.trim();
        if (estado === 'Rechazada' && observaciones === '') {
            mostrarMensaje('mensajeRevision', 'Para rechazar una solicitud debes indicar el motivo.', 'error');
            document.getElementById('observaciones').focus();
            return;
        }
        if (solicitud.estado !== 'Pendiente' && solicitud.estado !== estado) {
            if (!confirm('Esta solicitud ya tiene una decisión. ¿Quieres cambiarla?')) { return; }
        }
        solicitud.estado = estado;
        solicitud.observaciones = observaciones;
        guardarSolicitudes(solicitudes);
        document.getElementById('estadoRevision').innerHTML = '';
        document.getElementById('estadoRevision').appendChild(crearEstado(estado));
        mostrarMensaje('mensajeRevision', 'Solicitud #' + solicitud.id + ' marcada como ' + estado.toLowerCase() + '. La decisión aparecerá en la pantalla de estado del estudiante.', 'exito');
    }
}

function iniciarPerfil() {
    var formulario = document.getElementById('formularioPerfil');
    var perfil = obtenerPerfil();
    document.getElementById('nombre').value = perfil.nombre;
    document.getElementById('encargado').value = perfil.encargado;
    document.getElementById('correoInstitucional').value = perfil.correo;
    document.getElementById('telefono').value = perfil.telefono;
    document.getElementById('sede').value = perfil.sede;
    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        var nuevoPerfil = {
            nombre: document.getElementById('nombre').value.trim(),
            encargado: document.getElementById('encargado').value.trim(),
            correo: document.getElementById('correoInstitucional').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            sede: document.getElementById('sede').value.trim()
        };
        localStorage.setItem(CLAVE_PERFIL, JSON.stringify(nuevoPerfil));
        mostrarMensaje('mensajePerfil', 'Los datos de la universidad se guardaron correctamente en este navegador.', 'exito');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var pagina = document.body.getAttribute('data-pagina');
    if (pagina === 'solicitud') { iniciarSolicitud(); }
    if (pagina === 'estado') { iniciarEstado(); }
    if (pagina === 'panel') { iniciarPanel(); }
    if (pagina === 'listado') { iniciarListado(); }
    if (pagina === 'revision') { iniciarRevision(); }
    if (pagina === 'perfil') { iniciarPerfil(); }
});
