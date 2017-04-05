// // box do carrinho
// function cart(){
//     // var state = parseInt($('.cart-box').css('height')) > 1;
//     // $('.cart-box').animate({height:(state ? "30%" : '0')}, 100);
//     // $('.cart-box').animate({height:(state ? '0': '30%')}, 200);
//     $(".cart-box").slideToggle('slow');
// }

var routerProduto = '/catalogo/produto/';
var tallest = 0;
var valor = 0;
var countEffect = 0;
var clickEvent = false;
	
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
		if(searchField === '')  {//se não houver nada no campo de busca, limpa a div de resultados
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

// define a lista dos resultados
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
	window.location=(routerProduto+parameters);
}


// // conta a quantidade de produtos no carrinho e nos desejos e printa na tela
// function count(param){
// 	if (param.count=='carrinho'){
// 		$.get('/countcart', function(data){
// 			$("#numberCart").html(data.length);
// 		});
// 	}if(param.count=='desejos'){
// 		$.get('/countwish', function(data){
// 			$("#numberWish").html(data.length);
// 		});
// 	}
// }

// // adiciona ou remove produtos da lista de desejos
// function wishList(elem, param){
	
// 	$.get( '/catalogo/desejo',param, function(data) {
// 		if(data == true){
// 			$(elem).removeClass('glyphicon-heart-empty').addClass('glyphicon-heart').css({'color':'red'});
// 		}
// 		else if(data == false){	
// 			$(elem).removeClass('glyphicon-heart').addClass('glyphicon-heart-empty').css({'color':'white'});	
// 		}
// 		else{
// 			var check = 0;
// 			quant = data.length;
// 			for(var i=0; i< data.length; i++){
// 				if (data[i] == param.add){
// 					$(elem).removeClass('glyphicon-heart-empty').addClass('glyphicon-heart').css({'color':'red'});
// 					check = 1;
// 				}
// 			}
// 			if (check == 0){
// 				$(elem).removeClass('glyphicon-heart').addClass('glyphicon-heart-empty').css({'color':'white'});	
// 			}
// 		}
// 		count({count:'desejos'});
// 	});
// }

// // adiciona ou remove produtos do carrinho
// function cart(elem, param) {
// 	$.get( '/carrinho', param, function(data){
// 		if(data == true){
// 			$(elem).css({'color':'aqua'});
// 		}
// 		else if(data == false){	
// 			$(elem).css({'color':'white'});	
// 		}
// 		else{
// 			var check = 0;
// 			for(var i=0; i< data.length; i++){
// 				if (data[i] == param.add){
// 					$(".nome").append(data[i]);
// 					$(elem).css({'color':'aqua'});
// 					check = 1;
// 				}
// 			}
// 			if (check == 0){
// 				$(elem).css({'color':'white'});	
// 			}
// 		}
// 		count({count:'carrinho'});
// 	});
// }

// valor total do carrinho
function totalValue(group) {	
	group.each(function() {
		valor+=Number($(this).data('valor').replace(',','.'));
	});
	$('.valorTotal').html('<h3>Total: R$ '+valor.toFixed(2).toString().replace('.',',')+'</h3>');
} 

function createFilter(){
	var categorias = [];
	var editoras = [];
	var autores = [];
	$.get('/dados', function(data){
		$.each(data, function() {
			if ($.inArray(this.categoria, categorias)==-1) {
					categorias.push(this.categoria);
			}
			if ($.inArray(this.editora, editoras)==-1) {
					editoras.push(this.editora);
			}
			if ($.inArray(this.autor, autores)==-1){
					autores.push(this.autor);
			}
		});
		for(i in categorias){
			categorias.sort();
			$("#select-categ").append('<option value="'+categorias[i]+'">'+categorias[i]+'</option>');
		}
		for(i in editoras){
			editoras.sort();
			$("#select-editora").append('<option value="'+editoras[i]+'">'+editoras[i]+'</option>');
		}
		for(i in autores){
			autores.sort();
			$("#select-autor").append('<option value="'+autores[i]+'">'+autores[i]+'</option>');
		}
	});
}

// filtro da página
function filter(elem){
	var valor = $(elem).val();
	if($(elem).parents('form').data('filter')!==undefined){
		valor = $(elem).parents('form').data('filter');
		$('.filter-icon').hide();
		$('.titulo-pg').append(' - '+valor);
	}

	$('.grid').hide();
	$('.grid').each(function(){
		if($(this).data('categ')==valor || $(this).data('autor')==valor || $(this).data('editora')==valor){
			$(this).slideDown(1000);
		}
	});
	if(valor=='all'){
		$('.grid').slideDown(1000);
		msg('Nenhum item na lista de desejos.');
	}
	else{
		msg('Não foram encontrados itens nesta categoria.');
	}
	// filterAutor(categoria);
}

function msg(msg){
	if($('.grid:visible').length==0){
		$('#msg').html(msg).show(300);
	}
}

// gerencia os produtos
// function removeProduct(elem){
// 	if($(elem).hasClass('wish')){		
// 		$(elem).parents('.grid').fadeOut(function(){
// 			$(this).remove();
// 			msg('Nenhum item na lista de desejos.');
// 		});
// 	}

// 	else if($(elem).hasClass('cart')){
// 		$(elem).parents('.isbn').addClass('removeCart');
// 		$('.removeCart').hide(function(){ 
// 			$('.removeCart').remove(); 
// 			valor = 0;
// 			totalValue($(".valor"));
// 		});
// 	}
// }

// efeito do filtro
function filterEffect(){
	$('.filter-icon > span').each(function(){
		$(this).rotate(180,{
			duration: 250
		});
	});
}

function style(){
	window.onscroll = function() {
		onScroll();
	}
	$('#open-search').click(function(){
		openSearch();
	});
	$('#close-search').click(function(){
		closeSearch();
	});
	$(".icon > a").mouseenter(function(){
		$(this).find(".badge").css({'box-shadow': '0 5px 8px 1px rgba(0,0,0,0.4)'}).animate({'margin-top':'8px'}, 100);
	});
	$(".icon > a").mouseleave(function(){
		$(this).find(".badge").css({'box-shadow': '0 4px 2px -2px rgba(0,0,0,0.4)'}).animate({'margin-top':'11px'}, 100);
	});
	$('.filter-icon').mouseenter(function(){
		$('.filter-icon > span').animate({'font-size' : '20px'}, 100);
	});
	$('.filter-icon').mouseleave(function(){
		$('.filter-icon > span').animate({'font-size' : '14px'}, 100);
	});
	$('.filter-icon').click(function(){
		countEffect++;
		filterEffect();
		$(this).css({bottom: '60px'});
		$('.navig-filter').css({display:'block'});
		if(	countEffect==2){
			countEffect=0;
			$(this).css({bottom: '5%'});
			$('.navig-filter').css({display:'none'});
			filterEffect();
		}
	});
}

// ações
function actions(){
	style();
	$('.box-book').on('click', function(){
		productPage($(this).parents('.isbn').data('id'));
	});
	$('.wish').click(function(){	
		$(this).toggleClass("glyphicon-heart-empty glyphicon-heart");	
		var cod = $(this).parents('.isbn').data('id');

		// var param = {add: $(this).parents('.isbn').data('id'), op: 'adicionar'};
		// wishList(this, param);
	});
	$('.cart').click(function(){
		// var param = {add: $(this).parents('.isbn').data('id'), op: 'adicionar'};
		// cart(this, param);
	});

	// $('#removeCart').click(function(){
	// 	removeProduct(this);
	// });
	// $("#desejos").find('.wish').click(function(){
	// 	removeProduct(this);
	// });
	// $(".wish").each(function() {
	// 	var param = {add: $(this).parents('.isbn').data('id'), op: 'listar'};
	// 	wishList(this, param);
	// });
	// $(".cart").each(function() {
	// 	var param = {add: $(this).parents('.isbn').data('id'), op: 'listar'};
	// 	cart(this, param);
	// });
	$(".selectpicker").change(function(){
		msg('');
		filter($(this));
		$(".selectpicker").not(this).val('all');;

	});
	$(".catalogo-x").click(function(){
		var param = $(this).data('filter');
		// console.log(param);
		window.location=('/catalogo?filter='+param);
		// history.pushState(null, null, '?filter='+param);
	})
	// count({count:'desejos'});
	// count({count:'carrinho'});
}

function carousel(){
	$('#myCarousel').on('click', '.nav a', function() {
			clickEvent = true;
			$('.nav li').removeClass('active');
			$(this).parent().addClass('active');		
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.nav').children().length-1;
			var current = $('.nav li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count == id) {
				$('.nav li').first().addClass('active');	
			}
		}
		clickEvent = false;
	});
}

$(document).ready(function(){ 
	$("body").fadeIn(500);
	onScroll();
	actions();
	totalValue($(".valor"));
	equalHeight($(".grid")); 
	searchJson();
	createFilter();
	filter($('.selectpicker'));
	carousel();
	$("#img-produto").elevateZoom({zoomType: "lens", lensShape : "round", lensSize : 200});
});