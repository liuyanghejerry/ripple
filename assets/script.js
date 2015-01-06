(function() {
  $(document).ready(function(){

    if($('html.index').length) {
      var f = attachBackground();
      attachMainLink(f.setBackground, f.clearBackground);
    }

    if($('html.info').length) {
      var f = attachBackground();
      setInterval(function(){f.nextBackground();}, 5000);
    }

    if($('html.project').length) {
      attachMenuLink();
      loadProjects().done(function(data) {
        setProjectContents(data, 'identity', 'co&co');
      }).fail(function(err) {
        console.log(err);
      });
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
    }

    function previousBackground() {
      var item = $('.background-slider .background.active');
      var cur = backgrounds.index(item);
      var previous = (cur+backgrounds.length-1) % backgrounds.length;
      setBackground(previous);
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

  function attachMainLink(setBackground, clearBackground) {
    var links = $('.main-content .main-link');
    links.each(function(index, link) {
      link = $(link);
      link.hover(function(){setBackground(index)});
    });
  }

  function loadProjects() {
    return $.getJSON("assets/project-contents.json", {});
  }

  function attachMenuLink() {
    $('.header .nav li > a')
    .hover(function(ev) {
      $(this).parent().find('.inner-content').slideDown();
    }, function() {
      $(this).parent().not('.selected').find('.inner-content').slideUp();
    })
    .click(function(ev) {
      //
    });
  }

  function setProjectContents(data, main, sub) {
    $('.background-slider .background').remove();
    data[main][sub].backgrounds.forEach(function(item) {
      var img = $('<img>').prop('src', item);
      var background = $('<div>').addClass('background');
      background.append(img);
      $('.background-slider').append(background);4
      attachBackground();
    });
  }

})();
