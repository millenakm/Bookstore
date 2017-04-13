// // box do carrinho
// function cart(){
//     // var state = parseInt($('.cart-box').css('height')) > 1;
//     // $('.cart-box').animate({height:(state ? "30%" : '0')}, 100);
//     // $('.cart-box').animate({height:(state ? '0': '30%')}, 200);
//     $(".cart-box").slideToggle('slow');
// }

var product = '/catalogo/produto/';

// função geral para buscar os dados
function getData(handleData) {
	$.ajax({
		url:"/dados",  
		success:function(data) {
			handleData(data); 
		}
	});
}


/*************** STYLE ***************/

// funções de style ao carregar a página
function styles(){
	$("body").fadeIn(500);
	equalHeight($(".grid")); 
	onScroll();
	carousel();
	zoomImg();
	filterController();
	iconsNav();
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
		$('#logoNav').fadeIn(200);
	}
	else if(pageScroll == scrollY){
		$('.navig').removeClass('navig-top');
		$('.cart-box').removeClass('cart-top');
		$('.navbar-content').css({top: '10%'});
		$('#pg-title').fadeIn(500);
		$('#logoNav').fadeOut(100);
	}
}
// muda a altura das divs .grid, para todas terem a mesma altura
function equalHeight(grid){
	var tallest = 0;
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
// caracteristicas do carrossel
function carousel(){
	var clickEvent = false;
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
// zoom da imagem na página singular do produto
function zoomImg(){
	$("#img-produto").elevateZoom({
		zoomType: "lens",
		lensShape : "round",
		lensSize : 200
	});
}
// muda os números nos ícones da navbar
function iconsNav(){
	var carrinho=0, favorito=0;
	getData(function(data){
		$(data).each(function(){
			if(this.carrinho==true){
				carrinho++;
			}
			if(this.favorito==true){
				favorito++;
			}
		});
		$("#numberCart").html(carrinho);
		$("#numberWish").html(favorito);
	});
}
// mostra mensagem se não houverem produtos na categoria selecionada
function msg(msg){
	if($('.grid:visible').length==0){
		$('#msg').html(msg).show(300);
	}
}


/*************** SEARCH ***************/

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
		getData(function(data){//procura os dados
			var cor = 1;
			for(i in data){
				var titulo = data[i].titulo;
				if (titulo.search(regex) != -1 || data[i].autor.search(regex) != -1 || data[i].editora.search(regex) != -1 || data[i].categoria.search(regex) != -1 || data[i].isbn.search(regex) != -1){//se houver dados correspondentes à busca
					//mostra a div de resultados e printa 
					results+='<tr id="livros" class="box-book" data-id="'+data[i].isbn+'" onmouseover="painelResult(this)">'
					+'<td class="cod">'+data[i].isbn+'</td>'
					+'<td class="colored">'+data[i].titulo+'</td>'
					+'<td class="autor">'+data[i].autor+'</td>'
					+'<td class="colored">'+parseFloat(data[i].valor).toFixed(2).toString().replace('.',',')+'</td>'
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
	getData(function(data){//procura os dados
		$(data).each(function (){//percorre um por um
			if($(elem).data('id') == this.isbn){
				var livro = '<img src="../../images/livros/'+this.capa+'.jpg" height="400px">';
				$("#box-result").html(livro);
			}
		});
	});
}


/*************** FILTER ***************/

// cria o filtro
function createFilter(){
	var categorias = [];
	var editoras = [];
	var autores = [];
	getData(function(data){
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
}
// icone do filtro
function filterController(){
	var countEffect=0;
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
// efeito do icone
function filterEffect(){
	$('.filter-icon > span').each(function(){
		$(this).rotate(180,{
			duration: 250
		});
	});
}


/*************** CARRINHO ***************/

// calcula o valor total quando a página é carregada
function checkCart(){
	getData(function(data){
		for(i in data){
			$('.rowTab').each(function(){
				if($(this).data('id')== data[i].isbn){
					$(this).find(".valor").data('valor', data[i].valor);
					totalValue($(".valor"));
				}
			});
		}
	});
}
// remove produto do carrinho 
function removeFromCart(elem){
	$(elem).parents('.isbn').addClass('removeCart');
	$('.removeCart').hide(function(){ 
		$('.removeCart').remove(); 
		totalValue($(".valor"));
	});
}
// muda o valor do produto conforme a quantidade
function valueQnt(elem){
	var qnt = changeQnt(elem);
	var isbn = $(elem).parents('.isbn').data("id");
	getData(function(data){
		$(data).each(function(){
			if(this.isbn==isbn){
				var valor=this.valor;
				var valorProduto = valueProduct(qnt, valor);
				$(elem).parent().siblings('.valor').html("<h4>R$ "+valorProduto+"</h4>");
				$(elem).parent().siblings('.valor').data("valor", Number(valorProduto.replace(',','.')));
			}
		});
		totalValue($(".valor"));
	});
}
// muda a quantidade do produto no carrinho
function changeQnt(elem){
	var qnt = $(elem).siblings(".quantidade").val();
	var isbn = $(elem).parents('.isbn').data('id');

	if($(elem).hasClass("minus") && qnt>1){
		qnt--;
	}else if($(elem).hasClass("plus")){
		qnt++;
	}
	$(elem).siblings(".quantidade").val(qnt);
	return $(elem).siblings(".quantidade").val();
}
// calcula o valor total de cada produto
function valueProduct(quantidade, valorAtual){
	var valorQuant = valorAtual*quantidade;
	return parseFloat(valorQuant).toFixed(2).toString().replace('.',',');
}
// valor total do carrinho
function totalValue(group) {
	var valor = 0;	
	group.each(function() {
		valor+= Number($(this).data('valor'));
	});
	$('.valorTotal').html('R$ '+valor.toFixed(2).toString().replace('.',','));
}
// confirma a compra
function confirmPurchase(){
	$("#modalConfirm").modal('hide');
	var compras = [];
	$('.quantidade').each(function(){
		compras.push({
			cod: $(this).parents('.isbn').data('id'),
			quant: $(this).html()
		});
	});
	changeDataBuy(compras);
}
// muda estoque e status dos itens comprados
function changeDataBuy(compras){
	$.ajax({
		type: 'GET',
		url: "/dados/compra",
		data: {compras},
		success:function(){
			emptyCart();

		}
	});
}
// esvazia o carrinho
function emptyCart(){
	$("#tableCart").hide('slow', function(){ 
		$('#tableCart, #tableBtn').remove(); 
	});	
	$("#msgCart > h3").html("Compra concluída com sucesso!");
	$("#msgCart").show('slow');
	$(".rowTab").each(function(){
		var cod = $(this).data('id');
		listFav("cart", cod);
	});
}


/*************** ACTIONS ***************/

// adiciona ou remove do carrinho e/ou desejo
function listFav(type, cod){
	$.ajax({
		type: 'GET',
		url: "/dados/"+type+"/"+cod,
		success:function(){
			iconsNav();	
		}
	});
}
// vai para a página do produto clicado
function productPage(parameters){
	window.location=(product+parameters);
}
// actions style
function actionStyle(){
	window.onscroll = function() {
		onScroll();
	}
	$('#open-search').click(function(){
		openSearch();
	});
	$('#close-search').click(function(){
		closeSearch();
	});
	$('.wish').click(function(){	
		$(this).toggleClass("glyphicon-heart-empty glyphicon-heart");
	});
	$('.cart').click(function(){	
		$(this).toggleClass("cart-empty cart-full");
	});
}
// ações dos botoes/inputs
function actions(){
	actionStyle();
	$('.box-book').on('click', function(){
		productPage($(this).parents('.isbn').data('id'));
	});
	$('.wish').click(function(){	
		var cod = $(this).parents('.isbn').data('id');
		listFav("wish", cod);
	});
	$("#desejos").find(".glyphicon-heart").click(function(){
		$(this).parents('.grid').slideUp();
	});
	$(".glyphicon-remove").click(function(){
		removeFromCart(this);
	});
	$('.cart').click(function(){
		var cod = $(this).parents('.isbn').data('id');
		listFav("cart", cod);
	});
	$(".selectpicker").change(function(){
		msg('');
		filter($(this));
		$(".selectpicker").not(this).val('all');;
	});
	$(".catalogo-x").click(function(){
		var param = $(this).data('filter');
		window.location=('/catalogo?filter='+param);
	});
	$("#comprar").click(function(){
		confirmPurchase();
	});
	$(".plus, .minus").click(function(){
		valueQnt($(this));
	});
	$("#openCart").click(function(){
		$(".cart-box").slideToggle(500);
	});
}


$(document).ready(function(){
	var mouse_is_inside=false; 
	styles(); 
	actions();
	checkCart();
	searchJson();
	createFilter();
	filter($('.selectpicker'));
	$('.cart-box').hover(function(){ 
        mouse_is_inside=true; 
    }, function(){ 
        mouse_is_inside=false; 
    });
    $("body").mouseup(function(){ 
        if(! mouse_is_inside) $('.cart-box').hide();
    });
});
