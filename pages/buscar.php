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
    <script src="assets/js/jquery-ui.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/buscar.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../includes/menu.php")?>
        <div id="content">
            <aside id="filtros">
                <div>
                    <button id="vaciar-filtros" type="button">Vaciar filtros</button>
    
                    <div id="ordenar_filtro">
                        <input type="radio" name="ordenar" value="fecha"><label for="ordenar"> Ordenar por fecha</label><br>
                        <input type="radio" name="ordenar" value="relevancia"><label for="ordenar"> Ordenar por relevancia</label>
                    </div>
                    <div>
                        <h3>Provincias</h3>
                        <div id="provincias"></div>
                    </div>
                    <div id="requisitos_filtro">
                        <h3>Estudios mínimos</h3>
                        <div id="estudios"></div>
                        <h3>Salario min - max</h3>
                        
                        <input type="text" id="amount" readonly="" style="border:0; background-color:#e9e1fc; font-weight:bold;">
                        
                        <div id="slider-range" class="slider"></div>
                        <h3>Experiencia mínima (años)</h3>
                        <form id="experiencia_form">
                            <select style="border:none;background-color:#e9e1fc;" readonly="" name="experiencia" id="experiencia">
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>+6</option>
                            </select>
                        </form>
                        <h3>Sectores</h3>
                        <div id="sectores"></div>
                        <h3>Jornada laboral</h3>
                        <div id="jornadas"></div>
                        <h3>Tipo Contrato</h3>
                        <div id="tipo_contrato"></div>
                        <h3>Modalidad</h3>
                        <div id="modalidades"></div>
                    </div>
                </div>      
            </aside>
            <button id="ver_filtros">Mostrar filtros</button>
            <div>
                <div id="buscador">
                    <div>
                        <label>Busco...</label>
                        <input id="palabraClave" type="text" placeholder="Puesto, empresa, palabra clave">
                        <label>en...</label>
                        <input id="ubicacion" type="text" placeholder="Población, provincia, país">
                        <button id="buscar">Buscar ofertas</button>
                    </div>
                </div>
                <section id="ofertas"></section>
                <div id="controles">
                    <button id="anterior">&larr;</button>
                    <span>Página <span id="pag"></span> de <span id="totalPags"></span></span>
                    <button id="siguiente">&rarr;</button>
                </div>
            </div>
        </div>
        <?php include_once("../includes/footer.php")?>
    </div>
</body>
</html>