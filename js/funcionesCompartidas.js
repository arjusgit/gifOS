let ver_mas;
let divs_ocultos;
let primera_tanda;
let carrusel = select("#carrusel-container");
//// MODAL ////
let modal = document.getElementById("myModal");
// agarrar el span que cierra el modal
let span = document.getElementsByClassName("cerrar-modal")[0];
// clic en x para cerrar el modal
span.onclick = function () {
  modal.style.display = "none";
};
// cerrar el modal con clic en cualquier parte de la pantalla
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function esconderBoton() {
  if (select("#ver-mas")) {
    ver_mas = select("#ver-mas");
    ver_mas.remove();
  }
}

function mostrarMas() {
  divs_ocultos = document.querySelectorAll(".oculto");
  primera_tanda = Array.from(divs_ocultos).slice(0, 12);

  for (let i = 0; i < primera_tanda.length; i++) {
    primera_tanda[i].classList.remove("oculto");
    primera_tanda[i].classList.add("transition");
  }

  if (divs_ocultos.length <= 12) {
    esconderBoton();
  }
}
function getOriginalGif(element) {
  let gif = element;
  return fetch(`http://api.giphy.com/v1/gifs/${gif.id}?api_key=${APIKEY}`)
    .then((response) => response.json())
    .then((object) => {
      showOriginalGif(
        object.data.images.original.url,
        object.data.username,
        object.data.title,
        object.data.id
      );
    })
    .catch((err) => {
      console.error("ESTE ES EL ERROR DEL FETCH: ", err);
    });
}
function getTrending(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((object) => {
      gifs_carrusel(object);
    })
    .catch((err) => {
      console.error("ESTE ES EL ERROR DEL FETCH: ", err);
    });
}

getTrending(
  `https://api.giphy.com/v1/gifs/trending?api_key=${APIKEY}&limit=12`
);

function showOriginalGif(url, username, title, id) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos"));
  let fav_saved = "./assets/icon-fav-active.png";
  let fav_notSaved = "./assets/icon-fav.png";
  let iconFav;
  if (favoritos != null && favoritos.includes(id)) {
    iconFav = fav_saved;
  } else {
    iconFav = fav_notSaved;
  }
  let modalContent = select("#pop-up");
  modalContent.innerHTML = `
    <div class="cover-all">
          <div class="gif-max-container">
                <img class='gif-max' src="${url}" alt="">
                <div class="data-bottom">
                <div class="data-left">
                <p>${username}</p>
                <p class='data-title'>${title}</p>
              </div>
                <div class="data-right">
                <input type='image' title='${title}' img='${url}' id='${id}' class='btn-hover-fav fav-modal' src="${iconFav}" onclick="misFavoritos(this, true)">
                <input type='image' title='${title}' img='${url}' id='${id}' class='btn-hover-download dwn-modal' src='./assets/icon-download.svg' onclick="downloadGif(this)"> 
              </div>
            </div>
            </div>
          </div>
        </div>`;
  modal.style.display = "block";
}
function descargaGif() {
  let btn_download = document.querySelectorAll(".btn-hover-download");
  for (let btn of btn_download) {
    btn.addEventListener("click", () => {
      downloadGif(btn);
    });
  }
}

async function downloadGif(element) {
  let url = element.getAttribute("img");
  let title = element.getAttribute("title");
  let blob = await fetch(url).then((r) => r.blob());
  invokeSaveAsDialog(blob, title);
}
function gifs_carrusel(object) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos"));
  let fav_saved = "./assets/icon-fav-active.png";
  let fav_notSaved = "./assets/icon-fav.png";
  let iconFav;
  if (object) {
    let gifs = object.data;
    let concatenacion = "";
    for (let i = 0; i < gifs.length; i++) {
      let trending_Gifs = gifs[i];
      if (favoritos != null && favoritos.includes(trending_Gifs.id)) {
        iconFav = fav_saved;
      } else {
        iconFav = fav_notSaved;
      }
      concatenacion += `
      <div class="resultados-gif-box">
      <div class="gif-acciones-resultados">
      <div class="iconos acciones-gif">
      <button title='${trending_Gifs.title}' img='${trending_Gifs.images.original.url}'
      id='${trending_Gifs.id}' class="iconos-acciones-box favorito btn-hover-fav" onclick="misFavoritos(this, false)">
      <img src="./assets/icon-fav-hover.svg" alt="icon-favorito" id="icon-fav">
  </button>
  <button title='${trending_Gifs.title}' img='${trending_Gifs.images.original.url}'
  id='${trending_Gifs.id}' class="btn-hover-download iconos-acciones-box download" onclick="downloadGif(this)">
      <img src="./assets/icon-download.svg" alt="icon-download">
  </button>
  <button title='${trending_Gifs.title}' img='${trending_Gifs.images.original.url}'
  id='${trending_Gifs.id}' class="btn-hover-max iconos-acciones-box max" onclick="getOriginalGif(this)">
      <img src="./assets/icon-max.svg" alt="icon-max">
  </button>
      </div>
      <div class='textos-descripcion-gif-resultados'>
      <h3>${trending_Gifs.username}</h3>
      <p>${trending_Gifs.title}</p>
      </div>
      </div>
      <img src='${trending_Gifs.images.original.url}'/>
      </div>
      </div>`
 ;
    }
    carrusel.innerHTML = concatenacion;
  }
}
