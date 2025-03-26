<?php
session_start();

// Generar un token CSRF aleatorio si no existe en la sesión
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32)); // Genera un token CSRF
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Regístrate y empieza tu búsqueda de empleo</title>
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/formulario.css">
    <script src="assets/js/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/formulario_registro.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../includes/menu.php")?>
        <div id="content">
            <h1>¡Empieza tu búsqueda de empleo en QuickHire!</h1>
            <section id="formulario">
                <form >
                    <p>Introduce tus datos acceso</p>
                    <label for="nombre">Introduce tu nombre de usuario</label>
                    <input required type="text" id="nombre">
                    <label for="email">Introduce tu email</label>
                    <input required type="email" id="email">
                    <label for="password">Crea una constraseña</label>
                    <input required type="password" id="password1">
                    <button type="button" id="toggle-password1">Mostrar contraseña</button>
                    <label for="password">Repite la constraseña</label>
                    <input required type="password" id="password2">
                    <button type="button" id="toggle-password2">Mostrar contraseña</button><br><br>
                    <input type="checkbox" id="politica_privacidad"><label for="politica_privacidad"> He leído y acepto la <a href="">Política de Privacidad</a></label>
                    <br>
                    <input type="hidden" id="csrf_token" value="<?= $_SESSION['csrf_token']; ?>">
                    <button id="enviar">Crear cuenta</button>
                </form>
            </section>
        </div>
        <?php include_once("../includes/footer.php")?>
    </div>
</body>
</html>