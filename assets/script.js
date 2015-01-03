(function() {
  $(document).ready(function(){
    var f = attachBackground();

    if($('html.index').length) {
      attachLink(f.setBackground, f.clearBackground);
    }

    if($('html.info').length) {
      setInterval(function(){f.nextBackground();}, 5000);
    }
  });

  function attachBackground() {
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

    function nextBackground() {
      var item = $('.background-slider .background.active');
      var cur = backgrounds.index(item);
      var next = (cur+1) % backgrounds.length;
      setBackground(next);
      console.log(cur, next);
    }

    function previousBackground() {
      var item = $('.background-slider .background.active');
      var cur = backgrounds.index(item);
      var previous = (cur+backgrounds.length-1) % backgrounds.length;
      setBackground(previous);
      console.log(cur, previous);
    }

    setBackground(0);

    return {
      setBackground: setBackground, 
      clearBackground: clearBackground, 
      nextBackground: nextBackground, 
      previousBackground: previousBackground, 
      backgorundCount: backgrounds.length
    };
  }

  function attachLink(setBackground, clearBackground) {
    var links = $('.main-content .main-link');
    links.each(function(index, link) {
      link = $(link);
      link.hover(function(){setBackground(index)});
    });
  }

})();
