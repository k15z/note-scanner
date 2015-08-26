var Scanner = function(scan) {
    var width = scan.width;
    var height = scan.height;
    var pixels = scan.pixels;

    function extractLines(options) {
        if (!options) options = {MIN_COLOR: 0.75}
        
        // find boundaries
        var boundaries = []
        var state = false
        var h_sum = new Array(height);
        for (var y = 0; y < height - 5; y++) {
            h_sum[y] = 0;
            for (var x = 0; x < width; x++)
                h_sum[y] += (pixels[x][y+0] +
                            pixels[x][y+1] +
                            pixels[x][y+2] +
                            pixels[x][y+3] +
                            pixels[x][y+4])/5.0;
            if (h_sum[y]/width < options.MIN_COLOR != state) {
                state = h_sum[y]/width < options.MIN_COLOR;
                boundaries.push(y);
            }
        }

        // extract lines
        var lines = []
        var max_diff = 0
        for (var i = 0; i < boundaries.length - 1; i++)
            if (max_diff < boundaries[i+1] - boundaries[i])
                max_diff = boundaries[i+1] - boundaries[i];
        for (var i = 0; i < boundaries.length - 1; i++)
            if (max_diff/1.5 < boundaries[i+1] - boundaries[i]) {
                var middle = (boundaries[i+1] - boundaries[i])/2
                middle = (boundaries[i] + middle) | 0
                if (h_sum[middle] > options.MIN_COLOR)
                    lines.push({
                        y1: boundaries[i],
                        y2: boundaries[i+1]
                    });
            }
        return lines;
    }

    function extractBars(line, options) {
        if (!options) options = {MIN_COLOR: 150, MIN_WIDTH: 50}
        
        // find boundaries
        var boundaries = []
        var v_sum = new Array(width);
        for (var x = 0; x < width - 1; x++) {
            v_sum[x] = 0;
            var start = (line.y1 + (line.y2 - line.y1)*0.333) | 0
            var end = (line.y1 + (line.y2 - line.y1)*0.666) | 0
            for (var y = start; y < end; y++)
                v_sum[x] += (pixels[x+0][y] +
                            pixels[x+1][y])/2.0;
            if (v_sum[x]/(end - start) > options.MIN_COLOR) {
                boundaries.push(x);
            }
        }
        
        // extract bars
        var bars = [];
        for (var i = 0; i < boundaries.length - 1; i++) {
            if (boundaries[i+1] - boundaries[i] < options.MIN_WIDTH)
                continue;
            bars.push({
                x1: boundaries[i],
                y1: line.y1,
                x2: boundaries[i+1],
                y2: line.y2
            });
        }
        return bars;
    }

    function extractParts(bar, options) {
        if (!options) options = {MIN_COLOR: 100}
        
        // find boundaries
        var boundaries = []
        var state = false
        var h_sum = new Array(bar.y2 - bar.y1);
        for (var y = bar.y1; y < bar.y2 - 1; y++) {
            h_sum[y - bar.y1] = 0;
            for (var x = bar.x1; x < bar.x2; x++)
                h_sum[y - bar.y1] += 
                    (pixels[x][y + 0] + 
                    pixels[x][y + 1])/2.0;
            if (h_sum[y - bar.y1]/(bar.x2-bar.x1) < options.MIN_COLOR != state) {
                state = h_sum[y - bar.y1]/(bar.x2-bar.x1) < options.MIN_COLOR;
                boundaries.push(y);
            }
        }
        
        // extract dividers
        var max_dist = 0;
        var dividers = [];
        dividers.push(bar.y1);
        for (var i = 0; i < boundaries.length-1; i++)
            if (boundaries[i+1] - boundaries[i] > max_dist)
                max_dist = boundaries[i+1] - boundaries[i]
        for (var i = 0; i < boundaries.length-1; i++) {
            if (boundaries[i+1] - boundaries[i] > max_dist/1.25) {
                dividers.push(boundaries[i] + (boundaries[i+1] - boundaries[i]) / 2);
            }
        }
        dividers.push(bar.y2);
        
        // extract parts
        var parts = []
        for (var i = 0; i < dividers.length - 1; i++)
            parts.push({
                x1: bar.x1,
                y1: dividers[i],
                x2: bar.x2,
                y2: dividers[i+1]
            });
        console.log(parts);
        return parts;
    }

    function analyzePart(part) {

    }

    var exports = {};
    exports.extractLines = extractLines;
    exports.extractBars = extractBars;
    exports.extractParts = extractParts;
    exports.analyzePart = analyzePart;
    return exports;
};
