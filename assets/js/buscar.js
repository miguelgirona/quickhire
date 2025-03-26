$(document).ready(function(){
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 75, 300 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
        });
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
        " - $" + $( "#slider-range" ).slider( "values", 1 ) );

        var select = $( "#experiencia" );
        var slider = $( "<div id='slider'></div>" ).insertAfter( select ).slider({
          min: 1,
          max: 6,
          range: "min",
          value: select[ 0 ].selectedIndex + 1,
          slide: function( event, ui ) {
            select[ 0 ].selectedIndex = ui.value - 1;
          }
        });
        $( "#experiencia" ).on( "change", function() {
          slider.slider( "value", this.selectedIndex + 1 );
        });
});