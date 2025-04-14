$(document).ready(function(){

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
        
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }
    var csrfToken = getCookie('csrf_cookie_name');

    if(window.location.href.includes("logout")){
        sessionStorage.clear();
        window.location.replace("https://miguelgirona.com.es/quickhire/login.php");
    }

    if(sessionStorage.user){
        $("#content").html("<h1>¡Bienvenido/a "+ JSON.parse(sessionStorage.user).nombre +"!</h1><p><a href='?logout'>Cerrar sesión</a></p>");
    }

    if(sessionStorage.getItem("tipoUsuario")){
        if(sessionStorage.getItem("tipoUsuario") == "empresa") {
            $("#candidato,#empresa").toggleClass("selected");
            $(".two-cols h1 span").text(" buscando un candidato ideal.")
        } else {
            $(".two-cols h1 span").text(" en tu búsqueda de empleo.")
        }
    }


    $("#registrarse").click(function(event){
        event.preventDefault();
        window.location = (sessionStorage.tipoUsuario == "candidato" || !sessionStorage.tipoUsuario) ? "registro.php" : "empresas.php";
    });

    $("#candidato").click(function(){
        if(sessionStorage.tipoUsuario == "empresa"){

            $(this).toggleClass("selected");
            $("#empresa").toggleClass("selected");
            sessionStorage.tipoUsuario = "candidato";
            $(".two-cols h1 span").text(" en tu búsqueda de empleo.")
        }
    });

    $("#empresa").click(function(){
        if(sessionStorage.tipoUsuario != "empresa"){

            $(this).toggleClass("selected");
            $("#candidato").toggleClass("selected");
            sessionStorage.tipoUsuario = "empresa";
            $(".two-cols h1 span").text(" buscando un candidato ideal.")
        }
    });
    $("#iniciar-sesion").click(function(event){
        event.preventDefault();
    
        // 1. Petición para generar la cookie
        $.get("https://miguelgirona.com.es/quickhire_api/public/usuarios/token", function(){
            // 2. Luego hacemos el login
            csrfToken = getCookie('csrf_cookie_name');
    
            $.ajax({
                url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/login',
                method: "POST",
                contentType: 'application/json',
                data: JSON.stringify({
                    nombre: $("#nombre").val(),
                    contraseña: $("#password").val(),
                    csrf_test_name: csrfToken
                }),
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                success: function(response) {
                    sessionStorage.token = response.token;
                    sessionStorage.user = JSON.stringify(jwt_decode(response.token));
                    const user = JSON.parse(sessionStorage.user);
    
                    $("#login").after("<p>¡Bienvenido/a "+ user.nombre +"!</p>")
                    $("form")[0].reset();
    
                    if(user.tipo_usuario == "Candidato") window.location.href = "https://miguelgirona.com.es/quickhire/profile";
                    if(user.tipo_usuario == "Empresa") window.location.replace("https://miguelgirona.com.es/quickhire/empresa");
                    if(user.tipo_usuario == "Administrador") window.location.replace("https://miguelgirona.com.es/quickhire/admin");
                },
                error: function(xhr,status,error){
                    console.log(error);
                    console.log(xhr.responseText);
                    $("#login").after("<p>Error al iniciar sesión</p>");
                }
            });
        });
    });
    
});