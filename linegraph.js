(async () => {
  const height = window.innerHeight;
  const width = window.innerWidth;

  let data = await d3.csv("./covid_cases_by_date.csv")
    .then(dataset => dataset.filter(d => d.collection_date !== ""));

  const timeParse = d3.timeParse("%Y-%m-%d");
  data.forEach(d => {
    d.date = timeParse(d.collection_date);
    d.count = +d.count;
  });

  data = data.sort((a, b) => a.date - b.date);

  console.log(data);

  const sumstat = d3.group(data, d => d.test_result);
  console.log(sumstat);

  const x = d3.scaleTime() // a scale to convert time to x-position
    .domain(d3.extent(data, d => d.date)) // min to max date
    .range([0, width]); // from 0px to full width of page

  const y = d3.scaleLinear() // a scale to convert count to y-position
    .domain([0, d3.max(data, d => d.count)]) // 0 to max value
    .range([window.innerHeight, 0]); // from the bottom of the page to the top of the page

  // create a color scale for negative and positive test results
  const color = d3.scaleOrdinal()
    .domain(['negative', 'positive'])
    .range(['crimson', 'steelblue']);

  const line = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(+d.count); });

  const svg = d3.select("#linegraph")
    .append("g")
    .attr("transform", "translate(50, 50)");

  svg //add the linegraph
    .selectAll("path") //select all SVG paths in our canvas (i.e.: lines)
    .data(sumstat) //add our rolled up data
    .join("path") //join the data to path
    .attr('fill', 'white') // removes the area inside the path
    .attr('stroke', d => color(d[0])) //map color to the key (negative/positive)
    .attr("d", (d) => { //creates a stroke for each key/category rtnd by sumstat
      return line(d[1])
    });

  // Add the x Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  // Add the y Axis
  svg.append("g")
    .call(d3.axisLeft(y));

})();