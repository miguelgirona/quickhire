
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Oferta</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/oferta.css">
    <script src="assets/js/jquery.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/oferta.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../includes/menu.php")?>
        <div id="content">
            <div>
                <div style="gap:20px;" class="two-cols">
                    <div id="titulo">
                        <div>
                            <img id="foto_empresa" src="" alt=""> 
                            <div>
                                <h1 id="titulo_oferta"></h1>
                                <h2><a id="nombre_empresa" href=""></a></h2>
                            </div>
                        </div>
                        <div id="detalles">
                            <ul>
                                <li id="provincia"></li>
                                <li id="modalidad"></li>
                                <li id="fecha_publicacion"></li>
                            </ul>
                            <ul>
                                <li id="salario"></li>
                                <li id="experiencia"></li>
                                <li id="tipo_contrato"></li>
                            </ul>
                            <button class="inscribirme">Incribirme</button>
                        </div>
                    </div>
                    <div id="requisitos">
                        <h2>Requisitos</h2>
                        <div>
                            <h3>Estudios mínimos</h3>
                            <p id="estudios_min"></p>
                            <h3>Experiencia mínima</h3>
                            <p id="experiencia_min"></p>
                        </div>
                    </div>
                </div>
                <div id="descripcion">
                    <h2>Descripción</h2>
                    <div>
                        <p id="descripcion_oferta"></p>
                    </div>
                    <h3>Sector</h3>
                    <p id="sector"></p>
                    <p id="inscritos"></p>
                </div>
                <button class="inscribirme">Incribirme</button>
            </div>
        </div>
        <?php include_once("../includes/footer.php")?>
    </div>
</body>
</html>