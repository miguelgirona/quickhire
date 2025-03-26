<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - ¡Busca las mejores ofertas!</title>
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/buscar.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">
    <script src="assets/js/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/buscar.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../includes/menu.php")?>
        <div id="content">
            <div id="filtros">
                <div id="ordenar_filtro">
                    <input type="radio" name="ordenar" value="fecha"><label for="ordenar"> Ordenar por fecha</label><br>
                    <input type="radio" name="ordenar" value="relevancia"><label for="ordenar"> Ordenar por relevancia</label>
                </div>
                <div>
                    <h3>Provincias</h3>
                    <div id="provincias">
                        <script>
                            $.ajax({
                                url: 'https://miguelgirona.com.es/quickhire_api/public/ofertas',
                                method: 'GET',
                                success: function(response) {
                                    let provincias =Array.from(new Set(response.map(oferta => oferta.provincia)));
                                    provincias.forEach(provincia => $("#provincias").append($("<input type='checkbox' id="+provincia+"><label>"+provincia+" ("+response.length+")</label>")))
                                },
                                error: function(){}
                            })
                        </script>
                    </div>
                </div>
                <div id="requisitos_filtro">
                    <h3>Estudios mínimos</h3>
                    <input type="checkbox" id="sin_estudios"><label for="sin_estudios">Sin estudios</label>
                    <input type="checkbox" id="secundaria"><label for="secundaria">Secundaria Obligatoria</label>
                    <input type="checkbox" id="grado_medio"><label for="grado_medio">Ciclo Grado Medio</label>
                    <input type="checkbox" id="grado_superior"><label for="grado_superior">Ciclo Grado Superior</label>
                    <input type="checkbox" id="licenciatura"><label for="licenciatura">Licenciatura</label>
                    <input type="checkbox" id="ingenieria_superior"><label for="ingenieria_superior">Ingeniería Superior</label>
                    <input type="checkbox" id="ingenieria_tecnica"><label for="ingenieria_tecnica">Ingeniería Técnica</label>
                    <input type="checkbox" id="master"><label for="master">Máster</label>
                    <h3>Salario</h3>
                    <p>
                        <label for="amount">Price range:</label>
                        <input type="text" id="amount" readonly="" style="border:0; background-color:#e9e1fc; font-weight:bold;">
                    </p>
                    
                    <div id="slider-range"></div>
                    <h3>Experiencia mínima (años)</h3>
                    <form id="experiencia_form">
                        <select style="border:none;background-color:#e9e1fc;" name="experiencia" id="experiencia">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                        </select>
                    </form>
                    <h3>Sectores</h3>
                    <div id="sectores">
                        <script>
                            $.ajax({
                                url: 'https://miguelgirona.com.es/quickhire_api/public/sectores',
                                method: 'GET',
                                success: function(response) {
                                    var sectores = response;
                                    sectores.forEach(sector => $("#sectores").append($("<input type='checkbox' id="+sector.id+"><label>"+sector.sector+"</label>")))
                                },
                                error: function(){}
                            })
                        </script>
                    </div>
                </div>
                
            </div>
            <div>
                <div id="buscador">
                    <div>
                        <label>Busco...</label>
                        <input type="text" placeholder="Puesto, empresa, palabra clave">
                        <label>en...</label>
                        <input type="text" placeholder="Población, provincia, país">
                        <button id="buscar">Buscar ofertas</button>
                    </div>
                </div>
            </div>
        </div>
        <?php include_once("../includes/footer.php")?>
    </div>
</body>
</html>