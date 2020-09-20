let favoritos = select("#favoritos");
let iconFav = "./assets/icon-fav-active.svg";
let favGrid = select("#resultados-busqueda");
// let loader = select("#loader");
let favContainer = select('.resultados-busqueda-contenedor');

showFavoritos();

function showFavoritos() {
  let favs = "";
  favGrid.innerHTML = "";
  let misFavoritos = JSON.parse(localStorage.getItem("favoritos"));

  if (misFavoritos != null && misFavoritos.length > 0) {
    // loader.style.display = "block";
    main.style.display = "block";
    for (let index = 0; index < misFavoritos.length; index++) {
      fetch(
        `https://api.giphy.com/v1/gifs/${misFavoritos[index]}?api_key=${APIKEY}`
      )
        .then((response) => response.json())
        .then((object) => {
          let resultados = object.data;

          if (index < 12) {
            favs += `
                <div class="grid-item" id="item_${misFavoritos[index]}">`;
          } else {
            favs += `
                <div class="grid-item oculto" id="item_${misFavoritos[index]}">`;
          }
          favs += `
                   <div class="resultados-gif-box">
      <div class="gif-acciones-resultados">
      <div class="iconos acciones-gif">
      <button title='${resultados.title}' img='${resultados.images.original.url}'
      id='${resultados.id}' class="iconos-acciones-box favorito btn-hover-fav" onclick="misFavoritos(this, false)">
      <img src="${iconFav}" alt="icon-favorito" id="icon-fav">
  </button>
  <button title='${resultados.title}' img='${resultados.images.original.url}'
  id='${resultados.id}' class="btn-hover-download iconos-acciones-box download" onclick="downloadGif(this)">
      <img src="./assets/icon-download.svg" alt="icon-download">
  </button>
  <button title='${resultados.title}' img='${resultados.images.original.url}'
  id='${resultados.id}' class="btn-hover-max iconos-acciones-box max" onclick="getOriginalGif(this)">
      <img src="./assets/icon-max.svg" alt="icon-max">
  </button>
      </div>
      <div class='textos-descripcion-gif-resultados'>
      <p>${resultados.username}</p>
      <p>${resultados.title}</p>
      </div>
      </div>
      <img src='${resultados.images.original.url}'/>
      </div>
      </div>`;
          favGrid.innerHTML = favs;
        })
        .then(() => {
          showVerMas(misFavoritos);
        })
        // .then(() => {
        //   loader.style.display = "none";
        // })
        .catch((err) => {
          console.error("ESTE ES EL ERROR DEL FETCH: ", err);
        });
    }
  } else {
    main.style.display = "none";
    favGrid.innerHTML = "";
  }
}

function showVerMas(misFavoritos) {
  if (misFavoritos.length > 12 && !select("#ver-mas")) {
    let btn = document.createElement('BUTTON');
    btn.innerHTML = "ver más";
    btn.id = 'ver-mas';          
    favContainer.append(btn);  
    ver_mas = select("#ver-mas");
    ver_mas.addEventListener("click", function (e) {
      mostrarMas();
    });
  }
}
function misFavoritos(element, carrouselOrModal) {
  let image = element.getElementsByTagName("img")[0];
  let imageSavedSvg = "./assets/icon-fav-active.svg";
  let imageUnsavedSvg = "./assets/icon-fav-hover.svg";

  let imageSavedPng = "./assets/icon-fav-active.png";
  let imageUnsavedPng = "./assets/icon-fav.png";
  let iconPngForCarrusel;
  let imageSaved;
  let imageUnsaved;

  if (carrouselOrModal) {
    image = element;
    imageSaved = imageSavedPng;
    imageUnsaved = imageUnsavedPng;
  } else {
    imageSaved = imageSavedSvg;
    imageUnsaved = imageUnsavedSvg;
  }
  let lista_favoritos = [];
  let favoritos = JSON.parse(localStorage.getItem("favoritos"));
  let id_gif = element.id;
  let title_gif = element.getAttribute("title");
  if (favoritos == null || favoritos.length == 0) {
    image.src = imageSaved;
    iconPngForCarrusel = imageSavedPng;

    lista_favoritos.push(id_gif);
    localStorage.setItem("favoritos", JSON.stringify(lista_favoritos));
  } else if (favoritos.includes(id_gif)) {
    image.src = imageUnsaved;
    iconPngForCarrusel = imageUnsavedPng;

    let nuevaLista = [];
    for (let i = 0; i < favoritos.length; i++) {
      if (id_gif != favoritos[i]) {
        nuevaLista.push(favoritos[i]);
      }
    }
    localStorage.setItem("favoritos", JSON.stringify(nuevaLista));
  } else {
    image.src = imageSaved;
    iconPngForCarrusel = imageSavedPng;
    favoritos.push(id_gif);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }
  let favImage = document.querySelectorAll(
    `.btn-hover-fav[title="${title_gif}"]`
  );
  for (let elem of favImage) {
    if (elem.getAttribute("src")) {
      elem.src = iconPngForCarrusel;
    } else {
      let img = elem.getElementsByTagName("img")[0];
      img.src = image.src;
    }
  }
  rearmarGrillaFavoritos(id_gif);
}
function rearmarGrillaFavoritos(idFav) {
  let favsHtml = "";
  fetch(`https://api.giphy.com/v1/gifs/${idFav}?api_key=${APIKEY}`)
    .then((response) => response.json())
    .then((object) => {
      let favoritos = JSON.parse(localStorage.getItem("favoritos"));
      let resultado = object.data;

      if (favoritos && favoritos.includes(idFav)) {
        if (favoritos.length < 12) {
          favsHtml += `
      <div class="grid-item" id="item_${idFav}">`;
        } else {
          favsHtml += `
      <div class="grid-item oculto" id="item_${idFav}">`;
        }
        favsHtml += `
 <div class="resultados-gif-box">
      <div class="gif-acciones-resultados">
      <div class="iconos acciones-gif">
      <button title='${resultado.title}' img='${resultado.images.original.url}'
      id='${resultado.id}' class="iconos-acciones-box favorito btn-hover-fav" onclick="misFavoritos(this, false)">
      <img src="${iconFav}" alt="icon-favorito" id="icon-fav">
  </button>
  <button title='${resultado.title}' img='${resultado.images.original.url}'
  id='${resultado.id}' class="btn-hover-download iconos-acciones-box download" onclick="downloadGif(this)">
      <img src="./assets/icon-download.svg" alt="icon-download">
  </button>
  <button title='${resultado.title}' img='${resultado.images.original.url}'
  id='${resultado.id}' class="btn-hover-max iconos-acciones-box max" onclick="getOriginalGif(this)">
      <img src="./assets/icon-max.svg" alt="icon-max">
  </button>
      </div>
      <div class='textos-descripcion-gif-resultados'>
      <h3>${resultado.username}</h3>
      <h4>${resultado.title}</h4>
      </div>
      </div>
      <img src='${resultado.images.original.url}'/>
      </div>
      </div>`;

        favGrid.innerHTML += favsHtml;
        main.style.display = "block";

        if (favoritos.length > 12 && !select("#ver-mas")) {
          let addVerMas = ` <button id="ver-mas">ver más</button>`;
          favGrid.innerHTML += addVerMas;
          ver_mas = select("#ver-mas");
          ver_mas.addEventListener("click", function (e) {
            mostrarMas();
          });
        } else if (favoritos.length <= 12) {
          esconderBoton();
        } else {
          ver_mas = select("#ver-mas");
          ver_mas.addEventListener("click", function (e) {
            mostrarMas();
          });
        }
      } else {
        select("#item_" + idFav).remove();
        if (favoritos.length < 12) {
          esconderBoton();
        }
      }
    });
}
