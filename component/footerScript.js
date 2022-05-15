import Image from 'next/image'
import Script from 'next/script'

export default function FooterScript({ }) {
    return (
        <>
            <Script type="text/javascript" src="/js/jquery-3.6.0.min.js" />
            <Script type="text/javascript" src="/js/bootstrap.bundle.min.js" />

            <Script id="page-sliders" strategy="lazyOnload" >
                {`
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

                
                $(document).ready(function(){
                    $(".btn-minus").on("click",function(){
                        var now = $(".countItem input").val();
                        if ($.isNumeric(now)){
                            if (parseInt(now) -1> 0)
                            { now--;}
                            $(".countItem input").val(now);
                        }
                    })            
                    $(".btn-plus").on("click",function(){
                        var now = $(".countItem input").val();
                        if ($.isNumeric(now)){
                            $(".countItem input").val(parseInt(now)+1);
                        }
                    })                   
                })
                `}
            </Script>
        </>
    )
}