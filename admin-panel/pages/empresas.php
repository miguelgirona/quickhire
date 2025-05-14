<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Administrador</title>
    <link rel="stylesheet" href="../css/index.css">
    <link rel="stylesheet" href="../css/empresas.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="../js/empresas.js" defer></script>
</head>
<body>
    <?php include '../includes/menu.php'; ?>

    <div class="dashboard-container">
        <h1>Administrar Empresas</h1>

        <!-- Tarjetas de estadísticas -->
        <div class="graficos">
            <div class='grafico'>
                <canvas id="empresas-por-sector"></canvas>
            </div>
            <div class='grafico'>
                <canvas id="empresas-por-plan"></canvas>
            </div>
        </div>

        <!-- Tabla de datos -->
        <div class="data-table">
            <h2>Empresas Registradas Activas (<span id="numero-activas">0</span>)</h2>
            <table id="tabla-activas" class="display nowrap" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID_Usuario</th>
                        <th>Identificación</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Sitio Web</th>
                        <th>Fecha Validación</th>
                        <th>Ciudad</th>
                        <th>País</th>
                        <th>Plan</th>
                        <th>Fecha Activación</th>
                        <th>Actualizado por última vez</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <div class="data-table">
            <h2>Empresas por validar (<span id="numero-por-validar">0</span>)</h2>
            <table id="tabla-validar" class="display nowrap" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID_Usuario</th>
                        <th>Identificación</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Plan</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <div class="data-table">
            <h2>Empresas validadas por activar (<span id="numero-por-activar">0</span>)</h2>
            <table id="tabla-activar" class="display nowrap" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID_Usuario</th>
                        <th>Identificación</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Sitio Web</th>
                        <th>Fecha Validación</th>
                        <th>Ciudad</th>
                        <th>País</th>
                        <th>Plan</th>
                        <th>Actualizado por última vez</th>                    
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</body>
</html>