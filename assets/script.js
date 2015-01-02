(function() {
  $(document).ready(function(){
    var f = attachBackground();
    attachLink(f.setBackground, f.clearBackground);
  });

  function attachBackground() {
    var background = $('.background-slider .background').first();
    var images = background.data('background').split(',');
    
    function setBackground(index) {
      var url = images[index];
      var imgUrl = "url("+url+")";
      background.removeClass('active');
      background.css('background-image', imgUrl);
      background.addClass('active');
    }

    function clearBackground() {
      background.removeClass('active');
    }

    setBackground(0);

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
