$('.js-select').select2({
   width: '100%',
   minimumResultsForSearch: -1
 });
 function formatImage (image) {
   if (!image.id) {
     return image.text;
   }
   var baseUrl = "images/content";
   var $image = $(
     '<span><img src="' + baseUrl + '/' + image.element.value.toLowerCase() + '.png" class="select-img" /> ' + image.text + '</span>'
   );
   return $image;
 };
 $('.js-select-with-image').select2({
   width: '100%',
   minimumResultsForSearch: -1,
   templateResult: formatImage
 });