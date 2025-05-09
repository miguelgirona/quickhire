<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Inicia Sesión</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/login.css">
    <script src="assets/js/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>

    <script src="assets/js/main.js"></script>
    <script src="assets/js/login.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../includes/menu.php")?>
        <div id="content">
            <div id="tipo-usuario">
                <button id="candidato" class="toggle selected">Soy un candidato</button>
                <button id="empresa" class="toggle">Soy una empresa</button>
            </div>
            <div class="two-cols">
                <div>
                    <h1>¡Bienvenido/a de nuevo! Inicia sesión para continuar <span></span></h1>
                </div>
                <section id="login">
                    <p style="font-weight:bold; border-bottom:1px solid #181F1C;">Introduce tus datos</p>
                    <form>
                        <label for="mail">Correo electrónico</label>
                        <input id="mail" type="text">
                        <label for="password">Introduce tu contraseña</label>
                        <input id="password" type="password">
                        <button id="iniciar-sesion">Iniciar sesión</button>
                        <button id="registrarse">Regístrate</button>
                        <button id="linkedin"></button>
                    </form>
                </section>
            </div>
        </div>
        <?php include_once("../includes/footer.php")?>
    </div>
</body>
</html>