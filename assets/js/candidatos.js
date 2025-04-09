$(document).ready(function(){
  const provinciasEspaña = [
    "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
    "Badajoz", "Barcelona", "Bizkaia", "Burgos", "Cáceres", "Cádiz", "Cantabria",
    "Castellón", "Ciudad Real", "Córdoba", "Cuenca", "Gipuzkoa", "Girona", "Granada",
    "Guadalajara", "Huelva", "Huesca", "Illes Balears", "Jaén", "León", "Lleida",
    "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia",
    "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Santa Cruz de Tenerife",
    "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia",
    "Valladolid", "Zamora", "Zaragoza"
  ].sort();
  
  $("#ubicacion").autocomplete({
    source: provinciasEspaña
  });

  $("#buscar").click(function(){
    console.log("entra");
    
    if($("#palabraClave").val().trim() != "" && $("#ubicacion").val().trim() != "" ){
        window.location.href = "/quickhire/buscar?search="+$("#palabraClave").val().trim()+"&provincia="+$("#ubicacion").val().trim();
    } else if($("#palabraClave").val().trim() != ""){
        window.location.href = "/quickhire/buscar?search="+$("#palabraClave").val().trim();
    } else if($("#ubicacion").val().trim() != ""){
        window.location.href = "/quickhire/buscar?provincia="+$("#ubicacion").val().trim();
    }
    
  });
});