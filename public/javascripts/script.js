$(document).ready(function(){
    offSetManager();
    window.onscroll = function() {
        offSetManager();
    }
    $('#search').click(function(){
        search();
    });
    $('#close-search').click(function(){
        closeSearch();
    });
    $("body").fadeIn(500);
    $('.navbar-content .navbar-nav a').click(function(){
        $(this).css({'background-color':'transparent'});
        $('a').each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
    });
});

function search(){
    $(".search-box").animate({width: '100%'});
    $('.search-input').focus();
}

function closeSearch(){
    $(".search-box").animate({width: '0%'});
    $('.search-input').val(''); 
}

function offSetManager(){
    var yOffset = 0;
    var currYOffSet = window.pageYOffset;

    if(yOffset < currYOffSet) {
        $('.navig').addClass('navig-top');
        $('.titulo-pg').css({'font-size':'45px', 'width':'auto'});
    }
    else if(currYOffSet == yOffset){
        $('.navig').removeClass('navig-top');
        $('.titulo-pg').css({'font-size':'60px'});
    }
}