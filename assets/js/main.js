$(document).ready(function() {
    $('.menu-toggle').click(function() {
        $('#menu').toggleClass('active');
    });

    $("#link-to-prices").click(function(){
        window.location="planes.php";
    })

    $("#link-to-candidatos").click(function(){
        window.location="candidatos.php";
    })
});
