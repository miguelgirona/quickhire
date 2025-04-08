$(document).ready(function () {

  const provinciasEspaña = [
    "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz",
    "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón",
    "Ciudad Real", "Córdoba", "Cuenca", "Gerona", "Granada", "Guadalajara",
    "Guipúzcoa", "Huelva", "Huesca", "Islas Baleares", "Jaén", "A Coruña",
    "La Rioja", "Las Palmas", "León", "Lérida", "Lugo", "Madrid", "Málaga",
    "Murcia", "Navarra", "Orense", "Palencia", "Pontevedra", "Salamanca",
    "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona",
    "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
  ].sort(); // Ordenar alfabéticamente

  $("#ubicacion").autocomplete({
    source: provinciasEspaña
  });
  

  $(window).resize(function() {

    if(window.innerWidth > 768) $("#filtros").show();
  });
  

  //devuelve promise
  function getOfertas() {
    return $.ajax({  
      url: "https://miguelgirona.com.es/quickhire_api/public/ofertas",
      method: "GET",
    });
  }
  
  function getEmpresa(id) {
    return $.ajax({
      url: "https://miguelgirona.com.es/quickhire_api/public/empresas/"+id,
      method: "GET",
    });
  }
  
  function getFoto(id){
    return $.ajax({
      url: "https://miguelgirona.com.es/quickhire_api/public/usuarios/foto/"+id,
      method: "GET",
    });
  }
  
  function getSectores() {
    return $.ajax({
      url: "https://miguelgirona.com.es/quickhire_api/public/sectores",
      method: "GET",
    });
  }
  
  $("#filtros").on("change", "input[type=checkbox]", aplicarFiltros);
  $("#experiencia").on("change", aplicarFiltros);
  $("#slider-range").on("slidechange", aplicarFiltros);
  $("#buscar").click(function () {
    aplicarFiltros();
  });
  


  getOfertas().then(ofertas => {
    let provincias = Array.from(new Set(ofertas.map(oferta => oferta.provincia)));
    provincias.forEach(provincia => $("#provincias").append(`<div class='checkbox'><input type='checkbox' id='prov_${encodeURIComponent(provincia)}' data-valor='${provincia}'><label for='prov_${encodeURIComponent(provincia)}'>${provincia}</label></div>`));
  
    let estudios = Array.from(new Set(ofertas.map(oferta => oferta.requisitos.estudios)));
    estudios.forEach(estudio => $("#estudios").append(`<div class='checkbox'><input type='checkbox' id='est_${encodeURIComponent(estudio)}' data-valor='${estudio}'><label for='est_${encodeURIComponent(estudio)}'>${estudio}</label></div>`));
  
    let jornadas = Array.from(new Set(ofertas.map(oferta => oferta.requisitos.jornada)));
    jornadas.forEach(jornada => $("#jornadas").append(`<div class='checkbox'><input type='checkbox' id='jorn_${encodeURIComponent(jornada)}' data-valor='${jornada}'><label for='jorn_${encodeURIComponent(jornada)}'>${jornada}</label></div>`));
  
    let tipo_contratos = Array.from(new Set(ofertas.map(oferta => oferta.requisitos.tipo_contrato)));
    tipo_contratos.forEach(tipo_contrato => $("#tipo_contrato").append(`<div class='checkbox'><input type='checkbox' id='cont_${encodeURIComponent(tipo_contrato)}' data-valor='${tipo_contrato}'><label for='cont_${encodeURIComponent(tipo_contrato)}'>${tipo_contrato}</label></div>`));
  
    let modalidades = Array.from(new Set(ofertas.map(oferta => oferta.requisitos.modalidad)));
    modalidades.forEach(modalidad => $("#modalidades").append(`<div class='checkbox'><input type='checkbox' id='mod_${encodeURIComponent(modalidad)}' data-valor='${modalidad}'><label for='mod_${encodeURIComponent(modalidad)}'>${modalidad}</label></div>`));
  
    getSectores().then(sectores => {
      sectores = sectores.filter(sector => ofertas.some(oferta => oferta.id_sector == sector.id));
      sectores.forEach(sector => $("#sectores").append(`<div class='checkbox'><input type='checkbox' id='sect_${sector.id}' data-valor='${sector.id}'><label for='sect_${sector.id}'>${sector.sector}</label></div>`));
    });
  
    todasLasOfertas = ofertas;
    aplicarFiltros();
  });
  
  


  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 6000,
    step: 200,
    values: [0, 6000],
    slide: function (event, ui) {
      let amountText = ui.values[0] + "€ - " + (ui.values[1] === 6000 ? "+6000€" : ui.values[1] + "€");
      $("#amount").val(amountText);
    }
  });
  
  // Aseguramos que el valor inicial se actualice correctamente
  $("#amount").val(
      $("#slider-range").slider("values", 0) +
      "€ - " +
      ($("#slider-range").slider("values", 1) === 60000 ? "+60000€" : $("#slider-range").slider("values", 1) + "€")
  );
  

  var select = $("#experiencia");
  var slider = $("<div id='slider'></div>")
    .insertAfter(select)
    .slider({
      min: 0,
      max: 6,
      range: "min",
      value: select[0].selectedIndex,
      slide: function (event, ui) {
        select[0].selectedIndex = ui.value;
        aplicarFiltros(); // Llamamos a aplicarFiltros para filtrar las ofertas cuando se mueve el slider
      },
    });

  $("#experiencia").on("change", function () {
    slider.slider("value", this.selectedIndex); // Actualizamos el slider cuando se cambia el valor del select
    aplicarFiltros(); // Llamamos a aplicarFiltros para filtrar las ofertas cuando se cambia el valor del select
  });

  $("#ver_filtros").click(function(){
    console.log("entra");
    
    $("#filtros").toggle();

    $("#ver_filtros").text() == "Mostrar filtros" ? $("#ver_filtros").text("Ocultar filtros") : $("#ver_filtros").text("Mostrar filtros");

  });

  let todasLasOfertas = [];

  let renderId = 0;

  function renderOfertas(ofertas) {
    $("#ofertas").empty();
    let maxChars = window.innerWidth < 768 ? 50 : 175;
  
    renderId++;
    const currentRenderId = renderId;
  
    // Vamos a usar un array para almacenar promesas
    const promesas = ofertas.map(oferta => {
      return getEmpresa(oferta.id_empresa).then(empresa => {
        if (currentRenderId !== renderId) return null;
  
        return getFoto(empresa[0].id_usuario).then(foto => {
          if (currentRenderId !== renderId) return null;
  
          return {
            oferta,
            empresa: empresa[0],
            foto
          };
        });
      });
    });
  
    // Cuando todas las promesas se resuelvan
    Promise.all(promesas).then(resultados => {
      if (currentRenderId !== renderId) return;
  
      // Filtramos nulls por si hubo interrupciones
      resultados = resultados.filter(r => r !== null);

      console.log(resultados);
      
      // Ordenamos por el plan: premium > profesional > basico
      const ordenPlan = { premium: 2, profesional: 1, basico: 0 };

      resultados.sort((a, b) => {
        let planA = (a.empresa.plan || "basico").toLowerCase();
        let planB = (b.empresa.plan || "basico").toLowerCase();
        return ordenPlan[planB] - ordenPlan[planA];  // ¡Invertido! Ahora premium (2) será primero
      });
      
  
      // Renderizamos en orden
      resultados.forEach(({ oferta, empresa, foto }) => {
        $("#ofertas").append(`
          <div class='oferta' id='${oferta.id}'>
            <img src='${foto.url_imagen}' alt='logo empresa'>
            <div>
              <h2>${oferta.titulo}</h2>
              <p><a href='#'>${empresa.nombre_empresa}</a></p>
              <p>${oferta.provincia} | ${oferta.requisitos.modalidad}</p>
              <p>${oferta.descripcion.length > maxChars ? oferta.descripcion.substring(0, maxChars) + "..." : oferta.descripcion}</p>
              <p>${oferta.requisitos.tipo_contrato} | ${oferta.requisitos.jornada} | ${oferta.salario_min}€ - ${oferta.salario_max}€</p>
            </div>
          </div>
        `);
      });
    });
  }
  
  

function aplicarFiltros() {
  // Limpia las ofertas en el DOM antes de renderizar
  $("#ofertas").empty();

  let provinciaChecked = $("#provincias input:checked").map(function () { return $(this).data("valor"); }).get();
  let estudiosChecked = $("#estudios input:checked").map(function () { return $(this).data("valor"); }).get();
  let jornadasChecked = $("#jornadas input:checked").map(function () { return $(this).data("valor"); }).get();
  let contratosChecked = $("#tipo_contrato input:checked").map(function () { return $(this).data("valor"); }).get();
  let modalidadesChecked = $("#modalidades input:checked").map(function () { return $(this).data("valor"); }).get();
  let sectoresChecked = $("#sectores input:checked").map(function () { return $(this).data("valor").toString(); }).get();

  let salarioMin = $("#slider-range").slider("values", 0);
  let salarioMax = $("#slider-range").slider("values", 1);
  let experienciaMin = parseInt($("#experiencia").val());

  let keyword = $("#palabraClave").val().toLowerCase();
  let ubicacion = $("#ubicacion").val().toLowerCase();
  console.log(experienciaMin);
  
  // Filtrar las ofertas según los filtros
  let ofertasFiltradas = todasLasOfertas.filter(oferta => {
    let matchesPalabraClave = !keyword || (
      oferta.titulo.toLowerCase().includes(keyword) ||
      oferta.descripcion.toLowerCase().includes(keyword)
    );

    let matchesUbicacion = !ubicacion || (
      oferta.provincia.toLowerCase().includes(ubicacion)
    );

    return (
      matchesPalabraClave &&
      matchesUbicacion &&
      (provinciaChecked.length === 0 || provinciaChecked.includes(oferta.provincia)) &&
      (estudiosChecked.length === 0 || estudiosChecked.includes(oferta.requisitos.estudios)) &&
      (jornadasChecked.length === 0 || jornadasChecked.includes(oferta.requisitos.jornada)) &&
      (contratosChecked.length === 0 || contratosChecked.includes(oferta.requisitos.tipo_contrato)) &&
      (modalidadesChecked.length === 0 || modalidadesChecked.includes(oferta.requisitos.modalidad)) &&
      (sectoresChecked.length === 0 || sectoresChecked.includes(String(oferta.id_sector))) &&
      (oferta.salario_min >= salarioMin && (salarioMax === 6000 || oferta.salario_max <= salarioMax))&&
      (parseInt(oferta.requisitos.experiencia) >= experienciaMin)
    );
  });

  // Renderizar las ofertas filtradas
  renderOfertas(ofertasFiltradas);
}

$("#vaciar-filtros").click(function() {
  // Vaciar todos los checkboxes
  $("#filtros input:checkbox").prop("checked", false);
  
  // Restablecer el valor del slider de salario
  $("#slider-range").slider("values", [0, 6000]);
  $("#amount").val("0€ - +6000€");
  
  // Restablecer el valor del slider de experiencia
  $("#experiencia").prop("selectedIndex", 0);
  $("#slider").slider("value", 0);
  
  // Vaciar los campos de texto
  $("#palabraClave").val('');
  $("#ubicacion").val('');
  
  // Llamar a aplicarFiltros() después de restablecer para mostrar todas las ofertas
  aplicarFiltros();
});


});
