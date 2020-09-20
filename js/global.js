let APIKEY = "SphHGffcRaT0SrwLU8MIF1N6c5MMHt3B";
let darkMode = localStorage.getItem("darkMode");
const modo = select("#switch");
let navbarHamb = select(".navbar-container");
let navbar = localStorage.getItem("navbar");
let windowsize = window.innerWidth;
let logosmall = select("#logo-small");
let logobig = select("#logo-big");
let crearGifo = select(".crear-gifo-light");
let crearTitle = select(".crearTitle");
let hamburguesa = document.getElementById("hambu-icon");
let main = select(".main");
let cerrar = select("#cerrarHamb");
let videoContainer = select(".video-container");
let pelicula = select(".pelicula");
let camara = select('#camara-ilustracion');
let colorlinks = select(".navbar-link");
let compartir = select("#compartir");
let copyright = select(".copyright-txt");

if (darkMode == "enabled") {
  document.body.classList.toggle("dark");
  modoNocturno();
} else {
  modoDiurno();
}

modo.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.getElementById("body").className.indexOf("dark")) {
    modoDiurno();
  } else {
    modoNocturno();
  }
});

window.onresize = () => {
  windowsize = window.innerWidth;

  if (darkMode != "enabled") {
    if (windowsize < 768) {
      navbarHamb.style.backgroundColor = "rgb(87,46,229)";
    } else {
      navbarHamb.style.backgroundColor = "transparent";
    }
  } else {
    if (windowsize < 768) {
      navbarHamb.style.backgroundColor = "rgb(0, 0, 0)";
    } else {
      navbarHamb.style.backgroundColor = "transparent";
    }
  }
};

function modoDiurno() {
  logosmall.src = "./assets/logo-mobile.png";
  logobig.src = "./assets/logo-desktop.png";
  if(pelicula){
    pelicula.src = "./assets/pelicula.svg";
  }
  if(camara){
    camara.src = "./assets/camara.svg";
  }
  modo.innerHTML = "Modo Nocturno";
  compartir.style.color = "black";
  copyright.style.color = "black";

  hamburguesa.style.color = "#572EE5";
  if (select("#buscador")) {
    select("#buscador").style.color = "#37383C";
  }
  if (select("#iconlupa")) {
    select("#iconlupa").style.color = "#572EE5";
  }
  if (select("#txt-trending")) {
    select("#txt-trending").style.color = "#572EE5";
  }
  crearGifo.classList.remove("crear-gifo-dark");
  crearGifo.classList.add("crear-gifo-light");
  if (windowsize < 768) {
    navbarHamb.style.backgroundColor = "rgb(87,46,229)";
  } else {
    navbarHamb.style.backgroundColor = "transparent";
  }
  close.src = "./assets/close.png";
  cerrar.src = "./assets/close.png";
  for (let i = 0; i < colorlinks.length; i++) {
    colorlinks[i].classList.remove("navbar-dark");
    colorlinks[i].classList.add("navbar-light");
  }
  localStorage.setItem("darkMode", null);
  darkMode = localStorage.getItem("darkMode");
}

////////////////////////

function modoNocturno() {
  logosmall.src = "./assets/logo-mobile-dark.png";
  logobig.src = "./assets/logo-desktop-modo-noc.png";
  if(pelicula){
    pelicula.src = "./assets/pelicula-modo-noc.svg";
  }
  if(camara){
    camara.src = "./assets/camara-modo-noc.svg";
  }
  modo.innerHTML = "Modo Diurno";
  hamburguesa.style.color = "white";
  compartir.style.color = "white";
  copyright.style.color = "white";

  if (select("#buscador")) {
    select("#buscador").style.color = "white";
  }
  if (select("#iconlupa")) {
    select("#iconlupa").style.color = "white";
  }
  if (select("#txt-trending")) {
    select("#txt-trending").style.color = "white";
  }
  crearGifo.classList.add("crear-gifo-dark");
  crearGifo.classList.remove("crear-gifo-light");
  if (windowsize < 768) {
    navbarHamb.style.backgroundColor = "rgb(0, 0, 0)";
  } else {
    navbarHamb.style.background = "transparent";
  }

  close.src = "./assets/close-dark.png";
  cerrar.src = "./assets/close-dark-white.png";
  for (let i = 0; i < colorlinks.length; i++) {
    colorlinks[i].classList.remove("navbar-light");
    colorlinks[i].classList.add("navbar-dark");
  }
  localStorage.setItem("darkMode", "enabled");
  darkMode = localStorage.getItem("darkMode");
}

function select(clase) {
  let valores;
  if (clase[0] == ".") {
    clase = clase.substr(1);
    let objetosEncontrados = document.getElementsByClassName(clase);
    valores = objetosEncontrados[0];
  } else if (clase[0] == "#") {
    clase = clase.substr(1);
    valores = document.getElementById(clase);
  }

  return valores;
}
