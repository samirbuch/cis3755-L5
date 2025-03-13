(async () => {
  const height = window.innerHeight;
  const width = window.innerWidth;

  let data = await d3.json("./coins.json")
    .then(data => data["bitcoin"])
    .then(data => data.filter(d => d["24h_vol"] !== null))
    .then(data => data.filter(d => d.price_usd != null));

  const timeParse = d3.timeParse("%d/%m/%Y");
  data.forEach(d => {
    d.date = timeParse(d.date);
    d.price_usd = +d.price_usd;
    d.market_cap = +d.market_cap;
  })

  console.log(data[0].date);

  const xAxis = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

  const yAxis = d3.scaleLinear()
    .domain([
      0,
      d3.max(data, d => d.price_usd)
    ])
    .range([height, 0]);

  const line = d3.line()
    .x(function (d) {
      return xAxis(d.date);
    })
    .y(function (d) { return yAxis(d.price_usd); });

  // console.log(line(data[0]));
  console.log(line(data));

  const svg = d3.select("#linegraph")
    .append("g")
    .attr("transform", "translate(50, 0)");

  // svg.selectAll("path")
  //   .data(data)
  //   .join("path")
  //   .attr("fill", "white")
  //   .attr("stroke", "steelblue")
  //   .attr("d", function (d) {
  //     return line(d);
  //   })

  svg.append("path")
    .attr("d", line(data))
    .attr("stroke", "steelblue")
    .attr("stroke-width", "3px")
    .attr("fill", "white");

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xAxis));

  svg.append("g")
    .call(d3.axisLeft(yAxis));

  console.log(data);
})();