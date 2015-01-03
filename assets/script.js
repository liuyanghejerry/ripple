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
      var viewWidth = $(document).width();
      var viewHeight = $(document).height();

      var imageRatio = imageHeight / imageWidth;
      var windowRatio = viewHeight / viewWidth;

      if (windowRatio >= imageRatio) {
        setSize(viewHeight/imageRatio, viewHeight);
      } else {
        setSize(viewWidth, imageRatio*viewWidth);
      }

      function setSize(width, height) {
        background.css('background-size', '' + width + 'px ' + height + 'px');
      }
    }
    
    function setBackground(index) {
      var url = images[index];
      var imgUrl = "url("+url+")";

      background
      .removeClass('active')
      .css('background-image', imgUrl)
      .addClass('active')
      .data('background', index);
      
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
