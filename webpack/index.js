import * as d3 from 'd3';

d3.json('../data/popular.baby.names.json', function(fileData) {
    var data = fileData.data;
    // var manipulatedData = {};
    // data.forEach(function(item) {
    //     var name = item['11'].toLowerCase();
    //     if(!manipulatedData[name]) {
    //         manipulatedData[name] = [`${item['8']}     ${item['13']}:${item['10']}(${item['12']})`];
    //     } else {
    //         manipulatedData[name].push(`${item['8']}     ${item['13']}:${item['10']}(${item['12']})`);
    //     }
    // });

    var i = 0;
    d3.select('body')
        .data(data)
        .enter()
        .append('p')
        .text(function(d) {
            return `${i++}: (${d['10']})${d['11']}(${d['9']})`; 
        });

    i = 0;
    var startTime = Date.now();
    d3.selectAll('p')
        .transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .style('background-color', 'aliceblue')
        .text(function(d) {
            var delta = Date.now() - startTime;
            return `${i++}: (${d['10']})${d['11']}(${d['9']}), ${delta}s.`;
        });
});