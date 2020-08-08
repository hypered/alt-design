// Some of this code is modified from https://goodwill.awardwinninghuman.com/,
// in particular from from barChart.js.

// Draw data within an empty <svg> element on a HTML page.
// - `selector` is the empty <svg> element class or id to select it.
// - `color` is the color used to stroke the bar chart lines.
// - `data` are the data as returned by `d3.csv()`.
function draw_horizontal_bar_chart(selector, color, data) {
    let svg = d3.select(selector);
    // The width is static, but the height is based on data.
    // The plus 1 is to make room for the last line, at the end of this code.
    let width = svg.node().width.baseVal.value;
    let height = data.length * 24 + 1;
    let x = d3.scaleLinear()
      .domain([0, d3.max(data.map(e => e.count))])
      .range([0, width]);
    let y = d3.scaleBand()
      .domain(data.map(e => e.name))
      .range([0, data.length * 24])
      .paddingInner(0.9);

    svg.attr("height", `${height}`)
    svg.attr("viewBox", `0 0 ${width} ${height}`)
    // The plus 25 is to make room for the first line of text, at the top of
    // the bar chart.
    let group = svg.append("g")
      .attr("transform", "translate(0, 25)");

    let rects = group.selectAll("g.bars")
      .data(data, function(d) { return d; })
      .enter()
      .append("g")
      .attr("class", "bars")
      .attr("transform", (d) => ("translate(0," + y(d.name) + ")"));

    // Display the name (or a truncated version).
    rects.append("text")
      .attr("transform", "translate(0," + (-y.bandwidth()) + ")")
      .text(function(d) {
        if (d.name.length > Math.floor(width/15)) {
          return d.name.substring(0, Math.floor(width/15) + 3) + "...";
        } else {
          return d.name;
	}
      })
      .append("title")
      .text(d => d.name);

    // Display the count flushed right.
    rects.append("text")
      .attr("transform", "translate(" + width + "," + (-y.bandwidth()) + ")")
      .style("text-anchor", "end")
      .text(function(d){ return d3.format(",")(d.count); });

    // Display the bar.
    rects.append("rect")
      .attr("y", 1)
      .attr("width", function(d){ return x(d.count); })
      .attr("height", y.bandwidth())
      .attr("fill", color);

    // Display a dashed line to extend the bar further to the right.
    rects.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y.bandwidth()/2 + 1)
      .attr("y2", y.bandwidth()/2 + 1)
      .attr("stroke-dasharray", "1 2")
      .attr("stroke", color);
}

// Given a selector to specifies a <svg> element, render an horizontal bar
// chart. The data are retrieved using the custom data-csv attribute that
// should present on the <svg> element.
// TODO Retrieve the color also using a custom data-color attribute.
// TODO Find all such <svg> elements automatically, by doing so, it might
// possible the `id` attribute won't be needed .
function horizontal_bar_chart(selector, color, accessor) {
  let svg = document.querySelector(selector);
  let url = svg.dataset.csv;
  d3.csv(url, accessor)
    .then(function(data) {
      draw_horizontal_bar_chart(selector, color, data);
    });
}

horizontal_bar_chart("#example-00", "blue", function(d) {
  return {
    name: d.name,
    count: +d.count
  };
});
