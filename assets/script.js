(function() {
  $(document).ready(function(){
    var f = attachBackground();
    attachLink(f.setBackground, f.clearBackground);
  });

  function attachBackground() {
    var body = $('body');
    var backgrounds = $('.background-slider .background');
    var images = $('.background-slider .background img').map(function(index,item){return $(item).prop('src')});

    backgrounds.each(function(index, item) {
      var url = images[index];
      var imgUrl = "url("+url+")";
      $(item).css('background-image', imgUrl);
    });
    
    function setBackground(index) {
      backgrounds.removeClass('active');
      $(backgrounds[index]).addClass('active');
    }

    function clearBackground() {
      backgrounds.removeClass('active');
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
