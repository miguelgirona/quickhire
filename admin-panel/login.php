<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - Administrador</title>
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/login.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <script src="js/login.js" defer></script>
</head>
<body>
    <div class="login-container">
        <h1>Iniciar Sesión</h1>
        <form id="login-form">
            <div class="form-group">
                <label for="mail">Correo Electrónico</label>
                <input type="email" id="mail" name="mail" placeholder="admin@example.com" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="********" required>
            </div>
            <button id="iniciar-sesion" type="submit" class="btn">Iniciar Sesión</button>
            <p id="error-message" class="error-message"></p>
        </form>
    </div>
</body>
</html>