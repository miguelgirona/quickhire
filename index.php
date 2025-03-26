<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Encuentra trabajo rápido con QuickHire. Conectamos talento con empresas, con filtros avanzados y postulaciones fáciles. ¡Empieza hoy!">
    <meta name="keywords" content="empleo, trabajo rápido, ofertas de empleo, buscar trabajo, contratar personal, selección de personal, QuickHire">
    <title>QuickHire - Encuentra trabajo rápido</title>
    <link rel="stylesheet" href="assets/css/index.css">
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/main.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("includes/menu.php")?>
        <div id="content">
            <a href="qh-admin/payments/pago.php">pagar</a>
            <section id="candidatos">
                <div class="two-cols">
                    <div id="candidatos-title">
                        <h1>Encuentra trabajo rápido en QuickHire</h1>
                        <h3>Las mejores ofertas de empleo te están esperando.</h3>
                    </div>
                    <div>
                        <img src="assets/img/candidatos-main.png" alt="Candidatos">
                    </div>
                </div>
                <div class="porque-elegirnos">
                    <h2>¿Por qué elegir QuickHire para buscar empleo?</h2>
                    <p>Encuentra empleo rápido con QuickHire. Conectamos a los mejores candidatos con empresas que buscan talento de inmediato. Descubre ofertas de trabajo en tu ciudad. Nuestro sistema de búsqueda avanzada de empleo y perfiles verificados te ayuda a conseguir el trabajo ideal de manera fácil y segura. ¡Empieza hoy mismo y haz crecer tu carrera con QuickHire!</p>
                    <ul>
                        <li><span>Encuentra empleo rápidamente:</span> Conectamos a los mejores talentos con empresas que buscan contratar de inmediato.</li>
                        <li><span>Filtros avanzados de búsqueda:</span> Encuentra trabajos según tu ubicación, experiencia y habilidades.</li>
                        <li><span>Proceso de aplicación simplificado:</span> Postúlate con un solo clic y haz seguimiento a tus solicitudes en tiempo real.</li>
                        <li><span>Perfiles verificados:</span> Garantizamos ofertas de trabajo confiables y empresas reales.</li>
                    </ul>
                    <button id="link-to-candidatos" class="call-to-action">¡Comienza ahora!</button>
                </div>
            </section>
            <section id="empresas">
                <div class="two-cols">
                    <div>
                        <img src="assets/img/empresas-main.png" alt="Empresas">
                    </div>
                    <div id="empresas-title">
                        <h1>Forma tu gran equipo en QuickHire</h1>
                        <h3>Encuentra el candidato ideal con las mejores herramientas.</h3>
                    </div>
                </div>
                <div class="porque-elegirnos">
                    <h2>¿Por qué elegir QuickHire para contratar?</h2>
                    <p>Contrata rápido y fácil con QuickHire. Encuentra el talento ideal en minutos con nuestra plataforma de selección de personal. Publica ofertas de trabajo, accede a un amplio banco de candidatos y gestiona postulaciones de manera eficiente. Con filtros avanzados y perfiles verificados, agilizamos el proceso de reclutamiento y selección para que tu empresa crezca con los mejores profesionales. ¡Publica tu primera oferta hoy en QuickHire!</p>
                    <ul>
                        <li><span>Encuentra talento en minutos:</span> Publica una oferta y recibe postulaciones rápidamente.</li>
                        <li><span>Gestión fácil de candidatos :</span> Filtra, revisa y contacta aspirantes.</li>
                        <li><span>Costos accesibles y planes flexibles:</span> Adaptamos nuestros servicios a empresas de todos los tamaños.</li>
                    </ul>
                    <button id="link-to-prices" class="call-to-action">¡Elige un plan y publica tu primera oferta!</button>
                </div>
            </section>
        </div>
        <?php include_once("includes/footer.php")?>
    </div>
</body>
</html>