///variables grilla ///
let galeria_gifs = select("#resultados-busqueda");
let sin_resultados = select("#sin_resultados");
// let loader = select("#loader");
let misGifosContainer = select('.resultados-busqueda-contenedor');

showMisGifos()

function showMisGifos() {
    let gridItems = '';
  let misGifos = JSON.parse(localStorage.getItem("misGifos"));
    main.style.display = "block";
    if (misGifos != null && misGifos.length > 0) {
        // loader.style.display = "block";
      for (let index = 0; index < misGifos.length; index++) {
          fetch(`https://api.giphy.com/v1/gifs/${misGifos[index]}?api_key=${APIKEY}`)
          .then((response) => response.json())
          .then((object) => {
              if(index < 12){
                gridItems += `
                <div class="grid-item">`;
              }
             else {
                gridItems += `
                <div class="grid-item oculto">`;
             }
              gridItems += `
              <div class="resultados-gif-box">
      <div class="gif-acciones-resultados">
      <div class="iconos acciones-gif">
 <button title='${object.data.title}' img='${object.data.images.original.url}'
  id='${object.data.id}' class="btn-hover-download iconos-acciones-box download" onclick="removeGif(this)">
      <img src="./assets/icon-trash-normal.svg" alt="icon-remove">
  </button>
  <button title='${object.data.title}' img='${object.data.images.original.url}'
  id='${object.data.id}' class="btn-hover-download iconos-acciones-box download" onclick="downloadGif(this)">
      <img src="./assets/icon-download.svg" alt="icon-download">
  </button>
  <button title='${object.data.title}' img='${object.data.images.original.url}'
  id='${object.data.id}' class="btn-hover-max iconos-acciones-box max" onclick="getOriginalGifo(this)">
      <img src="./assets/icon-max.svg" alt="icon-max">
  </button>
      </div>
      <div class='textos-descripcion-gif-resultados'>
      <p>${object.data.username}</p>
      <p>${object.data.title}</p>
      </div>
      </div>
      <img src='${object.data.images.original.url}'/>
      </div>
      </div>`;
   
                galeria_gifs.innerHTML = gridItems;

        }).then( () => {
            showVerMas();
        }) 
        .catch((err) => {
          console.error("ESTE ES EL ERROR DEL FETCH: ", err);
        });
    }
  }
  else {
      gridItems += `
      <div class="animate-cointainer"><img class="sin-contenido" src='./assets/icon-mis-gifos-sin-contenido.svg'/>
      <p class="animate-txt">¡Anímate a crear tu primer GIFO!</p></div>

      `
      galeria_gifs.style.display = 'none';
      sin_resultados.style.display = 'block';
     sin_resultados.innerHTML = gridItems;
  }
}
function removeGif(element) {
    let misGifos = JSON.parse(localStorage.getItem("misGifos"));
    let nuevaLista = [];
    let id_gif = element.id;
    for (let i = 0; i < misGifos.length; i++) {
        if (id_gif != misGifos[i]) {
            nuevaLista.push(misGifos[i]);
        }
    }
    localStorage.setItem("misGifos", JSON.stringify(nuevaLista));
    showMisGifos();
}
function showVerMas (){
     let misGifos = JSON.parse(localStorage.getItem("misGifos"));
     if(misGifos.length > 12 && !select("#ver-mas")){
      let btn = document.createElement('BUTTON');
      btn.innerHTML = "ver más";
      btn.id = 'ver-mas';          
      misGifosContainer.append(btn);  
      ver_mas = select("#ver-mas");
      ver_mas.addEventListener("click", function (e) {
        mostrarMas();
      });
    }
    // loader.style.display = "none";
}
function getOriginalGifo(element) {
    let gif = element;
    return fetch(`http://api.giphy.com/v1/gifs/${gif.id}?api_key=${APIKEY}`)
        .then((response) => response.json())
        .then((object) => {
            showOriginalGifo(
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
function showOriginalGifo(url, username, title, id) {
    let modalContent = select('#pop-up')
    modalContent.innerHTML = `
    <div class="cover-all">
          <div class="gif-max-container">
                <img class='gif-max' src="${url}" alt="">
                <div class="data-bottom">
                <div class="data-left">
                <p>${username}</p>
                <p>${title}</p>
              </div>
                <div class="data-right">
<input type='image' title='${title}' img='${url}' id='${id}' class='btn-hover-download dwn-modal' src='./assets/icon-trash-normal.svg' onclick="removeGif(this)"> 
                <input type='image' title='${title}' img='${url}' id='${id}' class='btn-hover-download dwn-modal' src='./assets/icon-download.svg' onclick="downloadGif(this)"> 
              </div>
            </div>
            </div>
          </div>
        </div>`;
    modal.style.display = "block";
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