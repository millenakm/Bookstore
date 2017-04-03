var tallest = 0;
var valor = 0;
	
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
	$('.list-result, #box-result').html('');
}

// Muda caracteristicas conforme a scrollbar
function onScroll(){
	var scrollY = 0;
	var pageScroll = window.pageYOffset;
	if(scrollY < pageScroll) {
		$('.navig').addClass('navig-top');
		$('.cart-box').addClass('cart-top');
		$('.navbar-content').css({top: '15%'});
		$('#pg-title').fadeOut(200);
	}
	else if(pageScroll == scrollY){
		$('.navig').removeClass('navig-top');
		$('.cart-box').removeClass('cart-top');
		$('.navbar-content').css({top: '10%'});
		$('#pg-title').fadeIn(500);
	}
}

// muda a altura das divs .grid, para todas terem a mesma altura
function equalHeight(grid){
	grid.each(function(){
		var thisHeight = $(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	});
	grid.each(function(){ 
		$(this).height(tallest); 
	});
} 

// faz a busca dos dados
function searchJson(){
	$('#search-input').keyup(function(){//quando escrever na input, realiza a busca
		var searchField = $(this).val();
		if(searchField === '')  {//se não houver nada no campo de busca, esconde a div de resultados
			$(".list-result, #box-result").html('');
			return;
		}

		var results = '<table class="table"><thead><tr><th>Produto</th><th>Título</th><th>Autor</th><th>Preço(R$)</th><th>Categoria</th><th>Editora</th></tr></thead><tbody>';
	
		var regex = new RegExp(searchField, "i");//define a busca sem case sensitive
		$.get("/dados", function(data){//procura os dados
			var cor = 1;
			for(i in data){
				var titulo = data[i].titulo;
				if (titulo.search(regex) != -1 || data[i].autor.search(regex) != -1 || data[i].editora.search(regex) != -1 || data[i].categoria.search(regex) != -1 || data[i].isbn.search(regex) != -1){//se houver dados correspondentes à busca
					//mostra a div de resultados e printa 
					// results+='<a><div id="livros" class="box-book" data-id="'+data[i].isbn+'" onmouseover="painelResult(this)"><div id="livros-result" class="row livrosCor-'+cor+'">'
					// +'<h5 class="col-md-3">'+data[i].titulo+'</h5><h5 class="col-md-3">'+data[i].autor+'</h5>'
					// +'<h4 class="col-md-3">R$ '+data[i].preço.toString()+'</h4>'
					// +'<h5 class="col-md-3">Editora: '+data[i].editora+'</h5></a></div></div>';
					results+='<tr id="livros" class="box-book" data-id="'+data[i].isbn+'" onmouseover="painelResult(this)">'
					+'<td class="cod">'+data[i].isbn+'</td>'
					+'<td class="colored">'+data[i].titulo+'</td>'
					+'<td class="autor">'+data[i].autor+'</td>'
					+'<td class="colored">'+data[i].preço+'</td>'
					+'<td>'+data[i].editora+'</td>'
					+'<td>'+data[i].categoria+'</td>'
					+'</tr>';

					cor++;
				}
			}
			results+='</tbody></table>';
			searchResult(results);
		});
	});
}

function searchResult(results){
	$('.list-result').html(results);//define a div com os resultados
	$('.box-book').on('click', function(){
		$(".search-modal").animate({display: 'none'});
		productPage($(this).data('id'));
	}); 
	if($(".list-result td").length==0){
		$(".list-result").html("<h2>Nenhum resultado encontrado.</h2>");
		$("#box-result").html("");
	}		
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
function productPage(parameters){
	window.location=('/catalogo/produto?cod='+parameters);
}

// // box do carrinho
// function cart(){
//     // var state = parseInt($('.cart-box').css('height')) > 1;
//     // $('.cart-box').animate({height:(state ? "30%" : '0')}, 100);
//     // $('.cart-box').animate({height:(state ? '0': '30%')}, 200);
//     $(".cart-box").slideToggle('slow');
// }

// link ativo
function activeLink(){
	$(this).css({'background-color':'transparent'});
	$('a').each(function () {
		$(this).removeClass('active');
	});
	$(this).addClass('active');
}


function count(param){
	$.get('/count', param, function(data){
		if (param.count=='carrinho'){
			$("#numberCart").html(data.length);
		}
		else if (param.count=='desejos'){
			$("#numberWish").html(data.length);
		}
	});
}

function cartProducts(elem){
	$(elem).parents('.isbn').addClass('excluir');
	$('.excluir').hide(function(){ 
		$('.excluir').remove(); 
		valor = 0;
		totalValue($(".valor"));
	});
}

// lista de desejos
function wishList(elem, param){
	$.get( '/catalogo/desejo',param, function(data) {
		if(data == true){
			$(elem).removeClass('glyphicon-heart-empty').addClass('glyphicon-heart').css({'color':'red'});
		}
		else if(data == false){	
			$(elem).removeClass('glyphicon-heart').addClass('glyphicon-heart-empty').css({'color':'white'});	
		}
		else{
			var check = 0;
			quant = data.length;
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
		count({count:'desejos'});
	});
}

// filtro
function filter(elem){
	var categoria = $(elem).val();
	$('.grid').hide();
	$('#mensagem').hide();
	$('.grid').each(function(){
		if($(this).data('categ')==categoria){
			$(this).slideDown(1000);
		}
	});
	if(categoria=='all'){
		$('.grid').slideDown(1000);
	}
	if($('.grid:visible').length==0){
		$('#mensagem').show(300);
	}
}

// carrinho
function cart(elem, param) {
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
		count({count:'carrinho'});
	});
}

// valor total do carrinho
function totalValue(group) {	
	group.each(function() {
		valor+=Number($(this).data('valor').replace(',','.'));
	});
	$('.valorTotal').html('<h3>Total: R$ '+valor.toFixed(2).toString().replace('.',',')+'</h3>');
} 

function categFilter(){
	var categorias = [];
	$.get('/dados', function(data){
		$.each(data, function(index, value) {
			if ($.inArray(value.categoria, categorias)==-1) {
				categorias.push(value.categoria);
			}
		});
		for(i in categorias){
			$("#select-categ").append('<option value="'+categorias[i]+'">'+categorias[i]+'</option>');
		}
	});
}

function removeWhish(elem){
	$(elem).find('.wish').addClass('removeDesejo');
}

// ações
function actions(){
	window.onscroll = function() {
		onScroll();
	}
	$('#open-search').click(function(){
		openSearch();
	});
	$('#close-search').click(function(){
		closeSearch();
	});
	$('.navbar-content .navbar-nav a').click(function(){
		activeLink();
	});
	$('.box-book').on('click', function(){
		productPage($(this).parents('.isbn').data('id'));
	});
	$('.wish').click(function(){
		var param = {add: $(this).parents('.isbn').data('id'), op: 'adicionar'};
		wishList(this, param);
	});
	$('.cart').click(function(){
		var param = {add: $(this).parents('.isbn').data('id'), op: 'adicionar'};
		cart(this, param);
	});
	$('.deletar').click(function(){
		cartProducts(this);
	});
	$('#filter').change(function(){
		filter($(this).val());
	});
	$(".wish").each(function() {
		var param = {add: $(this).parents('.isbn').data('id'), op: 'listar'};
		wishList(this, param);
	});
	$(".cart").each(function() {
		var param = {add: $(this).parents('.isbn').data('id'), op: 'listar'};
		cart(this, param);
	});
	$("#select-categ").change(function(){
		filter(this);	
	});
	$('.removeDesejo').on('click', function(){
		$(this).parents('.grid').fadeOut();
	});
	$(".icon > a").mouseenter(function(){
		$(this).find(".badge").css({'box-shadow': '0 5px 8px 1px rgba(0,0,0,0.4)'}).animate({'margin-top':'8px'}, 100);
	});
	$(".icon > a").mouseleave(function(){
		$(this).find(".badge").css({'box-shadow': '0 4px 2px -2px rgba(0,0,0,0.4)'}).animate({'margin-top':'11px'}, 100);
	});
}

$(document).ready(function(){ 
	$("body").fadeIn(500);
	removeWhish($("#desejos"));
	$('#mensagem').hide();
	onScroll();
	actions();
	totalValue($(".valor"));
	equalHeight($(".grid")); 
	searchJson();
	categFilter();
	filter($("#select-categ"));
	count({count:'carrinho'});
	count({count:'desejos'});
});