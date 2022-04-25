$(document).ready(function () {
   $('.c-topstory-section .c-topstory-section__item').hover(
     function () {
       $('.c-topstory-section .c-topstory-section__item').removeClass('active');
       $(this).addClass('active');
     },
     function () {},
   );
 });