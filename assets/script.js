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
        buildMenu(data);
        bindExpandButton();
        // toggleMenu(data, 'identity');
        jumpHash(data);
        $(window).on('hashchange', function() {
          jumpHash(data);
        });
      }).fail(function(err) {
        console.log(err);
      });
    }
  });

  function jumpHash(data) {
    var routes = location.hash.split('#').slice(1);

    var main = null;
    var sub = null;

    if(routes.length) {
      main = routes[0];
    } 
    if(routes.length-1 > 0) {
      sub = routes[1];
    }

    if(!main) {
      main = 'identity';
    }

    var body = $('body');
    if(!body.hasClass(main) && !body.hasClass(sub)) {
      toggleMenu(data, main, sub);
    }
  }

  function attachBackground(subject) {
    if (subject) {
      subject = subject.replace(/[& \.]/, '-');
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

    function nextBackground(subject) {
      if (subject) {
        subject = subject.replace(/[& \.]/, '-');
      }
      var item = !subject ? 
        $('.background-slider .background.active') :
        $('.background-slider .'+subject+' .background.active');
      var cur = backgrounds.index(item);
      var next = (cur+1) % backgrounds.length;
      setBackground(next);
      return next;
    }

    function previousBackground(subject) {
      if (subject) {
        subject = subject.replace(/[& \.]/, '-');
      }
      var item = !subject ? 
        $('.background-slider .background.active') :
        $('.background-slider .'+subject+' .background.active');
      var cur = backgrounds.index(item);
      var previous = (cur+backgrounds.length-1) % backgrounds.length;
      setBackground(previous);
      return previous;
    }
    function activeSubject(subject) {
      subject = subject.replace(/[& \.]/, '-');
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

  function pureClassName(name) {
    return name.replace(/[& \.]/gi, '-');
  }

  function buildBackgrounds(backgrounds, sub) {
    sub = pureClassName(sub);
    var backgroundDivs = $.map(backgrounds, function(item) {
      var img = $('<img>').prop('src', item);
      var background = $('<div>').addClass('background');
      return background.append(img);
    });
    var slider = $('<div>')
                .addClass('background-slider')
                .addClass(sub)
                .append(backgroundDivs);
    $('.content-container').before(slider);
    return attachBackground(sub);
  }

  function buildMenu(data) {
    $.each(data.menus, function(i, object) {
      var main = object.name;
      var menu = $('.header .nav .'+main);
      menu.find('a.blur-link').text(main);
      menu.find('.sub-nav>li>a').remove();
      $.each(object.menus, function(i, object) {
        var sub = object.name;
        var link = $('<a>').prop('href', '').addClass('glow-link upper').text(sub);
        var subMenu = $('<li>').addClass(pureClassName(sub)).append(link);
        menu.find('.inner-content .sub-nav').append(subMenu);
        var backgroundController = buildBackgrounds(object.backgrounds, sub);
        link.click(function(ev) {
          ev.preventDefault();
          toggleMenu(data, main, sub);
        });
        setPager(data, main, sub, backgroundController);
      });
      menu.find('a.blur-link').click(function(ev) {
        ev.preventDefault();
        toggleMenu(data, main);
      });
    });

    $('.header .nav>li')
    .hover(function(ev) {
      $(this).find('.inner-content').slideDown();
    }, function() {
      $(this).not('.selected').find('.inner-content').slideUp();
    });
  }

  function toggleMenu(data, main, sub) {
    var menu = $('ul.nav li.'+main);
    menu.siblings('li').removeClass('selected');
    menu.addClass('selected');
    var submenu = menu.find('.inner-content .sub-nav li').first();
    if ($.type(sub) === 'string') {
      sub = pureClassName(sub);
      submenu = menu.find('.inner-content .sub-nav li.'+sub);
    } else {
      sub = submenu.attr('class').split('.')[0];
    }
    $('.inner-content .sub-nav li').removeClass('selected');
    submenu.addClass('selected');
    activeBackground(sub);
    toggleProjectContent(data, main, sub);
    // slide up all other expanded menu
    $('.header .nav>li').not('.selected').find('.inner-content').slideUp();
    location.hash = '#' + main + '#' + sub;
  }

  function activeBackground(sub) {
    sub = pureClassName(sub);
    var backgrounds = $('.background-slider.'+sub+' .background');
    $('.background-slider .background').removeClass('active');
    backgrounds.first().addClass('active');
  }

  function toggleProjectContent(data, main, sub) {
    $.each(data.menus, function(i, value) {
      if(pureClassName(value.name) === main) {
        $.each(value.menus, function(i, value) {
          if(pureClassName(value.name) === sub) {
            var menu = $('.header .nav .'+main);
            menu.find('.project-description').css(value.box).find('.content').text(value.description);
          }
        });
        sub = pureClassName(sub);
        $('body').removeClass();
        $('body').addClass(sub).addClass(main);
        resetPager(main, sub);
      }
    });
  }

  function setPager(data, main, sub, backgroundController) {
    sub = pureClassName(sub);
    $.each(data.menus, function(i, value) {
      if(value.name === main) {
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
          if(next.hasClass('disabled') || !$('body').hasClass(sub)) {
            return;
          }
          changePager(backgroundController.nextBackground(),
            backgroundController.backgorundCount);
        });
        previous
        .click(function(ev) {
          ev.preventDefault();
          if(previous.hasClass('disabled') || !$('body').hasClass(sub)) {
            return;
          }
          changePager(backgroundController.previousBackground(),
            backgroundController.backgorundCount);
        });
      }
    });
  }

  function resetPager(main, sub) {
    sub = pureClassName(sub);
    var backgrounds = $('.background-slider.'+sub).find('.background');
    var menu = $('.header .nav .'+main);
    var next = menu.find('.project-pager a.next');
    var previous = menu.find('.project-pager a.previous');
    previous.addClass('disabled');
    if (backgrounds.length > 1) {
      next.removeClass('disabled');
    } else {
      next.addClass('disabled');
    }
  }

  function bindExpandButton() {
    $('.header .nav .expand-button').click(function(ev) {
      ev.preventDefault();
      var self = $(this);
      self.toggleClass('minimized');
      self.parent().find('.project-description .content').slideToggle();
    });
  }
})();
