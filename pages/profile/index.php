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
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/profile/candidatos-perfil.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../includes/menu.php")?>
        <div id="content">
            <div id="datos-personales">
                <div>
                    <h2>Datos personales</h2>
                    <p><img width=100px height=100px style="border-radius:50px; object-fit:cover;" id="img_perfil" src=""></p>
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
                    <button class="editar" id="editar-datos-personales">Editar datos personales</button>
                    <button class="editar" id="linkedin">Rellenar datos con Linkedin</button>
                    <div class="form-dialog" id="form-dialog-datos-personales" style="display:none;">
                        <form id="form-datos-personales">
                            <label for="imagen">Imagen:</label>
                            <input type="file" id="imagen" name="imagen">
                            
                            <label for="editar_nombre">Nombre del puesto:</label>
                            <input type="text" id="editar_nombre" name="editar_nombre" required><br><br>
                            
                            <label for="editar_apellidos">Apellidos:</label>
                            <input type="text" id="editar_apellidos" name="editar_apellidos" required><br><br>
                            
                            <label for="editar_mail">Correo electrónico:</label>
                            <input type="text" name="editar_mail" id="editar_mail"><br><br>
                            
                            <label for="editar_telefono">Teléfono:</label>
                            <input type="text" id="editar_telefono" name="editar_telefono" required><br><br>
                            
                            <label for="editar_ciudad">Ciudad:</label>
                            <input type="text" id="editar_ciudad" name="editar_ciudad" required><br><br>
                            
                            <label for="editar_pais">País:</label>
                            <input type="text" id="editar_pais" name="editar_pais" required><br><br>
                            
                        </form>
                    </div>
                </div>
                <div>
                    <h2>CV</h2>
                    <div id="cv"></div>
                </div>
                <div>
                    <button class="eliminar" id="eliminar_cuenta">Eliminar cuenta</button>
                </div>
            </div>
            <div>
                <div id="otros-datos">
                    <div id="experiencia">
                        <h2 class="seccion">Experiencia</h2>
                        <div class="datos" id="experiencia-datos"></div>
                        <button class="añadir" id="nueva-exp">Añadir</button>
                        <div class="form-dialog" id="form-dialog-exp" title="Añadir Nueva Experiencia" style="display:none;">
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
                        <h2 class="seccion">Estudios</h2>
                        <div class="datos" id="estudios-datos"></div>
                        <button class="añadir" id="nuevo-est">Añadir</button>
                        <div class="form-dialog" id="form-dialog-est" title="Añadir Nuevo Estudio" style="display:none;">
                            <form id="form-est">
                                <label for="nivel_estudios">Nivel:</label>
                                <select name="nivel_estudios" id="nivel_estudios">
                                    <option value="Bachillerato">Bachillerato</option>
                                    <option value="Formación Profesional Básica">Formación Profesional Básica</option>
                                    <option value="Formación Profesional de Grado Medio">Formación Profesional de Grado Medio</option>
                                    <option value="Formación Profesional de Grado Superior">Formación Profesional de Grado Superior</option>
                                    <option value="Diplomatura">Diplomatura</option>
                                    <option value="Ingeniería Técnica">Ingeniería Técnica</option>
                                    <option value="Ingeniería Superior">Ingeniería Superior</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Máster">Máster</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                
                                <label for="titulo">Título:</label>
                                <input type="text" id="titulo" name="titulo" required><br><br>
                                
                                <label for="centro">Centro:</label>
                                <input type="text" id="centro" name="centro" required><br><br>
                                
                                <label for="fecha_inicio_est">Fecha de inicio:</label>
                                <input type="date" id="fecha_inicio_est" name="fecha_inicio_est" required><br><br>
                                
                                <label for="fecha_fin_est">*Fecha de fin:</label>
                                <input type="date" id="fecha_fin_est" name="fecha_fin_est"><br><br>
                                <p>*Dejar vacío para indicar actual</p>
    
                            </form>
                        </div>
                    </div>
                    <div id="habilidades">
                        <h2 class="seccion">Habilidades</h2>
                        <div class="datos" id="habilidades-datos"></div>
                        <button class="añadir" id="nueva-hab">Añadir</button>
                        <div class="form-dialog" id="form-dialog-hab" title="Añadir Nueva Habilidad" style="display:none;">
                            <form id="form-hab">
                                <label for="habilidad">Habilidad:</label>
                                <input type="text" id="habilidad" name="habilidad" required><br><br>
                                
                                <label for="nivel">Nivel:</label>
                                <select name="nivel" id="nivel">
                                    <option value="Básico">Básico</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </select>
    
                            </form>
                        </div>
                    </div>
                    <div id="idiomas">
                        <h2 class="seccion">Idiomas</h2>
                        <div class="datos" id="idiomas-datos"></div>
                        <button class="añadir" id="nuevo-idi">Añadir</button>
                        <div class="form-dialog" id="form-dialog-idi" title="Añadir Nuevo Idioma" style="display:none;">
                            <form id="form-idi">
                                <label for="idioma">Idioma:</label>
                                <input type="text" id="idioma" name="idioma" required><br><br>
                                
                                <label for="nivel_idi">Nivel:</label>
                                <select name="nivel_idi" id="nivel_idi">
                                    <option value="Básico">Básico</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                    <option value="Nativo">Nativo</option>
                                </select>
    
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php include_once("../../includes/footer.php")?>
    </div>
</body>
</html>