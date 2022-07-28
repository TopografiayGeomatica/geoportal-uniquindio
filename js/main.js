// 11: Scripts que Cambia las propiedades 
// para Mostrar y Ocultar el Menu en dispositivos Moviles

// identificar el elemento mediante el ID links-nav-sig
var linksNav = document.getElementById("links-nav-sig")

// ejecutar funcion de acuerdo al icono selecionado
function MostrarMenu(){
    linksNav.style.right = "0px";
};
function OcultarMenu (){
    linksNav.style.right = "-250px"
}