<nav id="menu"></nav>
<script>
    if(sessionStorage.user){
        let user = JSON.parse(sessionStorage.user);
        
        if(user.tipo_usuario == "Candidato"){
            $("#menu").html(
                "<ul><li><a href='/quickhire/profile'>Perfil</a></li>"+
                "<li><a href='/quickhire/'>Inicio</a></li>"+
                "<li><a href='/quickhire/buscar.php'>Buscar ofertas</a></li>"+
                "<li><a href='/quickhire/profile/candidaturas.php'>Mis candidaturas</a></li>"+
                "<li><a href='/quickhire/login.php?logout'>Cerrar sesión</a></li></ul>"+
                "<button class='menu-toggle' aria-label='Abrir menú'>&#9776;</button>"
            );
        } else if(user.tipo_usuario == "Empresa"){
            $("#menu").html(
                "<ul><li><a href='/quickhire/empresa'>Perfil</a></li>"+
                "<li><a href='/quickhire/'>Inicio</a></li>"+
                "<li><a href='/quickhire/empresa/ofertas.php'>Mis ofertas</a></li>"+
                "<li><a href='/quickhire/login.php?logout'>Cerrar sesión</a></li></ul>"+
                "<button class='menu-toggle' aria-label='Abrir menú'>&#9776;</button>"
            );
        }
    } else {
        $("#menu").html(
            "<ul>"+
                "<li><a href='./'>Inicio</a></li>"+
                "<li><a href='candidatos.php'>Candidatos</a></li>"+
                "<li><a href='empresas'>Empresas</a></li>"+
                "<li><a href='planes.php'>Planes para empresas</a></li>"+
                "<li><a href='login.php'>Iniciar Sesión</a></li>"+
            "</ul>"+
            "<button class='menu-toggle' aria-label='Abrir menú'>&#9776;</button>"
        );
    }
</script>