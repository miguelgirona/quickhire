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

            $("#nueva-exp").click(function(){
                csrfToken = getCookie('csrf_cookie_name');
                $("#form-exp")[0].reset();
                $("#form-form-dialog-exp").dialog({
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
                                        $("#form-dialog-exp-dialog").dialog("close");
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
                        "<p>"+new Date(e.fecha_inicio).toLocaleDateString("es-ES")+" - "+new Date(e.fecha_fin).toLocaleDateString("es-ES")+"</p>"+
                        "<button id=eliminar-"+e.id+">Eliminar</button>"+
                        "<button id=editar-"+e.id+">Editar</button>"+
                    "</div>"
                );
                $("#eliminar-"+e.id).click(function(){
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

                //editar
                $("#editar-"+e.id).click(function(){
                    $("#nombre_puesto").val(e.nombre_puesto);
                    $("#empresa").val(e.empresa);
                    $("#sector").val(e.sector);
                    $("#descripcion_puesto").val(e.descripcion_puesto);
                    $("#fecha_inicio").val(e.fecha_inicio);
                    if ($("#fecha_fin").val() != "actual") $("#fecha_fin").val(e.fecha_fin)

                        $("#form-form-dialog-exp").dialog({
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
                                            alert("Error al eliminar experiencia: " + error);
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
                        "<p>"+ e.fecha_inicio +" - "+ e.fecha_fin +"</p>"+
                    "</div>"
                );
            }

            //habilidades
            for(let h of JSON.parse(cand.habilidades)){
                $("#habilidades-datos").append(
                    "<div class='hab'>"+
                        "<h3>"+ h.habilidad +"</h3>"+
                        "<p>"+ h.nivel +"</p>"+
                    "</div>"
                );
            }

            //idiomas
            for(let i of JSON.parse(cand.idiomas)){
                $("#idiomas-datos").append(
                    "<div class='idi'>"+
                        "<h3>"+ i.idioma +"</h3>"+
                        "<p>"+ i.nivel +"</p>"+
                    "</div>"
                );
            }
 
        });
    })


});