var product = '/catalogo/produto/';
var selecionados = [];

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
	equalHeight($(".relacionados")); 
	onScroll();
	carousel();
	filterController();
	iconsNav();
}
// Muda caracteristicas conforme a scrollbar
function onScroll(){
	var scrollY = 0;
	var pageScroll = window.pageYOffset;
	if(scrollY < pageScroll) {
		$('.navig').addClass('navig-top');
		$('.filter-side').addClass('filter-top');
		$('.navbar-content').css({top: '15%'});
		$('.pg-title, #pg-title').fadeOut(200);
		$('#img-logo').removeClass('logo-top');
		$('#logoNav').css({'top':'0'});
		$(".filter-icon").css({'top':'85px'});
	}
	else if(pageScroll == scrollY){
		$('.navig').removeClass('navig-top');
		$('.filter-side').removeClass('filter-top');
		$('.navbar-content').css({top: '25%'});
		$('.pg-title, #pg-title').fadeIn(500);
		$('#img-logo').addClass('logo-top');
		$('#logoNav').css({'top':'-15px'});
		$(".filter-icon").css({'top':'100px'});

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
		if(carrinho==0){
			emptyCart("O carrinho está vazio", false);
		}
		if(favorito==0){
			setTimeout(function(){
				$("#desejos").find("#msg").html('Nenhum item na lista de desejos');
			},500);
		}
	});
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
	var descontos = [];
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
			if ($.inArray(this.desconto, descontos)==-1 && this.desconto!=0) {
					descontos.push(this.desconto);
			}
		});
		for(i in categorias){
			categorias.sort();
			$(".listCateg").append('<h4 data-name='+categorias[i]+' onclick=select(this)><i class="fa fa-square-o"></i> '+categorias[i]+'</h4>');
		}
		for(i in autores){
			autores.sort();
			var valor = autores[i];
			valor = valor.split(" ").join("+");
			$(".listAutor").append('<h4 data-name='+valor+' onclick=select(this)><i class="fa fa-square-o"></i> '+autores[i]+'</h4>');
		}
		for(i in editoras){
			editoras.sort();
			var valor = editoras[i];
			valor = valor.split(" ").join("+");
			$(".listEditora").append('<h4 data-name='+valor+' onclick=select(this)><i class="fa fa-square-o"></i> '+editoras[i]+'</h4>');
		}
		for(i in descontos){
			descontos.sort();
			var valor = descontos[i];
			$(".listDescontos").append('<h4 data-name='+valor+' onclick=select(this)><i class="fa fa-square-o"></i> '+descontos[i]+'%</h4>');
		}
	});
}

function select(elem){
	$("#desejos").find("#msg").html('');
	$(elem).toggleClass('ativo', '');
	$(elem).find('.fa').toggleClass('fa-check-square-o fa-square-o ');
	selected(elem);
	$('.grid').hide();
	for(i in selecionados){
		$('.grid').each(function(){
			if($(this).data('desconto')==selecionados[i] || $(this).data('categ')==selecionados[i] || $(this).data('autor')==selecionados[i] || $(this).data('editora')==selecionados[i]){
				$(this).show();
			}
		});
	}
	if(selecionados.length==0){
		$(".grid").show();
	}
	if($(".grid:visible").length==0){
		$("#desejos").find("#msg").html('Nenhum item encontrado');
	}
	
	// // filter(elem);
}
function selected(elem){
	if(isNaN($(elem).data('name'))){
		var data = $(elem).data('name').split("+").join(" ");
	}else{
		var data = $(elem).data('name');
	}
	var check = false;
	for(i in selecionados){
		if(data==selecionados[i]){
			selecionados.splice(i, 1);
			check = true;
		}
	}
	if(check==false){
		selecionados.push(data);
	}
}

// filtro da página
function filter(elem){
	var selected = $(elem).data('name').split("+").join(" ");
	$('.grid').hide();
	
}
// icone do filtro
function filterController(){
	var countEffect=0;
	$('.filter-icon').click(function(){
		countEffect++;
		filterEffect();
		$('.filter-side').css({display:'block'});
		$("#catalogo-container, #desejos").css({'margin-right':'0'});
		$(this).tooltip('hide').attr('data-original-title', 'Fechar Filtro').tooltip('fixTitle');
		if(	countEffect==2){
			countEffect=0;
			$('.filter-side').css({display:'none'});
			$("#catalogo-container, #desejos").css({'margin-right':'10%'});
			$(this).tooltip('hide').attr('data-original-title', 'Filtrar produtos').tooltip('fixTitle');
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
					if(data[i].desconto==0){
						$(this).find(".valor").data('valor', data[i].valor);
					}else{
						$(this).find(".valor").data('valor', data[i].valor-(data[i].valor*data[i].desconto/100));
					}
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
				if(this.desconto==0){
					var valor=this.valor;
				}else{
					var valor=this.valor-(this.valor*this.desconto/100);
				}
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


function checkEstoque(compras){
	var check = [];
	getData(function(data){
		$(compras).each(function(){
			var cod = this.cod;
			var qnt = this.quant;
			$(data).each(function(){
				if(this.isbn==cod){
					if(this.estoque<qnt){
						if(this.estoque>0){
							$("#alert > p").html('A quantidade selecionada no livro "'+this.titulo+'" é maior que o estoque. Por favor, selecione um valor menor que '+this.estoque+'.');
							$("#alert").show('slow');
						}
						else{
							$("#alert > p").html('O livro "'+this.titulo+'" está em falta.');
							$("#alert").show('slow');
						}
						check.push(false);
					}
					else{
						check.push(true);
					}
				}
			});
		});
		if ($.inArray(false, check)==-1){
			$("#alert").hide('fast');
			changeDataBuy(compras);
		}
	});
}
// confirma a compra
function confirmPurchase(){
	$("#modalConfirm").modal('hide');
	var compras = [];
	$('.quantidade').each(function(){
		compras.push({
			cod: $(this).parents('.isbn').data('id'),
			quant: $(this).val()
		});
	});
	checkEstoque(compras);
}
// muda estoque e status dos itens comprados
function changeDataBuy(compras){
	$.ajax({
		type: 'GET',
		url: "/dados/compra",
		data: {compras},
		success:function(){
			emptyCart("Compra concluída com sucesso!");
		}
	});
}
// esvazia o carrinho
function emptyCart(msg, condit){
	if(condit!=false){
		$(".rowTab").each(function(){
			var cod = $(this).data('id');
			listFav("cart", cod);
		});
	}
	$("#tableCart").hide('slow', function(){ 
		$('#tableCart, #tableBtn').remove(); 
	});	
	$("#msgCart > h3").html(msg);
	$("#msgCart").show('slow');
}
// carrinho da navbar
function cartBox(){
	var content = '';
	var valorTotal = 0;
	var count = 0;
	getData(function(data){
		$(data).each(function(){
			if(this.carrinho){
				count++;
				if(this.desconto==0){
					var valor = this.valor;
				}else{
					var valor = this.valor-(this.valor*this.desconto/100);
				}
				valorTotal+=valor;
				content+="<tr><td>"+this.titulo+"</td><td>R$ "+valor.toFixed(2).toString().replace(".", ",")+"</td></tr>"
			}
		});	
		$(".cart-content").html("<table><tbody>"+content+"<tr class='totalBox'><td>Total:</td><td>R$ "+valorTotal.toFixed(2).toString().replace('.',',')+"</td></tr></tbody></table><hr><a href='/carrinho'>Ir para o carrinho</a>");
		if(count==0){
			$(".cart-content").html("<h5 class='listNotif'>Nenhum item no carrinho de compras.</h5>");
		}
	});
}

// notificações navbar
function notifBox(){
	var content = '';
	var list = 0;
	getData(function(data){
		$(data).each(function(){
			if(this.favorito==true && this.desconto!=0){
				list++;
				var valor = this.valor-(this.valor*this.desconto/100);
				content+="<a href='../catalogo/produto/"+this.isbn+"'><div class='listNotif col-md-12'><h5 class='col-md-12'>O livro que você gostou está com desconto. Aproveite!</h5><img class='col-md-3' src='../../images/livros/"+this.capa+".jpg'><h6 class='col-md-3'>"+this.titulo+"</h6><h6 class='col-md-4'>R$ "+valor.toFixed(2).toString().replace(".", ",")+"</h6><h6 class='col-md-2'>"+this.desconto+"%</h6></div></a>";
			}
		});	
		$(".notif-content").html(content+"<hr><a href='/catalogo/desejo'>Ver lista de desejos completa</a>");
		$("#numberBell").html(list)
		if(list==0){
			$(".notif-content").html("<h5 class='listNotif'>Nenhuma notificação.</h5>");
		}
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
			cartBox();
			notifBox();
		}
	});
}
// vai para a página do produto clicado
function productPage(parameters){
	window.location=(product+parameters);
}

function scrollTarget(){
	$(document).on("scroll", onScroll);

	$('a[href^="#"]').on('click', function (e) {
		e.preventDefault();
		$(document).off("scroll");
		var target = this.hash,
		$target = $(target);
		$('.index-bg').stop().animate({
			'scrollTop': $target.offset().top-90
		}, 800, 'swing', function () {
			window.location.hash = target;
			console.log($target.offset().top);
		});
	});
}
// actions style
function actionStyle(){
	window.onscroll = function() {
		onScroll();
	}
	scrollTarget();
	$(".img-produto").elevateZoom({
	  zoomType				: "inner",
	  cursor: "crosshair"
	});
	$('#open-search').click(function(){
		openSearch();
	});
	$('#close-search').click(function(){
		closeSearch();
	});
	$("#cartBox").click(function(){
		$(".cart-box").fadeToggle();
		$(".notif-box").hide();
		cartBox();
	});
	$("#notifBox").click(function(){
		$(".notif-box").fadeToggle();
		$(".cart-box").hide();
		notifBox();
	});
  	$('.filter-icon').tooltip()
  	$(".quantidade").select(function(event){
  		event.preventDefault();
  	});
}
// ações dos botoes/inputs
function actions(){
	actionStyle();
	$('.box-book').on('click', function(){
		productPage($(this).parents('.isbn').data('id'));
	});
	$('.wish').click(function(){	
		$(this).children('span').toggleClass('hide');
		var cod = $(this).parents('.isbn').data('id');
		listFav("wish", cod);
	});
	$("#desejos .wish").click(function(){
		$(this).parents('.grid').slideUp(function(){
			$(this).remove(); 
		});
	});
	$(".glyphicon-remove").click(function(){
		removeFromCart(this);
	});
	$('.cart').click(function(){
		$(this).children('span').toggleClass('hide');
		var cod = $(this).parents('.isbn').data('id');
		listFav("cart", cod);
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
	// $(".confirm-wish").click(function(){
	// 	$(this).children('span').toggleClass('hide');
	// 	$(this).children('i').removeClass('glyphicon-heart-empty').addClass('glyphicon-heart');
	// });
	// $(".confirm-cart").click(function(){
	// 	$(this).children('span').toggleClass('hide');
	// });
}

$(document).ready(function(){
	createFilter();
	styles(); 
	actions();
	checkCart();
	searchJson();
	notifBox();
});
