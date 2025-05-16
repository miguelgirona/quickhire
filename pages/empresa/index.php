<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Empresas</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/empresa/empresas-perfil.css">
    <script src="assets/js/jquery.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/empresa/empresas-perfil.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../includes/menu.php")?>
        <div id="content">
            <div id="datos-usuario">
                <div>
                    <div>

                        <h2 style="display:inline;">Datos de usuario</h2><button class='editar' id="editar-datos-usuario"><img src="/quickhire/assets/img/iconos/editar.png" alt="botón editar"></button>
                    </div>
                    <p><img width=100px height=100px style="border-radius:10px; object-fit:cover;" id="img_perfil" src=""></p>
                    <p style="font-weight:bold;">Nombre usuario:</p>
                    <p id="nombre"></p>
                    <p style="font-weight:bold;">Correo electrónico:</p>
                    <p id="mail"></p>
                    <p style="font-weight:bold;">Teléfono:</p>
                    <p id="telefono"></p>
                    <div>
                        <h2 style="display:inline;">Datos de empresa</h2>
                        <button class="editar" id="editar-datos-empresa"><img src="/quickhire/assets/img/iconos/editar.png" alt="botón editar"></button>
                    </div>
                    <p style="font-weight:bold;">Nombre empresa:</p>
                    <p id="nombre_empresa"></p>
                    <p style="font-weight:bold;">Sector:</p>
                    <p id="sector"></p>
                    <p style="font-weight:bold;">Identificación:</p>
                    <p id="identificacion"></p>
                    <p style="font-weight:bold;">Ciudad:</p>
                    <p id="ciudad"></p>
                    <p style="font-weight:bold;">Sitio web:</p>
                    <p ><a id="sitio_web" target="_blank" href=""></a></p>
                    <div class="form-dialog" id="form-dialog-datos-usuario" style="display:none;">
                        <form id="form-datos-usuario">
                            <label for="imagen">Imagen:</label>
                            <input type="file" id="imagen" name="imagen">
                            
                            <label for="editar_nombre">Nombre de usuario:</label>
                            <input type="text" id="editar_nombre" name="editar_nombre" required><br><br>
 
                            <label for="editar_mail">Correo electrónico:</label>
                            <input type="text" name="editar_mail" id="editar_mail"><br><br>
                            
                            <label for="editar_telefono">Teléfono:</label>
                            <input type="text" id="editar_telefono" name="editar_telefono" required><br><br>
                            
                        </form>
                    </div>
                    <div class="form-dialog" id="form-dialog-datos-empresa" style="display:none;">
                        <form id="form-datos-empresa">
                            
                            <label for="editar_nombre_empresa">Nombre de empresa:</label>
                            <input type="text" id="editar_nombre_empresa" name="editar_nombre_empresa" required><br><br>
 
                            <label for="editar_sector">Sector:</label>
                            <select name="editar_sector" id="editar_sector"></select><br><br>
                            
                            <label for="editar_sitio">Sitio Web:</label>
                            <input type="text" id="editar_sitio" name="editar_sitio" required><br><br>
                            
                            <label for="editar_ciudad">Ciudad:</label>
                            <input type="text" id="editar_ciudad" name="editar_ciudad" required><br><br>
                            
                            <label for="editar_pais">País:</label>
                            <input type="text" id="editar_pais" name="editar_pais" required><br><br>
                            
                        </form>
                    </div>
                </div>
                <div>
                    <button class="eliminar" id="eliminar_cuenta">Eliminar cuenta</button>
                </div>
            </div>
            <div id="otros-datos">
                <div>
                    <div>
                        <h2 style="display:inline;">Descripción de la empresa</h2>
                        <button id="editar-descripcion" class="editar"><img src="/quickhire/assets/img/iconos/editar.png" alt="botón editar"></button>
                    </div>
                    <p style="white-space: pre-line;" id="descripcion"></p>
                    <div class="form-dialog" id="form-dialog-desc" style="display:none;">
                        <form style="width:100%;" id="form-desc">              
                            <label for="descripcion_empresa">Descripción:</label>
                            <textarea id="descripcion_empresa" name="descripcion_empresa" required></textarea>
                        </form>
                    </div>
                </div>
                <div class="plan-container">
                <div class="plan-texto">
                    <h3>Plan:</h3>
                    <p id="plan"></p>
                </div>
                <button class="accion-plan" id="mejorar-plan">Mejorar plan</button>
                <button class="accion-plan" id="cambiar-plan">Cambiar plan</button>
                <button class="accion-plan" id="activar-plan">Activar plan</button>
                </div>

            </div>
        </div>
        <?php include_once("../../includes/footer.php")?>
    </div>
</body>
</html>