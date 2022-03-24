$('.js-slider').slick({
   slidesToShow: 4,
   slidesToScroll: 1,
   arrows:true,
   prevArrow: '<button class="slider__btn slider__btnprev"><img src="images/ico/left-slider.svg" alt="" ></button> ',
  nextArrow: ' <button class="slider__btn  slider__btnnext"><img src="images/ico/right-slider.svg" alt = "" ></button>',
  responsive: [
   {
     breakpoint: 1400,
     settings: {
       slidesToShow: 3,
       slidesToScroll: 1,
       
     }
   },
   {
     breakpoint: 820,
     settings: {
       slidesToShow: 2,
       slidesToScroll: 1
     }
   },
   {
     breakpoint: 420,
     settings: {
       slidesToShow: 1,
       slidesToScroll: 1
     }
   }
 
 ]
 });