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
      loadProjects().done(function(data) {
        attachMenuLink(data);
        $('.nav>li>a').click();
      }).fail(function(err) {
        console.log(err);
      });
    }
  });

  function attachBackground(subject) {
    if (subject) {
      subject = subject.replace('&', '-');
    }
    var backgrounds = !subject ? 
      $('.background-slider .background') : 
      $('.background-slider.'+subject+' .background');
    var images = backgrounds.find('img')
    .map(function(index,item){return $(item).prop('src')});

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
      return next;
    }

    function previousBackground() {
      var item = $('.background-slider .background.active');
      var cur = backgrounds.index(item);
      var previous = (cur+backgrounds.length-1) % backgrounds.length;
      setBackground(previous);
      return previous;
    }
    function activeSubject(subject) {
      subject = subject.replace('&', '-');
      var backgrounds = $('.background-slider.'+subject+' .background');
      $('.background-slider .background').removeClass('active');
      backgrounds.first().addClass('active');
    }

    setBackground(0);

    return {
      setBackground: setBackground, 
      clearBackground: clearBackground, 
      nextBackground: nextBackground, 
      previousBackground: previousBackground, 
      backgorundCount: backgrounds.length,
      activeSubject: activeSubject
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
    function prepareBackgrounds(backgrounds, name) {
      name = name.replace('&', '-');
      var backgroundDivs = $.map(backgrounds, function(item) {
        var img = $('<img>').prop('src', item);
        var background = $('<div>').addClass('background');
        return background.append(img);
      });
      var slider = $('<div>')
                  .addClass('background-slider')
                  .addClass(name)
                  .append(backgroundDivs);
      $('.content-container').before(slider);
      return attachBackground(name);
    }

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
        var backgroundController = prepareBackgrounds(object.backgrounds, sub);
        link.click(function(ev) {
          ev.preventDefault();
          $('.header .nav .sub-nav>li>a').removeClass('selected');
          $(this).addClass('selected');
          // backgroundController.activeSubject(sub);
          setProjectContents(data, main, sub, backgroundController);
        });
        setProjectContents(data, main, sub, backgroundController);
      });
      menu.find('a.blur-link').click(function(ev) {
        ev.preventDefault();
        $(this).parent().find('.sub-nav>li>a').first().click();
      });
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

  function setProjectContents(data, main, sub, backgroundController) {
    $.each(data.menus, function(i, value) {
      if(value.name === main) {
        $.each(value.menus, function(i, value) {
          if(value.name === sub) {
            var menu = $('.header .nav .'+main);
            menu.find('.project-description').css(value.box).find('.content').text(value.description);
          }
        });
        var menu = $('.header .nav .'+main);
        var next = menu.find('.project-pager a.next');
        var previous = menu.find('.project-pager a.previous');
        function changePager(cur, total) {
          if (cur >= total-1) {
            next.addClass('disabled');
          } else {
            next.removeClass('disabled');
          }
          if(cur <= 0) {
            previous.addClass('disabled');
          } else {
            previous.removeClass('disabled');
          }
        }
        next
        .click(function(ev) {
          ev.preventDefault();
          if(next.hasClass('disabled')) {
            return;
          }
          changePager(backgroundController.nextBackground(),
            backgroundController.backgorundCount);
        });
        previous
        .click(function(ev) {
          ev.preventDefault();
          if(previous.hasClass('disabled')) {
            return;
          }
          changePager(backgroundController.previousBackground(),
            backgroundController.backgorundCount);
        });
        backgroundController.activeSubject(sub);
      }
    });
  }
})();
