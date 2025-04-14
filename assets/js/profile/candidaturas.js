$(document).ready(function(){
    $("#loading-candidaturas").show();

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

    function getCandidaturas(){
        return getCandidato(user.id, sessionStorage.token).then(cand => {
            return $.ajax({  
                url: "https://miguelgirona.com.es/quickhire_api/public/candidaturas/",
                method: "GET",
                data: {
                    idCandidato: cand[0].id,
                }
            });
        });
    }

    function getOferta(id) {
        return $.ajax({  
          url: "https://miguelgirona.com.es/quickhire_api/public/ofertas/"+id,
          method: "GET",
        });
      }
    

    getCandidato(user.id,sessionStorage.token).then(cand => {
        
        getCandidaturas().then(candidaturas => {
            console.log(candidaturas);
            
            candidaturas.forEach((candidatura, index) => {
                getOferta(candidatura.id_oferta).then(oferta =>{
                    let maxChars = window.innerWidth < 768 ? 50 : 175;

                    getEmpresa(oferta.id_empresa).then(empresa => {
                        
                        getFoto(empresa[0].id_usuario).then(foto => {
                            $("#candidaturas").append(
                                "<a href='/quickhire/oferta?id="+oferta.id+"'>"+
                                    "<div class='candidatura' data-id='"+candidatura.id+"'>"+
                                        "<img src='"+foto.url_imagen+"'>"+
                                        "<div>"+
                                            "<p class='estado'>"+ candidatura.estado +"</p>"+
                                            "<h2>"+ oferta.titulo +"</h2>"+
                                            "<p><a style='text-decoration: underline;' href='#'>"+ empresa[0].nombre_empresa +"</a></p>"+
                                            "<p>"+(oferta.descripcion.length > maxChars ? oferta.descripcion.substring(0, maxChars) + "..." : oferta.descripcion)+"</p>"+
                                        "</div>"+
                                        "<button class='borrar-inscripcion' data-id='"+candidatura.id+"'>Borrar inscripción</button>"+
                                    "</div>"+
                                "</a>"
                            );
                            $(".borrar-inscripcion[data-id='"+candidatura.id+"']").click(function(){
                                
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
                                            url: 'https://miguelgirona.com.es/quickhire_api/public/candidaturas/' + candidatura.id + '?idCandidato=' + cand[0].id,
                                            type: 'DELETE',
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
                                                    timer: 3000,
                                                    timerProgressBar: true
                                                });
                                                $(".candidatura[data-id='" + candidatura.id + "']").remove();
                                            },
                                            error: function (xhr, status, error) {
                                                console.log(xhr.responseText);
                                            }
                                        });
                                        
                                    }
                                });
                                
                            });
                            if (index === candidaturas.length - 1) {
                                $("#loading-candidaturas").hide();
                            }
                            
                        });
                    });
                });
                
            });
            
        });
    });
});