<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Administrador</title>
    <link rel="stylesheet" href="../css/index.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/config.js" defer></script>
</head>
<body>
    <?php include '../includes/menu.php'; ?>

    <div class="dashboard-container">
        <h1>Configuración</h1>

        <!-- Tabla de datos -->
        <div class="data-table">
            <h2>Sectores disponibles (<span id="numero-sectores">0</span>)</h2>
            <table id="tabla-sectores" class="display nowrap" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Actualizado por última vez</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <button id="nuevo-sector">Nuevo sector</button>
        </div>

        <div id="admins" class="data-table">
            <h2>Administradores de QuickHire (<span id="numero-admins">0</span>)</h2>
            <table id="tabla-admins" class="display nowrap" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th id="acciones">Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <button id="nuevo-admin">Nuevo Administrador</button>
        </div>
    </div>
</body>
</html>