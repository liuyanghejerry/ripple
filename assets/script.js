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
      // attachMenuLink();
      loadProjects().done(function(data) {
        attachMenuLink(data);
        // setProjectContents(data, 'identity', 'co&co');
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

  function attachMenuLink(data) {
    $.each(data.menus, function(i, object) {
      var main = object.name;
      var menu = $('.header .nav .'+main);
      menu.find('a.blur-link').text(main);
      menu.find('.sub-nav>li>a').remove();
      $.each(object.menus, function(i, object) {
        var sub = object.name;
        var link = $('<a>').prop('href', '').addClass('glow-link upper').text(sub);
        var subMenu = $('<li>').append(link);
        menu.find('.inner-content .sub-nav').append(subMenu);
        link.click(function(ev) {
          ev.preventDefault();
          $('.header .nav .sub-nav>li>a').removeClass('selected');
          $(this).addClass('selected');
          setProjectContents(data, main, sub);
        });
      });
      menu.find('a.blur-link').click(function(ev) {
        ev.preventDefault();

      });
      setProjectContents(data, 'identity', 'co&co');
    });

    $('.header .nav .expand-button').click(function(ev) {
      ev.preventDefault();
      var self = $(this);
      self.toggleClass('minimized');
      self.parent().find('.project-description .content').slideToggle();
    });

    $('.header .nav>li')
    .hover(function(ev) {
      $(this).find('.inner-content').slideDown();
    }, function() {
      $(this).not('.selected').find('.inner-content').slideUp();
    });
  }

  function setProjectContents(data, main, sub) {
    $('.background-slider .background').remove();
    var slider = $('.background-slider');

    $.each(data.menus, function(i, value) {
      console.log(value);
      if(value.name === main) {
        $.each(value.menus, function(i, value) {
          console.log(value);
          if(value.name === sub) {
            $.each(value.backgrounds, function(i, item) {
              var img = $('<img>').prop('src', item);
              var background = $('<div>').addClass('background');
              background.append(img);
              slider.append(background);
              attachBackground();
            });
            var menu = $('.header .nav .'+main);
            menu.find('.project-description').css(value.box).find('.content').text(value.description);
          }
        });
      }
    });
  }
})();
