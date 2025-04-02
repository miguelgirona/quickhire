<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Candidatos</title>
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/profile/candidatos-perfil.css">
    <script src="assets/js/jquery.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/profile/candidatos-perfil.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../includes/menu-candidatos.php")?>
        <div id="content">
            <div id="datos-personales">
                <div>
                    <h2>Datos personales</h2>
                    <p><img width=100px id="img_perfil" src=""></p>
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
            </div>
            <div id="otros-datos">
                <div id="experiencia">
                    <h2>Experiencia</h2>
                    <div id="experiencia-datos"></div>
                    <button class="añadir" id="nueva-exp">Añadir</button>
                    <div id="form-dialog-exp" title="Añadir Nueva Experiencia" style="display:none;">
                        <form id="form-exp">
                            <label for="nombre_puesto">Nombre del puesto:</label>
                            <input type="text" id="nombre_puesto" name="nombre_puesto" required><br><br>
                            
                            <label for="empresa">Empresa:</label>
                            <input type="text" id="empresa" name="empresa" required><br><br>
                            
                            <label for="sector">Sector:</label>
                            <select name="sector" id="sector"></select><br><br>
                            
                            <label for="descripcion_puesto">Descripción del puesto:</label>
                            <textarea id="descripcion_puesto" name="descripcion_puesto" required></textarea><br><br>
                            
                            <label for="fecha_inicio">Fecha de inicio:</label>
                            <input type="date" id="fecha_inicio" name="fecha_inicio" required><br><br>
                            
                            <label for="fecha_fin">*Fecha de fin:</label>
                            <input type="date" id="fecha_fin" name="fecha_fin"><br><br>
                            <p>*Dejar vacío para indicar actual</p>

                        </form>
                    </div>
                </div>
                <div id="estudios">
                    <h2>Estudios</h2>
                    <div id="estudios-datos"></div>
                </div>
                <div id="habilidades">
                    <h2>Habilidades</h2>
                    <div id="habilidades-datos"></div>
                </div>
                <div id="idiomas">
                    <h2>Idiomas</h2>
                    <div id="idiomas-datos"></div>
                </div>
            </div>
        </div>
        <?php include_once("../../includes/footer.php")?>
    </div>
</body>
</html>