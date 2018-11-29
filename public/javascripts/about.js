/**
 * Created by rossg on 11/1/2018.
 */
var width = 400;
var height = 400;
var radius = Math.min(width, height) / 2;

var b = {
    w: 75, h: 30, s: 3, t: 10
};

var colors = {
    "Javascript": "#5687d1",
    "Apex": "#7b615c",
    "C#": "#de783b",
    "Java": "#6ab975",
    "HTML/CSS": "#8E44AD",
    "Go": "#2C3E50",
    "Swift": "#F1C40F",
    "PHP": "#bbbbbb",
    "Skills": Theme[2]
};

var totalSize = 0;

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.partition()
    .size([2 * Math.PI, radius * radius]);

var arc = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    .outerRadius(function(d) { return Math.sqrt(d.y1); });

var json = getData();
createVisualization(json);

function createVisualization(json) {
    initializeBreadcrumbTrail();

    vis.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

    var root = d3.hierarchy(json)
        .sum(function(d) { return d.size; })
        .sort(function(a, b) { return b.value - a.value; });

    var nodes = partition(root).descendants()
        .filter(function(d) {
            return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
        });

    var path = vis.data([json]).selectAll("path")
        .data(nodes)
        .enter().append("svg:path")
        .attr("display", function(d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function(d) { return d.data.color; })
        .style("opacity", function(d) {
            if (d.data.opacity) {
                return d.data.opacity;
            } else {
                return 1;
            }
        })
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave);

    totalSize = path.datum().value;

    updateBreadcrumbs([], "");
}

function mouseOver(d) {
    var percentage = (100 * d.value / totalSize).toPrecision(3);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
        percentageString = "< 0.1%";
    }

    d3.select("#percentage")
        .text(percentageString);

    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift();
    updateBreadcrumbs(sequenceArray, percentageString);

    vis.selectAll("path")
        .filter(function(node) {
            return (sequenceArray.indexOf(node) < 0);
        })
        .style("opacity", function(d) {
            if (d.data.opacity) {
                return d.data.opacity / 2;
            } else {
                return 1 / 2;
            }
        });

    d3.select("#sunburst-note")
        .transition()
        .duration(500)
        .style("opacity", 0);

    d3.select("#sequence")
        .style("opacity", 1);
}

function mouseLeave(d) {
    updateBreadcrumbs([], "");

    d3.selectAll("path")
        .style("opacity", function(d) {
            if (d.data.opacity) {
                return d.data.opacity;
            } else {
                return 1;
            }
        });
}

function initializeBreadcrumbTrail() {
    var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", width)
        .attr("height", 50)
        .attr("id", "trail");

    trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
}

function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) {
        points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
}

function updateBreadcrumbs(nodeArray, percentageString) {
    nodeArray = [{data:{name: "Skills", depth: 1, color: colors["Skills"]}}].concat(nodeArray);

    var trail = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.data.name + d.depth; });

    trail.exit().remove();

    var entering = trail.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function(d) {
            return d.data.color;
        })
        .style("opacity", function(d) {
            if (d.data.opacity) {
                return d.data.opacity;
            } else {
                return 1;
            }
        });

    entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.name; });

    // Merge enter and update selections; set position for all nodes.
    entering.merge(trail).attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    // Now move and update the percentage at the end.
    d3.select("#trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(percentageString);

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("opacity", 1);

}

function getData() {
    var result = {
        "name": "root",
        "children": [
            {"name": "Javascript", "children": [
                {"name": "Vanilla", "size": 5},
                {"name": "Node", "size": 4},
                {"name": "API", "size": 4},
                {"name": "Angular2", "size": 3},
                {"name": "Lightning", "size": 3},
                {"name": "Angular", "size": 2},
                {"name": "React", "size": 1}
            ]},
            {"name": "Java", "children": [
                {"name": "College", "size": 4},
                {"name": "Android", "size": 3}
            ]},
            {"name": "HTML/CSS", "children": [
                {"name": "Vanilla ", "size": 3},
                {"name": "Angular2 ", "size": 2},
                {"name": "Angular ", "size": 1},
                {"name": "React ", "size": 1}
            ]},
            {"name": "C#", "children": [
                {"name": "Unity", "size": 5},
                {"name": ".NET", "size": 3},
                {"name": "API ", "size": 3},
                {"name": "College", "size": 2},
                {"name": "ASP.NET", "size": 1}
            ]},
            {"name": "Swift", "children": [
                {"name": "iOS", "size": 3}
            ]},
            {"name": "Go", "children": [
                {"name": "API  ", "size": 2}
            ]},
            {"name": "PHP", "children": [
                {"name": "College  ", "size": 2},
                {"name": "API   ", "size": 1}
            ]},
            {"name": "Apex", "children": [
                {"name": "Salesforce", "size": 4},
                {"name": "API ", "size": 4}
            ]}
        ]};

    var current;
    for (var i = 0; i < result.children.length; i++) {
        current = result.children[i];

        if (colors[current.name] != undefined) {
            var currentChild;
            for (var j = 0; j < current.children.length; j++) {
                currentChild = current.children[j];
                currentChild.color = colors[current.name];
                currentChild.opacity = 0.25 + 0.75 * ((current.children.length - j) / current.children.length);
            }
        }

        current.color = colors[current.name];
    }

    return result;
}