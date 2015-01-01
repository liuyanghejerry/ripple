(function() {
  $(document).ready(function(){
    attachBackground();
  });

  function attachBackground() {
    var items = $('.background-slider .background').each(function(index, item) {
      var item = $(item);
      var imgUrl = item.data('background');
      imgUrl = "url("+imgUrl+")";
      item.css('background-image', imgUrl);
      item.on('click', function(){
        console.log('click', index);
        next();
      });
    });
    $(items[items.length-1]).addClass('active');
    function next() {
      var active = items.siblings('.active');
      active.prev().addClass('active');
      active.removeClass('active').prependTo(active.parent())
    }
  }
})();
