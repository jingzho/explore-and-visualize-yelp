import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { ViewEncapsulation } from '@angular/core';
import { timeout } from 'd3';

@Component({
  selector: 'app-overview-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})

export class OverviewPageComponent implements OnInit {
  public modal_madison(){
    this.p_madison();
    this.drawCoxcomb("city/fre_int/Madison_frq_int.csv","#madison-coxcomb","#portfolioModal2");
  }
  public modal_phoenix(){
    this.draw_map_phoenix();
    this.p_phoenix();
    this.drawCoxcomb("city/fre_int/Phoenix_frq_int.csv","#phoenix-coxcomb","#portfolioModal3");
  }
  public modal_cleveland(){
    this.draw_map_cleveland();
    this.p_cleveland();
    this.drawCoxcomb("city/fre_int/Cleveland_frq_int.csv","#cleveland-coxcomb","#portfolioModal4");
  }
  public modal_charlotte(){
    this.p1_charlotte();
    this.p2_charlotte();
    this.p3_charlotte();
    this.drawCoxcomb("city/fre_int/Charlotte_frq_int.csv","#charlotte-coxcomb","#portfolioModal5");
  }
  public modal_montreal(){
    this.draw_map_montreal();
    this.p1_montreal();
    this.p2_montreal();
    this.p3_montreal();
    this.p4_montreal();
    this.drawCoxcomb("city/fre_int/Montreal_frq_int.csv","#montreal-coxcomb","#portfolioModal6");
  }
  public modal_toronto(){
    this.draw_map_toronto();
    this.p1_toronto();
    this.p2_toronto();
    this.p3_toronto();
    this.drawCoxcomb("city/fre_int/Toronto_frq_int.csv","#toronto-coxcomb","#portfolioModal7");
    }
  public modal_lasvegas(){
    this.drawmap_lasvegas();
    this.drawCoxcomb("city/fre_int/LasVegas_frq_int.csv","#lasvegas-coxcomb","#portfolioModal1");
    this.p1_lasvegas();
    this.p2_lasvegas();
    this.p3_lasvegas();
  }

  public reset_map = function(){
    d3.selectAll(".draggable")
      .attr("transform", "translate(0,0) scale(1)")
  }

  public draw_map = function(map_element:string, geojson_file:string, default_zoom_in:string, rest_csv:string, detail_id:string){
    var svg = d3.select(map_element);
    svg.selectAll("g").remove()

    var width = 1000, height = 1000;

    d3.json(geojson_file).then(function (json) { 

    var projection = d3.geoAlbersUsa()   
    .fitSize([width, height], <any>json)
    ;  //fit svg size! 

    var path = d3.geoPath()   
      .projection(projection);

    svg.selectAll(".reset_map")
      .on("click", function(){
        svg.select(".draggable")
          .attr("transform", "translate(0,0) scale(1)")
      })
      
      
    svg = svg.append("g")
      .attr("transform", default_zoom_in) // set default zoom in

    svg.append("g")
      .selectAll("path")   
      .data(json['features'])  //data join with features   
      .enter()   
      .append("path")   
      .attr("fill", "white")   
      .attr("stroke", "#2b2b28")
      // .attr("class", "country-borders")
      .attr("stroke-width", function(d){
        if (map_element == "#map-lasvegas") { return 0.1; } else if (map_element == "#map-charlotte"){ return 0.01 } else {return 0.4;}
      })   
      .attr("d", path);  //generate geographic path 


    var zoom = d3.zoom().scaleExtent([1, 100])
    .on("zoom", function () {
      var g = svg.select('g')
      g.attr("transform", d3.event.transform)
      var trans_str = g.attr("transform");
      var trans_scale_str = trans_str.split('scale')[1];
      var trans_scale_float = parseFloat(trans_scale_str.slice(1,-1))
      if (trans_scale_float < 5) { 
        svg.selectAll(".restaurant")
          .attr("r", )}
      else if (trans_scale_float < 30 && trans_scale_float >= 5) { 
        svg.selectAll(".restaurant")
          .classed("dot_sm", false)
          .classed("dot_md", true)
          .classed("dot_lg", false);}
      else {svg.selectAll(".restaurant")
        .classed("dot_sm", false)
        .classed("dot_md", false)
        .classed("dot_lg", true);}
    })
      
    svg.select("g")
      .attr("class", "draggable")
      .call(zoom)
      .append("g")

      $(".reset_zoom_button").click(() => {
        zoom.transform(d3.select(".draggable"), d3.zoomIdentity.scale(1) );
    })

    var converter_function = function(d){
      return {
        name: d.name,
        address: d.address,
        latitude: +d.latitude,
        longitude: +d.longitude,
        stars: +d.stars,
        review_count: +d.review_count,
        food_type: d.food_type,
        rest_type: d.restaurant_type,
        coun_type: d.country_type,
        mon: d.mon,
        tue: d.tue,
        wed: d.wed,
        thu: d.thu,
        fri: d.fri,
        sat: d.sat,
        sun: d.sun
      }
    }

    d3.csv(rest_csv, converter_function).then(function(data){

      svg.select("g")
        .append("g")
        .selectAll(".restaurant")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d){ return projection([d.longitude, d.latitude])[0] })
        .attr("cy", function(d){ return projection([d.longitude, d.latitude])[1] })
        .attr("class", "restaurant circle dot_sm")

      svg.selectAll(".restaurant")
        .on("mouseover", function(d){

          var rest_detail = 'Name: ' + d['name'] + ' <br/>' +
          'Address: ' + (d['address']) + ' <br/>' +
          'Stars: ' + d['stars'] + '<br/>'

          document.getElementById(detail_id).innerHTML=rest_detail;
          d3.select(this).classed("pop_out",true)
        })

      svg.selectAll(".restaurant")
      .on("mouseout", function(d){

        var rest_detail = 'Hover on restaurant on the map to view detail information.'

        document.getElementById(detail_id).innerHTML=rest_detail;
        d3.select(this).classed("pop_out",false)
      })
    })

    });
  }

  public draw_barchart = function(element_id, ydomain_min,ydomain_max, csv_file, 
    converter_function, anchor_interval, attributes, city, title){
    const margin = {top:100,bottom:100,left:70,right:50}
    var svg = d3.select(element_id)

    var width = 1000 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var xscale = d3.scaleBand()
      .domain([])
      .range([0, width])
      .paddingInner(0.2);

    var yscale = d3.scaleLinear()
    .domain([ydomain_min, ydomain_max])
    .range([height,0]);
  
    var xaxis = d3.axisBottom(xscale),
    yaxis = d3.axisLeft(yscale);

    d3.csv(csv_file, converter_function).then(function(data){
      //remove groups drew before
      svg.selectAll("g").remove();

      xscale.domain(data.map(function (d) { return d.city; }));
      //margin convention
      svg = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      //y anchor lines
      var anchors = [];
      for (let i=0; i < (ydomain_max - ydomain_min)/anchor_interval; i++){
        anchors[i] = i*anchor_interval + ydomain_min;
      }
      svg.append("g")
        .selectAll(".anchor_line")
        .data(anchors)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", function(d) { return  yscale(d); })
        .attr("x2", width)
        .attr("y2", function(d) { return  yscale(d); })
        .attr("class", "anchor_line")
      //bars
      svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d){
            return xscale(d['city']);
        })
        .attr("width", <any>xscale.bandwidth)
        .attr("y", function(d) { return  yscale(<any>d[attributes]); })
        .attr("height", function(d) { return height - yscale(<any>d[attributes]); })
        .attr("fill", "darkgrey")
        .attr("class", "bar")
        .classed("pop_out_city",function(d){
          if (d.city == city || d.city.slice(0,-1) == city) {return true;}
          else {return false;}
        });
      if(city=="Phoenix"){
        xaxis.tickFormat(function(d, i) {
          return d.slice(0,d.length-1);
        });
      }
      //x axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xaxis);
      //y axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yaxis);
      //labels and titles
      svg.append("text")
        .attr("x",width / 2)
        .attr("y",-30)
        .text(title)
        .attr("class", "chart_title")
      //description
      // avg_review.append("text")
      //   .attr("x", 0)
      //   .attr("y", height + margin.bottom / 2)
      //   .text("Las Vegas has the highest average review counts.")
      //   .attr("class", "city_des")
    })
  }
  
  public draw_stacked_barchart = function(element_id, ydomain_min,ydomain_max, csv_file, 
    converter_function, anchor_interval, attribute_list, city, title){
    const margin = {top:100,bottom:100,left:70,right:50}
    var svg = d3.select(element_id)

    var width = 1000 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var xscale = d3.scaleBand()
      .domain([])
      .range([0, width])
      .paddingInner(0.2);

    var yscale = d3.scaleLinear()
    .domain([ydomain_min, ydomain_max])
    .range([height,0]);
  
    var xaxis = d3.axisBottom(xscale),
    yaxis = d3.axisLeft(yscale);

    d3.csv(csv_file, converter_function).then(function(data){
      //remove groups drew before
      svg.selectAll("g").remove();

      xscale.domain(data.map(function (d) { return d.city; }));
      //margin convention
      svg = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      //y anchor lines
      var anchors = [];
      for (let i=0; i < (ydomain_max - ydomain_min)/anchor_interval; i++){
        anchors[i] = i*anchor_interval + ydomain_min;
      }
      svg.append("g")
        .selectAll(".anchor_line")
        .data(anchors)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", function(d) { return  yscale(d); })
        .attr("x2", width)
        .attr("y2", function(d) { return  yscale(d); })
        .attr("class", "anchor_line")
      //bars & legends
      var l = attribute_list.length;
      var agg_height = [0, 0, 0, 0, 0, 0, 0];
      var colors = ['#40536A','#2E6674','#288980','#4FAA7B','#90C86C','#E1DE61'];
      var legend_y = 0;
      for (let cc = 0; cc < l; cc++){
        var attribute = attribute_list[cc];
        svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d){return xscale(d['city']);})
        .attr("width", xscale.bandwidth)
        .attr("y", function(d,i) {
          var temp = yscale(<any>d[attribute])
          return temp-agg_height[i]; 
        })
        .attr("height", function(d,i) {
          var temp = height - yscale(<any>d[attribute]); 
          agg_height[i] += temp;
          return temp; 
        })
        .attr("fill", function(d){ return colors[cc]})
        .attr("class", "bar");

        // legends
        var xpos = 700;
        if (element_id =="#p3-montreal" || element_id =="#p3-toronto") {xpos = 50}

        var legend = svg.append("g")
        legend.append("rect")
          .attr("x", xpos)
          .attr("y", legend_y)
          .attr("width", 30)
          .attr("height", 15)
          .attr("fill", function(d){ return colors[cc]})
          .attr("class", "legend_rect");
        legend.append("text")
          .attr("x", xpos + 40)
          .attr("y", legend_y + 12)
          .attr("class", "legend_text")
          .text(attribute);
        
        legend_y += 20;
      }
      //x axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xaxis);
      //y axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yaxis);
      //labels and titles
      svg.append("text")
        .attr("x",width / 2)
        .attr("y",-30)
        .text(title)
        .attr("class", "chart_title")
    })
  }

  public drawmap_lasvegas = function(){
    var map_element:string = "#map-lasvegas", 
      geojson_file:string = "geojson/las_vegas_lg.geojson", 
      default_zoom_in:string = "translate(-3859.781489274662,-3404.849174117047) scale(6.727171322029714)", 
      rest_csv:string = "city/raw/las_vegas.csv",
      detail_id:string = "vegas_restaurant_detail";
      this.draw_map(map_element,geojson_file,default_zoom_in,rest_csv, detail_id);
  }

  public p1_lasvegas = function(){
    var element_id = "#rate-lasvegas";
    var ydomain_min = 0, ydomain_max = 150, anchor_interval = 20;
    var csv_file = "city/pattern/rate_des_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        rating: +d.Average_rating,
        star5: +d.star5_rate,
        avg_rate: +d.Average_review_count
      }}
    var attributes = 'avg_rate', city = 'Las Vegas', title = "Average review counts per restautant";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p2_lasvegas = function(){
    var element_id = "#hour24-lasvegas";
    var ydomain_min = 0, ydomain_max = 15, anchor_interval = 2;
    var csv_file = "city/pattern/24hour_rate_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        average: +d.Average
      }}
    var attributes = 'average', city = 'Las Vegas', title = "24 hours open restaurant rate";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p3_lasvegas = function(){
    var element_id = "#open-lasvegas";
    var ydomain_min = 8, ydomain_max = 14, anchor_interval = 0.5;
    var csv_file = "city/pattern/open_duration_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        average: +d.Average
      }}
    var attributes = 'average', city = 'Las Vegas', title = "Average restaurant open time";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p_madison = function(){
    var element_id = "#bar-madison";
    var ydomain_min = 0, ydomain_max = 25, anchor_interval = 2;
    var csv_file = "city/pattern/bar_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        bars: d.Bars,
        wine_bars: d.Wine_Bars,
        cocktail_bars: d.Cocktail_Bars,
        beer_bars: d.Beer_Bars,
        other_bars: d.Other_Bars,
        sum: +d.Sum
      }}
    var attributes = ['bars','wine_bars','cocktail_bars','beer_bars','other_bars'], city = 'Madison', title = "Bars percentage in all restaurants";

    this.draw_stacked_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public draw_map_phoenix = function(){
    var map_element:string = "#map-phoenix", 
      geojson_file:string = "geojson/phoenix.geojson", 
      default_zoom_in:string = "", 
      rest_csv:string = "city/raw/Phoenix.csv",
      detail_id:string = "phoenix_restaurant_detail";
      this.draw_map(map_element,geojson_file,default_zoom_in,rest_csv,detail_id);
  }

  public p_phoenix = function(){
    var element_id = "#star5-phoenix";
    var ydomain_min = 0, ydomain_max = 1800, anchor_interval = 200;
    var csv_file = "city/pattern/5star_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        city_tag: d.City_tag,
        review_count: +d.review_count
      }}
    var attributes = 'review_count', city = 'Phoenix', title = "Top commented 5-stars restaurants (y:review counts)";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public draw_map_cleveland = function(){
    var map_element:string = "#map-cleveland", 
      geojson_file:string = "geojson/cleveland.geojson", 
      default_zoom_in:string = "", 
      rest_csv:string = "city/raw/Cleveland.csv",
      detail_id:string = "cleveland_restaurant_detail";
      this.draw_map(map_element,geojson_file,default_zoom_in,rest_csv,detail_id);
  }

  public p_cleveland = function(){
    var element_id = "#fastfood-cleveland";
    var ydomain_min = 0, ydomain_max = 35, anchor_interval = 5;
    var csv_file = "city/pattern/fast_food_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        sandwich_rate: d.sandwich_rate,
        pizza_rate: d.pizza_rate,
        burger_rate: d.burger_rate,
        fast_food_rate: d.fast_food_rate,
        total_rate: d.total_rate
      }}
    var attributes = ['sandwich_rate','pizza_rate','burger_rate','fast_food_rate'], city = 'Cleveland', title = "Restaurants percentage in all categories";

    this.draw_stacked_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p1_charlotte = function(){
    var element_id = "#ct-charlotte";
    var ydomain_min = 0, ydomain_max = 15, anchor_interval = 1;
    var csv_file = "city/pattern/cofe_tea_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        coffee_tea: d.Coffee_Tea,
        cafe: d.Cafes
      }}
    var attributes = ['coffee_tea','cafe'], city = 'Charlotte', title = "Beverage shops percentage in all categories";

    this.draw_stacked_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p2_charlotte = function(){
    var element_id = "#late-charlotte";
    var ydomain_min = 17.5, ydomain_max = 19.5, anchor_interval = 0.1;
    var csv_file = "city/pattern/late_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        average: d.Average,
      }}
    var attributes = 'average', city = 'Charlotte', title = "Average closing time (hour in 24h clock)";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p3_charlotte = function(){
    var element_id = "#min-charlotte";
    var ydomain_min = 0, ydomain_max = 10, anchor_interval = 1;
    var csv_file = "city/pattern/minority_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        dom: d.Dominican,
      }}
    var attributes = 'dom', city = 'Charlotte', title = "Number of Dominican restaurants";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public draw_map_montreal = function(){
    var map_element:string = "#map-montreal", 
      geojson_file:string = "geojson/montreal.geojson", 
      default_zoom_in:string = "", 
      rest_csv:string = "city/raw/Montreal.csv",
      detail_id:string = "montreal_restaurant_detail";
      this.draw_map(map_element,geojson_file,default_zoom_in,rest_csv,detail_id);
  }

  public p1_montreal = function(){
    var element_id = "#p1-montreal";
    var ydomain_min = 0, ydomain_max = 35, anchor_interval = 5;
    var csv_file = "city/pattern/fast_food_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        sandwich_rate: d.sandwich_rate,
        pizza_rate: d.pizza_rate,
        burger_rate: d.burger_rate,
        fast_food_rate: d.fast_food_rate,
        total_rate: d.total_rate
      }}
    var attributes = ['sandwich_rate','pizza_rate','burger_rate','fast_food_rate'], city = 'Montreal', title = "Restaurants percentage in all categories";

    this.draw_stacked_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p2_montreal = function(){
    var element_id = "#p2-montreal";
    var ydomain_min = 0, ydomain_max = 6, anchor_interval = 0.5;
    var csv_file = "city/pattern/european_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        italian: d.Italian,
        mediteranean:d.Mediterranean,
        middle_eastern:d.Middle_Eastern,
        greek:d.Greek,
        french:d.French,
        german:d.German,
        british:d.British
      }}
    var attributes = 'french', city = 'Montreal', title = "French restaurants percentage in all categories";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p3_montreal = function(){
    var element_id = "#p3-montreal";
    var ydomain_min = 0, ydomain_max = 20, anchor_interval = 2;
    var csv_file = "city/pattern/european_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        italian: d.Italian,
        mediteranean:d.Mediterranean,
        middle_eastern:d.Middle_Eastern,
        greek:d.Greek,
        french:d.French,
        german:d.German,
        british:d.British
      }}
    var attributes = ['italian','mediteranean','middle_eastern','greek',"french","german","british"], city = 'Montreal', title = "European restaurants percentage in all categories";

    this.draw_stacked_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p4_montreal = function(){
    var element_id = "#p4-montreal";
    var ydomain_min = 8, ydomain_max = 14, anchor_interval = 0.5;
    var csv_file = "city/pattern/open_duration_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        average: +d.Average
      }}
    var attributes = 'average', city = 'Montreal', title = "Average restaurant open time";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public draw_map_toronto = function(){
    var map_element:string = "#map-toronto", 
      geojson_file:string = "geojson/toronto.geojson", 
      default_zoom_in:string = "", 
      rest_csv:string = "city/raw/Toronto.csv",
      detail_id:string = "toronto_restaurant_detail";
      this.draw_map(map_element,geojson_file,default_zoom_in,rest_csv,detail_id);
  }

  public p1_toronto = function(){
    var element_id = "#p1-toronto";
    var ydomain_min = 0, ydomain_max = 150, anchor_interval = 20;
    var csv_file = "city/pattern/rate_des_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        rating: +d.Average_rating,
        star5: +d.star5_rate,
        avg_rate: +d.Average_review_count
      }}
    var attributes = 'avg_rate', city = 'Toronto', title = "Average review counts per restautant";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p2_toronto = function(){
    var element_id = "#p2-toronto";
    var ydomain_min = 50, ydomain_max = 80, anchor_interval = 2;
    var csv_file = "city/pattern/type_counts_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        type: +d.types
      }}
    var attributes = 'type', city = 'Toronto', title = "Restaurant types percentage in whole dataset";

    this.draw_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public p3_toronto = function(){
    var element_id = "#p3-toronto";
    var ydomain_min = 0, ydomain_max = 20, anchor_interval = 2;
    var csv_file = "city/pattern/asian_t.csv";
    var converter_function = function(d){
      return {
        city: d.City,
        chinese:d.Chinese,
        japanese:d.Japanese,
        indian:d.Indian,
        thai:d.Thai,
        vietnamese:d.Vietnamese,
        korean:d.Korean
      }}
    var attributes = ['chinese','japanese','indian','thai',"vietnamese","korean"], city = 'Toronto', title = "Asian restaurants percentage in all categories";

    this.draw_stacked_barchart(element_id, ydomain_min,ydomain_max, csv_file, 
      converter_function, anchor_interval, attributes, city, title)
  }

  public drawCoxcomb(csv:string, svg_id:string, modal_id:string){
    var all_data;
    d3.csv(csv, function(d, i, columns) {
      var t;
      for (i = 1, t = 0; i < columns.length; ++i)
        {var increment = +d[columns[i]];
        t = t + increment;}
      d.total = t;
      return {
        r1: +d.r1,
        r2: +d.r2,
        r3: +d.r3,
        r4: +d.r4,
        r5: +d.r5,
        Cuisine: d.Cuisine,
        total: +d.total
      };
    }).then(function(data){
      all_data = data;
    })

    setTimeout(() => {
      draw(all_data);
      update();
    }, 1000);

    d3.selectAll(".form-check-input").on("change",update);

    function radial() {

      var linear = d3.scaleLinear();
  
      function scale(x) {
        return Math.sqrt(linear(x));
      }
  
      scale.domain = function(_) {
        return arguments.length ? (linear.domain(_), scale) : linear.domain();
      };
  
      scale.nice = function(count) {
        return (linear.nice(count), scale);
      };
  
      scale.range = function(_) {
        return arguments.length ? (linear.range(_.map(square)), scale) : linear.range().map(Math.sqrt);
      };
  
      scale.ticks = linear.ticks;
      scale.tickFormat = linear.tickFormat;
  
      return scale;
    }

    function square(x) {
      return x * x;
    }

    function draw(data:any){
      const margin = {top:50, bottom:50, left:50, right:50}
      var svg = d3.select(svg_id);
      svg.selectAll("g").remove();
      var width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom,
        innerRadius = 180,
        outerRadius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.right + ")").append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0);
      var y:any = radial()
        .range([innerRadius, outerRadius]);
      var z = d3.scaleOrdinal()
        .range(['#40536A','#2E6674','#288980','#4FAA7B','#90C86C','#E1DE61']);

      x.domain(data.map(function(d) { return d.Cuisine; }));
      y.domain([0, 1.2*<any>d3.max(data, function(d:any) { return d.total; })]);
      z.domain(data.columns.slice(1));

      g.append("g")
        .attr("class", "pie")
        .selectAll("g")
        .data(d3.stack().keys(data.columns.slice(1))(<any>data))
        .enter().append("g")
          .attr("fill", function(d) {return <any>z(d['key']); })
        // .selectAll("path")
        // .data(function(d) {console.log(d); return d;}, function(d){ return d['key'];})//
        // .enter().append("path")
        //   .attr("d", <any>d3.arc()
        //       .innerRadius(function(d) { return y(d[0]); })
        //       .outerRadius(function(d) { return y(d[1]); })
        //       .startAngle(function(d) { return x(d['data'].Cuisine); })
        //       .endAngle(function(d) { return x(d['data'].Cuisine) + x.bandwidth(); })
        //       .padAngle(0.01)
        //       .padRadius(innerRadius));

      var label = g.append("g")
        .attr("class", "label")
        .selectAll("g")
        .data(data)
        .enter().append("g")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) { return "rotate(" + ((x(d['Cuisine']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

      label.append("line")
          .attr("x2", -5)
          .attr("stroke", "#000");

      label.append("text")
          .attr("transform", function(d) { return (x(d['Cuisine']) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
          .text(function(d) { return d['Cuisine']; });
        

      var yAxis = g.append("g")
        .attr("class", "yaxis")
          .attr("text-anchor", "middle");

      var yTick = yAxis
        .selectAll("g")
        .data(y.ticks(5).slice(1))
        .enter().append("g");

      yTick.append("circle")
          .attr("fill", "none")
          .attr("stroke", "grey")
          .attr("r", <any>y)
          .attr("opacity", 0.5);

      yTick.append("text")
          .attr("class", "invis")
          .attr("y", function(d) { return -y(d); })
          .attr("dy", "0.35em")
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", 5)
          .text(y.tickFormat(5, "s"));

      yTick.append("text")
          .attr("class", "vis")
          .attr("y", function(d) { return -y(d); })
          .attr("dy", "0.35em")
          .text(y.tickFormat(5, "s"));

      yAxis.append("text")
          .attr("y", function(d) { return -y(y.ticks(5).pop()); })
          .attr("dy", "-1em")
          .attr("class", "yaxis label")
          .text("Number of Restaurants");

      var legend = g.append("g")
        .selectAll("g")
        .data(data.columns.slice(1).reverse())
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 30 + ")"; });

      legend.append("rect")
          .attr("width", 25)
          .attr("height", 25)
          .attr("fill", <any>z);

      // legend.append("text")
      //     .attr("x", 30)
      //     .attr("y", 12.5)
      //     .attr("dy", "0.35em")
      //     .text(<any>function(d) { return d; });

      var imgs = svg.selectAll("image").data([0]);
                  imgs.enter()
                  .append("svg:image")
                  .attr("xlink:href", "img/icon/star.png")
                  .attr("x", "500")
                  .attr("y", "425")
                  .attr("width", "20")
                  .attr("height", "20");

                  imgs.enter()
                  .append("svg:image")
                  .attr("xlink:href", "img/icon/star2.png")
                  .attr("x", "500")
                  .attr("y", "456")
                  .attr("width", "42")
                  .attr("height", "20");

                  imgs.enter()
                  .append("svg:image")
                  .attr("xlink:href", "img/icon/star3.png")
                  .attr("x", "498")
                  .attr("y", "487")
                  .attr("width", "66")
                  .attr("height", "20");

                  imgs.enter()
                  .append("svg:image")
                  .attr("xlink:href", "img/icon/star4.png")
                  .attr("x", "500")
                  .attr("y", "516")
                  .attr("width", "83")
                  .attr("height", "20");

                  imgs.enter()
                  .append("svg:image")
                  .attr("xlink:href", "img/icon/star5.png")
                  .attr("x", "498")
                  .attr("y", "546")
                  .attr("width", "108")
                  .attr("height", "20");
    }
  

    function update_coxcomb(data:any){

      const margin = {top:50, bottom:50, left:50, right:50}
      var svg = d3.select(svg_id);

      var width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom,
        innerRadius = 180,
        outerRadius = Math.min(width, height) / 2,
        g = svg.select("g").select("g");

      var past_max:any = g.selectAll(".vis").data()[g.selectAll(".vis").data().length - 1];
      var current_max:any = d3.max(data, function(d:any) { return d.total; });
      var multiplier = past_max / current_max;

      var x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0);
      var y:any = radial()
        .range([innerRadius, outerRadius]);
      var z = d3.scaleOrdinal()
        .range(['#40536A','#2E6674','#288980','#4FAA7B','#90C86C','#E1DE61']);



      x.domain(data.map(function(d) { return d.Cuisine; }));
      y.domain([0, 1.2*<any>d3.max(data, function(d:any) { return d.total; })]);
      z.domain(data.columns.slice(1));

      var g_selection = g.select(".pie")
        .selectAll("g")
        .data(d3.stack().keys(data.columns.slice(1))(<any>data))
        .selectAll("path")
        .data(<any>function(d) {return d;}, function(d){return d['data'].Cuisine;})
        
      //update
      g_selection.transition()
        .duration(1000)
        .attr("d", <any>d3.arc()
        .innerRadius(function(d) { return y(d[0]); })
        .outerRadius(function(d) { return y(d[1]); })
        .startAngle(function(d) { return x(d['data'].Cuisine); })
        .endAngle(function(d) { return x(d['data'].Cuisine) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius));
      //exit
      g_selection.exit()       
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();
      //enter
      g_selection.enter()
        .append("path")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .attr("d", <any>d3.arc()
        .innerRadius(function(d) { return y(d[0]); })
        .outerRadius(function(d) { return y(d[1]); })
        .startAngle(function(d) { return x(d['data'].Cuisine); })
        .endAngle(function(d) { return x(d['data'].Cuisine) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius));

      var label_selection = g.select(".label")
        .selectAll("g")
        .data(data, function(d) { return d['Cuisine']; })

      //update
      label_selection
        .attr("text-anchor", "middle")        
        .transition()
        .duration(1000)
        .attr("transform", function(d) { return "rotate(" + ((x(d['Cuisine']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; })
        .selectAll("line")
        .attr("x2", -5)
        .attr("stroke", "#000");
      label_selection
        .attr("text-anchor", "middle")        
        .transition()
        .duration(1000)
        .attr("transform", function(d) { return "rotate(" + ((x(d['Cuisine']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius * 0.92 + ",0)"; })
        .selectAll("text")
        .attr("transform", function(d) { return (x(d['Cuisine']) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
        .text(function(d) { return d['Cuisine']; });
        
      //enter
      var label_enter = label_selection.enter()
        .append("g")
        .attr("text-anchor", "middle")


      label_enter
        .attr("transform", function(d) { return "rotate(" + ((x(d['Cuisine']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; })
        .append("line")
        .transition()
        .duration(1000)
        .attr("x2", -5)
        .attr("stroke", "#000");

      label_enter.attr("transform", function(d) { return "rotate(" + ((x(d['Cuisine']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius * 0.92 + ",0)"; })
        .append("text")
        .transition()
        .duration(1000)
        .attr("transform", function(d) { return (x(d['Cuisine']) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
        .text(function(d) { return d['Cuisine']; });

      //exit
      label_selection.exit()
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();

      if (multiplier > 3 || multiplier < 0.9) {overwrite_axis() ;}
      else {transform_axis();}

      function overwrite_axis(){
        g.select(".yaxis")        
      .transition()
      .duration(1000)
      .style("opacity", 0).remove();

      var yAxis = g.append("g")
        .attr("class", "yaxis")
          .attr("text-anchor", "middle");

      var yTick = yAxis
        .selectAll("g")
        .data(y.ticks(5).slice(1))
        .enter().append("g");

      yTick.append("circle")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1)
          .attr("fill", "none")
          .attr("stroke", "grey")
          .attr("r", <any>y)
          .attr("opacity", 0.5);

      yTick.append("text")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1)
          .attr("class", "invis")
          .attr("y", function(d) { return -y(d); })
          .attr("dy", "0.35em")
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", 5)
          .text(y.tickFormat(5, "s"));

      yTick.append("text")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1)
          .attr("class", "vis")
          .attr("y", function(d) { return -y(d); })
          .attr("dy", "0.35em")
          .text(y.tickFormat(5, "s"));

      yAxis.append("text")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1)
          .attr("y", function(d) { return -y(y.ticks(5).pop()); })
          .attr("dy", "-1em")
          .attr("class", "yaxis label")
          .text("Number of Restaurants");
      }

      function transform_axis(){
      var yAxis_selection = g.select(".yaxis");
      var yTick_selection = yAxis_selection
        .data(y.ticks(5).slice(1))
        .selectAll("g");

      // var yTick = yAxis
      //   .selectAll("g")
      //   .data(y.ticks(5).slice(1))
      //   .enter().append("g");

      yTick_selection.selectAll("circle")
        .transition()
        .duration(1000)
          .attr("fill", "none")
          .attr("stroke", "grey")
          .attr("r", <any>y)
          .attr("opacity", 0.5);

      yTick_selection.selectAll("circle").enter()
          .transition()
          .duration(1000)
          .attr("fill", "none")
          .attr("stroke", "grey")
          .attr("r", <any>y)
          .attr("opacity", 0.5);

      yTick_selection.selectAll("circle").exit()
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();

      yTick_selection.selectAll(".invis")
        .transition()
        .duration(1000)
          .attr("y", function(d) { return -y(d); })
          .attr("dy", "0.35em")
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", 5)
          .text(y.tickFormat(5, "s"));

      yTick_selection.selectAll(".vis")
        .transition()
        .duration(1000)
          .attr("y", function(d) { return -y(d); })
          .attr("dy", "0.35em")
          .text(y.tickFormat(5, "s"));
      }
    }

    function update(){
      var selected_type = [];
      var selected_data = [];
      var cb;

      d3.select(modal_id).selectAll(".form-check-input").each(function(){
        cb = d3.select(this);
        if(cb.property("checked")){
          selected_type.push(cb.property("value"));
        }
        cb.classed("is_checked", function(){return cb.property("checked");})
      })

      for(let cc = 0; cc < selected_type.length; cc++){
        for (let dd = 0; dd < all_data.length; dd++){
          if (selected_type[cc] == all_data[dd].Cuisine)
          { selected_data[cc] = all_data[dd];}
        }
      }

      selected_data['columns'] = ["Cuisine","r1","r2","r3","r4","r5"]
      update_coxcomb(selected_data);

      if (selected_data.length <= 2){
        checkbox_disable();
      } else {checkbox_enaable();}


    }

    function checkbox_disable(){
      d3.selectAll(".checkbox_container")
        .selectAll(".is_checked")
        .property("disabled", true);
    }
    function checkbox_enaable(){
       d3.selectAll(".checkbox_container")
        .selectAll("input")
        .property("disabled", false);
    }
    $(".default-food").click(function(){
      d3.select(this.parentNode.parentNode)
        .select(".food-dropdown")
        .selectAll("input")
        .property("checked", true)

      d3.select(this.parentNode.parentNode)
        .select(".rest-dropdown")
        .selectAll("input")
        .property("checked", false)

      d3.select(this.parentNode.parentNode)
        .select(".region-dropdown")
        .selectAll("input")
        .property("checked", false)

      update();
    })
    $(".default-rest").click(function(){
      d3.select(this.parentNode.parentNode)
        .select(".food-dropdown")
        .selectAll("input")
        .property("checked", false)

      d3.select(this.parentNode.parentNode)
        .select(".rest-dropdown")
        .selectAll("input")
        .property("checked", true)

      d3.select(this.parentNode.parentNode)
        .select(".region-dropdown")
        .selectAll("input")
        .property("checked", false)

      update();
    })
    $(".default-region").click(function(){
      d3.select(this.parentNode.parentNode)
        .select(".food-dropdown")
        .selectAll("input")
        .property("checked", false)

      d3.select(this.parentNode.parentNode)
        .select(".rest-dropdown")
        .selectAll("input")
        .property("checked", false)

      d3.select(this.parentNode.parentNode)
        .select(".region-dropdown")
        .selectAll("input")
        .property("checked", true)

      update();
    })
    $(".default-reset").click(function(){
      var inputs = d3.select(this.parentNode.parentNode)

      inputs.selectAll("input")
        .property("checked", false)

      inputs.select(".food-dropdown")
        .select("input")
        .property("checked", true)

      inputs.select(".rest-dropdown")
        .select("input")
        .property("checked", true)

      inputs.select(".region-dropdown")
        .select("input")
        .property("checked", true)

      update();
    })
}
  
  constructor() { }

  ngOnInit() {
    

    // $(window).resize(function(){
    //     clearmap_lasvegas();
    //     drawmap_lasvegas();
    //   });
  
    
  }

}
