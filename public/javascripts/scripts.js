$(function() {

	//Load Images after the page load has completed
	//Elegant Way

	$("img.lazy").lazyload({
		effect : "fadeIn"
	});

	// $('#pagination').bootpag({
	// 	total: 22,
	// 	maxVisible: 5,
	// 	firstLastUse: true,
	// 	href: '{{number}}'
	// });
	// 	.on("page",function(event,num) {
	// 	
	// 	// $(this).bootpag({activeClass: 'active'});
        //
	// 	console.log(event);
	// });

	// $(".img-thumbnail").each(function(){
	//
	// 	console.log(this);
	// 	var this_img = this;
	// 	var src = $(this_img).attr("src")||'';
	// 	if(!src.length>0){
	// 		var lsrc = $(this_img).attr('lsrc')||'';
	// 		if (lsrc.length>0){
	// 			var img = new Image();
	// 			img.src = lsrc;
	// 			$(img).load(function() {
	// 				this_img.src = this.src;
	// 			})
	//
	// 		}
	// 	}
	// });
	//
	// $(".img-thumbnail").hover(function() {
	// 	$(this).fadeTo("slow",0.5,function() {
	// 		$(this).closest("div").siblings("div.media-body").children("p.important").show();
	// 	});
	// },function() {
	// 	$(this).fadeTo("fast",1.0,function() {
	//
	// 		$(this).closest("div").siblings("div.media-body").children("p.important").hide();
	// 	});
	// });
	// (function() {
	// 	var dataset = [
	// 		{ label: 'Positive', count:60 },
	// 		{ label: 'Negative', count:40 },
	// 	];
	// 	var width = parseInt($("div.pie").first().innerWidth());
	// 	var height= parseInt($("div.pie").first().innerHeight())*100; 
	// 	var radius = Math.min(width,height)/2;
	// 	// var color = d3.scaleOrdinal(d3.schemeCategory20b);
	// 	// Alternative
	// 	var color = d3.scale.ordinal()
	// 	  .range(['#0CA647','#ED0909']);
	// 	var svg = d3.selectAll(".pie")
	// 		.append('svg')
	// 		.attr('width',width)
	// 		.attr('height',height)
	// 		.append('g')
	// 		.attr('transform','translate('+(width/2)+','+(height/2)+')');
	// 	//Define Radius of the PIE Chart
	// 	var arc = d3.svg.arc()
	// 		.innerRadius(0)
	// 		.outerRadius(radius);
	// 	var pie = d3.layout.pie()
	// 		.value(function(d) {
	// 			return d.count;
	// 		}).sort(null);
	// 	var path = svg.selectAll('path')
	// 		.data(pie(dataset))
	// 		.enter()
	// 		.append('path')
	// 		.attr('d',arc)
	// 		.attr('fill',function(d,i){
	//
	// 			return color(d.data.label);
	// 		});
	//
	//
	// })();

});
