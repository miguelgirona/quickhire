<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Registra tu empresa en QuickHire y comienza a reclutar a los mejores talentos. Crea una cuenta fácilmente y accede a nuestros planes de contratación adaptados a tus necesidades." />
    <meta name="keywords" content="reclutamiento, empleo, contratación, empresas, QuickHire, contratar empleados, búsqueda de talento, selección de personal, plan de contratación" />
    <title>QuickHire - Empresas</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/formulario.css">
    <script src="assets/js/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/formulario_empresas.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../includes/menu.php")?>
        <div id="content">
            <h1>¡Empieza ahora a reclutar en QuickHire!</h1>
            <section class="two-cols" id="formulario">
                <form>
                    <p>Datos acceso</p>
                    <label for="email">Introduce tu email</label>
                    <input required type="email" id="email">
                    <label for="password">Crea una constraseña</label>
                    <input required type="password" id="password1">
                    <button type="button" id="toggle-password1">Mostrar contraseña</button>
                    <label for="password">Repite la constraseña</label>
                    <input required type="password" id="password2">
                    <button type="button" id="toggle-password2">Mostrar contraseña</button>
                    <label for="nombre">Tu nombre</label>
                    <input required type="text" id="nombre">
                    <br><br>
                    <p>Datos de tu empresa</p>
                    <label for="nombre_empresa">Nombre de la empresa</label>
                    <input required type="text" id="nombre_empresa">
                    <label for="telefono">Teléfono de contacto</label>
                    <input required type="tel" id="telefono" maxlength="9" inputmode="numeric">
                    <label for="nif">Identificación fiscal (C.I.F o N.I.F)</label>
                    <input required type="text" id="nif">
                    <label for="descripcion">Descripción de la empresa</label>
                    <textarea id="descripcion" placeholder="Describe tu empresa como quieres que se muestre a los candidatos" maxlength="255"></textarea>
                    <label for="plan">Elige tu plan</label>
                    <select id="plan">
                        <option <?php echo isset($_GET['basico']) ? "selected" : ""?> value="basico">Básico</option>
                        <option <?php echo isset($_GET['profesional']) ? "selected" : ""?> value="profesional">Profesional</option>
                        <option <?php echo isset($_GET['premium']) ? "selected" : ""?> value="premium">Premium</option>
                    </select>
                    <input type="checkbox" id="politica_privacidad"><label for="politica_privacidad"> He leído y acepto la <a href="">Política de Privacidad</a></label>
                    <br>
                    <button id="enviar">Crear cuenta</button>
                </form>
                <img src="assets/img/empresa-form.png" alt="Imagen de empresa">
            </section>
        </div>
        <?php include_once("../includes/footer.php")?>
    </div>
</body>
</html>