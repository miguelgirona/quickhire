<nav class="admin-menu">
    <ul>
        <li><a href="/quickhire/admin-panel/">Dashboard</a></li>
        <li><a href="/quickhire/admin-panel/pages/candidatos">Candidatos</a></li>
        <li><a href="/quickhire/admin-panel/pages/empresas">Empresas</a></li>
        <li><a href="/quickhire/admin-panel/pages/ofertas">Ofertas</a></li>
        <li><a href="/quickhire/admin-panel/pages/config">Configuración</a></li>
        <li><a href="javascript:cerrarSesion()">Cerrar Sesión</a></li>
    </ul>
    <button class='menu-toggle' aria-label='Abrir menú'>&#9776;</button>
</nav>
<script>
    $('.menu-toggle').click(function() {        
        $('.admin-menu').toggleClass('active');
    });

    function cerrarSesion(){
        sessionStorage.clear();
        window.location.href = "/quickhire/admin-panel";
    }
</script>
<style>
/* General */
.admin-menu {
    background-color: #2c3e50;
    padding: 10px;
    position: relative;
}

.admin-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 15px;
}

.admin-menu ul li {
    display: inline;
}

.admin-menu ul li a {
    color: #ecf0f1;
    text-decoration: none;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.admin-menu ul li a:hover {
    background-color: #34495e;
}

/* Botón del menú */
.menu-toggle {
    display: none; /* Oculto por defecto */
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #2c3e50;
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 1000; /* Asegura que el botón esté por encima del menú */
}

/* Estilos para pantallas pequeñas */
@media (max-width: 768px) {
    .admin-menu ul {
        display: none; /* Oculta el menú por defecto */
        flex-direction: column; /* Los elementos del menú se apilan verticalmente */
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #2c3e50; /* Fondo del menú desplegable */
        position: absolute;
        top: 50px;
        left: 0;
        z-index: 999; /* Asegura que el menú esté por encima de otros elementos */
    }

    .admin-menu ul li {
        width: 100%;
        text-align: center;
    }

    .admin-menu ul li a {
        padding: 10px;
        display: block;
    }

    .menu-toggle {
        display: block; /* Muestra el botón del menú */
    }

    .admin-menu.active ul {
        display: flex; /* Muestra el menú cuando tiene la clase "active" */
    }
}

/* Estilos para pantallas muy pequeñas */
@media (max-width: 480px) {
    .admin-menu ul li a {
        padding: 8px;
        font-size: 14px;
    }

    .menu-toggle {
        font-size: 25px;
    }
}
</style>
