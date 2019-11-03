import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';

@Component({
  selector: 'app-lasvegas',
  templateUrl: './lasvegas.component.html',
  styleUrls: ['./lasvegas.component.css']
})
export class LasvegasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setInterval(function () { 
      drawmap();}, 10000);

    $(document).ready(function(){
      var width = $("#map").width();
      var height = $("#map").height();
      console.log(width, height);
    });
    $(window).resize(function(){
      drawmap();
    });

    function drawmap(){
      var svg = d3.select("#map");
      var width = $("#map").width();
      var height = $("#map").height();
      console.log(width, height); 

      d3.json("geojson/las-vegas.geojson").then(function (json) { 

        var projection = d3.geoAlbersUsa()   
        .fitSize([width, height], <any>json);  //fit svg size! 
        
      var path = d3.geoPath()   
        .projection(projection); 
  
      svg.selectAll("path")   
        .data(json['features'])  //data join with features   
        .enter()   
        .append("path")   
        .attr("fill", "white")   
        .attr("stroke", "black")   
        .attr("d", path);  //generate geographic path 
      });
    }  
  }

}
