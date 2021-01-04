const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const paginacionDiv = document.querySelector('#paginacion')
const registrosPorPagina = 40
let totalPaginas
let iterador
let paginaActual



//registrar el submit para el formulario
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e) {
    e.preventDefault()

    const terminoBusqueda = document.querySelector('#termino').value

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de busqueda')
        return
    }
    buscarImagenes()
    terminoBusqueda.remove(textContent)
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100')
    if (!existeAlerta) {
        const alerta = document.createElement('p')
        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center")

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:incline">${mensaje}</span>
        `

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000)
    }
}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value
        //API key
    const key = '19767362-b39066c6e90bfcf69242a1b92'
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`

    fetch(url)
        .then(respuesta => respuesta.json()) //retorna todo como json (la api esta en json)
        .then(resultado => {
            console.log(resultado)
            totalPaginas = calcularPaginas(resultado.totalHits)
            console.log(totalPaginas)
            mostrarImagenes(resultado.hits)
        })
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina))
}

function mostrarImagenes(imagenes) {
    //Si hay resultados previos de una busqueda anterior los borra
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

    //Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
            const { previewURL, likes, views, largeImageURL } = imagen //previewURL es el enlace para ver la imagen

            resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold">${likes}<span class="font-light"> likes</span></p>
                    <p class="font-bold">${views}<span class="font-light"> views</span></p>
                    <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Full image</a>
                </div>
            </div>
        </div>
        `
        })
        //Limpiar el paginador previo
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    //generamos nuevo html
    imprimirPaginador()
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas)
    while (true) {
        const { value, done } = iterador.next()
            //si termina (llega al done) sale del while
        if (done) return
            //caso contrario genera un boton por cada elemento en el generador
        const boton = document.createElement('a')
        boton.href = '#'
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded')

        boton.onclick = () => {
            paginaActual = value
            buscarImagenes()
        }

        paginacionDiv.appendChild(boton)
    }
}