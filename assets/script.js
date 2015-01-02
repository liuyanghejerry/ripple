(function() {
  $(document).ready(function(){
    var f = attachBackground();
    attachLink(f.setBackground, f.clearBackground);
  });

  function attachBackground() {
    var background = $('.background-slider .background').first();
    var images = $('.background-slider .background img').map(function(index,item){return $(item).prop('src')});

    $(window).resize(resize);

    function resize() {
      var realImages = $('.background-slider .background img');
      var realImage = $(realImages[background.data('background')]);

      var imageWidth = realImage.width();
      var imageHeight = realImage.height();
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();

      var imageRatio = imageHeight / imageWidth;
      var windowRatio = windowHeight / windowWidth;

      if (windowRatio >= imageRatio) {
        setSize(windowHeight/imageRatio, windowHeight);
      } else {
        setSize(windowWidth, imageRatio*windowWidth);
      }

      function setSize(width, height) {
        background.css('background-size', '' + width + 'px ' + height + 'px');
      }
    }
    
    function setBackground(index) {
      var url = images[index];
      var imgUrl = "url("+url+")";
      background.removeClass('active');
      background.css('background-image', imgUrl);
      background.addClass('active');
      background.data('background', index);
      // console.log(background.data('background'));
      // resize();
    }

    function clearBackground() {
      background.removeClass('active');
    }

    setBackground(0);
    resize();

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
