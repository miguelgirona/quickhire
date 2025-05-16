$(document).ready(function(){
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
        
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }
    var csrfToken = getCookie('csrf_cookie_name');

    if(!sessionStorage.user){
        window.location.href = "https://miguelgirona.com.es/quickhire"
    }
    
    let user = JSON.parse(sessionStorage.user);

    function getUsuario(id, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/usuarios/" + id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function getEmpresa(id, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/empresas/showByUserId/" + id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function getSector(id = null){
        if(id == null){
            return $.ajax({
                url: "https://miguelgirona.com.es/quickhire_api/public/sectores/",
                method: "GET"
            }); 
        }
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/sectores/"+id,
            method: "GET"
        });
    }
    
    getSector().then(sectores => {
        for(let s of sectores){
            $("#editar_sector").append(
                "<option value="+ s.id +">"+ s.sector +"</option>"
            );
        }
        
    })

    getEmpresa(user.id, sessionStorage.token).then(emp => {
        console.log(user);
        let empresa = emp[0];
        console.log(empresa);

        if(empresa.activa == 1) {
            $("#activar-plan").remove();
        }

        if(empresa.activa == 0){
            $("#mejorar-plan").remove();
        }
        if(empresa.plan == "Premium" && empresa.activa == 1) {
            $("#mejorar-plan").remove();
            $("#cambiar-plan").remove();
        }
        
        getUsuario(user.id,sessionStorage.token).then(usuario => {
            //datos usuario
            $("#img_perfil").attr('src', usuario.url_imagen);
            $("#nombre").text(usuario.nombre == "" ? "¡Completa este campo!" : usuario.nombre);
            $("#mail").text(usuario.mail == "" ? "¡Completa este campo!" : usuario.mail);
            $("#telefono").text(usuario.telefono == "" ? "¡Completa este campo!" : usuario.telefono);

            //EDITAR DATOS USUARIO
            $("#editar-datos-usuario").click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                $("#editar_nombre").val(usuario.nombre);
                $("#editar_mail").val(usuario.mail);
                $("#editar_telefono").val(usuario.telefono);

                $("#form-dialog-datos-usuario").dialog({
                    modal: true,
                    width: 400,  
                    buttons: {
                        "Guardar": function() {
                            $.ajax({
                                url: "https://miguelgirona.com.es/quickhire_api/public/usuarios/" + user.id,
                                method: "PUT",
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    nombre: $("#editar_nombre").val(),
                                    mail: $("#editar_mail").val(),
                                    url_imagen: $("#imagen").val() == "" ? usuario.url_imagen : $("#imagen").val(),
                                    telefono: $("#editar_telefono").val(),
                                }),
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.token,
                                    'X-CSRF-TOKEN': csrfToken,
                                },
                                success: function(response) {
                                    csrfToken = getCookie('csrf_cookie_name');
                                    if($("#imagen").val() != ""){
                                        csrfToken = getCookie('csrf_cookie_name');
                                        var formData = new FormData();
                                        formData.append('imagen', $('#imagen')[0].files[0]); // Agregamos el archivo de imagen

                                        // Hacemos la solicitud AJAX
                                        $.ajax({
                                            url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/guardarfoto/'+user.id,  // URL de tu servidor para manejar la imagen
                                            type: 'POST',
                                            data: formData,  // Enviamos la imagen
                                            contentType: false,  // No necesitamos especificar el tipo de contenido
                                            processData: false,
                                            headers: {
                                                "Authorization": "Bearer " + sessionStorage.token,
                                                'X-CSRF-TOKEN': csrfToken,
                                            },  // Impide que jQuery intente convertir los datos en una cadena de consulta
                                            success: function(response) {
                                                location.reload();
                                            },
                                            error: function(xhr, status, error) {
                                                console.error('Error al subir la imagen:', error);
                                                console.log(xhr.responseText);
                                                
                                            }
                                        });
                                    } else {
                                        location.reload();
                                    }
                                },
                                error: function(xhr, status, error) {
                                    csrfToken = getCookie('csrf_cookie_name');
                                    const response = xhr.responseText;

                                    try {
                                        const json = JSON.parse(response);
                                        if (json.message && json.message.includes("Duplicate entry") && json.message.includes("for key 'mail'")) {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Correo duplicado',
                                                text: 'Ese correo ya está en uso por otro usuario.',
                                            });
                                        } else {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Error',
                                                text: 'Error al editar el usuario',
                                                footer: `<pre>${json.message}</pre>`
                                            });
                                        }
                                    } catch (e) {
                                        // Si no se puede parsear como JSON
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error inesperado',
                                            text: 'No se pudo procesar la respuesta del servidor.',
                                            footer: `<pre>${xhr.responseText}</pre>`
                                        });
                                    }

                                    console.error(xhr.responseText);
                                }
                            });
                            
                        },
                        "Cancelar": function() {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        });


        //datos empresa
        $("#nombre_empresa").text(empresa.nombre_empresa == "" ? "¡Completa este campo!" : empresa.nombre_empresa);
        getSector(empresa.id_sector).then(sector => $("#sector").text(sector[0].sector == null ? "¡Completa este campo!" : sector[0].sector));
        $("#identificacion").text(empresa.identificacion);
        $("#ciudad").text((empresa.ciudad == null || empresa.pais == null) ? "¡Completa este campo!" : empresa.ciudad+", "+empresa.pais);
        $("#sitio_web").attr('href',empresa.sitio_web == null ? "" : empresa.sitio_web);
        $("#sitio_web").text(empresa.sitio_web == null ? "¡Completa este campo!" : empresa.sitio_web);

        //EDITAR DATOS EMPRESA
        $("#editar-datos-empresa").click(function(){
            csrfToken = getCookie('csrf_cookie_name');
            $("#editar_nombre_empresa").val(empresa.nombre_empresa);
            $("#editar_sector").val(empresa.id_sector);
            $("#editar_sitio").val(empresa.sitio_web);
            $("#editar_ciudad").val(empresa.ciudad),
            $("#editar_pais").val(empresa.pais);

            $("#form-dialog-datos-empresa").dialog({
                modal: true,
                width: 400,
                buttons: {
                    "Guardar": function() {
                        $.ajax({
                            url: "https://miguelgirona.com.es/quickhire_api/public/empresas/" + user.id,
                            method: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                nombre_empresa: $("#editar_nombre_empresa").val(),
                                id_sector: $("#editar_sector").val(),
                                sitio_web: $("#editar_sitio").val(),
                                ciudad: $("#editar_ciudad").val(),
                                pais: $("#editar_pais").val()
                            }),
                            headers: {
                                "Authorization": "Bearer " + sessionStorage.token,
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            success: function(response) {
                                location.reload();
                            },
                            error: function(xhr, status, error) {
                                alert("Error al editar EMPRESA: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                    },
                    "Cancelar": function() {
                        $(this).dialog("close");
                    }
                }
            });

        });

        //descripcion
        $("#descripcion").text(empresa.descripcion == "" ? "¡Completa este campo!" : empresa.descripcion);
        
        //EDITAR DESCRIPCION
        $("#editar-descripcion").click(function(){
            csrfToken = getCookie('csrf_cookie_name');
            $("#descripcion_empresa").val(empresa.descripcion);

            $("#form-dialog-desc").dialog({
                modal: true,
                width: 1000,
                buttons: {
                    "Guardar": function(){
                        
                        $.ajax({
                            url: "https://miguelgirona.com.es/quickhire_api/public/empresas/" + user.id,
                            method: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                descripcion: $("#descripcion_empresa").val(),
                            }),
                            headers: {
                                "Authorization": "Bearer " + sessionStorage.token,
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            success: function(response) {
                                location.reload();
                            },
                            error: function(xhr, status, error) {
                                alert("Error al editar EMPRESA: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                        
                    },
                    "Cancelar": function(){
                        $(this).dialog("close");
                    }
                }
            });
        });

        // plan
        $("#plan").text(empresa.plan);

        //eliminar cuenta
        $("#eliminar_cuenta").click(function(){
            csrfToken = getCookie('csrf_cookie_name');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Vas a eliminar tu cuenta, esta acción no se puede revertir.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#595bd4',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    csrfToken = getCookie('csrf_cookie_name');
                    $.ajax({
                        url: 'https://miguelgirona.com.es/quickhire_api/public/empresas/' + user.id,
                        type: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + sessionStorage.token,
                            'X-CSRF-TOKEN': csrfToken,
                        },
                        success: function (response) {
                            csrfToken = getCookie('csrf_cookie_name');
                            $.ajax({
                                url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/' + user.id,
                                type: 'DELETE',
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.token,
                                    'X-CSRF-TOKEN': csrfToken,
                                },
                                success: function (response) {
                                    window.location.href = "/quickhire/login.php?logout";
                                },
                                error: function (xhr, status, error) {
                                    console.log(xhr.responseText);
                                }
                            });
                        },
                        error: function (xhr, status, error) {
                            console.log(xhr.responseText);
                        }
                    });
                }
            });
            
        });
    });
});