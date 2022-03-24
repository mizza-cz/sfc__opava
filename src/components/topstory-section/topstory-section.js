$(document).ready(function () {
   $('.topstory .topstory__item').hover(
     function () {
       $('.topstory .topstory__item').removeClass('active');
       $(this).addClass('active');
     },
     function () {},
   );
 });