import Script from 'next/script'

export default function FooterScript({ }) {
    return (
        <>
            <Script type="text/javascript" src="/js/jquery-3.6.0.min.js" />
            <Script type="text/javascript" src="/js/bootstrap.bundle.min.js" />

            <Script id="footer-custom-scripts" strategy="lazyOnload" >
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

                    $(".jq_login").click(function(){
                        $("#loginSidebar").addClass("active");
                        $('body').addClass('overflow-active');
                        $('.sidebar-overlay-bg').addClass('active');
                    });

                    $(".back-arrow").click(function(){
                        $("#mobileVerfication").removeClass("active");
                        $("#loginSidebar").addClass("active");
                        $('body').addClass('overflow-active');
                        $('.sidebar-overlay-bg').addClass('active');
                    });

                    $(".jq_verify").click(function(){
                        $("#loginSidebar").removeClass("active");
                        $("#mobileVerfication").addClass("active");
                        $('body').addClass('overflow-active');
                        $('.sidebar-overlay-bg').addClass('active');
                    });

                    $(".sidebar-overlay-bg").click(function(){
                        $("#loginSidebar").removeClass("active");
                        $("#mobileVerfication").removeClass("active");
                        $('body').removeClass('overflow-active');
                        $(".sidebar-overlay-bg").removeClass('active');
                        $("#wishlistSidebar").removeClass("active");
                    });

                    function closeSidebar(){
                        $("#loginSidebar").removeClass("active");
                        $("#mobileVerfication").removeClass("active");
                        $('body').removeClass('overflow-active');
                        $(".sidebar-overlay-bg").removeClass('active');
                        $("#wishlistSidebar").removeClass("active");
                    }

                    function openLoginSideBar(){
                        $("#loginSidebar").addClass("active");
                        $('body').addClass('overflow-active');
                        $('.sidebar-overlay-bg').addClass('active');
                    }

                    function openOTPSideBar(){
                        $("#loginSidebar").removeClass("active");
                        $("#mobileVerfication").addClass("active");
                        $('body').addClass('overflow-active');
                        $('.sidebar-overlay-bg').addClass('active');
                    }
                    
                    function openUserSideBar(){
                        $(".left-menu-box").addClass("active");
                        $(".lm-overflow-bg").addClass("active");
                        $("body").addClass("body-overflow");   
                    }

                    function closeUserSideBar(){
                        $(".left-menu-box").removeClass("active");
                        $(".lm-overflow-bg").removeClass("active");
                        $("body").removeClass("body-overflow");
                    }

                   function openWishlistSideBar(){
                        $("#wishlistSidebar").addClass("active");
                        $('body').addClass('overflow-active');
                        $('.sidebar-overlay-bg').addClass('active');
                    };
                `}
            </Script>
        </>
    )
}