$(document).ready(function(){

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
        window.location = sessionStorage.tipoUsuario == "candidato" ? "registro.php" : "empresas.php";
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
        console.log("nombre",$("#nombre").val(),"contraseña",$("#password").val());
        
        $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/login',
            method: "POST",
            contentType: 'application/json', // Asegura que se envía como JSON
            data: JSON.stringify({
                nombre: $("#nombre").val(),
                contraseña: $("#password").val(),
            }),
            success: function(response) {
                console.log(response.token);
                
                sessionStorage.token = response.token;
                console.log(jwt_decode(response.token));
                
                sessionStorage.user = JSON.stringify(jwt_decode(response.token));
                let user = JSON.parse(sessionStorage.user)
                
                $("#login").after("<p>¡Bienvenido/a "+ user.nombre +"!</p>")
                $("form")[0].reset();
                window.location.href = "https://miguelgirona.com.es/quickhire/profile/"
            },
            error: function(error){
                console.log(error);
                
                $("#login").after("<p>Error al iniciar session</p>")
            }
        });
    });
});