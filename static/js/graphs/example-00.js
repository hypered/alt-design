// Some of this code is modified from https://goodwill.awardwinninghuman.com/,
// in particular from from barChart.js and lineChart.js.

/* Same as en-US but using Euro instead of Dollars.
   See https://stackoverflow.com/questions/34744243/d3-js-format-as-currency-euro.
   This can be used as e.g. `euro.format('$,.2f')`.
 */
var euro = d3.formatLocale ({
  "decimal": ".",
  "thousands": ",",
  "grouping": [3],
  "currency": ["€", ""],
  "dateTime": "%a %b %e %X %Y",
  "date": "%m/%d/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"
  ],
  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "months": [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ],
  "shortMonths": [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
  ]
})

// Draw data within an empty <svg> element on a HTML page.
// - `svg` is the <svg> element as a D3 selection.
// - `color` is the color used to stroke the bar chart lines.
// - `data` are the data as returned by `d3.csv()`.
function draw_horizontal_bar_chart(svg, color, data) {
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

    svg.attr("height", `${height}`);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
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

function draw_line_chart(svg, data, legend, yTitle) {
  let width = svg.node().width.baseVal.value * 2.5;
  let height = svg.node().height.baseVal.value * 2.5;
  let margin = {"left": width < 500 ? 65 : 65, "top": 10, "bottom": 75, "right": 0};
  let x = d3.scaleUtc()
    .domain(d3.extent(data.dates))
    .range([margin.left, width - margin.right]);
  let y = d3.scaleLinear()
   .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
   .range([height - margin.bottom, margin.top]);

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  // Draw X axis
  svg.append("g").attr("class", "axisX")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  // Draw Y axis
  svg.append("g").attr("class", "axisY")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(euro.format('$,.2f')));

  const line = d3.line()
    .defined(d => !isNaN(d))
    .x((d, i) => x(data.dates[i]))
    .y(d => y(d))

  // Create the graph lines proper.
  svg.append("g")
    .attr("fill", "none")
    .attr("stroke-width", 2.0)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .selectAll("path")
    .data(data.series)
    .join("path")
    .attr("stroke", function(d){
      return legend[d.name] ? legend[d.name]["colour"] : "orange";
    })
    .attr("stroke-dasharray", function(d){
      return legend[d.name]["dash"] === "solid" ? null : "2,2";
    })
    .attr("d", d => line(d.values));

  group = svg.append("g")
   .attr("class", "legend")
   .attr("transform", "translate(" + (0) + "," + (height - margin.bottom/2) + ")");

  // Create groups to hold each legend item.
  let names = group.selectAll(".legItem")
    .data(Object.keys(legend))
    .enter()
    .append("g")
    .attr("transform", (d, i) =>
      `translate(${i * 150 + 20},0)`)
    .attr("class", "legItem")

  // Draw a small line, corresponding to the graph line.
  names.append("line")
    .attr("x1", 0)
    .attr("x2", 15)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke-width", 2.0)
    .attr("stroke", function(d){
      return legend[d]["colour"];
    })
    .attr("stroke-dasharray", function(d){
      return legend[d]["dash"] === "solid" ? null : "4,4";
    });

  // Draw the label after the small line, corresponding to the graph line.
  names.append("text")
    .attr("transform", "translate(20,4)")
    .text(d => legend[d].label)

  // Draw vertical label along the y axis.
  let yAxisGroup = svg.append("g").attr("class", "yAxisTitle").append("text");
  x = 12;
  y = (height - margin.top - margin.bottom)/2 + margin.top;
  yAxisGroup
   .attr("transform", `rotate(-90 ${x} ${y}) translate(${x},${y})`)
   .text(yTitle)
   .attr("text-anchor", "middle");
}

// Given a selector to specifies a <svg> element, render an horizontal bar
// chart. The data are retrieved using the custom data-csv attribute that
// should present on the <svg> element.
// The data should be organized in "name" and "count" columns.
function horizontal_bar_chart(selector) {
  let svg = d3.select(selector);
  let url = svg.node().dataset.csv;
  let color = 'color' in svg.node().dataset ? svg.node().dataset.color : 'black';

  function map_name_count(d) {
    return {
      name: d.name,
      count: +d.count
    };
  }

  d3.csv(url, map_name_count)
    .then(function(data) {
      draw_horizontal_bar_chart(svg, color, data);
    });
}

// Given a selector to specifies a <svg> element, render a line chart. The data
// are retrieved using the custom data-csv attribute that should present on the
// <svg> element.
// The data should be organized in a "YY-MM" "date" and "values_x" columns.
// TODO Handle arbitray values_x columns, and allow user-defined data for the
// legend.
function line_chart(selector) {
  let svg = d3.select(selector);
  let url = svg.node().dataset.csv;
  d3.csv(url, function(d) {
    let parseTime = d3.timeParse("%Y-%m");
    return {
      date: parseTime(d.date),
      value_0: +d.value_0,
      value_1: +d.value_1
    }
  }).then(function(data) {
    const columns = data.columns.slice(1);
    let formattedData = {
        series: columns.map(d => ({
                 name: d,
                 values: data.map(k => +k[d])
               })),
           dates: data.map(d => d[data.columns[0]])
        };
    let legend = {
          "value_0": {
            "colour": "cyan", "dash": "solid",
            "label": "Some values" },
          "value_1": {
            "colour": "blue", "dash": "solid",
            "label": "Some other values" }
        }
    draw_line_chart(
      svg, formattedData, legend,
      "Some amount in EUR");
  });
}

// Find all <svg> elements with a data-graph attribute, and render the
// corresponding in it.
var svgs = document.querySelectorAll("svg[data-graph]");
svgs.forEach(function(svg) {
  switch (svg.dataset.graph) {
    case 'horizontal-bar':
      horizontal_bar_chart(svg);
      break;
    case 'line':
      line_chart(svg);
      break;
    default:
      break;
  }
});
