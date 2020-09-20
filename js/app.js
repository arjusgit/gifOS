//KEY API : SphHGffcRaT0SrwLU8MIF1N6c5MMHt3B

//VARIABLES///
let favoritos = select("#favoritos");
let lupa = select("#iconlupa");
let linklupa = select("#lupa");
let close = select("#close");
let borrar = select("#borrar");
let buscador = select("#buscador");
let buscador_container = select(".resultados-busqueda-contenedor");
let busqueda;
let trendings = select("#txt-trending");
let listaSugerencias = select("#sugerencias");
let separador = select(".divider-search");

let galeria_gifs = select("#resultados-busqueda");

let divider = select(".divider");
let titulo_resultados = select("#titulo-main");

getTrendingsTxt();

borrar.addEventListener("click", () => {
  buscador.value = "";
  lupa.style.left = "initial";
  close.style.display = "none";
  main.style.display = "none";
  listaSugerencias.innerHTML = "";
  separador.style.display = "none";
  listaSugerencias.style.paddingBottom = "0px";
  lupa.style.color = "rgb(87,46,229)";
  if (darkMode == "enabled") {
    lupa.style.color = "white";
  }
});

function getTrendingsTxt() {
  return fetch(`https://api.giphy.com/v1/trending/searches?api_key=${APIKEY}`)
    .then((response) => response.json())
    .then((object) => {
      showTrendingsTxt(object.data);
    })
    .catch((err) => {
      console.error("ESTE ES EL ERROR DEL FETCH: ", err);
    });
}

////////////////Muestra los trendings///////////////////

function showTrendingsTxt(data) {
  let resultados = "";
  for (let i = 0; i < 5; i++) {
    let liTrending = document.createElement("li");
    liTrending.classList.add("trendingItem");
    if (i === 4) {
      liTrending.innerHTML = data[i];
    } else {
      liTrending.innerHTML = `${data[i]}`;
    }
    trendings.appendChild(liTrending);
  }
  let listaTrending = document.querySelectorAll(".trendingItem");
  for (li of listaTrending) {
    li.addEventListener("click", (e) => {
      buscador.value = e.target.innerHTML;
      getData();
      main.style.display = "block";
    });
  }
}

function sugerencias() {
  busqueda = buscador.value;
  if (busqueda.length > 0) {
    return fetch(
      `https://api.giphy.com/v1/tags/related/${busqueda}?api_key=${APIKEY}&limit=5&rating=g`
    )
      .then((response) => response.json())
      .then((object) => {
        showSugerencias(object.data);
      })
      .catch((err) => {
        console.error("ERROR DEL FETCH ==> ", err);
      });
  } else {
    listaSugerencias.innerHTML = "";
    listaSugerencias.style.paddingBottom = "0px";
  }
}

function showSugerencias(resultados) {
  if (resultados.length > 0) {
    listaSugerencias.innerHTML = `
      <li class="item"><i class="fas fa-search lupalista" aria-hidden="true"></i>${resultados[0].name}</li>
      <li class="item"><i class="fas fa-search lupalista" aria-hidden="true"></i>${resultados[1].name}</li>
      <li class="item"><i class="fas fa-search lupalista" aria-hidden="true"></i>${resultados[2].name}</li>
      <li class="item"><i class="fas fa-search lupalista" aria-hidden="true"></i>${resultados[3].name}</li>
      `;
    listaSugerencias.style.paddingBottom = "16px";
  } else {
    listaSugerencias.innerHTML = "";
    listaSugerencias.style.paddingBottom = "0px";
  }
}

//busca con ENTER //

buscador.addEventListener("keyup", function (e) {
  if (buscador.value != "") {
    if (e.key === "Enter") {
      getData();
      main.style.display = "block";
    } else {
      inicioBusqueda();
      sugerencias();
    }
  } else {
    titulo_resultados.innerHTML = "";
    galeria_gifs.style.display = "none";
    divider.style.display = "none";
  }
});

//mueve iconos del input al iniciar el tipeo para buscar //

function inicioBusqueda() {
  let borraTrendSugerencias = select("#trending-sugerencias");
  lupa.style.left = "0";
  lupa.style.color = "#9CAFC3";
  close.style.display = "inline-block";
  separador.style.display = "block";
  if (buscador.value == "") {
    lupa.style.left = "initial";
    main.style.display = "none";
    separador.style.display = "none";

    if (darkMode != "enabled") {
      lupa.style.color = "#572EE5";
    } else {
      lupa.style.color = "white";
    }
    close.style.display = "none";
    borraTrendSugerencias.style.display = "block";
  }
}

listaSugerencias.addEventListener("click", function (e) {
  buscador.value = e.target.textContent;

  listaSugerencias.innerHTML = "";
  listaSugerencias.style.paddingBottom = "0px";
  separador.style.display = "none";
});

linklupa.addEventListener("click", function (e) {
  getData();
  main.style.display = "block";
});

function getData() {
  return fetch(
    `https://api.giphy.com/v1/gifs/search?q=${buscador.value}&api_key=${APIKEY}&limit=60`
  )
    .then((response) => response.json())
    .then((object) => {
      grillaResultados(object.data);
    })
    .catch((err) => {
      console.error("ESTE ES EL ERROR DEL FETCH: ", err);
    });
}

function grillaResultados(resultados) {
  let concatenacion = "";
  let sinResultados = select("#sin_resultados");
  let favoritos = JSON.parse(localStorage.getItem("favoritos"));
  let fav_saved = "./assets/icon-fav-active.svg";
  let fav_notSaved = "./assets/icon-fav-hover.svg";
  let iconFav;
  if (resultados.length == 0) {
    titulo_resultados.innerHTML = `No hay resultados que coincidan con "${buscador.value}"`;
    galeria_gifs.style.display = "none";
    concatenacion += `
    <img id="ouch" src="./assets/icon-busqueda-sin-resultado.png">
    <h4 id="otra-busqueda">Por favor, intenta con otra búsqueda</h4>
    `;
    listaSugerencias.innerHTML = "";
    listaSugerencias.style.paddingBottom = "0px";
    sinResultados.innerHTML = concatenacion;
    sinResultados.style.display = "block";
    separador.style.display = "none";
  } else {
    titulo_resultados.innerHTML = buscador.value;
    sinResultados.style.display = "none";

    for (let i = 0; i < resultados.length; i++) {
      if (favoritos != null && favoritos.includes(resultados[i].id)) {
        iconFav = fav_saved;
      } else {
        iconFav = fav_notSaved;
      }
      if (i < 12) {
        concatenacion += `
      <div class="grid-item">`;
      } else if (i < 60) {
        concatenacion += `
      <div class="grid-item oculto">`;
      }
      concatenacion += `
      
      <div class="resultados-gif-box">
      <div class="gif-acciones-resultados">
      <div class="iconos acciones-gif">
      <button title='${resultados[i].title}' img='${resultados[i].images.original.url}'
      id='${resultados[i].id}' class="iconos-acciones-box favorito btn-hover-fav" onclick="misFavoritos(this, false)">
      <img src="${iconFav}" alt="icon-favorito" id="icon-fav">
  </button>
  <button title='${resultados[i].title}' img='${resultados[i].images.original.url}'
  id='${resultados[i].id}' class="btn-hover-download iconos-acciones-box download" onclick="downloadGif(this)">
      <img src="./assets/icon-download.svg" alt="icon-download">
  </button>
  <button title='${resultados[i].title}' img='${resultados[i].images.original.url}'
  id='${resultados[i].id}' class="btn-hover-max iconos-acciones-box max" onclick="getOriginalGif(this)">
      <img src="./assets/icon-max.svg" alt="icon-max">
  </button>
      </div>
      <div class='textos-descripcion-gif-resultados'>
      <h3>${resultados[i].username}</h3>
      <p>${resultados[i].title}</p>
      </div>
      </div>
      <img src='${resultados[i].images.original.url}'/>
      </div>
      </div>`
    }
    galeria_gifs.innerHTML = concatenacion;
    
    if (resultados.length > 12 && !select("#ver-mas")) {
      let btn = document.createElement('BUTTON');
      btn.innerHTML = "ver más";
      btn.id = 'ver-mas';          
      buscador_container.append(btn);  
      ver_mas = select("#ver-mas");
      ver_mas.addEventListener("click", function (e) {
        mostrarMas();
      });
    } 
  }
}
function misFavoritos(element, carrouselOrModal){
    let image = element.getElementsByTagName('img')[0];
    let imageSaved = "./assets/icon-fav-active.svg";
    let imageUnsaved = "./assets/icon-fav-hover.svg";
    if (carrouselOrModal) {
        image = element;
        imageSaved = "./assets/icon-fav-active.png";
        imageUnsaved = "./assets/icon-fav.png";
    }
    let lista_favoritos = [];
    let favoritos = JSON.parse(localStorage.getItem("favoritos"));
    let id_gif = element.id;
    let title_gif = element.getAttribute('title');
    if (favoritos == null || favoritos.length == 0) {
        image.src = imageSaved;      
        lista_favoritos.push(id_gif);
        localStorage.setItem("favoritos", JSON.stringify(lista_favoritos));
    } else if (favoritos.includes(id_gif)) {
        image.src = imageUnsaved;
        let nuevaLista = [];
        for (let i = 0; i < favoritos.length; i++) {
            if (id_gif != favoritos[i]) {
                nuevaLista.push(favoritos[i]);
            }
        }
        localStorage.setItem("favoritos", JSON.stringify(nuevaLista));
    } else {
        image.src = imageSaved;
        favoritos.push(id_gif);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }
    let favImage = document.querySelectorAll(`.btn-hover-fav[title="${title_gif}"]`);
    for (let elem of favImage) {
        if (elem.getAttribute('src')) {
            elem.src = image.src;
        }
        else {
            let img = elem.getElementsByTagName('img')[0];
            img.src = image.src;
        }
    }
}


