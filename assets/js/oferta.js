$(document).ready(function(){
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
        
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }
    var csrfToken = getCookie('csrf_cookie_name');

    if(sessionStorage.user ){
        if(!sessionStorage.user.tipo_usuario == "Empresa"){
            window.location.href = "https://miguelgirona.com.es/quickhire"
        }
        var user = JSON.parse(sessionStorage.user);
    }



    let parametros = new URLSearchParams(window.location.search);
    let idOferta = parametros.get('id');

    function getOferta(id) {
        return $.ajax({  
          url: "https://miguelgirona.com.es/quickhire_api/public/ofertas/"+id,
          method: "GET",
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

    function getEmpresa(id) {
        return $.ajax({  
          url: "https://miguelgirona.com.es/quickhire_api/public/empresas/"+id,
          method: "GET",
        });
    }

    function getFoto(id){
        return $.ajax({
          url: "https://miguelgirona.com.es/quickhire_api/public/usuarios/foto/"+id,
          method: "GET",
        });
    }

    function getSector(id){
        return $.ajax({
          url: "https://miguelgirona.com.es/quickhire_api/public/sectores/"+id,
          method: "GET",
        });
    }

    getOferta(idOferta).then(oferta => {
        getEmpresa(oferta.id_empresa).then(empresa => {            
            getFoto(empresa[0].id_usuario).then(foto => {
                $("#foto_empresa").attr("src",foto.url_imagen);
                $("#titulo_oferta").text(oferta.titulo);
                $("#nombre_empresa").text(empresa[0].nombre_empresa);
                $("#provincia").text(oferta.provincia);
                $("#modalidad").text(oferta.requisitos.modalidad);
                $("#fecha_publicacion").text(new Date(oferta.fecha_publicacion).toLocaleDateString("es-ES") );
                $("#salario").text(oferta.salario_min +"€ - "+oferta.salario_max+"€");
                $("#experiencia").text("Al menos "+ oferta.requisitos.experiencia+" años");
                $("#tipo_contrato").text(oferta.requisitos.tipo_contrato);
                $("#estudios_min").text(oferta.requisitos.estudios);
                $("#experiencia_min").text(oferta.requisitos.experiencia + " años");
                $("#descripcion_oferta").text(oferta.descripcion);
                getSector(oferta.id_sector).then(sector => {
                    $("#sector").text(sector[0].sector);
                });
            });
            
            $(".inscribirme").click(function(){

                if(user){
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "Vas a inscribirte a esta oferta y la empresa podrá analizar tus datos.",
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonColor: '#595bd4',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, quiero inscribirme',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            csrfToken = getCookie('csrf_cookie_name');
                            getCandidato(user.id,sessionStorage.token).then(cand => {
                                
                                $.ajax({
                                    url: 'https://miguelgirona.com.es/quickhire_api/public/candidaturas',
                                    type: 'POST',
                                    credentials: 'include',
                                    data: {
                                        id_oferta: oferta.id,
                                        id_candidato: cand[0].id,
                                        csrf_test_name: csrfToken // Agregar el token CSRF
                                    },
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.token,
                                        'X-CSRF-TOKEN': csrfToken,
                                    },
                                    success: function (response) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: '¡Éxito!',
                                            text: 'La operación se realizó correctamente.',
                                            showConfirmButton: true,
                                            confirmButtonText: 'Aceptar',
                                            timer: 3000,  // El mensaje desaparecerá después de 3 segundos (opcional)
                                            timerProgressBar: true // Muestra una barra de progreso del temporizador
                                        });
                                          
                                    },
                                    error: function (xhr, status, error) {
                                        
                                        if(JSON.parse(xhr.responseText).error == "400"){
                                            Swal.fire({
                                                icon: 'info',
                                                title: 'Ya estas inscrito',
                                                text: 'Ya estás inscrito a esta oferta.',
                                                showConfirmButton: true,
                                                confirmButtonText: 'Aceptar',
                                                timer: 3000,  // El mensaje desaparecerá después de 3 segundos (opcional)
                                                timerProgressBar: true // Muestra una barra de progreso del temporizador
                                            });
                                        }
                                    }
                                });
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Inicia Sesión',
                        text: "Para inscribirte en una oferta, debes iniciar sesión en QuickHire.",
                        icon: 'error',
                        confirmButtonColor: '#595bd4',
                        confirmButtonText: 'Aceptar',
                    })
                }
                
            });

        }); 
    });

}); 
