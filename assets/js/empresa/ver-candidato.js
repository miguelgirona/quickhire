$(document).ready(function(){

    $(".seccion").click(function(){
        $(this).next().toggle();
        
    });
    
    $("#linkedin").click(function(){
        
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

    let candidatoID = new URLSearchParams(window.location.search).get("idCandidato");
    let ofertaID = new URLSearchParams(window.location.search).get("idOferta");
    let candidaturaID = new URLSearchParams(window.location.search).get("idCandidatura");

    function getSectores(){
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/sectores",
            method: "GET"
        });
    }

    function getCandidatura(idCandidatura){
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/candidaturas/" + idCandidatura,
            method: "GET",
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
            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/showByIdCandidato/" + id,
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

    getCandidato(candidatoID,sessionStorage.token).then(candidato =>{
            
        let cand = candidato[0];    

        getCandidatura(candidaturaID).then(candidatura => {

            //cv
            console.log(cand.url_cv);
            if(cand.url_cv == null){
                $("#cv").html(
                    "<p>Sin CV</p>"
                );
            } else {
                $("#cv").html(
                    "<a id='enlace-cv' href='"+cand.url_cv+"' target='_blank'>VER CV</a>"
                );
            
                $("#enlace-cv").click(function(e){
                    if(candidatura[0].estado == "Aceptado"){
                        window.open(cand.url_cv, '_blank');

                    } else {
                        e.preventDefault(); // Previene que abra el enlace antes de actualizar estado
                        console.log("entra");
                
                        $.ajax({
                            url: "https://miguelgirona.com.es/quickhire_api/public/candidaturas/" + candidaturaID,
                            method: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({ estado: "CV Leído" }),
                            headers: {
                                "Authorization": "Bearer " + sessionStorage.token,
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            success: function(response) {
                                $.ajax({
                                    url: 'https://miguelgirona.com.es/quickhire_api/public/correo/enviar',
                                    type: 'POST',
                                    data: {
                                        destinatario: destinatario,
                                        nombre: row.nombre,
                                        mensaje: 'Hola '+ row.nombre +',\n\n'+ empresa[0].nombre_empresa +' ha leído tu CV. Te informaremos sobre el estado de tu candidatura.\n\nSaludos,\nEl equipo de QuickHire',
                                    },
                                    headers: {
                                        'X-CSRF-TOKEN': getCookie('csrf_cookie_name'),
                                    },
                                    success: function(response) {
                                        if (response.error) {
                                            alert('Error: ' + response.error);
                                        }
                                    },
                                    error: function(xhr) {
                                        console.log('Error inesperado: ' + xhr.responseText);
                                    }
                                });
                                window.open(cand.url_cv, '_blank');
                            },
                            error: function(xhr, status, error) {
                                console.log(xhr.responseText);
                            }
                        });
                    }
                });
            }

            if(candidatura[0].estado == "Aceptado"){
                $("#aceptar-candidatura, #rechazar-candidatura").hide();
                $("#datos-personales > div:last-child").html("Candidato aceptado, puedes iniciar un chat con él en la pestaña 'Chats'.");
            }
        getUsuario(cand.id_usuario,sessionStorage.token).then(usuario =>{   
            //datos personales
            $("#img_perfil")[0].src = usuario.url_imagen;
            $("#nombre").text(cand.nombre == "" ? "Sin datos" : cand.nombre);
            $("#mail").text(usuario.mail == "" ? "Sin datos" : usuario.mail);
            $("#telefono").text(usuario.telefono == "" ? "Sin datos" : usuario.telefono);
            $("#ciudad").text((cand.ciudad == null || cand.pais == null) ? "Sin datos" : cand.ciudad+", "+cand.pais);
            
            getEmpresa(user.id,sessionStorage.token).then(empresa => {
                
                //aceptar candidatura
                $("#aceptar-candidatura").click(function(e){
                    Swal.fire({
                            title: '¿Estás seguro?',
                            text: "Vas a aceptar esta candidatura, se notificará al candidato y podrás iniciar un chat.",
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonColor: '#595bd4',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sí, aceptar',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                let csrfToken = getCookie('csrf_cookie_name');
                                $.ajax({
                                    url: "https://miguelgirona.com.es/quickhire_api/public/candidaturas/" + candidaturaID,
                                    method: "PUT",
                                    contentType: 'application/json',
                                    data: JSON.stringify({ estado: "Aceptado" }),
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.token,
                                        'X-CSRF-TOKEN': csrfToken,
                                    },
                                    success: function(response) {
                                        csrfToken = getCookie('csrf_cookie_name');
                                        console.log(candidatura);
                                        
                                        $.ajax({
                                            url: "https://miguelgirona.com.es/quickhire_api/public/chats",
                                            method: "POST",
                                            credentials: "include",
                                            data: {
                                                id_candidato: candidatoID,
                                                id_empresa: empresa[0].id,
                                            },
                                            headers: {
                                                "Authorization": "Bearer " + sessionStorage.token,
                                                'X-CSRF-TOKEN': csrfToken,
                                            },
                                            success: function(response) {
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: '¡Éxito!',
                                                    text: 'La operación se realizó correctamente.',
                                                    showConfirmButton: true,
                                                    confirmButtonText: 'Aceptar',
                                                    timer: 3000,
                                                    timerProgressBar: true
                                                });
                                                location.reload();
                                            },
                                            error: function(xhr, status, error) {
                                                console.log(xhr.responseText);
                                            }
                                        });
                                        
                                        $.ajax({
                                            url: 'https://miguelgirona.com.es/quickhire_api/public/correo/enviar',
                                            type: 'POST',
                                            data: {
                                                destinatario: usuario.mail,
                                                nombre: cand.nombre,
                                                mensaje: 'Hola '+ cand.nombre +',\n\n'+ empresa[0].nombre_empresa +' ha aceptado tu candidatura, mira en tu pestaña Chats para hablar con '+ empresa[0].nombre_empresa +'. ¡Gracias por confiar en nosotros!.\n\nSaludos,\nEl equipo de QuickHire',
                                            },
                                            headers: {
                                                'X-CSRF-TOKEN': getCookie('csrf_cookie_name'),
                                            },
                                            success: function(response) {
                                                if (response.error) {
                                                    alert('Error: ' + response.error);
                                                }
                                            },
                                            error: function(xhr) {
                                                console.log('Error inesperado: ' + xhr.responseText);
                                            }
                                        });
                                    },
                                    error: function(xhr, status, error) {
                                        console.log(xhr.responseText);
                                    }
                                });
                                
                            }
                        });
                    });
                });
                
                //rechazar candidatura
                $("#rechazar-candidatura").click(function(e){
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "Vas a eliminar esta candidatura, se notificará al candidato.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#595bd4',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, rechazar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            let csrfToken = getCookie('csrf_cookie_name');
                            $.ajax({
                                url: "https://miguelgirona.com.es/quickhire_api/public/candidaturas/" + candidaturaID + "?idCandidato=" + candidatoID,
                                method: "DELETE",                        
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.token,
                                    'X-CSRF-TOKEN': csrfToken,
                                },
                                success: function(response) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: '¡Éxito!',
                                        text: 'La operación se realizó correctamente.',
                                        showConfirmButton: true,
                                        confirmButtonText: 'Aceptar',
                                        timer: 3000,
                                        timerProgressBar: true
                                    });
                                    window.location.href = "https://miguelgirona.com.es/quickhire/empresa/oferta?id="+ofertaID;
                                },
                                error: function(xhr, status, error) {
                                    console.log(xhr.responseText);
                                }
                            });

                            $.ajax({
                                url: 'https://miguelgirona.com.es/quickhire_api/public/correo/enviar',
                                type: 'POST',
                                data: {
                                    destinatario: usuario.mail,
                                    nombre: cand.nombre,
                                    mensaje: 'Hola '+ cand.nombre +',\n\nLamentamos comunicarte que '+ empresa[0].nombre_empresa +' ha rechazado tu candidatura, continua en tu búsqueda de empleo en QuickHire.\n\nSaludos,\nEl equipo de QuickHire',
                                },
                                headers: {
                                    'X-CSRF-TOKEN': getCookie('csrf_cookie_name'),
                                },
                                success: function(response) {
                                    if (response.error) {
                                        alert('Error: ' + response.error);
                                    }
                                },
                                error: function(xhr) {
                                    console.log('Error inesperado: ' + xhr.responseText);
                                }
                            });
                            
                        }
                    });
                });
            });

        });

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
                "</div>"
            );

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
                "</div>"
            );

        }

        //habilidades
        for(let h of JSON.parse(cand.habilidades)){
            $("#habilidades-datos").append(
                "<div style='position:relative;' class='hab' data-id='"+ h.id +"'>"+
                    "<h3>"+ h.habilidad +"</h3>"+
                    "<p>"+ h.nivel +"</p>"+
                "</div>"
            );

        }

        //idiomas
        for(let i of JSON.parse(cand.idiomas)){
            $("#idiomas-datos").append(
                "<div style='position:relative;' class='idi' data-id='"+ i.id +"'>"+
                    "<h3>"+ i.idioma +"</h3>"+
                    "<p>"+ i.nivel +"</p>"+
                "</div>"
            );
        
        }
       
    })

});