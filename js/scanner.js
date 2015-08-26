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
                        start: boundaries[i] - 5,
                        end: boundaries[i+1] + 5
                    });
            }
        return lines;
    }

    function extractParts(i, j) {

    }

    function extractBars(i, j) {

    }

    function analyzeBar(i, j) {

    }

    var exports = {};
    exports.extractLines = extractLines;
    exports.extractParts = extractParts;
    exports.extractBars = extractBars;
    exports.analyzeBar = analyzeBar;
    return exports;
};
