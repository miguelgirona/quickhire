$(document).ready(function () {

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
  
  getOfertas().then(ofertas => {
    let provincias = Array.from(new Set(ofertas.map(oferta => oferta.provincia)));
    provincias.forEach(provincia => $("#provincias").append($("<div class='checkbox'><input type='checkbox' id="+provincia+"><label>"+provincia+"</div></label>")))
    
    let estudios = Array.from(new Set(ofertas.map(oferta => oferta.requisitos.estudios)));
    estudios.forEach(estudio => $("#estudios").append($("<div class='checkbox'><input type='checkbox' id="+estudio+"><label>"+estudio+"</div></label>")))
    
    let jornadas = Array.from(new Set(ofertas.map(oferta => oferta.requisitos.jornada)));
    jornadas.forEach(jornada =>$("#jornadas").append($("<div class='checkbox'><input type='checkbox' id="+jornada+"><label>"+jornada+"</div></label>")) )
    
    let tipo_contratos = Array.from(new Set(ofertas.map(oferta => oferta.requisitos.tipo_contrato)));
    tipo_contratos.forEach(tipo_contrato =>$("#tipo_contrato").append($("<div class='checkbox'><input type='checkbox' id="+tipo_contrato+"><label>"+tipo_contrato+"</div></label>")) )
    
    let modalidades = Array.from(new Set(ofertas.map(oferta => oferta.requisitos.modalidad)));
    modalidades.forEach(modalidad =>$("#modalidades").append($("<div class='checkbox'><input type='checkbox' id="+modalidad+"><label>"+modalidad+"</div></label>")) )
    
    getSectores().then(sectores => {
      sectores = sectores.filter(sector => ofertas.some(oferta => oferta.id_sector == sector.id))
      
      sectores.forEach(sector => $("#sectores").append($("<div class='checkbox'><input type='checkbox' id="+sector.id+"><label>"+sector.sector+"</div></label>")))
    })
    
    ofertas.forEach(oferta => {

      let maxChars = window.innerWidth < 768 ? 50 : 175; // 50 caracteres en móviles, 175 en pantallas grandes
      
      getEmpresa(oferta.id_empresa).then(empresa =>{
        
        getFoto(empresa[0].id_usuario).then(foto => {
          
          $("#ofertas").append($(
            "<div class='oferta' id="+oferta.id+">" +
              "<img src="+ foto.url_imagen +">"+
              "<div>"+
                "<h2>"+ oferta.titulo +"</h2>" +
                "<p><a href='#'>"+ empresa[0].nombre_empresa +"</a></p>"+
                "<p>"+ oferta.provincia +" | "+ oferta.requisitos.modalidad +"</p>"+
                "<p>"+ (oferta.descripcion.length > maxChars ? (oferta.descripcion.substring(0,maxChars) + "...") : oferta.descripcion) +"</p>"+
                "<p>"+ oferta.requisitos.tipo_contrato +" | "+ oferta.requisitos.jornada +" | "+ oferta.salario_min +"€ - "+ oferta.salario_max +"€</p>"+
              "</div>"+
            "</div>"
          ));
          
        })
        
      });
      
    });


  }).catch(error => console.log(error ));


  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 60000,
    step: 500,
    values: [12000, 20000],
    slide: function (event, ui) {
      let amountText = ui.values[0] + "€ - " + (ui.values[1] === 60000 ? "+60000€" : ui.values[1] + "€");
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
      },
    });
  $("#experiencia").on("change", function () {
    slider.slider("value", this.selectedIndex);
  });

  $("#ver_filtros").click(function(){
    console.log("entra");
    
    $("#filtros").toggle();

    $("#ver_filtros").text() == "Mostrar filtros" ? $("#ver_filtros").text("Ocultar filtros") : $("#ver_filtros").text("Mostrar filtros");

  });
});
