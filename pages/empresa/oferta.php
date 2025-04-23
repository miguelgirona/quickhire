<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Oferta</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="/quickhire/assets/css/menu.css">
    <link rel="stylesheet" href="/quickhire/assets/css/footer.css">
    <link rel="stylesheet" href="/quickhire/assets/css/empresa/mi-oferta.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script src="/quickhire/assets/js/main.js"></script>
    <script src="/quickhire/assets/js/empresa/mi-oferta.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../includes/menu.php")?>
        <div id="content">
            <div>
                <p>¡Así ven los candidatos tu oferta!</p>
                <div style="gap:20px;" class="two-cols">
                    <div id="titulo">
                        <div>
                            <img id="foto_empresa" src="" alt=""> 
                            <div>
                                <h1 id="titulo_oferta"></h1>
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
                <div id='candidaturas'>
                    <h2>Candidaturas</h2>
                    <div id="candidatos">
                        <table id="tabla" class="display nowrap" style="width:100%">
                        <thead>
                                <tr>
                                    <th>Ver</th>
                                    <th>Nombre</th>
                                    <th>Apellidos</th>
                                    <th>CV</th>
                                    <th>Ciudad</th>
                                    <th>País</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <?php include_once("../../includes/footer.php")?>
    </div>
</body>
</html>