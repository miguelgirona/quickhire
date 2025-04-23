<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Ver candidato</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="/quickhire/assets/css/menu.css">
    <link rel="stylesheet" href="/quickhire/assets/css/footer.css">
    <link rel="stylesheet" href="/quickhire/assets/css/profile/candidatos-perfil.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="/quickhire/assets/js/main.js"></script>
    <script src="/quickhire/assets/js/empresa/ver-candidato.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../includes/menu.php")?>
        <div id="content">
            <div id="datos-personales">
                <div>
                    <div>
                        <h2 style="display:inline;">Datos personales</h2>
                    </div>
                    <p><img width=100px height=100px style="border-radius:10px; object-fit:cover;" id="img_perfil" src=""></p>
                    <p style="font-weight:bold;">Nombre:</p>
                    <p id="nombre"></p>
                    <p style="font-weight:bold;">Apellidos:</p>
                    <p id="apellidos"></p>
                    <p style="font-weight:bold;">Correo electrónico:</p>
                    <p id="mail"></p>
                    <p style="font-weight:bold;">Teléfono:</p>
                    <p id="telefono"></p>
                    <p style="font-weight:bold;">Ciudad:</p>
                    <p id="ciudad"></p>
                </div>
                <div>
                    <h2>CV</h2>
                    <div id="cv"></div>
                </div>
                <div>
                    <button id="aceptar-candidatura">Aceptar</button>
                    <button id="rechazar-candidatura">Rechazar</button>
                </div>
            </div>
            <div>
                <div id="otros-datos">
                    <div>
                        <div id="experiencia">
                            <h2 class="seccion">Experiencia</h2>
                            <div class="datos" id="experiencia-datos"></div>
                        </div>
                        <div id="habilidades">
                            <h2 class="seccion">Habilidades</h2>
                            <div class="datos" id="habilidades-datos"></div>
                        </div>
                    </div>
                    <div>
                        <div id="estudios">
                            <h2 class="seccion">Estudios</h2>
                            <div class="datos" id="estudios-datos"></div>
                        </div>
                        <div id="idiomas">
                            <h2 class="seccion">Idiomas</h2>
                            <div class="datos" id="idiomas-datos"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php include_once("../../includes/footer.php")?>
    </div>
</body>
</html>