$(".mobile-inner-header-icon").click(function(){
    $(this).toggleClass("mobile-inner-header-icon-click mobile-inner-header-icon-out");
    $(".main-menu").toggleClass("active");
    $('body').toggleClass('overflow-active');
    $('.overlay-bg').toggleClass('active');
    $(".dash-left").toggleClass("active");
});
$(".overlay-bg").click(function(){
    $(".mobile-inner-header-icon-click").toggleClass("mobile-inner-header-icon-click mobile-inner-header-icon-out");
    $(".main-menu").removeClass("active");
    $('body').removeClass('overflow-active');
    $('.overlay-bg').removeClass('active');
    $(".dash-left").removeClass("active");
});

$(".jq_dropdown_menu").click(function(){
  $(this).parent().toggleClass("open");
});

		
$(".m-search-icon").click(function(){
  $(".search-block").toggleClass("sticky");
});
                        
$(".mobile-search").on("click",function(){
  $(".search-box").toggleClass("open");
})     