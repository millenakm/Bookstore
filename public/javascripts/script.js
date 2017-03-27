var tallest = 0;
	
function openSearch(){
	$(".search-modal").animate({width: '100%'});
	$('body, html').css({'overflow-y':'hidden'});
	$('.search-input').focus();
}

function closeSearch(){
	$(".search-modal").animate({width: '0%'});
	$('.search-input').val(''); 
	$('body, html').css({'overflow-y':'auto'});
	$('.list-result').html('');
	$("#box-result").html('');
}

function offSetManager(){
	var yOffset = 0;
	var currYOffSet = window.pageYOffset;
	if(yOffset < currYOffSet) {
		$('.navig').addClass('navig-top');
		$('.cart-box').addClass('cart-top');
		$('.navbar-content').css({top: '15%'});
		$('#pg-title').fadeOut(200);
	}
	else if(currYOffSet == yOffset){
		$('.navig').removeClass('navig-top');
		$('.cart-box').removeClass('cart-top');
		$('.navbar-content').css({top: '10%'});
		$('#pg-title').fadeIn(500);
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
	$('#search-input').keyup(function(){//quando escrever na input, realiza a busca
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
					output+='<a><div id="livros" class="box-book" data-id="'+data[i].isbn+'" onmouseover="painelResult(this)"><div id="livros-result" class="row livrosCor-'+cor+'">'
					+'<h5 class="col-md-3">'+data[i].titulo+'</h5><h5 class="col-md-3">'+data[i].autor+'</h5>'
					+'<h3 class="col-md-3">R$ '+data[i].preço.toString()+'</h3></a></div></div>';

					cor++;
				}
			}
			output += '';
			$('.list-result').html(output);//define a div com os resultados
			align();
			$('.box-book').on('click', function(){
				$(".search-modal").animate({display: 'none'});
				product(this);
			}); 		
		});
	});
}

function align(){
	var marginBottom = $('.list-result').css('bottom');
	var marginTop = marginBottom/2;
	$('.list-result').css('mar')
}

function painelResult(elem){
	$.get("/dados", function(data){//procura os dados
		$(data).each(function (){//percorre um por um
			if($(elem).data('id') == this.isbn){
				var livro = '<div><h3>'+this.titulo+'</h3></div>';
				$("#box-result").html(livro);
			}
		});
	});
}

function product(elem){
	var parameters = $(elem).data('id');
	window.location=('/catalogo/produto?cod='+parameters);

};

function cart(){
    var state = parseInt($('.cart-box').css('height')) > 1;
    $('.cart-box').animate({height:(state ? "30%" : '0')}, 100);
    $('.cart-box').animate({height:(state ? '0': '30%')}, 200);
}

function activeLink(){
	$(this).css({'background-color':'transparent'});
	$('a').each(function () {
		$(this).removeClass('active');
	});
	$(this).addClass('active');
}

function actions(){
	window.onscroll = function() {
		offSetManager();
	}
	$('#open-search').click(function(){
		openSearch();
	});
	$('#close-search').click(function(){
		closeSearch();
	});
	$('#cart').click(function(){
		cart();
	});
	$('.navbar-content .navbar-nav a').click(function(){
		activeLink();
	});
	$('.box-book').on('click', function(){
		product(this);
	});
	$('.heart').click(function(){
		var param = {add: $(this).data('id'), op: 'adicionar'};
		heart(this, param);
	});
	$('.cart').click(function(){
		var param = {add: $(this).data('id'), op: 'adicionar'};
		carrinho(this, param);
	});
}

function heart(elem, param){
	$.get( '/catalogo/desejo',param, function(data) {
		if(data == true){
			$(elem).removeClass('glyphicon-heart-empty').addClass('glyphicon-heart').css({'color':'red'});
		}
		else if(data == false){	
			$(elem).removeClass('glyphicon-heart').addClass('glyphicon-heart-empty').css({'color':'white'});	
		}
		else{
			var check = 0;
			for(var i=0; i< data.length; i++){
				if (data[i] == param.add){
					$(elem).removeClass('glyphicon-heart-empty').addClass('glyphicon-heart').css({'color':'red'});
					check = 1;
				}
			}
			if (check == 0){
				$(elem).removeClass('glyphicon-heart').addClass('glyphicon-heart-empty').css({'color':'white'});	
			}
		}
	});
}

function carrinho(elem, param) {
	$.get( '/carrinho',param, function(data) {
		console.log(data);
	});
}

$(document).ready(function(){ 
	$("body").fadeIn(500);
	offSetManager();
	actions();
	$(".heart").each(function() {
		var param = {add: $(this).data('id'), op: 'listar'};
		heart(this, param);
	});
	equalHeight($(".grid")); 
	searchJson();
});