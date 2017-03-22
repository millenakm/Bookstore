var tallest = 0;

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
    $('#carrinho').click(function(){
        carrinho();
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
    $('.list-result').html('');
    $("#searchResult").html('');

}

function offSetManager(){
    var yOffset = 0;
    var currYOffSet = window.pageYOffset;

    if(yOffset < currYOffSet) {
        $('.navig').addClass('navig-top');
        $('.carrinho-box').addClass('carrinho-top');
        $('.navbar-content').css({top: '15%'});
        $('#imagem').fadeOut(200);
    }
    else if(currYOffSet == yOffset){
        $('.navig').removeClass('navig-top');
        $('.carrinho-box').removeClass('carrinho-top');
        $('.navbar-content').css({top: '10%'});
        $('#imagem').fadeIn(500);
    }
}

function equalHeight(group) { 
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
            $(".list-result").html('');
            return;
        }

        var output = '';//cria a div para mostras os resultados
        var regex = new RegExp(searchField, "i");//define a busca sem case sensitive
        $.get("http://localhost:3000/dados", function(data){//procura os dados
            var cor = 0;
            for(i in data){
                var titulo = data[i].titulo;
                if (titulo.search(regex) != -1 || data[i].autor.search(regex) != -1 || data[i].editora.search(regex) != -1){//se houver dados correspondentes à busca
                    //mostra a div de resultados e printa 
                    output+='<a data-id="'+data[i].id+'" onmouseover="painelResult(this)"><div id="livros"><div id="livros-result" class="row livrosCor-'+cor+'">'
                    +'<h5 class="col-md-3">'+data[i].titulo+'</h5><h5 class="col-md-3">'+data[i].autor+'</h5>'
                    +'<h3 class="col-md-3">R$ '+data[i].preço.toString()+'</h3></a></div></div>';

                    cor++;
                }
            }
            output += '';
            $('.list-result').html(output);//define a div com os resultados
            align();
        });
    });
}

function align(){
    var marginBottom = $('.list-result').css('bottom');
    var marginTop = marginBottom/2;
}

function painelResult(elem){
    $.get("http://localhost:3000/dados", function(data){//procura os dados
        $(data).each(function (){//percorre um por um
            if($(elem).data('id') == this.id){
                var livro = '<div><h3>'+this.titulo+'</h3></div>';
                $("#searchResult").html(livro);
            }
        });
    });
}

function carrinho(){
    var state = parseInt($('.carrinho-box').css('height')) > 1;
    $('.carrinho-box').animate({height:(state ? "30%" : '0')}, 100);
    $('.carrinho-box').animate({height:(state ? '0': '30%')}, 200);
}
