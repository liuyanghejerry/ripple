(function() {
  $(document).ready(function(){
    var f = attachBackground();
    attachLink(f.setBackground, f.clearBackground);
  });

  function attachBackground() {
    var background = $('.background-slider .background').first();
    var images = $('.background-slider .background img').map(function(index,item){return $(item).prop('src')});

    $(window).resize(function() {
      resize();
      console.log(background.css('background-size'));
    });

    function resize() {
      var realImages = $('.background-slider .background img');
      var realImage = $(realImages[background.data('background')]);

      var imageWidth = realImage.width();
      var imageHeight = realImage.height();
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      var maxWidth = Math.max(imageWidth, windowWidth);
      var maxHeight = Math.max(imageHeight, windowHeight);

      var ratio = imageHeight / imageWidth;
      var isImageHeightLargeThanWidth = ratio > 1;
      var isWindowHeightLargeThanWidth = windowHeight > windowWidth;
      var length = isWindowHeightLargeThanWidth ? windowWidth : windowHeight;

      var width = Math.max(isImageHeightLargeThanWidth ? length : length/ratio, windowWidth);
      var height = Math.max(isImageHeightLargeThanWidth ? length*ratio : length, windowHeight);

      background.css('background-size', '' + (width) + 'px ' + (height) + 'px');
    }
    
    function setBackground(index) {
      var url = images[index];
      var imgUrl = "url("+url+")";
      background.removeClass('active');
      background.css('background-image', imgUrl);
      background.addClass('active');
      background.data('background', index);
      // console.log(background.data('background'));
      resize();
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
