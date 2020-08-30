// D3 Code from https://www.d3-graph-gallery.com/graph/heatmap_style.html
d3.csv("bertin.csv", function (data) {
    let margin = { top: 30, right: 30, bottom: 30, left: 30 };
    let width = 450 - margin.left - margin.right;
    let height = 450 - margin.top - margin.bottom;
    let xs = data.columns;
    let ys = Array.from(Array(data.length), (_, i) => data.length - i);
    let ext = data.map(di => [Math.min(...Object.values(di)), Math.max(...Object.values(di))]);
    let list = data.reduce((s, di, i) => s.concat(Object.values(di).reduce((si, dij, j) => si.concat({ x: xs[j], y: String(i + 1), v: Number(dij), s: (Number(dij) - ext[i][0]) / (ext[i][1] - ext[i][0]) }), [])), []);
    let svg = d3.select("#bertin")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let x = d3.scaleBand()
        .range([0, width])
        .domain(xs)
        .padding(0.01);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    let y = d3.scaleBand()
        .range([height, 0])
        .domain(ys)
        .padding(0.01);
    svg.append("g")
        .call(d3.axisLeft(y));
    let color = d3.scaleLinear()
        .range(["white", "green"])
        .domain([0, 1]);
    let tooltip = d3.select("#bertin")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");
    let mouse = function (d) {
        tooltip.html("Value: " + d.v + "<br>Relative: " + d.s.toFixed(2))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
    };
    svg.selectAll()
        .data(list, function (d) { return d.x + ':' + d.y; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.x); })
        .attr("y", function (d) { return y(d.y); })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return color(d.s); })
        .on("mouseover", function () { tooltip.style("opacity", 1); })
        .on("mousemove", mouse)
        .on("mouseleave", function () { tooltip.style("opacity", 0); })
});