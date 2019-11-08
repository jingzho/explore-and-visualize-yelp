import { Component, OnInit } from '@angular/core';
import * as D3 from 'd3';
import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-bubble-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})

export class BubbleChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    var margin = {top:50, right:50, bottom:50, left:50};
    var width = parseInt(D3.select("#bubble").style("width")) - margin.left - margin.right;
    var height = parseInt(D3.select("#bubble").style("height")) - margin.top - margin.bottom;
      
    var bubble = D3.select("#bubble")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var random_num = Array();
    for (var i = 0; i < 10; i++){
      random_num[i] = Math.random() * 20;
    }
    
    var color = D3.scaleSequential(D3.interpolateBlues);

    D3.csv("data.csv").then(function (data){
      
      var minStar = D3.min(data, function (d) { return d.stars;}),
        maxGDP = D3.max(data, function(d) { return Math.log10(parseInt(d.GDP))});
        color.domain([minGDP - 1, maxGDP]);

      var vdata = D3.stratify()(data);
      var vlayout = D3.pack().size([width,height]);
      var vroot = D3.hierarchy(vdata).sum(function (d){return d.data['GDP']})
      var vnodes = vroot.descendants();
      vlayout(vroot);
      var circle_enter = bubble.selectAll("circle").data(vnodes).enter();
      
      circle_enter.append("circle")
        .attr("cx", function(d){return d['x']})
        .attr('cy', function (d) { return d['y']; })
        .attr('r', function (d) { return d['r']; })
        .attr("fill", function(d){console.log(d); return color(Math.log10(d['value']))} )
        .attr("stroke", "white")
        .attr("opacity", 0.2)
        .attr("stroke-width", "1.5px")
        .attr("class", "bubble_cloud");

      var leaf = vnodes.filter(function(d) { return !d.children; });
      var text_enter = bubble.selectAll("text").data(leaf).enter();

      text_enter.append("text")
        .attr("x", function(d){return d['x']})
        .attr('y', function (d) { return d['y']; })
        .text(function (d) {return d.data.data['id']})
        .attr("class", "circle_text");

        bubble.selectAll(".bubble_cloud")
          .on('mouseover', function (d) {
            D3.mouse(D3.event.currentTarget);
            var xPosition = D3.mouse(D3.event.currentTarget)[0];
            // xPosition += (xPosition > width / 2) ? -220 : 100;  //switch sides
            var yPosition = D3.mouse(D3.event.currentTarget)[1];
            // yPosition += (yPosition > height / 2) ? -100 : 100;  //switch up/bottom
            
            var country_html = 'Country: ' + d['data'].data['id'] + ' <br/>' +
            'GDP per capita: ' + d['value'] + ' Dollars<br/>';
            var continent_html = 'Continent: ' + d['data'].data['id'];
            var world_html = 'World';

            D3.select('#tooltip')
              .style("left", xPosition + 225 + "px")
              .style("top", yPosition + 600 + "px")
              .select('#planet-info')
              .html(d['depth'] == 2 ? country_html : d['depth'] == 1 ? continent_html : world_html);

            D3.select('#tooltip').classed('hidden', false);
              })

          .on('mouseout', function (d){
            D3.select("#tooltip")
              .classed("hidden", true);
          })
    })

    // D3.csv("GDP2016.csv", function (d) {
    //   return { Country : d.Country, GDP : +d.GDP };
    // })
    //   .then(function (data){


    //     var dataenter = bubble.selectAll("circle")
    //       .data(data)
    //       .enter();

    //       dataenter.append("circle")
    //       .attr("cx", function(d,i) { return 50+ i % 5 * width/5.2 + random_num[i]; })
    //       .attr("cy", function(d,i) { return 50 + Math.floor(i/5) * height/2.5 + random_num[i]; })
    //       .attr("r", function (d) { return Math.sqrt(d.GDP) / 4;})
    //       .attr("class", "bubble_cloud")
    //       .style("fill", function(d){ return color(Math.log10(d.GDP))} )

    //       dataenter.append("text")
    //       .text(function (d) {return d.Country;})
    //       .attr("x", function(d,i) { return 50 + i % 5 * width/5.2 + random_num[i]; })
    //       .attr("y", function(d,i) { 
    //         var ypos = 50 + Math.floor(i/5) *  height/2.5 + random_num[i]
    //         return Math.log10(d.GDP) > 4 ? ypos : ypos - 25 ; })
    //       .attr('fill', function (d) { return Math.log10(d.GDP) > 4 ? "white" : "black" ;})   
    //       .attr('font-size', '14px')   
    //       .attr('text-anchor', 'middle')   
    //       .attr('vertical-align', 'middle')
    //       .attr("class", "bubble_text");
        
    //     bubble.selectAll(".bubble_cloud")
    //       .on('mouseover', function (d) {
    //         D3.mouse(D3.event.currentTarget);
    //         var xPosition = D3.mouse(D3.event.currentTarget)[0];
    //         // xPosition += (xPosition > width / 2) ? -220 : 100;  //switch sides
    //         var yPosition = D3.mouse(D3.event.currentTarget)[1];
    //         // yPosition += (yPosition > height / 2) ? -100 : 100;  //switch up/bottom

    //         D3.select('#tooltip')
    //           .style("left", xPosition + 225 + "px")
    //           .style("top", yPosition + 600 + "px")
    //           .select('#planet-info')
    //           .html('Country: ' + d['Country'] + ' <br/>' +
    //             'GDP per capita: ' + d['GDP'] + ' Dollars<br/>')

    //         D3.select('#tooltip').classed('hidden', false);
    //           })

    //       .on('mouseout', function (d){
    //         D3.select("#tooltip")
    //           .classed("hidden", true);
    //       })
    //   })
  }
}

