const buscarProyecto = document.getElementById("buscarProyecto");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroModalidad = document.getElementById("filtroModalidad");
const contadorProyectos = document.getElementById("contadorProyectos");
const proyectos = document.querySelectorAll(".tarjeta-proyecto");


function filtrarProyectos() {

    const textoBusqueda = buscarProyecto.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

   
    const categoriaSeleccionada = filtroCategoria.value;
    const modalidadSeleccionada = filtroModalidad.value;


    let cantidadEncontrada = 0;
    
    proyectos.forEach(function (proyecto) {

        const contenido = proyecto.textContent
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const categoria = proyecto.dataset.categoria;
        const modalidad = proyecto.dataset.modalidad;

        const coincideTexto = contenido.includes(textoBusqueda);
        const coincideCategoria = categoriaSeleccionada === "" ||
            categoria === categoriaSeleccionada;
        const coincideModalidad = modalidadSeleccionada === "" ||
            modalidad === modalidadSeleccionada;

        if (coincideTexto && coincideCategoria && coincideModalidad) {
            proyecto.parentElement.style.display = "";
            cantidadEncontrada++;
        } else {
            proyecto.parentElement.style.display = "none";
        }

    });

    contadorProyectos.textContent = cantidadEncontrada +
        (cantidadEncontrada === 1
            ? " proyecto disponible"
            : " proyectos disponibles");

}


buscarProyecto.addEventListener("input", filtrarProyectos);

filtroCategoria.addEventListener("change", filtrarProyectos);

filtroModalidad.addEventListener("change", filtrarProyectos);