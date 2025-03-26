$(document).ready(function(){
        // Mostrar/Ocultar contraseña para password1
    $('#toggle-password1').on('click', function() {
        var passwordField = $('#password1');
        var type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);

        // Alternar el texto del botón
        var buttonText = passwordField.attr('type') === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
        $('#toggle-password1').text(buttonText);
    });

    // Mostrar/Ocultar contraseña para password2
    $('#toggle-password2').on('click', function() {
        var passwordField = $('#password2');
        var type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);

        // Alternar el texto del botón
        var buttonText = passwordField.attr('type') === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
        $('#toggle-password2').text(buttonText);
    });

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
        
        if (match) {
            return decodeURIComponent(match[2]);  // Aseguramos que se decodifique correctamente
        }
        return null;
    }
    var csrfToken = getCookie('csrf_cookie_name');
        // Validación de formulario
    $('#enviar').click(function(e) {
        e.preventDefault(); // Evita el envío del formulario hasta validar
        csrfToken = getCookie('csrf_cookie_name');
        // Limpiar mensajes de error previos
        $('.error').remove();
        $('input, textarea').removeClass('error-border');

        // Validación de nombre
        var nombre = $('#nombre').val();
        if (nombre.trim() === '') {
            showError('#nombre', 'Por favor, introduce tu nombre.');
            return false;
        }

        // Validación del email
        var email = $('#email').val();
        if (!validateEmail(email)) {
            showError('#email', 'Por favor, introduce un correo electrónico válido.');
            return false;
        }

        // Validación de contraseñas
        var password1 = $('#password1').val();
        var password2 = $('#password2').val();
        if (password1 !== password2) {
            showError('#password2', 'Las contraseñas no coinciden.');
            return false;
        }

        // Validar que la contraseña sea segura
        if (!validatePassword(password1)) {
            showError('#password1', 'La contraseña debe tener al menos 6 caracteres, incluir letras mayúsculas, minúsculas, números y caracteres especiales.');
            return false;
        }

        if (password1.length < 6) {
            showError('#password1', 'La contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        // Validación del checkbox de política de privacidad
        var politicaPrivacidad = $('#politica_privacidad').is(':checked');
        if (!politicaPrivacidad) {
            showError('#politica_privacidad', 'Debes aceptar la política de privacidad.');
            return false;
        }

        var hashedPassword = CryptoJS.SHA256(password1).toString(CryptoJS.enc.Base64);

        // Enviar los datos al servidor a través de AJAX
        $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios',
            method: 'POST',
            credentials: 'include',
            data: {
                nombre: nombre,
                mail: email,
                contraseña: hashedPassword,
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
                        $("form")[0].reset();
                        $("form").after("<div>¡Felicidades! Ahora formas parte de QuickHire, ya puedes <a href='login.php'>iniciar sesión</a></div>")

                    },
                    error: function() {
                    }
                });
                
            },
            error: function() {
                alert("usuario existente")
            }
        });

    });

    // Función para mostrar el mensaje de error y aplicar el borde rojo
    function showError(selector, message) {
        $(selector).addClass('error-border'); // Añadir borde rojo
        $(selector).after('<div class="error">' + message + '</div>'); // Añadir mensaje debajo
    }

    // Función para validar que la contraseña cumpla con los requisitos de seguridad
    function validatePassword(password) {
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
        return re.test(password);
    }


    // Función para validar el email
    function validateEmail(email) {
        var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

});