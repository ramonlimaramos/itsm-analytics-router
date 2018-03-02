//Control frog
function rSVP(element, options){
  // Call the chart generation on window resize
  $(window).resize(generateChart);
  
  var container = $(element);
  var chart = '#'+$(element).attr('id')+' .chart';
  

  // Create the chart
  function generateChart(){
    
    // Resize when width is 768 or greater 
    // Remove any existing canvas                
    if($('canvas', $(container)).length){
      $.when($('canvas', $(container)).remove()).then(addChart());
    }
    else{
      addChart();
    }
    
    function addChart(){
      //Setup options
      var rsvpOpt = {
        barColor: pieBar,
        trackColor: pieTrack,
        scaleColor: false,
        lineWidth: 15,      
        lineCap: 'butt',
        size: 100
      };
      
      //Alter settings depending on layout and screen width
      var ww = $(window).width();
      
      if(ww > 767 && ww < 992){
        rsvpOpt.size = container.width()-10;
                    
        switch($(chart).data('layout')){
          case 'l-6':
            rsvpOpt.lineWidth = 30;
            break;
          
          case 'l-6-i':
            rsvpOpt.lineWidth = 20;
            rsvpOpt.size = parseFloat((container.width()*0.7)-10);
            break;          
          
          case 'l-6-12-6':
            break;
          
          case 'l-6-4':
            rsvpOpt.lineWidth = 5;  
            break;
        }
      }
      else if(ww > 991 && ww < 1200 ){
        rsvpOpt.size = container.width()-10;
                    
        switch($(chart).data('layout')){
          case 'l-6':
            rsvpOpt.lineWidth = 30;
            break;
          
          case 'l-6-i':
            rsvpOpt.lineWidth = 30;
            rsvpOpt.size = parseFloat((container.width()*0.75)-10);
            break;          
          
          case 'l-6-12-6':
            rsvpOpt.lineWidth = 20;
            break;
          
          case 'l-6-4':
            rsvpOpt.lineWidth = 5;  
            break;
        }
      }
      else if(ww > 1199 && ww < 1399){
        rsvpOpt.size = container.width()-10;
                    
        switch($(chart).data('layout')){
          case 'l-6':
            rsvpOpt.lineWidth = 40;
            break;
          
          case 'l-6-i':
            rsvpOpt.lineWidth = 30;
            rsvpOpt.size = parseFloat((container.width()*0.75)-10);
            break;          
          
          case 'l-6-12-6':
            rsvpOpt.lineWidth = 20;         
            break;
          
          case 'l-6-4':
            rsvpOpt.lineWidth = 10; 
            break;
        }
      }
      else if(ww > 1399){
        rsvpOpt.size = container.width()-10;
                    
        switch($(chart).data('layout')){
          case 'l-6':
            rsvpOpt.lineWidth = 50;
            break;
          
          case 'l-6-i':
            rsvpOpt.lineWidth = 40;
            rsvpOpt.size = parseFloat((container.width()*0.75)-10);
            break;          
          
          case 'l-6-12-6':
            rsvpOpt.lineWidth = 30;
            break;
          
          case 'l-6-4':
            rsvpOpt.lineWidth = 15; 
            break;
        }
      }
      // Create and store the chart
      cf_rSVPs[$(element).attr('id')].chart = new EasyPieChart(document.querySelector(chart), rsvpOpt);
    }
  };

  // Run once on first load
  generateChart();
}