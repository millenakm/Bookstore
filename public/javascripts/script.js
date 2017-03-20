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
    equalHeight($(".thumbnail")); 
    searchJson();
});

function search(){
    $(".search-box").animate({width: '100%'});
    $('body, html').css({'overflow-y':'hidden'});
    $('.search-input').focus();
}

function closeSearch(){
    $(".search-box").animate({width: '0%'});
    $('.search-input').val(''); 
    $('body, html').css({'overflow-y':'auto'});
}

function offSetManager(){
    var yOffset = 0;
    var currYOffSet = window.pageYOffset;

    if(yOffset < currYOffSet) {
        $('.navig').addClass('navig-top');
        $('.titulo-pg').css({'font-size':'45px', 'width':'50%', 'margin':'0 auto', 'color':'white'});
    }
    else if(currYOffSet == yOffset){
        $('.navig').removeClass('navig-top');
        $('.titulo-pg').css({'font-size':'60px', 'color':'black'});
    }
}

function equalHeight(group) {    
    var tallest = 0;    
    group.each(function() {       
        var thisHeight = $(this).height();       
        if(thisHeight > tallest) {          
            tallest = thisHeight;       
        }    
    });    
    group.each(function() { $(this).height(tallest); });
} 

function searchJson(){
    $('#searchInput').keyup(function(){//quando escrever na input, realiza a busca
        var searchField = $(this).val();
        if(searchField === '')  {//se não houver nada no campo de busca, esconde a div de resultados
            $("#searchResult").html('');
            return;
        }

        var output = '<div>';//cria a div para mostras os resultados
        var regex = new RegExp(searchField, "i");//define a busca sem case sensitive
        $.get("http://localhost:3000/dados", function(data){//procura os dados
            $(data).each(function (){//percorre um por um
                var titulo = this.titulo;
                if (titulo.search(regex) != -1 || this.autor.search(regex) != -1){//se houver dados correspondentes à busca
                    //mostra a div de resultados e printa 
                    output += "<div class='col-md-12' id='rowBusca'><div class='col-md-12' data-id="+ this.id+">"+
                    "<div class='col-md-2'><h4>" + titulo + "</h4></div>"+
                    "<div class='col-md-2'><h4>Preço: " + this.preço.toString() + "</h4></div>"+
                    "<div class='col-md-2'><h4>Autor: "+ this.autor +"</h4></div>"+
                    "<div class='col-md-4'><h4>Editora: "+ this.editora +"</h4></div></div>";
                }
            });
            output += '</div>';
            $('#searchResult').html(output);//define a div com os resultados
        });
    });
}
