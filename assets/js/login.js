$(document).ready(function(){

    const params = new URLSearchParams(window.location.search);

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
        
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }
    var csrfToken = getCookie('csrf_cookie_name');

    function getEmpresa(id, token){
        csrfToken = getCookie('csrf_cookie_name');

        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/empresas/showByUserId/'+id,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'X-CSRF-Token': csrfToken
            }
        });
    }

    if(window.location.href.includes("logout")){
        sessionStorage.clear();
        window.location.replace("https://miguelgirona.com.es/quickhire/login.php");
    }

    if(sessionStorage.user){
        $("#content").html("<h1>¡Bienvenido/a "+ JSON.parse(sessionStorage.user).nombre +"!</h1><p><a href='?logout'>Cerrar sesión</a></p>");
    }

    if(sessionStorage.getItem("tipoUsuario")){
        if(sessionStorage.getItem("tipoUsuario") == "empresa") {
            $("#linkedin").hide();
            $("#candidato,#empresa").toggleClass("selected");
            $(".two-cols h1 span").text(" buscando un candidato ideal.")
        } else {
            $("#linkedin").show();
            $(".two-cols h1 span").text(" en tu búsqueda de empleo.")
        }
    }

    if(params.get("token")){
        var linkedinUser = jwt_decode(params.get("token"));
        console.log(linkedinUser);
        $.get('https://miguelgirona.com.es/quickhire_api/public/usuarios/token', function() {
            // Esperamos un poco para asegurarnos que la cookie se setea correctamente
            setTimeout(() => {
                csrfToken = getCookie('csrf_cookie_name');
    
                if (!csrfToken) {
                    $("#error").remove();
                    $("#login").after("<p id='error'>No se pudo obtener el token CSRF</p>");
                    return;
                }
    
                // Paso 2: Petición POST con token CSRF correcto
                $.ajax({
                    url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/login',
                    method: "POST",
                    contentType: 'application/json',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    },
                    data: JSON.stringify({
                        mail: linkedinUser.data.email,
                        contraseña: null,
                        csrf_test_name: csrfToken
                    }),
                    success: function(response) {
                        sessionStorage.token = response.token;
                        sessionStorage.user = JSON.stringify(jwt_decode(response.token));
                        const user = JSON.parse(sessionStorage.user);
    
                        $("#login").after("<p>¡Bienvenido/a "+ user.nombre +"!</p>");
                        $("form")[0].reset();
    
                        if(user.tipo_usuario == "Candidato") window.location.href = "https://miguelgirona.com.es/quickhire/profile";
                    },
                    error: function(xhr, status, error) {
                        console.log(error);
                        let errorCode = JSON.parse(xhr.responseText).error;
                        console.log(errorCode);

                        if(errorCode == 401){
                            csrfToken = getCookie('csrf_cookie_name');

                            $.ajax({
                                url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios',
                                method: 'POST',
                                credentials: 'include',
                                data: {
                                    nombre: linkedinUser.data.name,
                                    mail: linkedinUser.data.email,
                                    url_imagen:linkedinUser.data.picture,
                                    contraseña: null,
                                    tipo_usuario: "Candidato",
                                    csrf_test_name: csrfToken // Agregar el token CSRF
                                },
                                headers: {
                                    'X-CSRF-TOKEN': csrfToken // También enviarlo en el header
                                },
                                success: function(response) {
                                    csrfToken = getCookie('csrf_cookie_name');
                                    $.ajax({
                                        url: 'https://miguelgirona.com.es/quickhire_api/public/candidatos',
                                        method: 'POST',
                                        credentials: 'include',
                                        data: {
                                            id_usuario: response.id,
                                            nombre: response.nombre,
                                            csrf_test_name: csrfToken
                                        },
                                        headers: {
                                            'X-CSRF-TOKEN': csrfToken
                                        },
                                        success: function() {
                                            csrfToken = getCookie('csrf_cookie_name');
                                            $.ajax({
                                                url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/login',
                                                method: "POST",
                                                contentType: 'application/json',
                                                headers: {
                                                    'X-CSRF-TOKEN': csrfToken
                                                },
                                                data: JSON.stringify({
                                                    mail: linkedinUser.data.email,
                                                    contraseña: null,
                                                    csrf_test_name: csrfToken
                                                }),
                                                success: function(response) {
                                                    sessionStorage.token = response.token;
                                                    sessionStorage.user = JSON.stringify(jwt_decode(response.token));
                                                    const user = JSON.parse(sessionStorage.user);
                                            
                                                    $("#login").after("<p>¡Bienvenido/a "+ user.nombre +"!</p>");
                                                    $("form")[0].reset();
                                            
                                                    if(user.tipo_usuario == "Candidato") window.location.href = "https://miguelgirona.com.es/quickhire/profile";
                                                    if(user.tipo_usuario == "Empresa") window.location.href = "https://miguelgirona.com.es/quickhire/empresa";
                                                    if(user.tipo_usuario == "Administrador") window.location.replace("https://miguelgirona.com.es/quickhire/admin");
                                                },
                                                error: function(xhr, status, error) {
                                                    console.log(error);
                                                    console.log(xhr.responseText);
                                                }
                                            });
                                            
                    
                                        },
                                        error: function() {
                                            console.log(error);
                                            console.log(xhr.responseText);
                                        }
                                    });
                                    
                                },
                                error: function() {
                                    alert("usuario existente")
                                }
                            });
                        }

                        $("#error").remove();
                        $("#login").after("<p id='error'>Error al iniciar sesión</p>");
                    }
                });
            }, 200); // Pequeño delay para que el navegador guarde la cookie
        });
        
    }

    $("#linkedin").click(function(event){
        event.preventDefault();
        window.location = "https://miguelgirona.com.es/quickhire_api/public/linkedin/login";

    });


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
            $("#linkedin").show();
        }
    });

    $("#empresa").click(function(){
        if(sessionStorage.tipoUsuario != "empresa"){

            $(this).toggleClass("selected");
            $("#candidato").toggleClass("selected");
            sessionStorage.tipoUsuario = "empresa";
            $(".two-cols h1 span").text(" buscando un candidato ideal.")
            $("#linkedin").hide();
        }
    });

    $("#iniciar-sesion").click(function(event){
        event.preventDefault();
    
        // Paso 1: Petición GET para obtener la cookie CSRF
        $.get('https://miguelgirona.com.es/quickhire_api/public/usuarios/token', function() {
            // Esperamos un poco para asegurarnos que la cookie se setea correctamente
            setTimeout(() => {
                csrfToken = getCookie('csrf_cookie_name');
    
                if (!csrfToken) {
                    $("#error").remove();
                    $("#login").after("<p id='error'>No se pudo obtener el token CSRF</p>");
                    return;
                }
    
                // Paso 2: Petición POST con token CSRF correcto
                $.ajax({
                    url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/login',
                    method: "POST",
                    contentType: 'application/json',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    },
                    data: JSON.stringify({
                        mail: $("#mail").val(),
                        contraseña: $("#password").val(),
                        csrf_test_name: csrfToken
                    }),
                    success: function(response) {
                        if(JSON.parse(JSON.stringify(jwt_decode(response.token)).tipo_usuario != "Administrador")){
                            sessionStorage.token = response.token;
                            sessionStorage.user = JSON.stringify(jwt_decode(response.token));
                            const user = JSON.parse(sessionStorage.user);
                            
                            if(user.tipo_usuario == "Administrador") window.location.href = "https://miguelgirona.com.es/quickhire/login?logout";
                            $("form")[0].reset();
        
                            if(user.tipo_usuario == "Candidato") window.location.href = "https://miguelgirona.com.es/quickhire/profile";
                            if(user.tipo_usuario == 'Empresa'){
                                getEmpresa(user.id, sessionStorage.token).then(e => {
                                    let empresa = e[0];

                                    if(empresa.validada == 0){
                                        $("#error").remove();
                                        $("#login").after("<p id='error'>Todavía no se ha validad la empresa, intentalo más tarde.</p>");
                                        setTimeout(()=>{
                                            window.location.href = "https://miguelgirona.com.es/quickhire/login?logout";
                                        },2500);
                                    } else {
                                        window.location.href = "https://miguelgirona.com.es/quickhire/empresa";
                                    }

                                });
                            }
                        } else {
                            $("#error").remove();
                            $("#login").after("<p id='error'>Error al iniciar sesión</p>");    
                        }
                    },
                    error: function(xhr, status, error) {
                        console.log(error);
                        console.log(xhr.responseText);
                        $("#error").remove();
                        $("#login").after("<p id='error'>Error al iniciar sesión</p>");
                    }
                });
            }, 200);
        });
    });
    
    
});