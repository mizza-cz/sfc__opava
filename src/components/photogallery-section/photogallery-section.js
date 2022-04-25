if($('.js-gallery').length) {
   $('body').append('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
   var pswpElement = document.querySelectorAll('.pswp')[0];
   $('.js-gallery').each( function() {
       var $pic     = $(this),
       getItems = function() {
           var items = [];
           $pic.find('a').each(function() {
               var $href   = $(this).attr('href'),
                   $size   = $(this).data('size').split('x'),
                   $width  = $size[0],
                   $height = $size[1];
               var item = {
                   src : $href,
                   w   : $width,
                   h   : $height
               }
               items.push(item);
           });
           return items;
       }
       var items = getItems();
       $pic.on('click', 'figure', function(event) {
           event.preventDefault();
 
           var $index = $(this).parent().index();
           var options = {
               index: $index,
               bgOpacity: 0.7,
               showHideOpacity: true
           }
           // Initialize PhotoSwipe
           var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
           gallery.init();
       });
   });
 }
 