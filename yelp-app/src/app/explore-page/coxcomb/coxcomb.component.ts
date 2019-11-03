import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { updateBinding } from '@angular/core/src/render3/instructions';
import { calcBindingFlags } from '@angular/core/src/view/util';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-coxcomb',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './coxcomb.component.html',
  styleUrls: ['./coxcomb.component.css']
})
export class CoxcombComponent implements OnInit {


  public drawCoxcomb(){
    var all_data;
    d3.csv("city/Las_Vegas_f_test.csv", function(d, i, columns) {
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
      var svg = d3.select("#coxcomb");
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
          .attr("y", function(d) { return -y(y.ticks(5).pop()) - 20; })
          .attr("dy", "-1em")
          .text("Frequency");

      var legend = g.append("g")
        .selectAll("g")
        .data(data.columns.slice(1).reverse())
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });

      legend.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", <any>z);

      legend.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text(<any>function(d) { return d; });
    }

    function update_coxcomb(data:any){

      const margin = {top:50, bottom:50, left:50, right:50}
      var svg = d3.select("#coxcomb");

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
        .attr("transform", function(d) { return "rotate(" + ((x(d['Cuisine']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; })
        .transition()
        .duration(1000)
        .selectAll("line")
        .attr("x2", -5)
        .attr("stroke", "#000");
      label_selection
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "rotate(" + ((x(d['Cuisine']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; })
        .transition()
        .duration(1000)
        .selectAll("text")
        .attr("transform", function(d) { return (x(d['Cuisine']) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
        .text(function(d) { return d['Cuisine']; });
        
      //enter
      var label_enter = label_selection.enter()
        .append("g")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "rotate(" + ((x(d['Cuisine']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; })


      label_enter.append("line")
        .transition()
        .duration(1000)
        .attr("x2", -5)
        .attr("stroke", "#000");

      label_enter.append("text")
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
          .attr("y", function(d) { return -y(y.ticks(5).pop()) - 20; })
          .attr("dy", "-1em")
          .text("Frequency");
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

      d3.selectAll(".form-check-input").each(function(d){
        cb = d3.select(this);
        if(cb.property("checked")){
          selected_type.push(cb.property("value"));
        }
      })

      for(let cc = 0; cc < selected_type.length; cc++){
        for (let dd = 0; dd < all_data.length; dd++){
          if (selected_type[cc] == all_data[dd].Cuisine)
          { selected_data[cc] = all_data[dd];}
        }
      }

      selected_data['columns'] = ["Cuisine","r1","r2","r3","r4","r5"]
      update_coxcomb(selected_data);
    }
}

  constructor() { }

  ngOnInit() {
    // this.drawCoxcomb();
  }


}

// export class InputControls {
//   sandwiches = true;
//   fastfood = false;
//   american = false;
//   pizza = false;
  
// }