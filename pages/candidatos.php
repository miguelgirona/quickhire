<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Candidatos</title>
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/candidatos.css">
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/candidatos.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../includes/menu.php")?>
        <div id="content">
            <h1>¡Empieza tu búsqueda de empleo!</h1>
            <div id="buscador">
                <div>
                    <label>Busco...</label>
                    <input type="text" placeholder="Puesto, empresa, palabra clave">
                    <label>en...</label>
                    <input type="text" placeholder="Población, provincia, país">
                    <button id="buscar">Buscar ofertas</button>
                </div>
            </div>
            <section>
                <h2>Encuentra el sector ideal para ti</h2>
                <div class="filtros">
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/informatica-filtro.jpg" alt="Sector informática">
                            <p>INFORMÁTICA</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/comercial-filtro.jpg" alt="Sector comercial y ventas">
                            <p>COMERCIAL Y VENTAS</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/sanidad-filtro.jpg" alt="Sector sanidad">
                            <p>SANIDAD</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/educacion-filtro.jpg" alt="Sector educación">
                            <p>EDUCACIÓN</p>
                        </a>
                    </div>
                </div>
                <a href="">Buscar más sectores...</a>
            </section>
            <section>
                <h2>Encuentra tu puesto cerca de casa</h2>
                <div class="filtros">
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/madrid-filtro.jpg" alt="Madrid">
                            <p>MADRID</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/barcelona-filtro.jpg" alt="Barcelona">
                            <p>BARCELONA</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/valencia-filtro.jpg" alt="Valencia">
                            <p>VALENCIA</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/bilbao-filtro.jpg" alt="Bilbao">
                            <p>BILBAO</p>
                        </a>
                    </div>
                </div>
                <a href="">Ver más ciudades...</a>
            </section>
            <section>
                <h2>Encuentra trabajo de...</h2>
                <div class="filtros">
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/salario-alto-filtro.jpg" alt="Salario alto">
                            <p>SALARIO ALTO</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/media-jornada-filtro.jpg" alt="Media jornada">
                            <p>MEDIA JORNADA</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/teletrabajo-filtro.jpg" alt="Teletrabajo">
                            <p>TELETRABAJO</p>
                        </a>
                    </div>
                    <div class="filtro">
                        <a href="">
                            <img src="assets/img/directivo-filtro.jpg" alt="Directivo">
                            <p>DIRECTIVO</p>
                        </a>
                    </div>
                </div>
                <a href="">Ver más filtros...</a>
            </section>
        </div>
        <?php include_once("../includes/footer.php")?>
    </div>
</body>
</html>