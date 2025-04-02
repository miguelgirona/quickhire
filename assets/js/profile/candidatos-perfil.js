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

    function getSectores(){
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/sectores",
            method: "GET"
        });
    }

    function getFoto(id){
        return $.ajax({
          url: "https://miguelgirona.com.es/quickhire_api/public/usuarios/foto/"+id,
          method: "GET",
        });
      }


    function getCandidato(id, token) {

        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
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
        getFoto(user.id).then(foto =>{
            
            let cand = candidato[0];
            
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
                    modal: true,  // Hace que sea un diálogo modal
                    width: 400,   // Puedes ajustar el ancho del diálogo
                    buttons: {
                        "Guardar": function() {
                            // Recolectar datos del formulario
                            let newEst ={
                                id: Date.now(),
                                nivel_estudios: $("#nivel_estudios").val(),
                                titulo: $("#titulo").val(),
                                centro: $("#centro").val(),
                                fecha_inicio: $("#fecha_inicio_est").val(),
                                fecha_fin: $("#fecha_fin_est").val() == "" ? "actual" : $("#fecha_fin").val()
                            } ;
                            let estudiosExistentes = JSON.parse(cand.educacion);
                            estudiosExistentes.push(newEst);
                            console.log(estudiosExistentes);
                            
                            if(newEst.fecha_inicio > newEst.fecha_fin && newEst.fecha_fin !== "actual"){
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
                            
                            if(newExp.fecha_inicio > newExp.fecha_fin && newExp.fecha_fin !== "actual"){
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
            $("#img_perfil")[0].src = foto.url_imagen;
            $("#nombre").text(cand.nombre);
            $("#apellidos").text(cand.apellidos);
            $("#mail").text(user.mail);
            $("#telefono").text(user.telefono);
            $("#ciudad").text(cand.ciudad + ", " + cand.pais);

            
            //experiencia
            for(let e of JSON.parse(cand.experiencia)){
                $("#experiencia-datos").append(
                    "<div class='exp'>"+
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
                        "<button id=eliminar-exp-"+e.id+">Eliminar</button>"+
                        "<button id=editar-exp-"+e.id+">Editar</button>"+
                    "</div>"
                );

                //eliminar experiencia
                $("#eliminar-exp-"+e.id).click(function(){
                    if(confirm("¿Seguro que quieres borrar esta experiencia?")){
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
                                location.reload(); // Eliminar el elemento del DOM
                            },
                            error: function(xhr, status, error) {
                                alert("Error al eliminar experiencia: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                    }
                });

                //editar experiencia
                $("#editar-exp-"+e.id).click(function(){
                    $("#nombre_puesto").val(e.nombre_puesto);
                    $("#empresa").val(e.empresa);
                    $("#sector").val(e.sector);
                    $("#descripcion_puesto").val(e.descripcion_puesto);
                    $("#fecha_inicio").val(e.fecha_inicio);
                    if ($("#fecha_fin").val() != "actual") $("#fecha_fin").val(e.fecha_fin)

                        $("#form-dialog-exp").dialog({
                            modal: true,  // Hace que sea un diálogo modal
                            width: 400,   // Puedes ajustar el ancho del diálogo
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
                                    expEditar.fecha_fin = $("#fecha_fin").val();

                                    if(expEditar.fecha_inicio > expEditar.fecha_fin && expEditar.fecha_fin !== "actual"){
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
                    "<div class='est'>"+
                        "<h3>Nivel:</h3>"+
                        "<p>"+ e.nivel_estudios +"</p>"+
                        "<h3>Título:</h3>"+
                        "<p>"+ e.titulo +"</p>"+
                        "<h3>Centro:</h3>"+
                        "<p>"+ e.centro +"</p>"+
                        "<h3>Duración:</h3>"+
                        "<p>"+ new Date(e.fecha_inicio).toLocaleDateString("es-ES") +" - "+ (e.fecha_fin == "actual" ? e.fecha_fin : new Date(e.fecha_fin).toLocaleDateString("es-ES")) +"</p>"+
                        "<button id=eliminar-est-"+e.id+">Eliminar</button>"+
                        "<button id=editar-est-"+e.id+">Editar</button>"+
                    "</div>"
                );

                //eliminar estudio
                $("#eliminar-est-"+e.id).click(function(){
                    if(confirm("¿Seguro que quieres borrar este estudio?")){
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
                                location.reload(); // Eliminar el elemento del DOM
                            },
                            error: function(xhr, status, error) {
                                alert("Error al eliminar estudio: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                    }
                });

                //editar estudio
                $("#editar-est-"+e.id).click(function(){
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
                                    estEditar.fecha_fin = $("#fecha_fin_est").val();

                                    if(estEditar.fecha_inicio > estEditar.fecha_fin && estEditar.fecha_fin !== "actual"){
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
                    "<div class='hab'>"+
                        "<h3>"+ h.habilidad +"</h3>"+
                        "<p>"+ h.nivel +"</p>"+
                        "<button id=eliminar-hab-"+h.id+">Eliminar</button>"+
                        "<button id=editar-hab-"+h.id+">Editar</button>"+
                    "</div>"
                );

                //eliminar habilidad
                $("#eliminar-hab-"+h.id).click(function(){
                    if(confirm("¿Seguro que quieres borrar esta habilidad?")){
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
                                location.reload(); // Eliminar el elemento del DOM
                            },
                            error: function(xhr, status, error) {
                                alert("Error al eliminar habilidad: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                    }
                });

                //editar habilidad
                $("#editar-hab-"+h.id).click(function(){
                    $("#habilidad").val(h.habilidad);
                    $("#nivel").val(h.nivel);

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
                    "<div class='idi'>"+
                        "<h3>"+ i.idioma +"</h3>"+
                        "<p>"+ i.nivel +"</p>"+
                        "<button id=eliminar-idi-"+i.id+">Eliminar</button>"+
                        "<button id=editar-idi-"+i.id+">Editar</button>"+
                    "</div>"
                );

                //eliminar idioma
                $("#eliminar-idi-"+i.id).click(function(){
                    if(confirm("¿Seguro que quieres borrar este idioma?")){
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
                                location.reload(); // Eliminar el elemento del DOM
                            },
                            error: function(xhr, status, error) {
                                alert("Error al eliminar idioma: " + error);
                                console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                            }
                        });
                    }
                });

                //editar idioma
                $("#editar-idi-"+i.id).click(function(){
                    $("#idioma").val(i.idioma);
                    $("#nivel_idi").val(i.nivel);

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
 
        });
    })


});