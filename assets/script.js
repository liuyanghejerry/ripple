(function() {
  $(document).ready(function(){
    var f = attachBackground();
    attachLink(f.setBackground, f.clearBackground);
  });

  function attachBackground() {
    var background = $('.background-slider .background').first();
    var images = $('.background-slider .background img').map(function(index,item){return $(item).prop('src')});
    
    function setBackground(index) {
      var url = images[index];
      var imgUrl = "url("+url+")";

      // background
      $('html')
      // .removeClass('active')
      .css('background-image', imgUrl)
      // .addClass('active')
      .data('background', index);
      
    }

    function clearBackground() {
      background.removeClass('active');
    }

    setBackground(0);
    // resize();

    return {setBackground: setBackground, clearBackground: clearBackground};
  }

  function attachLink(setBackground, clearBackground) {
    var links = $('.main-content .main-link');
    links.each(function(index, link) {
      link = $(link);
      link.hover(function(){setBackground(index)});
    });
  }

})();
