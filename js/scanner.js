var Scanner = function(scan) {
    var width = scan.width;
    var height = scan.height;
    var pixels = scan.pixels;

    function extractLines() {
        // find boundaries
        var boundaries = []
        var state = false
        var h_sum = new Array(height);
        for (var y = 0; y < height - 5; y++) {
            h_sum[y] = 0;
            for (var x = 0; x < width; x++)
                h_sum[y] += pixels[x][y+0] +
                            pixels[x][y+1] +
                            pixels[x][y+2] +
                            pixels[x][y+3] +
                            pixels[x][y+4];
            if (h_sum[y]/width < 3 != state) {
                state = h_sum[y]/width < 3;
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
                if (h_sum[middle] > 3)
                    lines.push({
                        y1: boundaries[i] - 3,
                        y2: boundaries[i+1] + 3
                    });
            }
        return lines;
    }

    function extractBars(line) {
        // find boundaries
        var boundaries = []
        var v_sum = new Array(width);
        for (var x = 0; x < width - 1; x++) {
            v_sum[x] = 0;
            var start = (line.y1 + (line.y2 - line.y1)*0.333) | 0
            var end = (line.y1 + (line.y2 - line.y1)*0.666) | 0
            for (var y = start; y < end; y++)
                v_sum[x] += (pixels[x+0][y] +
                            pixels[x+1][y])/3.0;
            if (v_sum[x]/(end - start) > 100) {
                boundaries.push(x);
            }
        }
        
        // extract bars
        var bars = [];
        for (var i = 0; i < boundaries.length - 1; i++) {
            if (boundaries[i+1] - boundaries[i] < width/20)
                continue;
            bars.push({
                x1: boundaries[i]+1,
                y1: line.y1,
                x2: boundaries[i+1]-1,
                y2: line.y2
            });
        }
        return bars;
    }

    function extractParts(bar) {
    }

    function analyzeBar(bar) {

    }

    var exports = {};
    exports.extractLines = extractLines;
    exports.extractParts = extractParts;
    exports.extractBars = extractBars;
    exports.analyzeBar = analyzeBar;
    return exports;
};
