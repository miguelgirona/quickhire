$(document).ready(function(){
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
    
        function getSector(id){
            return $.ajax({
              url: "https://miguelgirona.com.es/quickhire_api/public/sectores/"+id,
              method: "GET",
            });
        }
    
        getOferta(idOferta).then(oferta => {
            getEmpresa(user.id,sessionStorage.token).then(empresa => {

                if(empresa[0].id != oferta.id_empresa) window.location.href = "/quickhire/empresa/ofertas";

                $("#foto_empresa").attr("src",user.url_imagen);
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
                        getCandidato(c.id_candidato, sessionStorage.token).then(candidato => {
                            return {
                                ...candidato[0],
                                estado: c.estado,
                                id_candidatura: c.id,
                            };
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
                                        return `<a href='/quickhire/empresa/ver-candidato?idOferta=${idOferta}&idCandidato=${data}&idCandidatura=${row.id_candidatura}'>Ver</a>`;
                                    }
                                },
                                { data: 'nombre' },
                                { 
                                    data: 'url_cv',
                                    render: function(data, type, row) {
                                        return `<a class='cv-leido' href='#' data-id='${row.id_candidatura}' data-url='${data}'>Ver CV</a>`;
                                    }
                                },
                                { data: 'ciudad' },
                                { data: 'pais' },
                                { 
                                    data: 'estado',
                                    render: function(data){
                                        return data || 'Desconocido';
                                    }
                                }
                            ],
                            responsive: true
                        });
                    
                        // Manejador de evento para actualizar el estado a "CV Leído"
                        $(document).on('click', '.cv-leido', function(e){
                            e.preventDefault();
                    
                            const candidaturaID = $(this).data('id');
                            const cvURL = $(this).data('url');

                            const row = $('#tabla').DataTable().row($(this).closest('tr')).data();

                            console.log(row);
                            

                            if(row.estado === "Aceptado") {
                                window.open(cvURL, '_blank');
                            } else {
                                $.ajax({
                                    url: "https://miguelgirona.com.es/quickhire_api/public/candidaturas/" + candidaturaID,
                                    method: "PUT",
                                    contentType: 'application/json',
                                    data: JSON.stringify({ estado: "CV Leído" }),
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.token,
                                        'X-CSRF-TOKEN': getCookie('csrf_cookie_name'),
                                    },
                                    success: function(response) {
                                        window.open(cvURL, '_blank');
                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Error al actualizar estado:", xhr.responseText);
                                    }
                                });
                            }

                                
                        });
                    
                    });
                    
                
                });
                
            }); 
        });
    
    }); 
    
});