<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Mis candidaturas</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="/quickhire/assets/css/menu.css">
    <link rel="stylesheet" href="/quickhire/assets/css/footer.css">
    <link rel="stylesheet" href="/quickhire/assets/css/profile/candidaturas.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="/quickhire/assets/js/main.js"></script>
    <script src="/quickhire/assets/js/profile/candidaturas.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../includes/menu.php")?>
        <div id="content">
            <h1>Mis candidaturas</h1>
            <div id="filtro">
                <div class="checkbox">
                    <input type="checkbox" id="pendiente">
                    <label for="pendiente">Pendiente</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id="en-proceso">
                    <label for="en-proceso">En Proceso</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id="aceptado">
                    <label for="aceptado">Aceptado</label>
                </div>
            </div>
            <div id="loading-candidaturas" style="text-align:center; margin-top: 20px;">
                <img src="/quickhire/assets/img/loading.gif" alt="Cargando..." style="width: 60px;">
            </div>
            <div id="candidaturas"></div>
        </div>
        <?php include_once("../../includes/footer.php")?>
    </div>
</body>
</html>