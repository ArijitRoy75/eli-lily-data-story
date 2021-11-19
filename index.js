/**
 * @author Arijit Ray <arijitroy75@gmail.com>
 */


let covid19;
let mapData;

function buildTable(table, columns, data){
    
    var thead = table.append('thead');
    var tbody = table.append('tbody');

		
		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
		    .text(function (column) { return column; });
        
       
		var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

      
		var cells = rows.selectAll('td')
        .data(function (row) {
          return columns.map(function (column) {
            return {column: column, value: row[column]};
          });
        })
        .enter()
        .append('td')
          .text(function (d) { return d.value; });
    
}


function handleMouseOut() {
  d3.select(this).attr("stroke-width","0.5")
}


function buildMap(mapSection,covidData){
  var w = 600;
    var h = 650;
    var proj = d3.geo.mercator();
    var path = d3.geo.path().projection(proj);
    var t = proj.translate(); 
    var s = proj.scale() 

    var svg = mapSection
             .append("svg:svg")
             .attr("width", w)
        .attr("height", h)
        .attr("class","map-svg")
        .call(initialize);

    var map = svg.append("svg:g")

    


    var india = map.append("svg:g")
        .attr("id", "india")
        .style('stroke','#000')
        .style('stroke-width','0.5');
    function getRandomColor() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
     }
    
    india.selectAll("path")
        .data(statesData.features)
      .enter().append("path")
        .attr("d", path)
        .style("fill",function(){
          return getRandomColor();
        })
        .on("mouseout", handleMouseOut)
        .on("click", function(d,i){d3.select(this).attr("stroke-width","1.4")})
        .append("title")
        .text(function(d){
          return "State : " + d.id;
        });

   
    
    function initialize() {
      proj.scale(6700);
      proj.translate([-1240, 750]);
    }
}



d3.json('https://s3-ap-southeast-1.amazonaws.com/he-public-data/covid196c95c6e.json')
  .then((data,error) => {
      covid19=data;
      columns=Object.keys(covid19[0]);
      var table = d3.select('#master-data').append('table').attr("class","table table-hover").attr("id","myTable");
      $(document).ready(function() {
              $('#myTable').DataTable();
       } );
      buildTable(table,columns,data);
      
      let mapSection=d3.select('#india-map');
      buildMap(mapSection,covid19);
      
});