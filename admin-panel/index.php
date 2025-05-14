<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Administrador</title>
    <link rel="stylesheet" href="css/index.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/dashboard.js" defer></script>
</head>
<body>
    <?php include 'includes/menu.php'; ?>

    <div class="dashboard-container">
        <h1>Bienvenido al Panel de Administración</h1>

        <!-- Tarjetas de estadísticas -->
        <div class="stats-cards">
            <div class="card">
                <h3>Usuarios Registrados</h3>
                <p id="total-users">0</p>
            </div>
            <div class="card">
                <h3>Ofertas Publicadas</h3>
                <p id="total-jobs">0</p>
            </div>
            <div class="card">
                <h3>Empresas Registradas</h3>
                <p id="total-companies">0</p>
            </div>
            <div class="card">
                <h3>Candidatos Registrados</h3>
                <p id="total-cand">0</p>
            </div>
        </div>

        <!-- Tabla de datos -->
        <div class="data-table">
            <h2>Últimos Usuarios Registrados</h2>
            <table id="tabla" class="display nowrap" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Fecha de Registro</th>
                        <th>Tipo Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</body>
</html>