(async function () {
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.

    const width = 800;
    const height = 600;

    //read in our csv file 
    const data = await d3.csv("./cars.csv");

    const svg = d3.select("#scatterplot");

    //create an svg g element and add 50px of padding
    const chart = svg.append("g")
        .attr("transform", `translate(50, 50)`);

    //create linear scales to map your data 
    //x and y become functions that can be called later (functions are 1st class citizens in JS)
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => { return +d.hwy })])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => { return +d.cty })])
        .range([height, 0]);

    chart.append('text') //x-axis
        .attr('class', 'axis-title') //Optional: change font size and font weight
        .attr('y', height - 15) //add to the bottom of graph (-25 to add it above axis)
        .attr('x', width - 60) //add to the end of X-axis (-60 offsets the width                     of text)  
        .text('HWY'); //actual text to display

    chart.append('text') //y-axis
        .attr('class', 'axis-title') //Optional: change font size and font weight
        .attr('x', 10) //add some x padding to clear the y axis
        .attr('y', 25) //add some y padding to align the end of the axis with the text
        .text('CTY'); //actual text to display

    //add axes
    chart.append("g")
        .attr("transform", "translate(0," + (height) + ")")
        .call(d3.axisBottom(x).ticks(10).tickSize(-height-10));

    chart.append("g")
        .call(d3.axisLeft(y).ticks(10).tickSize(-width-10));

    //Creating a color scale for nominal/categorical data

    //find the unique options for data.manufacturer
    const distinctValues = [...new Set(data.map((d) => d.manufacturer))]
    console.log({ distinctValues });

    //use unique values as input domain 
    const ordinal = d3.scaleOrdinal().domain(distinctValues)
        .range(d3.schemeSet3); //use d3 Color Scheme #3 as output colors

    // Add marks (points/circles) 
    const points = chart.append('g')
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle") //map data attributes to channels 
        .attr("cx", function (d) { return x(+d.hwy); })
        .attr("cy", function (d) { return y(+d.cty); })
        // .attr("r", 4)
        .style("opacity", 0.25)
        // .style("fill", "#69b3a2")
        .attr("cy", function (d) { return y(+d.cty); })
        .attr("fill", function (d) { return ordinal(d.manufacturer) })
        .attr("r", 15)

    points //let’s attach an event listener to points (all svg circles)
        .on('mouseenter', (event, d) => { //when mouse is over point
            d3.select(event.currentTarget) //add a stroke to highlighted point 
                .style("stroke", "black");
            d3.select('#tooltip') // add text inside the tooltip div
                .style('display', 'block') //make it visible
                .html(`
                       <h1 class="tooltip-title">${d.manufacturer}</h1>          
                       <div>Highway (HWY) MPG: ${d.hwy}</div>
                       City (CTY) MPG: ${d.cty}
               `);
        })
        .on('mouseleave', (event) => {  //when mouse isn’t over point
            d3.select('#tooltip').style('display', 'none'); // hide tooltip
            d3.select(event.currentTarget) //remove the stroke from point
                .style("stroke", "none");
        });
})();
