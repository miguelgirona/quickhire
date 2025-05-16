$(document).ready(function(){

    const params = new URLSearchParams(window.location.search);
    const idOferta = params.get('id');

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
    }

    function getOferta(id) {
        return $.ajax({  
        url: "https://miguelgirona.com.es/quickhire_api/public/ofertas/"+id,
        method: "GET",
        });
    }

    function getUsuario(userId, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: `https://miguelgirona.com.es/quickhire_api/public/usuarios/${userId}`,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "X-CSRF-TOKEN": csrfToken,
            }
        });
    }


    function getCandidaturas(idOferta){
        return $.ajax({  
            url: "https://miguelgirona.com.es/quickhire_api/public/candidaturas/getCandidaturasByOferta/"+idOferta,
            method: "GET",
        });
    }

    function getCandidato(id,token){
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

    function getSector(id){
        return $.ajax({
        url: "https://miguelgirona.com.es/quickhire_api/public/sectores/"+id,
        method: "GET",
        });
    }

    getOferta(idOferta).then(oferta => {
        
        const destinatario = oferta.email_empresa;

        $("#nombre_empresa").text(oferta.nombre_empresa);
        $("#titulo_oferta").text(oferta.titulo);
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
        
        getCandidaturas(oferta.id).then(candidaturas => {

            const promesasCandidatos = candidaturas.map(c => 
                getCandidato(c.id_candidato, sessionStorage.token)
                .then(candidatoArr => {
                    const candidato = candidatoArr[0];
                    console.log(candidato);
                    
                    // Ahora traemos su usuario para obtener el email
                    return getUsuario(candidato.id_usuario, sessionStorage.token)
                    .then(usuario => {
                        
                        return {
                        ...candidato,
                        estado: c.estado,
                        id_candidatura: c.id,
                        email: usuario.mail
                        };
                    });
                })
            );
            Promise.all(promesasCandidatos).then(inscritos => {

                $('#tabla').DataTable({
                    data: inscritos,
                    scrollX: true,
                    columns: [
                        { 
                            data: "id",
                            render: function(data,type,row){                                
                                return `<a href='/quickhire/admin-panel/pages/perfil-candidato?id=${row.id_usuario}'>Ver</a>`;
                            }
                        },
                        { data: 'nombre' },
                        { 
                            data: 'url_cv',
                            render: function(data, type, row) {
                                return data != null ? `<a class='cv-leido' href='${data}' target='_blank'>Ver CV</a>` : 'Sin CV';
                            }
                        },
                        {
                            data: 'ciudad',
                            render: function(data){
                                return data || 'Sin datos'
                            }
                        },
                        {
                            data: 'pais',
                            render: function(data){
                                return data || 'Sin datos'
                            }
                        },
                        { 
                            data: 'estado',
                            render: function(data){
                                return data || 'Desconocido';
                            }
                        }
                    ],
                    responsive: true
                });
            
            });
            
        
        });

        $('#eliminar-oferta').click(async function(){
            
                const { value: formValues } = await Swal.fire({
                title: "Eliminar oferta",
                html: `
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label for="nombre" style="font-weight:bold;">Motivo</label>
                        <textarea swal2-input id="motivo" placeholder="Escribe el motivo por el cual vas a eliminar la oferta para notificar a la empresa"></textarea>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: "Eliminar",
                preConfirm: () => {
                    return [
                        $("#motivo").val(),
                    ];
                }
            });
            
            if (formValues) {
                csrfToken = getCookie('csrf_cookie_name');

                const nombre_empresa = $("#nombre_empresa").text();
                
                $.ajax({
                    url: "https://miguelgirona.com.es/quickhire_api/public/ofertas/" + idOferta,
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.token,
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    success: function(response) {
                        csrfToken = getCookie('csrf_cookie_name');
                        console.log(response);
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Oferta eliminada',
                            text: 'El usuario ha sido editado correctamente',
                        });
                        $.ajax({
                            url: 'https://miguelgirona.com.es/quickhire_api/public/correo/enviar',
                            type: 'POST',
                            data: {
                                destinatario: destinatario,
                                nombre: nombre_empresa,
                                mensaje: 'Hola '+ nombre_empresa +',\n\n Desde QuickHire lamentamos comunicarte que hemos eliminado tu oferta "'+oferta.titulo+'" por el siguiente motivo: \n'+formValues[0]+'\n\nSaludos,\nEl equipo de QuickHire',
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
                        window.location.href = "/quickhire/admin-panel/pages/ofertas";
                    },
                    error: function(xhr, status, error) {
                        csrfToken = getCookie('csrf_cookie_name');
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al editar la oferta',
                            footer: `<pre>${json.message}</pre>`
                        });
                        console.error(xhr.responseText);

                    }
                });
            }
            
        });
 
    });

}); 
