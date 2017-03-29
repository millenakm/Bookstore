var tallest = 0;
	
// Abre a tela de pesquisa
function openSearch(){
	$(".search-modal").animate({width: '100%'});
	$('body, html').css({'overflow-y':'hidden'});
	$('.search-input').focus();
}

// Fecha a tela de pesquisa
function closeSearch(){
	$(".search-modal").animate({width: '0%'});
	$('.search-input').val(''); 
	$('body, html').css({'overflow-y':'auto'});
	$('.list-result').html('');
	$("#box-result").html('');
}

// Muda caracteristicas conforme a scrollbar
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

// muda a altura das divs .grid, para todas da mesma altura
function equalHeight(group) {
	group.each(function() {
		var thisHeight = $(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	});
	group.each(function() { $(this).height(tallest); });
} 

// faz a busca dos dados
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
			$('.box-book').on('click', function(){
				$(".search-modal").animate({display: 'none'});
				product($(this).data('id'));
			}); 		
		});
	});
}

// painel com informações de resultados da pesquisa
function painelResult(elem){
	$.get("/dados", function(data){//procura os dados
		$(data).each(function (){//percorre um por um
			if($(elem).data('id') == this.isbn){
				var livro = '<img src="../images/livros/'+this.capa+'.jpg" height="400px">';
				$("#box-result").html(livro);
			}
		});
	});
}

// vai para a página do produto clicado
function product(parameters){
	window.location=('/catalogo/produto?cod='+parameters);

};

// box do carrinho
function cart(){
    // var state = parseInt($('.cart-box').css('height')) > 1;
    // $('.cart-box').animate({height:(state ? "30%" : '0')}, 100);
    // $('.cart-box').animate({height:(state ? '0': '30%')}, 200);
    $(".cart-box").slideToggle('slow');
}

// link ativo
function activeLink(){
	$(this).css({'background-color':'transparent'});
	$('a').each(function () {
		$(this).removeClass('active');
	});
	$(this).addClass('active');
}

// ações
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
		product($(this).parents('.grid').data('id'));
	});
	$('.heart').click(function(){
		var param = {add: $(this).parents('.grid').data('id'), op: 'adicionar'};
		heart(this, param);
	});
	$('.cart').click(function(){
		var param = {add: $(this).parents('.grid').data('id'), op: 'adicionar'};
		carrinho(this, param);
	});
	$('#filter').change(function(){
		filter($(this).val());
	});
	$(".heart").each(function() {
		var param = {add: $(this).data('id'), op: 'listar'};
		heart(this, param);
	});
	$(".cart").each(function() {
		var param = {add: $(this).data('id'), op: 'listar'};
		carrinho(this, param);
	});
	$("#select").change(function(){
		filter(this);	
	});
}

// lista de desejos
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

// filtro
function filter(elem){
	var categoria = $(elem).val();
	$('.grid').hide();
	$('.mensagem').hide();
	$('.grid').each(function(){
		if($(this).data('categ')==categoria){
			$(this).show();
		}
	});
	if(categoria=='all'){
		$('.grid').show();
	}
	if($('.grid:visible').length==0){
		$('.mensagem').show();
	}
}

// carrinho
function carrinho(elem, param) {
	$.get( '/carrinho', param, function(data){
		if(data == true){
			$(elem).css({'color':'aqua'});
		}
		else if(data == false){	
			$(elem).css({'color':'white'});	
		}
		else{
			var check = 0;
			for(var i=0; i< data.length; i++){
				if (data[i] == param.add){
					$(".nome").append(data[i]);
					$(elem).css({'color':'aqua'});
					check = 1;
				}
			}
			if (check == 0){
				$(elem).css({'color':'white'});	
			}
		}
	});
}

// valor total do carrinho
function valorTotal(group) {
	group.each(function() {
		var thisHeight = $(this).data('valor');
	});
	group.each(function() { $(this); });
} 


$(document).ready(function(){ 
	$("body").fadeIn(500);
	$('.mensagem').hide();
	offSetManager();
	actions();
	valorTotal($(".valor"));
	equalHeight($(".grid")); 
	searchJson();
	filter($("#select"));
});