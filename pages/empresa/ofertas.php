<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Mis Ofertas</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="/quickhire/assets/css/menu.css">
    <link rel="stylesheet" href="/quickhire/assets/css/footer.css">
    <link rel="stylesheet" href="/quickhire/assets/css/empresa/mis-ofertas.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="/quickhire/assets/js/main.js"></script>
    <script src="/quickhire/assets/js/empresa/mis-ofertas.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../includes/menu.php")?>
        <div id="content">
            <h1>Mis Ofertas</h1>
            <div id="loading-candidaturas" style="text-align:center; margin-top: 20px;">
                <img src="/quickhire/assets/img/loading.gif" alt="Cargando..." style="width: 60px;">
            </div>
            <div id="ofertas"></div>
        </div>
        <?php include_once("../../includes/footer.php")?>
    </div>
</body>
</html>