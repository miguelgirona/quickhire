<script>
    if(!sessionStorage.user){
        window.location.href = "/quickhire"
    }
    let user = JSON.parse(sessionStorage.user);
    
    function getFoto(id){
        return $.ajax({
        url: "https://miguelgirona.com.es/quickhire_api/public/usuarios/foto/"+id,
        method: "GET",
        });
    }
    getFoto(user.id).then(foto => {        
        var img_perfil = foto.url_imagen;
        $("<li><img width='50px' src="+img_perfil+"></li>").insertBefore("li:first");
    })
</script>
<nav id="menu">
    <ul>
        <li><a href="perfil.php">Perfil</a></li>
        <li><a href="https://miguelgirona.com.es/quickhire/">Inicio</a></li>
        <li><a href="/buscar.php">Buscar ofertas</a></li>
        <li><a href="candidaturas.php">Mis candidaturas</a></li>
        <li><a href="https://miguelgirona.com.es/quickhire/login.php?logout">Cerrar sesión</a></li>
    </ul>
    <button class="menu-toggle" aria-label="Abrir menú">&#9776;</button>
</nav>