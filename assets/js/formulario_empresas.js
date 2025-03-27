$(document).ready(function() {

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
        
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }

    // Mostrar ocultar contraseña
    $('#toggle-password1').on('click', function() {
        var passwordField = $('#password1');
        var type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);

        var buttonText = passwordField.attr('type') === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
        $('#toggle-password1').text(buttonText);
    });

    $('#toggle-password2').on('click', function() {
        var passwordField = $('#password2');
        var type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);

        var buttonText = passwordField.attr('type') === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
        $('#toggle-password2').text(buttonText);
    });
    var csrfToken = getCookie('csrf_cookie_name');
    $('#enviar').click(function(e) {
        e.preventDefault(); // Evita el envío del formulario hasta validar
        csrfToken = getCookie('csrf_cookie_name');
        $('.error').remove();
        $('input, textarea').removeClass('error-border');

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

        if (!validatePassword(password1)) {
            showError('#password1', 'La contraseña debe tener al menos 6 caracteres, incluir letras mayúsculas, minúsculas, números y caracteres especiales.');
            return false;
        }

        if (password1.length < 6) {
            showError('#password1', 'La contraseña debe tener al menos 6 caracteres.');
            return false;
        }


        var nombre = $('#nombre').val();
        if (nombre.trim() === '') {
            showError('#nombre', 'Por favor, introduce tu nombre.');
            return false;
        }

        var nombreEmpresa = $('#nombre_empresa').val();
        if (nombreEmpresa.trim() === '') {
            showError('#nombre_empresa', 'Por favor, introduce el nombre de tu empresa.');
            return false;
        }

        var telefono = $('#telefono').val();
        if (!validateTelefono(telefono)) {
            showError('#telefono', 'Por favor, introduce un número de teléfono válido (9 dígitos).');
            return false;
        }

        var nif = $('#nif').val();
        if (!validateNIF(nif)) {
            showError('#nif', 'Por favor, introduce un NIF o CIF válido.');
            return false;
        }

        var descripcion = $('#descripcion').val();
        if (descripcion.trim() === '') {
            showError('#descripcion', 'Por favor, introduce una descripción de tu empresa.');
            return false;
        }

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
                telefono:telefono,
                tipo_usuario: "Empresa",
                csrf_test_name: csrfToken // Agregar el token CSRF
            },
            headers: {
                'X-CSRF-TOKEN': csrfToken // También enviarlo en el header
            },
            success: function(response) {
                csrfToken = getCookie('csrf_cookie_name');
                $.ajax({
                    url: 'https://miguelgirona.com.es/quickhire_api/public/empresas',
                    method: 'POST',
                    credentials: 'include',
                    data: {
                        id_usuario: response.id,
                        nombre_empresa: nombreEmpresa,
                        identificacion: nif,
                        descripcion: descripcion,
                        plan:$("#plan").val(),
                        csrf_test_name: csrfToken
                    },
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    },
                    success: function() {
                        $("form")[0].reset();
                        $("#enviar").after("<div>¡Felicidades! Estás a un paso de unirte a QuickHire, cuando comprobemos tus datos podrás iniciar sesión, te avisaremos.</div>")

                    },
                    error: function() {
                        alert("Empresa existente")
                    }
                });
                
            },
            error: function() {
                alert("usuario existente")
            }
        });

        // Aquí podrías hacer el envío del formulario
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

    // Función para validar el teléfono (solo 9 dígitos)
    function validateTelefono(telefono) {
        var re = /^[0-9]{9}$/;
        return re.test(telefono);
    }

    // Función para validar el NIF/CIF
    function validateNIF(nif) {
        var re = /^(?:[0-9]{8}[A-Za-z]{1}|[A-Za-z]{1}[0-9]{8})$/;
        return re.test(nif);
    }

});
