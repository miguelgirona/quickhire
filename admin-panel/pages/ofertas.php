<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Administrador</title>
    <link rel="stylesheet" href="../css/index.css">
    <link rel="stylesheet" href="../css/graficos.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="../js/ofertas.js" defer></script>
</head>
<body>
    <?php include '../includes/menu.php'; ?>

    <div class="dashboard-container">
        <h1>Administrar Ofertas</h1>

        <!-- Tarjetas de estadísticas -->
        <div class="graficos">
            <div class='grafico'>
                <canvas id="ofertas-por-sector"></canvas>
            </div>
            <div class='grafico'>
                <canvas id="ofertas-por-empresa"></canvas>
            </div>
            
        </div>

        <!-- Tabla de datos -->
        <div class="data-table">
            <h2>Ofertas Activas (<span id="numero-ofertas">0</span>)</h2>
            <table id="tabla-ofertas" class="display nowrap" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Titulo</th>
                        <th>Provincia</th>
                        <th>Fecha publicación</th>
                        <th>Fecha cierre</th>
                        <th>Descripción</th>
                        <th>Sector</th>
                        <th>Salario mínimo</th>
                        <th>Salario máximo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</body>
</html>