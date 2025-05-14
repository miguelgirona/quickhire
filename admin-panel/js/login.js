$(document).ready(function () {
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }

    var csrfToken = getCookie('csrf_cookie_name');

    $("#iniciar-sesion").click(function (event) {
        event.preventDefault();

        // Paso 1: Petición GET para obtener la cookie CSRF
        $.get('https://miguelgirona.com.es/quickhire_api/public/usuarios/token', function () {
            // Esperamos un poco para asegurarnos de que la cookie se setea correctamente
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
                    success: function (response) {
                        const decodedToken = jwt_decode(response.token);
                        sessionStorage.token = response.token;
                        sessionStorage.user = JSON.stringify(decodedToken);
                        const user = JSON.parse(sessionStorage.user);

                        // Verificar si el usuario es administrador
                        if (user.tipo_usuario === "Administrador") {
                            window.location.href = "https://miguelgirona.com.es/quickhire/admin-panel/";
                        } else {
                            $(".error-message").remove();
                            $("#login-form").after("<p class='error-message'>No tienes permisos para acceder al panel de administración</p>");
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log(error);
                        console.log(xhr.responseText);
                        $(".error-message").remove();
                        $("#login-form").after("<p class='error-message'>Error al iniciar sesión</p>");
                    }
                });
            }, 200); // Pequeño delay para que el navegador guarde la cookie
        });
    });
});