var styles;

var map;

const https=require('https');



function myMap() {
    var mapProp= {
      center:new google.maps.LatLng(-38.7167,-62.2833),
      zoom:13,
      mapTypeControl:false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

function inicializar(){
  setearEstilo();
  cargaDeLocales();
}


function inicializarPuntaje(){
  setearEstiloPuntaje();
  var seleccionado=consultarSeleccionado();
  cargarImagenes(seleccionado);
}

function cargarImagenes(local){
  if (local!=null){
    $("#imagen1").attr("src",'https://uns-iaw-2018-com09.github.io/ProyectoIAW/Imagenes/'+local+'1.jpg');
    $("#imagen2").attr("src",'https://uns-iaw-2018-com09.github.io/ProyectoIAW/Imagenes/'+local+'2.jpg');
    $("#imagen3").attr("src",'https://uns-iaw-2018-com09.github.io/ProyectoIAW/Imagenes/'+local+'3.jpg');
  }
}

function consultarSeleccionado(){
  var local=localStorage.getItem("LocalSeleccionado");
  if (local!=null){
    var ObjetoJSON=JSON.parse(local);
    console.log(ObjetoJSON);
    $("#NombreLocal").html(ObjetoJSON.Nombre_del_local);
    $("#Tipo").html(ObjetoJSON.Tipo);
    $("#Telefono").html(ObjetoJSON.Telefono);
    $("#Direccion").html(ObjetoJSON.Direccion);
    return ObjetoJSON.Nombre_del_local;
  }
  return null;
}


function setearEstiloPuntaje(){
  var estiloActual=localStorage.getItem("Estilo");
  console.log(estiloActual);
  if ((estiloActual==null) || (estiloActual=='Infinity')){
    $("#hojaEstilo").attr("href","puntaje1.css");
    localStorage.setItem("Estilo",1);
  }
  else{
    $("#hojaEstilo").attr("href","puntaje"+estiloActual+".css");
    if (estiloActual==1){
      $("#myonoffswitch").prop("checked",true);
    }
    else
      $("#myonoffswitch").prop("checked",false);
  }
}

function setearEstilo(){
  var estiloActual=window.localStorage.getItem("Estilo");
  console.log(estiloActual);
  if ((estiloActual==null) || (estiloActual=='Infinity')){
    $("#hojaEstilo").attr("href","Estilo1.css");
    cambiarMapa(1);
    localStorage.setItem("Estilo",1);
  }
  else{
    $("#hojaEstilo").attr("href","Estilo"+estiloActual+".css");
    cambiarMapa(estiloActual);
    if (estiloActual==1)
      $("#myonoffswitch").prop("checked",true);
    else
      $("#myonoffswitch").prop("checked",false);
  }
}


function cargaDeLocales(){

	$.getJSON('https://raw.githubusercontent.com/UNS-IAW-2018-Com09/ProyectoIAW/master/ModeloDeDatos.json',function(data){
    var locales=data.Locales;
    for (var i = 0; i < locales.length; i++) {
      AlmacenamientoLocales.set(locales[i]["Nombre_del_local"],locales[i]);
      var marker=new google.maps.Marker({
        position:locales[i]["Ubicacion"],
        title:locales[i]["Nombre_del_local"],
        icon:'https://uns-iaw-2018-com09.github.io/ProyectoIAW/Imagenes/'+locales[i]["Tipo"]+'.png',
        map:map
      });
      (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    var localClickeado=AlmacenamientoLocales.get(marker.title);
                    setearInformacionLocal(localClickeado);
                    var ObjetoJSON=JSON.stringify(localClickeado);
                    localStorage.setItem("LocalSeleccionado",ObjetoJSON);
                });
            })(marker, data);
    }
  });
}

function setearInformacionLocal(local){
  $("#NombreLocal").html(local.Nombre_del_local);
  $("#Tipo").html(local.Tipo);
  $("#Telefono").html(local.Telefono);
  $("#HoraOpen").html("Hora de apertura:");
  $("#HoraClose").html("Hora de cierre:");
  $("#Direccion").html(local.Direccion);
  $("#facebook").attr("href",local.Facebook);
  $("#Clasificacion").html("Clasificacion: "+local.Clasificacion);
}

function makeIcon(tipo){

  var image={
    url:"https://uns-iaw-2018-com09.github.io/ProyectoIAW/Imagenes/"+tipo+".png",
    size:new google.maps.Size(36,48),
  };
  return image;
}

function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}


function cambiarEstilo(){
  https.get('localhost:8080/stylesheets/Estilo2',(resp)=>{
    resp.on('data',()=>{
      $("#hojaEstilo").attr("href",data);
    })
  });
}


function cambiarEstiloPuntaje(){
  var estiloActual=localStorage.getItem("Estilo");
   var estiloSiguiente=Math.floor(1/estiloActual+1);
   console.log(estiloSiguiente);
   $("#hojaEstilo").attr("href","puntaje"+estiloSiguiente+".css");
   localStorage.setItem("Estilo", estiloSiguiente);
}

function cambiarMapa(estilo){
  $.getJSON('https://raw.githubusercontent.com/UNS-IAW-2018-Com09/ProyectoIAW/master/EstiloMapa'+estilo+'.json',function(data){
    console.log(data);
    map.setOptions(data);
 });
}

function recuperarPedido() {
  var es = localStorage.getItem("pedido");
  $("#hojaEstilo").attr("href",es);
}

function mostrarHorario(event){
  var diaSeleccionado=event.innerHTML;
  $("#dropdown").html(event.innerHTML);
  var localSel=$("#NombreLocal").html();
  if (localSel!="Nombre"){
    var objetoLocal=AlmacenamientoLocales.get(localSel);
    for (var i = 0; i < objetoLocal.Horario.length; i++) {
      if (objetoLocal.Horario[i].Dia==diaSeleccionado){
         $("#HoraOpen").html("Hora de apertura: "+objetoLocal.Horario[i].Hora_Apertura);
         $("#HoraClose").html("Hora de cierre: "+objetoLocal.Horario[i].Hora_Cierre);
         return;
      }
    }
    $("#HoraOpen").html("Hora de apertura: Cerrado");
    $("#HoraClose").html("Hora de apertura: Cerrado");
  }
}


function guardarComentario(){
  var textoComentario=$("#comment").val();
  $("#comment").val("Ingrese un comentario...")
  var valoracion=obtenerValoracion();

  console.log(valoracion);
  console.log($("#NombreLocal").html());

  var local=$("#NombreLocal").html();
  var local_comment=local+"-comment";
  var local_value=local+"-value";

  var listaComentarios=localStorage.getItem(local_comment);

  var arrayComentarios=null;

  if (listaComentarios==null){
    arrayComentarios=[];
  }
  else{
    arrayComentarios=JSON.parse(listaComentarios);
  }

  arrayComentarios.push(textoComentario);

  localStorage.setItem(local_comment,JSON.stringify(arrayComentarios));

  alert("Comentario enviado");
}

function obtenerValoracion(){
  var valoracion=0;
  for (var i = 1; i<6; i++) {
    if ($("#radio"+i).is(':checked')){
      valoracion=6-i;
      break;
    }
    $("#radio"+i).is(':checked',true)
  }
  return valoracion;
}


function cargarComentarios(){

  var seleccionado=$("#NombreLocal").html()+"-comment";
  var comment=localStorage.getItem(seleccionado);

  $("#campoComentarios").html(" ");

  if (comment!=null){
    var listaDeComentarios=JSON.parse(comment);
    console.log(listaDeComentarios);
    listaDeComentarios.forEach(function(element){
      console.log(element);
      var comentariosActual=$("#campoComentarios").html();
      $("#campoComentarios").html(comentariosActual+"<div>"+element+"</div><hr>");
    });
  }
}
