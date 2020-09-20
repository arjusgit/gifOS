let camInicio = select("#cam-comenzar");
let camGrabar = select("#cam-grabar");
let camFinalizar = select("#cam-finalizar");
let crearNuevo = select("#crear-nuevo");
let upload = select("#gif-upload");
let boton1 = select("#boton1");
let boton2 = select("#boton2");
let boton3 = select("#boton3");
let gifoContainer = select(".banner-text");
const constraints = { audio: false, video: { height: 320, width: 480 } };
let stream, recorder;
let video = select("#gif-video");
let formData = new FormData();
let repetir = select("#repetir");
let loader = select("#overlay-video");
let loaderParrafo = select("#overlay-video-parrafo");
let loaderIcon = select("#overlay-video-icon");
let contadorContainer = select(".contador-container");
let iconosAcciones = select("#iconos-acciones");
let downloadBtn = select("#download-btn");
let linkBtn = select("#link-btn");


repetir.addEventListener("click", () => {
  repetirCaptura();
});

camInicio.addEventListener("click", () => {
  gifoContainer.innerHTML = `
   <h1>¿Nos das acceso a tu cámara?</h1>
   <p>El acceso a tu cámara será válido solo</p>
   <p>por el tiempo en el que estés creando el GIFO.</p>
   `;
  boton1.classList.remove("botones-numeros");
  boton1.classList.add("botones-numeros-activos");
  camInicio.style.display = "none";
  activarCamara();
});
crearNuevo.addEventListener("click", () => {
  loader.style.display = "none";
  crearNuevo.style.display = "none";
  video.style.display = 'none';
  boton3.classList.add("botones-numeros");
  boton3.classList.remove("botones-numeros-activos");
  camInicio.click();
});
camGrabar.addEventListener("click", () => {
  camFinalizar.style.display = "block";
  camGrabar.style.display = "none";
  recorder.startRecording();
    let comienzo = new Date().getTime();
    let contadorTiempo = document.createElement('div');
    contadorTiempo.id = 'contador';
    contadorContainer.appendChild(contadorTiempo);

  (function looper() {
      contadorTiempo.innerText = armarTimer((new Date().getTime() - comienzo) / 1000);
      setTimeout(looper, 1000);
  })();
});

camFinalizar.addEventListener("click", () => {
  finalizar();
});

upload.addEventListener("click", () => {
  repetir.style.display = "none";
  upload.style.display = "none";
  boton2.classList.remove("botones-numeros-activos");
  boton2.classList.add("botones-numeros");
  boton3.classList.remove("botones-numeros");
  boton3.classList.add("botones-numeros-activos");
  subirGif();
});

function activarCamara() {
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    recorder = RecordRTC(stream, {
      type: "gif",
      frameRate: 1,
      quality: 10,
      width: 360,
      hidden: 240,
      onGifRecordingStarted: function () {
        console.log("started");   },
    });
    video.style.display = "block";
    video.srcObject = stream;
    video.play();
    gifoContainer.innerHTML = "";
    boton1.classList.remove("botones-numeros-activos");
    boton1.classList.add("botones-numeros");
    boton2.classList.remove("botones-numeros");
    boton2.classList.add("botones-numeros-activos");
    camGrabar.style.display = "block";

  });
}
function armarTimer(segundosTranscurridos) {
  let horas = Math.floor(segundosTranscurridos / 3600);
  let minutos = Math.floor((segundosTranscurridos - (horas * 3600)) / 60);
  let segundos = Math.floor(segundosTranscurridos - (horas * 3600) - (minutos * 60));
  if (minutos < 10) {
      minutos = "0" + minutos;
  }
  if (segundos < 10) {
      segundos = "0" + segundos;
  }
  return horas + ":" + minutos + ":" + segundos;
}
async function finalizar() {
  camFinalizar.style.display = "none";
  upload.style.display = "block";
  // const sleep = (m) => new Promise((r) => setTimeout(r, m));
  // await sleep(3000);
   select("#contador").remove();
  
  repetir.style.display = "block";
  recorder.stopRecording(() => {
    let blob = recorder.getBlob();
    formData.append("file", blob, "migifo.gif");
    // formData.append("api_key", APIKEY);
  });
}
function repetirCaptura() {
    repetir.style.display = "none";
    upload.style.display = "none";
    camGrabar.click();
}
async function subirGif() {
  loaderParrafo.innerHTML = "Estamos subiendo tu GIFO";
  loaderIcon.src = "./assets/loader.svg";
  iconosAcciones.style.display = "none";
  loader.style.display = "flex";
  fetch(`https://upload.giphy.com/v1/gifs?api_key=${APIKEY}`, {
    method: "POST",
    body: formData
  })
    .then(data => {
      return data.json();
    })
    .then(object => {
      let misGifos = JSON.parse(localStorage.getItem("misGifos"));
      if (misGifos == null) {
        misGifos = [];
        misGifos.push(object.data.id);
      } else {
        misGifos.push(object.data.id);
      }
      localStorage.setItem("misGifos", JSON.stringify(misGifos));
      loaderParrafo.innerHTML = "GIFO subido con éxito";
      loaderIcon.src = "./assets/check.svg";
      iconosAcciones.style.display = "flex";
      crearNuevo.style.display = "block";

      fetch(`https://api.giphy.com/v1/gifs/${object.data.id}?api_key=${APIKEY}`)
          .then((response) => response.json())
          .then((object) => { 
            downloadBtn.setAttribute("img",object.data.images.original.url);
            downloadBtn.setAttribute("title",object.data.title);
            linkBtn.setAttribute("img",object.data.images.original.url);
          });
    })
    .catch((err) => console.log(err));
}
async function downloadGif(element){
  let url = element.getAttribute("img");
  let title = element.getAttribute("title");
  let blob = await fetch(url).then((r) => r.blob());
  invokeSaveAsDialog(blob, title);
}
function copyLink(element) {
  let el = document.createElement('textarea');
  el.value = element.getAttribute("img");
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
