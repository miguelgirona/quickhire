$(document).ready(function(){

    $(".seccion").click(function(){
        $(this).next().toggle();
        
    });

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

    function getSectores(){
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/sectores",
            method: "GET"
        });
    }


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

    function getCandidato(id, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }
    
    getSectores().then(sectores => {
        for(let s of sectores){
            $("#sector").append(
                "<option value="+ s.sector +">"+ s.sector +"</option>"
            );
        }
        
    })

    getCandidato(user.id,sessionStorage.token).then(candidato =>{
            
        let cand = candidato[0];
        
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
                        url: 'https://miguelgirona.com.es/quickhire_api/public/candidatos/' + user.id,
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

        //cv
        console.log(cand.url_cv);
        if(cand.url_cv == null){
            $("#cv").html(
                "<form enctype='multipart/form-data'>"+
                    "<input required type='file' id='url_cv' accept='application/pdf'>"+
                    "<button class='editar' id='enviar_cv'>Subir CV</button>"+
                "</form>"
            );
        } else {
            $("#cv").html(
                "<a href='"+cand.url_cv+"' target='_blank'>VER CV</a>"+
                "<form enctype='multipart/form-data'>"+
                "<input required type='file' id='url_cv' accept='application/pdf'>"+
                "<button class='editar' id='enviar_cv'>Actualizar CV</button>"+
            "</form>"
            );
        }

        //añadir cv
        $("#enviar_cv").click(function(event){
            event.preventDefault();
            if ($("#url_cv").val() != "") {
                var file = $('#url_cv')[0].files[0];
            
                // Validar que sea un archivo PDF
                if (file.type !== 'application/pdf') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Archivo no válido',
                        text: 'Por favor, selecciona un archivo en formato PDF.',
                        confirmButtonColor: '#595bd4'
                    });
                    return; // Detiene la ejecución
                }
            
                csrfToken = getCookie('csrf_cookie_name');
                var formData = new FormData();
                formData.append('url_cv', file);
            
                $.ajax({
                    url: 'https://miguelgirona.com.es/quickhire_api/public/candidatos/guardarCV/' + user.id,
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.token,
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    success: function (response) {
                        location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error('Error al subir el CV:', error);
                        console.log(xhr.responseText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al subir el CV',
                            text: 'Ocurrió un problema al intentar subir el archivo.',
                            confirmButtonColor: '#595bd4'
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Selecciona un archivo',
                    text: 'Por favor, selecciona un archivo en formato PDF.',
                    confirmButtonColor: '#595bd4'
                });
            } 

        });

        //AÑADIR NUEVO IDIOMA
        $("#nuevo-idi").click(function(){
            csrfToken = getCookie('csrf_cookie_name');
            $("#form-idi")[0].reset();
            $("#form-dialog-idi").dialog({
                modal: true,  // Hace que sea un diálogo modal
                width: 400,   // Puedes ajustar el ancho del diálogo
                buttons: {
                    "Guardar": function() {
                        // Recolectar datos del formulario
                        let newIdi ={
                            id: Date.now(),
                            idioma: $("#idioma").val(),
                            nivel: $("#nivel_idi").val(),
                        } ;
                        let idiomasExistentes = JSON.parse(cand.idiomas);
                        
                        idiomasExistentes.push(newIdi);
                        console.log(idiomasExistentes);
                        
                        if(newIdi.idioma == ""){
                            alert("No puedes dejar esos campos vacios");
                        } else {
                            
                            // Enviar los datos usando AJAX
                            $.ajax({
                                url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                method: "PUT",
                                credentials: 'include',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    idiomas: idiomasExistentes, // Convertir el objeto a JSON
                                }),
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.token, // Agregar token de autorización
                                    'X-CSRF-TOKEN': csrfToken, // Agregar token CSRF si es necesario
                                },
                                success: function(response) {                                        
                                    $("#form-dialog-idi").dialog("close");
                                    location.reload();
                                    
                                },
                                error: function(xhr, status, error) {
                                    alert("Error al añadir idioma: " + error);
                                    console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
                                }
                            });
                        }
                        
                    },
                    "Cancelar": function() {
                        $(this).dialog("close");
                    }
                }
            });
        });

        //AÑADIR NUEVA HABILIDAD
        $("#nueva-hab").click(function(){
            csrfToken = getCookie('csrf_cookie_name');
            $("#form-hab")[0].reset();
            $("#form-dialog-hab").dialog({
                modal: true,  // Hace que sea un diálogo modal
                width: 400,   // Puedes ajustar el ancho del diálogo
                buttons: {
                    "Guardar": function() {
                        // Recolectar datos del formulario
                        let newHab ={
                            id: Date.now(),
                            habilidad: $("#habilidad").val(),
                            nivel: $("#nivel").val(),
                        } ;
                        let habilidadesExistentes = JSON.parse(cand.habilidades);

                        habilidadesExistentes.push(newHab);
                        console.log(habilidadesExistentes);
                        
                        if(newHab.habilidad == ""){
                            alert("No puedes dejar esos campos vacios");
                        } else {
                            
                            // Enviar los datos usando AJAX
                            $.ajax({
                                url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                method: "PUT",
                                credentials: 'include',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    habilidades: habilidadesExistentes, // Convertir el objeto a JSON
                                }),
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.token, // Agregar token de autorización
                                    'X-CSRF-TOKEN': csrfToken, // Agregar token CSRF si es necesario
                                },
                                success: function(response) {
                                    $("#form-dialog-hab").dialog("close");
                                    location.reload();
                                },
                                error: function(xhr, status, error) {
                                    alert("Error al añadir habilidad: " + error);
                                    console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
                                }
                            });
                        }
                        
                    },
                    "Cancelar": function() {
                        $(this).dialog("close");
                    }
                }
            });
        });

        //AÑADIR NUEVO ESTUDIO
        $("#nuevo-est").click(function(){
            csrfToken = getCookie('csrf_cookie_name');
            $("#form-est")[0].reset();
            $("#form-dialog-est").dialog({
                modal: true,
                width: 400,
                buttons: {
                    "Guardar": function() {
                        // Recolectar datos del formulario
                        let newEst ={
                            id: Date.now(),
                            nivel_estudios: $("#nivel_estudios").val(),
                            titulo: $("#titulo").val(),
                            centro: $("#centro").val(),
                            fecha_inicio: $("#fecha_inicio_est").val(),
                            fecha_fin: $("#fecha_fin_est").val() == "" ? "actual" : $("#fecha_fin_est").val()
                            
                        } ;
                        let estudiosExistentes = JSON.parse(cand.educacion);
                        estudiosExistentes.push(newEst);
                        console.log(estudiosExistentes);
                        
                        if(newEst.fecha_fin !== "actual" && new Date(newEst.fecha_inicio) > new Date(newEst.fecha_fin)){
                            alert("duracion invalida");
                        }else if(newEst.titulo == "" || newEst.centro == "" || newEst.fecha_inicio == ""){
                            alert("No puedes dejar esos campos vacios");
                        } else {
                            
                            // Enviar los datos usando AJAX
                            $.ajax({
                                url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                method: "PUT",
                                credentials: 'include',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    educacion: estudiosExistentes, // Convertir el objeto a JSON
                                }),
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.token, // Agregar token de autorización
                                    'X-CSRF-TOKEN': csrfToken, // Agregar token CSRF si es necesario
                                },
                                success: function(response) {
                                    $("#form-dialog-est").dialog("close");
                                    location.reload();
                                },
                                error: function(xhr, status, error) {
                                    alert("Error al añadir estudio: " + error);
                                    console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
                                }
                            });
                        }
                        
                    },
                    "Cancelar": function() {
                        $(this).dialog("close");
                    }
                }
            });
        });

        //AÑADIR NUEVA EXPERIENCIA
        $("#nueva-exp").click(function(){
            csrfToken = getCookie('csrf_cookie_name');
            $("#form-exp")[0].reset();
            $("#form-dialog-exp").dialog({
                modal: true,  // Hace que sea un diálogo modal
                width: 400,   // Puedes ajustar el ancho del diálogo
                buttons: {
                    "Guardar": function() {
                        // Recolectar datos del formulario
                        let newExp ={
                            id: Date.now(),
                            nombre_puesto: $("#nombre_puesto").val(),
                            empresa: $("#empresa").val(),
                            sector: $("#sector").val(),
                            descripcion_puesto: $("#descripcion_puesto").val(),
                            fecha_inicio: $("#fecha_inicio").val(),
                            fecha_fin: $("#fecha_fin").val() == "" ? "actual" : $("#fecha_fin").val()
                        } ;
                        let experienciasExistentes = JSON.parse(cand.experiencia);
                        experienciasExistentes.push(newExp);
                        console.log(experienciasExistentes);
                        
                        if(new Date(newExp.fecha_inicio) > new Date(newExp.fecha_fin) && newExp.fecha_fin !== "actual"){
                            alert("duracion invalida")
                        } else if(newExp.nombre_puesto == "" || newExp.empresa == "" || newExp.descripcion_puesto == "" || newExp.fecha_inicio == ""){
                            alert("No puedes dejar esos campos vacios");
                        } else {
                            
                            // Enviar los datos usando AJAX
                            $.ajax({
                                url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                method: "PUT",
                                credentials: 'include',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    experiencia: experienciasExistentes, // Convertir el objeto a JSON
                                }),
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.token, // Agregar token de autorización
                                    'X-CSRF-TOKEN': csrfToken, // Agregar token CSRF si es necesario
                                },
                                success: function(response) {
                                    $("#form-dialog-exp").dialog("close");
                                    location.reload();
                                },
                                error: function(xhr, status, error) {
                                    alert("Error al añadir experiencia: " + error);
                                    console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
                                }
                            });
                        }
                        
                    },
                    "Cancelar": function() {
                        $(this).dialog("close");
                    }
                }
            });
        });

        //datos personales
        getUsuario(user.id,sessionStorage.token).then(usuario =>{       
            
            $("#img_perfil")[0].src = usuario.url_imagen;
            $("#nombre").text(cand.nombre == "" ? "¡Completa este campo!" : cand.nombre);
            $("#mail").text(usuario.mail == "" ? "¡Completa este campo!" : usuario.mail);
            $("#telefono").text(usuario.telefono == "" ? "¡Completa este campo!" : usuario.telefono);
            $("#ciudad").text((cand.ciudad == null || cand.pais == null) ? "¡Completa este campo!" : cand.ciudad+", "+cand.pais);

            //editar datos personales
            $("#editar-datos-personales").click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                $("#editar_nombre").val(cand.nombre);
                $("#editar_mail").val(usuario.mail);
                $("#editar_telefono").val(usuario.telefono);
                $("#editar_ciudad").val(cand.ciudad);
                $("#editar_pais").val(cand.pais);

                $("#form-dialog-datos-personales").dialog({
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
                                    $.ajax({
                                        url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                        method: "PUT",
                                        contentType: 'application/json',
                                        data: JSON.stringify({
                                            nombre: $("#editar_nombre").val(),
                                            ciudad: $("#editar_ciudad").val(),
                                            pais: $("#editar_pais").val()
                                        }),
                                        headers: {
                                            "Authorization": "Bearer " + sessionStorage.token,
                                            'X-CSRF-TOKEN': csrfToken,
                                        },
                                        success: function(response) {
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
                                            alert("Error al editar CANDIDATO: " + error);
                                            console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
            
                                        }
                                    });
                                },
                                error: function(xhr, status, error) {
                                    alert("Error al editar USUARIO: " + error);
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
        })

        //experiencia
        for(let e of JSON.parse(cand.experiencia)){
            $("#experiencia-datos").append(
                "<div style='position:relative;' class='exp' data-id='"+ e.id +"'>"+
                    "<h3>Nombre del puesto:</h3>"+
                    "<p>"+e.nombre_puesto+"</p>"+
                    "<h3>Empresa:</h3>"+
                    "<p>"+e.empresa+"</p>"+
                    "<h3>Sector:</h3>"+
                    "<p>"+e.sector+"</p>"+
                    "<h3>Descripción:</h3>"+
                    "<p>"+e.descripcion_puesto+"</p>"+
                    "<h3>Duración:</h3>"+
                    "<p>"+new Date(e.fecha_inicio).toLocaleDateString("es-ES")+" - "+(e.fecha_fin == "actual" ? e.fecha_fin : new Date(e.fecha_fin).toLocaleDateString("es-ES"))+"</p>"+
                    "<button class='eliminar-top-right' id=eliminar-exp-"+e.id+"><img src='/quickhire/assets/img/iconos/eliminar.png' alt='botón eliminar'></button>"+
                    "<button class='editar-top-right' id=editar-exp-"+e.id+"><img src='/quickhire/assets/img/iconos/editar.png' alt='botón editar'></button>"+
                "</div>"
            );

            //eliminar experiencia
            $("#eliminar-exp-"+e.id).click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Vas a eliminar esta experiencia, esta acción no se puede revertir.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#595bd4',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let experienciasExistentes = JSON.parse(cand.experiencia);
                        console.log(experienciasExistentes);
                        
                        let nuevasExperiencias = experienciasExistentes.filter(exp => exp.id !== e.id);
                        console.log(nuevasExperiencias);
                        
                        $.ajax({
                            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                            method: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                experiencia: nuevasExperiencias,
                            }),
                            headers: {
                                "Authorization": "Bearer " + sessionStorage.token,
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            success: function(response) {
                                cand.experiencia = JSON.stringify(nuevasExperiencias);
                                $(".exp[data-id='"+ e.id +"']").remove(); // Eliminar el elemento del DOM
                            },
                            error: function(xhr, status, error) {
                                alert("Error al eliminar experiencia: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                    }
                });
            });

            //editar experiencia
            $("#editar-exp-"+e.id).click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                $("#nombre_puesto").val(e.nombre_puesto);
                $("#empresa").val(e.empresa);
                $("#sector").val(e.sector);
                $("#descripcion_puesto").val(e.descripcion_puesto);
                $("#fecha_inicio").val(e.fecha_inicio);
                if ($("#fecha_fin").val() != "actual") $("#fecha_fin").val(e.fecha_fin)


                $("#form-dialog-exp").dialog({
                    modal: true,  
                    width: 400,   
                    buttons: {
                        "Guardar": function() {
                            let experienciasExistentes = JSON.parse(cand.experiencia);
                            let expEditar = experienciasExistentes.filter(exp => exp.id == e.id)[0];
                            console.log(expEditar);
                            
                            expEditar.nombre_puesto = $("#nombre_puesto").val();
                            expEditar.empresa = $("#empresa").val();
                            expEditar.sector = $("#sector").val();
                            expEditar.descripcion_puesto = $("#descripcion_puesto").val();
                            expEditar.fecha_inicio = $("#fecha_inicio").val();
                            expEditar.fecha_fin = $("#fecha_fin").val() == "" ? "actual" : $("#fecha_fin").val();

                            if(new Date(expEditar.fecha_inicio) > new Date(expEditar.fecha_fin) && expEditar.fecha_fin !== "actual"){
                                alert("duracion invalida")
                            } else if(expEditar.nombre_puesto == "" || expEditar.empresa == "" || expEditar.descripcion_puesto == "" || expEditar.fecha_inicio == ""){
                                alert("No puedes dejar esos campos vacios");
                            } else {
                                $.ajax({
                                    url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                    method: "PUT",
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        experiencia: experienciasExistentes,
                                    }),
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.token,
                                        'X-CSRF-TOKEN': csrfToken,
                                    },
                                    success: function(response) {
                                        location.reload();
                                    },
                                    error: function(xhr, status, error) {
                                        alert("Error al editar experiencia: " + error);
                                        console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
                                    }
                                });
                            }
                            
                        },
                        "Cancelar": function() {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        }

        //estudios
        for(let e of JSON.parse(cand.educacion)){
            $("#estudios-datos").append(
                "<div style='position:relative;' class='est' data-id='"+ e.id +"'>"+
                    "<h3>Nivel:</h3>"+
                    "<p>"+ e.nivel_estudios +"</p>"+
                    "<h3>Título:</h3>"+
                    "<p>"+ e.titulo +"</p>"+
                    "<h3>Centro:</h3>"+
                    "<p>"+ e.centro +"</p>"+
                    "<h3>Duración:</h3>"+
                    "<p>"+ new Date(e.fecha_inicio).toLocaleDateString("es-ES") +" - "+ (e.fecha_fin == "actual" ? e.fecha_fin : new Date(e.fecha_fin).toLocaleDateString("es-ES")) +"</p>"+
                    "<button class='eliminar-top-right' id=eliminar-est-"+e.id+"><img src='/quickhire/assets/img/iconos/eliminar.png' alt='botón eliminar'></button>"+
                    "<button class='editar-top-right' id=editar-est-"+e.id+"><img src='/quickhire/assets/img/iconos/editar.png' alt='botón editar'></button>"+
                "</div>"
            );

            //eliminar estudio
            $("#eliminar-est-"+e.id).click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Vas a eliminar este estudio, esta acción no se puede revertir.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#595bd4',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let estudiosExistentes = JSON.parse(cand.educacion);
                        console.log(estudiosExistentes);
                        
                        let nuevosEstudios = estudiosExistentes.filter(est => est.id !== e.id);
                        console.log(nuevosEstudios);
                        
                        $.ajax({
                            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                            method: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                educacion: nuevosEstudios,
                            }),
                            headers: {
                                "Authorization": "Bearer " + sessionStorage.token,
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            success: function(response) {
                                cand.educacion = JSON.stringify(nuevosEstudios);
                                $(".est[data-id='"+ e.id +"']").remove(); // Eliminar el elemento del DOM
                            },
                            error: function(xhr, status, error) {
                                alert("Error al eliminar estudio: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                    }
                });
            });

            //editar estudio
            $("#editar-est-"+e.id).click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                $("#nivel_estudios").val(e.nivel_estudios);
                $("#titulo").val(e.titulo);
                $("#centro").val(e.centro);
                $("#fecha_inicio_est").val(e.fecha_inicio);
                if ($("#fecha_fin_est").val() != "actual") $("#fecha_fin_est").val(e.fecha_fin)

                $("#form-dialog-est").dialog({
                    modal: true,  // Hace que sea un diálogo modal
                    width: 400,   // Puedes ajustar el ancho del diálogo
                    buttons: {
                        "Guardar": function() {
                            let estudiosExistentes = JSON.parse(cand.educacion);
                            let estEditar = estudiosExistentes.filter(est => est.id == e.id)[0];
                            console.log(estEditar);
                            
                            estEditar.nivel_estudios = $("#nivel_estudios").val();
                            estEditar.titulo = $("#titulo").val();
                            estEditar.centro = $("#centro").val();
                            estEditar.fecha_inicio = $("#fecha_inicio_est").val();
                            estEditar.fecha_fin = $("#fecha_fin_est").val() == "" ? "actual" : $("#fecha_fin_est").val();

                            if(estEditar.fecha_fin !== "actual" && new Date(estEditar.fecha_inicio) > new Date(estEditar.fecha_fin)){
                                alert("duracion invalida");
                            }else if(estEditar.titulo == "" || estEditar.centro == "" || estEditar.fecha_inicio == ""){
                                alert("No puedes dejar esos campos vacios");
                            } else {
                                $.ajax({
                                    url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                    method: "PUT",
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        educacion: estudiosExistentes,
                                    }),
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.token,
                                        'X-CSRF-TOKEN': csrfToken,
                                    },
                                    success: function(response) {
                                        location.reload();
                                    },
                                    error: function(xhr, status, error) {
                                        alert("Error al editar experiencia: " + error);
                                        console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
        
                                    }
                                });
                            }
                            
                        },
                        "Cancelar": function() {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        }

        //habilidades
        for(let h of JSON.parse(cand.habilidades)){
            $("#habilidades-datos").append(
                "<div style='position:relative;' class='hab' data-id='"+ h.id +"'>"+
                    "<h3>"+ h.habilidad +"</h3>"+
                    "<p>"+ h.nivel +"</p>"+
                    "<button class='eliminar-top-right' id=eliminar-hab-"+h.id+"><img src='/quickhire/assets/img/iconos/eliminar.png' alt='botón eliminar'></button>"+
                    "<button class='editar-top-right' id=editar-hab-"+h.id+"><img src='/quickhire/assets/img/iconos/editar.png' alt='botón editar'></button>"+
                "</div>"
            );

            //eliminar habilidad
            $("#eliminar-hab-"+h.id).click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Vas a eliminar esta habilidad, esta acción no se puede revertir.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#595bd4',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let habilidadExistentes = JSON.parse(cand.habilidades);
                        console.log(habilidadExistentes);
                        
                        let nuevasHabilidades = habilidadExistentes.filter(hab => hab.id !== h.id);
                        console.log(nuevasHabilidades);
                        
                        $.ajax({
                            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                            method: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                habilidades: nuevasHabilidades,
                            }),
                            headers: {
                                "Authorization": "Bearer " + sessionStorage.token,
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            success: function(response) {
                                cand.habilidades = JSON.stringify(nuevasHabilidades);
                                $(".hab[data-id='"+ h.id +"']").remove(); // Eliminar el elemento del DOM
                            },
                            error: function(xhr, status, error) {
                                alert("Error al eliminar habilidad: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
                            }
                        });
                    }
                });
            });

            //editar habilidad
            $("#editar-hab-"+h.id).click(function(){
                $("#habilidad").val(h.habilidad);
                $("#nivel").val(h.nivel);
                csrfToken = getCookie('csrf_cookie_name');
                $("#form-dialog-hab").dialog({
                    modal: true,  // Hace que sea un diálogo modal
                    width: 400,   // Puedes ajustar el ancho del diálogo
                    buttons: {
                        "Guardar": function() {
                            let habilidadesExistentes = JSON.parse(cand.habilidades);
                            let habEditar = habilidadesExistentes.filter(hab => hab.id == h.id)[0];
                            console.log(habEditar);
                            
                            habEditar.habilidad = $("#habilidad").val();
                            habEditar.nivel = $("#nivel").val();

                            if(habEditar.habilidad == ""){
                                alert("No puedes dejar esos campos vacios");
                            } else {
                                $.ajax({
                                    url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                    method: "PUT",
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        habilidades: habilidadesExistentes,
                                    }),
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.token,
                                        'X-CSRF-TOKEN': csrfToken,
                                    },
                                    success: function(response) {
                                        location.reload();
                                    },
                                    error: function(xhr, status, error) {
                                        alert("Error al editar habilidad: " + error);
                                        console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
                                    }
                                });
                            }
                            
                        },
                        "Cancelar": function() {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        }

        //idiomas
        for(let i of JSON.parse(cand.idiomas)){
            $("#idiomas-datos").append(
                "<div style='position:relative;' class='idi' data-id='"+ i.id +"'>"+
                    "<h3>"+ i.idioma +"</h3>"+
                    "<p>"+ i.nivel +"</p>"+
                    "<button class='eliminar-top-right' id=eliminar-idi-"+i.id+"><img src='/quickhire/assets/img/iconos/eliminar.png' alt='botón eliminar'></button>"+
                    "<button class='editar-top-right' id=editar-idi-"+i.id+"><img src='/quickhire/assets/img/iconos/editar.png' alt='botón editar'></button>"+
                "</div>"
            );

            //eliminar idioma
            $("#eliminar-idi-"+i.id).click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Vas a eliminar este idioma, esta acción no se puede revertir.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#595bd4',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let idiomasExistentes = JSON.parse(cand.idiomas);
                        console.log(idiomasExistentes);
                        
                        
                        let nuevosIdiomas = idiomasExistentes.filter(idi => idi.id !== i.id);
                        console.log(nuevosIdiomas);
                        
                        $.ajax({
                            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                            method: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                idiomas: nuevosIdiomas,
                            }),
                            headers: {
                                "Authorization": "Bearer " + sessionStorage.token,
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            success: function(response) {
                                cand.idiomas = JSON.stringify(nuevosIdiomas);
                                $(".idi[data-id='"+ i.id +"']").remove(); // Eliminar el elemento del DOM
                            },
                            error: function(xhr, status, error) {
                                alert("Error al eliminar idioma: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                    }
                });

            });

            //editar idioma
            $("#editar-idi-"+i.id).click(function(){
                $("#idioma").val(i.idioma);
                $("#nivel_idi").val(i.nivel);
                csrfToken = getCookie('csrf_cookie_name');
                $("#form-dialog-idi").dialog({
                    modal: true,  // Hace que sea un diálogo modal
                    width: 400,   // Puedes ajustar el ancho del diálogo
                    buttons: {
                        "Guardar": function() {
                            let idiomasExistentes = JSON.parse(cand.idiomas);
                            let idiEditar = idiomasExistentes.filter(idi => idi.id == i.id)[0];
                            console.log(idiEditar);
                            
                            idiEditar.idioma = $("#idioma").val();
                            idiEditar.nivel = $("#nivel_idi").val();

                            if(idiEditar.idioma == ""){
                                alert("No puedes dejar esos campos vacios");
                            } else {
                                $.ajax({
                                    url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + user.id,
                                    method: "PUT",
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        idiomas: idiomasExistentes,
                                    }),
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.token,
                                        'X-CSRF-TOKEN': csrfToken,
                                    },
                                    success: function(response) {
                                        location.reload();
                                    },
                                    error: function(xhr, status, error) {
                                        alert("Error al editar idioma: " + error);
                                        console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles
                                    }
                                });
                            }
                            
                        },
                        "Cancelar": function() {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        }
       
    })

});