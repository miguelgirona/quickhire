$(document).ready(function(){

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
        if(sessionStorage.tipoUsuario == "candidato"){

            $(this).toggleClass("selected");
            $("#candidato").toggleClass("selected");
            sessionStorage.tipoUsuario = "empresa";
            $(".two-cols h1 span").text(" buscando un candidato ideal.")
        }
    });
});