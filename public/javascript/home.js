/**
 * Created by rossg on 11/1/2018.
 */
function initHome() {
    var Theme = GetThemeFromCSS();

    var canvas = document.querySelector("canvas");
    var context = canvas.getContext("2d");
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    var homeSection = document.getElementById("home");
    homeSection.setAttribute("style", "height: " + canvas.height + "px;");

    var densityValue = 3;
    var density = 0.01 * densityValue;

    const blubCooldown = 150;
    const blubDuration = 5;
    var blubDurationTimer = 0;
    var blubTimer = blubCooldown;

    var nodes = [];
    var links = [];
    var linkCounter = 0;

    var simulation;

    initCanvas();

    function initCanvas() {
        createNodesAndLinks();

        simulation = d3.forceSimulation(nodes)
            .alphaTarget(0.3)
            .velocityDecay(0.01)
            .force("link", d3.forceLink(links).strength(1).distance(5))
            .on("tick", ticked);

        d3.select(canvas)
            .call(d3.drag()
                .container(canvas)
                .subject(dragSubject)
                .on("start", dragStarted)
                .on("drag", dragged)
                .on("end", dragEnded));
    }

    function createNodesAndLinks() {
        nodes = [];
        links = [];

        var width = canvas.width;
        var height = canvas.height;

        for (var y = 0; y < Math.ceil(height * density); y++) {
            for (var x = 0; x < Math.ceil(width * density); x++) {
                var nodeIndex = x + Math.ceil(width * density) * y;

                var nextNode = {
                    index: nodeIndex,
                    x: Math.round(width / canvas.width) / 2 + Math.round(x / density) - width / 2,
                    y: Math.round(height / canvas.height) / 2 + Math.round(y / density) - height / 2,
                    color: Theme[2],
                };

                if (nodeIndex % Math.ceil(width * density) === 0 || (nodeIndex + 1) % Math.ceil(width * density) === 0) {
                    nextNode.fx = nextNode.x;
                    nextNode.fy = nextNode.y;
                }

                if (y === 0 || y === Math.ceil(height * density) - 1) {
                    nextNode.fx = nextNode.x;
                    nextNode.fy = nextNode.y;
                }

                nodes[nodeIndex] = nextNode;


                if (x != 0) {
                    links.push({
                        index: linkCounter,
                        source: nodeIndex,
                        target: nodeIndex - 1
                    });
                    linkCounter++;
                }
                if (y != 0) {
                    links.push({
                        index: linkCounter,
                        source: nodeIndex,
                        target: nodeIndex - Math.ceil(width * density)
                    });
                    linkCounter++;
                }
            }
        }
    }

    function ticked() {
        blubTimer--;
        blubDurationTimer--;

        if (blubTimer <= 0) {
            simulation.force("charge", d3.forceManyBody().strength(-5));
            blubTimer = blubCooldown;
            blubDurationTimer = blubDuration
        }

        if (blubDurationTimer == 0) {
            simulation.force("charge", null);
        }

        context.fillStyle = Theme[0];
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2);
        links.forEach(drawLink);
        context.restore();
    }

    function drawNode(d) {
        context.beginPath();
        context.moveTo(d.x + 3, d.y);
        context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
        context.fillStyle = d.color;
        context.fill();
    }

    function drawLink(l) {
        context.beginPath();
        context.moveTo(l.source.x, l.source.y);
        context.lineTo(l.target.x, l.target.y);
        context.strokeStyle = Theme[1];
        context.stroke();
    }

    function dragSubject() {
        return simulation.find(d3.event.x - canvas.width / 2, d3.event.y - canvas.height / 2);
    }

    function dragStarted() {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;

        d3.select("#grid-note")
            .transition()
            .duration(500)
            .style("opacity", 0);
    }

    function dragged() {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }

    function dragEnded() {
        if (!d3.event.active) simulation.alphaTarget(0.3);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }
}

initHome();