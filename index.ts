import * as d3 from 'd3';
import {Request} from 'd3-request';

// interface IAttributes {
//     height?: number;
//     width?: number;
// }

// interface Selection<BaseType, Object, HTMLElement, any> {
//     attributes(attributes: IAttributes): this;
// }

// function attr(attributes: IAttributes) {
//     for(let key in attributes) {
//         this.attr(key, (<any>attributes)[key]);
//     }

//     return this;
// }


// #region bar chart with labels
var barChartHeight: number = 120;
var barChartWidth: number = 300;
var barChartPadding: number = 2;
var barChartDataset: number[] = [5, 10, 13, 19, 21, 25, 11, 25, 22, 18, 7];

var barChartSvg = d3.select('body')
                    .append('svg')
                    .attr('height', barChartHeight)
                    .attr('width', barChartWidth);

function colorPicker(v: number): string {
    if (v <= 20) {
        return '#666';
    }

    return '#F03';
}

barChartSvg.selectAll('rect')
           .data(barChartDataset)
           .enter()
           .append('rect')
           .attr('fill', (dataitem: number) => colorPicker(dataitem))
           .attr('height', (dataitem: number) => dataitem * 4)
           .attr('width', barChartWidth / barChartDataset.length - barChartPadding)
           .attr('x', (dataitem: number, index: number) => index * (barChartWidth / barChartDataset.length))
           .attr('y', (dataitem: number) => barChartHeight - (dataitem * 4))
//  easiest path to a tooltip. doesn't add a lot of control though, so not usually the ideal route
        //    .append('title')
        //    .text((d) => d);
            .on('mouseover', function (d) {
                barChartSvg.append('text')
                           .text(d)
                           .attr('fill', '#FFF')
                           .attr('font-family', 'sans-serif')
                           .attr('font-size', 12)
                           .attr('text-anchor', 'middle')
                           .attr('x', () => {
                               return parseFloat(d3.select(this).attr('x')) + (parseFloat(d3.select(this).attr('width')) / 2)
                           })
                           .attr('y', parseFloat(d3.select(this).attr('y')) + 12)
                           .attr('id', 'tooltip');
            })
            .on('mouseout', () => {
                d3.select('#tooltip').remove();
            });

// text label on bar itself
// shows for all bars on render
// barChartSvg.selectAll('text')
//            .data(barChartDataset)
//            .enter()
//            .append('text')
//            .text((dataitem: number) => dataitem)
//            .attr('fill', '#FFF')
//            .attr('font-family', 'sans-serif')
//            .attr('font-size', 12)
//            .attr('text-anchor', 'middle')
//            .attr('x', (dataitem: number, index: number) => index * (barChartWidth / barChartDataset.length) + (barChartWidth / barChartDataset.length - barChartPadding) / 2)
//            .attr('y', (dataitem: number) => barChartHeight - (dataitem * 4) + 14);

// #endregion

interface IMonthlySale
{
    month: number,
    sales: number
}

// #region line chart
var lineChartHeight: number = 350;
var lineChartWidth: number = 400;
var lineChartDataset: IMonthlySale[] = [
    { month: 10, sales: 100 },
    { month: 20, sales: 130 },
    { month: 30, sales: 250 },
    { month: 40, sales: 300 },
    { month: 50, sales: 265 },
    { month: 60, sales: 225 },
    { month: 70, sales: 180 },
    { month: 80, sales: 120 },
    { month: 90, sales: 145 },
    { month: 100, sales: 130 }
];

var line = d3.line<IMonthlySale>()
             .x((dataitem: IMonthlySale) => dataitem.month * 3)
             .y((dataitem: IMonthlySale) => lineChartHeight - dataitem.sales);

var lineChartSvg = d3.select('body')
                     .append('svg')
                     .attr('height', lineChartHeight)
                     .attr('width', lineChartWidth);

lineChartSvg.append('path')
            .attr('d', line(lineChartDataset))
            .attr('fill', 'none')
            .attr('stroke', 'purple')
            .attr('stroke-width', 2);

lineChartSvg.selectAll('text')
            .data(lineChartDataset)
            .enter()
            .append('text')
            .text((dataitem: IMonthlySale) => dataitem.sales)
            .attr('dy', '.35em')
            .attr('fill', '#666')
            .attr('font-family', '#666')
            .attr('font-size', '12px')
            .attr('font-weight', (dataitem: IMonthlySale, index: number): string => {
                if (index === 0 || index === (lineChartDataset.length - 1)) {
                    return 'bold';
                }

                return 'normal';
            })
            .attr('text-anchor', 'start')
            .attr('x', (dataitem: IMonthlySale) => dataitem.month * 3 - 25)
            .attr('y', (dataitem: IMonthlySale) => lineChartHeight - dataitem.sales);
// #endregion

// #region scatter plot
var scatterPlotHeight: number = 350;
var scatterPlotWidth: number = 400;
var scatterPlotDataset: IMonthlySale[] = [
    { month: 10, sales: 100 },
    { month: 20, sales: 130 },
    { month: 30, sales: 250 },
    { month: 40, sales: 300 },
    { month: 50, sales: 265 },
    { month: 60, sales: 225 },
    { month: 70, sales: 180 },
    { month: 80, sales: 120 },
    { month: 90, sales: 145 },
    { month: 100, sales: 130 }
];

function salesKeyPerformanceIndicator(sales: number): string {
    if (sales >= 250) {
        return '#3C6';
    }

    return '#666';
}

function showMinMax(dataset: IMonthlySale[], column: string, value: number, type: string): number {
    let max = d3.max<IMonthlySale>(dataset, (dataitem: IMonthlySale) => (<any>dataitem)[column]);
    let min = d3.min<IMonthlySale>(dataset, (dataitem: IMonthlySale) => (<any>dataitem)[column]);

    if (type === 'all' || (type === 'minmax' && (value === max || value === min))) {
        return value;
    }
}

var scatterPlotSvg = d3.select('body')
                       .append('svg')
                       .attr('width', scatterPlotWidth)
                       .attr('height', scatterPlotHeight);

scatterPlotSvg.selectAll('circle')
              .data(scatterPlotDataset)
              .enter()
              .append('circle')
              .attr('cx', (dataitem: IMonthlySale) => dataitem.month * 3)
              .attr('cy', (dataitem: IMonthlySale) => scatterPlotHeight - dataitem.sales)
              .attr('fill', (dataitem: IMonthlySale) => salesKeyPerformanceIndicator(dataitem.sales))
              .attr('r', 5);

scatterPlotSvg.selectAll('text')
              .data(scatterPlotDataset)
              .enter()
              .append('text')
              .text((dataitem: IMonthlySale) => showMinMax(scatterPlotDataset, 'sales', dataitem.sales, 'all'))
              .attr('fill', '#666')
              .attr('font-family', 'sans-serif')
              .attr('font-size', '12px')
              .attr('text-anchor', 'start')
              .attr('x', (dataitem: IMonthlySale) => (dataitem.month * 3) - 28)
              .attr('y', (dataitem: IMonthlySale) => scatterPlotHeight - dataitem.sales);

d3.select('#label-option')
  .on('change', (dataitem) => {
        let selection = (<HTMLOptionElement>
                            d3.select('#label-option')
                              .node()
                        ).value;

        scatterPlotSvg.selectAll('text')
                      .data(scatterPlotDataset)
                      .text((dataitem) => showMinMax(scatterPlotDataset, 'sales', dataitem.sales, selection));
  });
// #endregion


// input domain: raw data min/max
// output range: min/max created for output(make sure it stays within visual area)
var scale = d3.scaleLinear()
              .domain([130, 350])
              .range([10, 100]);

// console.log(scale(300));
// console.log(scale(270));
// console.log(scale(150));

// #region scaling data
interface ILinks {
    git: string;
    html: string;
    self: string;
}

interface IMonthlySalesByCategoryApiResponse {
    _links: ILinks;
    content: string;
    download_url: string;
    encoding: string;
    git_url: string;
    html_url: string;
    name: string;
    path: string;
    sha: string;
    size: number;
    type: string;
    url: string;
}

interface IMonthlySalesByCategory {
    category: string;
    monthlySales: IMonthlySale[];
    region: string;
}

var scalingHeight = 100;
var scalingWidth = 400;

function showHeader(dataset: IMonthlySalesByCategory): void {
    d3.select('body')
      .append('h1')
      .text(`${dataset.category} Sales (2013)`);
}

function buildLine(dataset: IMonthlySalesByCategory): void {
    let xScale = d3.scaleLinear()
                   .domain([
                       d3.min(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.month),
                       d3.max(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.month)
                    ])
                    .range([0, scalingWidth]);

    let yScale = d3.scaleLinear()
                   .domain([
                       0,
                       d3.max(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.sales)
                    ])
                    .range([scalingHeight, 0]);

    let scalingLine = d3.line<IMonthlySale>()
                        .x((dataitem: IMonthlySale) => xScale(dataitem.month))
                        .y((dataitem: IMonthlySale) => yScale(dataitem.sales));

    let svg = d3.select('body')
                .append('svg')
                .attr('height', scalingHeight)
                .attr('width', scalingWidth);

    svg.append('path')
       .attr('d', scalingLine(dataset.monthlySales))
       .attr('fill', 'none')
       .attr('stroke', 'purple')
       .attr('stroke-width', 2);
}

d3.json('https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json',
        (error: any, data: IMonthlySalesByCategoryApiResponse) => {
            if (error) {
                console.log(error);
            } else {
                // console.log(data);
            }

            let decodedData: { contents: IMonthlySalesByCategory[] } = JSON.parse(window.atob(data.content));
            // console.log(decodedData.contents);
            decodedData.contents.forEach((dataset: IMonthlySalesByCategory) => {
                // console.log(dataset);
                showHeader(dataset);
                buildLine(dataset);
            });
        }
);
// #endregion

// #region axis
var axisHeight = 100;
var axisWidth = 400;
var axisPadding = 20;

function getDate(data: any): Date {
    let stringDate = new String(data); //20130101
    let year = parseInt(stringDate.substr(0, 4), 10);
    let month = parseInt(stringDate.substr(4, 2), 10) - 1;
    let day = parseInt(stringDate.substr(6, 2), 10);

    return new Date(year, month, day);
}

function axisBuildLine(dataset: IMonthlySalesByCategory): void {
    // console.log(`xscale-max: ${d3.max(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.month)}`);
    // console.log(`yscale-max: ${d3.max(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.sales)}`);

    let minDate = getDate(dataset.monthlySales[0].month);
    let maxDate = getDate(dataset.monthlySales[dataset.monthlySales.length - 1].month);
    // console.log(minDate);
    // console.log(maxDate);

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);

    let xScale = d3.scaleTime()
                   .domain([minDate, maxDate])
                   .range([axisPadding + 5, axisWidth - axisPadding]);
                //    .nice();

    let xAxisGenerator = d3.axisBottom(xScale)
                           .tickFormat(d3.timeFormat('%b'));

    let yScale = d3.scaleLinear()
                   .domain([
                       0,
                       d3.max(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.sales)
                    ])
                    .range([axisHeight - axisPadding, 10]);
                    // .nice();

    let yAxisGenerator = d3.axisLeft(yScale)
                           .ticks(4);

    let axisLine = d3.line<IMonthlySale>()
                     .x((dataitem: IMonthlySale) => xScale(getDate(dataitem.month)))
                     .y((dataitem: IMonthlySale) => yScale(dataitem.sales));

    let svg = d3.select('body')
                .append('svg')
                .attr('height', axisHeight)
                .attr('id', `svg-${dataset.category}`)
                .attr('width', axisWidth);

    svg.append('g')
       .call(yAxisGenerator)
       .attr('class', 'y-axis')
       .attr('transform', `translate(${axisPadding}, 0)`);

    svg.append('g')
       .call(xAxisGenerator)
       .attr('class', 'x-axis')
       .attr('transform', `translate(0, ${axisHeight - axisPadding})`);

    svg.append('path')
       .attr('class', `path-${dataset.category}`)
       .attr('d', axisLine(dataset.monthlySales))
       .attr('fill', 'none')
       .attr('stroke', 'purple')
       .attr('stroke-width', 2);

    svg.selectAll('circle')
       .data(dataset.monthlySales)
       .enter()
       .append('circle')
       .attr('cx', (dataitem: IMonthlySale) => xScale(getDate(dataitem.month)))
       .attr('cy', (dataitem: IMonthlySale) => yScale(dataitem.sales))
       .attr('r', 4)
       .attr('fill', '#666')
       .attr('class', `circle-${dataset.category}`)
       .on('mouseover', (d) => {
           tooltip.transition()
                  .duration(500)
                  .style('opacity', .85);
            tooltip.html(`<strong>Sales $${d.sales}K</strong>`)
                   .style('left', `${d3.event.pageX}px`)
                   .style('top', `${d3.event.pageY - 28}px`);
       })
       .on('mouseout', (d) => {
           tooltip.transition()
                  .duration(300)
                  .style('opacity', 0);
       });
}

function axisUpdateLine(dataset: IMonthlySalesByCategory): void {
    // console.log(`xscale-max: ${d3.max(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.month)}`);
    // console.log(`yscale-max: ${d3.max(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.sales)}`);

    let minDate = getDate(dataset.monthlySales[0].month);
    let maxDate = getDate(dataset.monthlySales[dataset.monthlySales.length - 1].month);
    // console.log(minDate);
    // console.log(maxDate);

    let xScale = d3.scaleTime()
                   .domain([minDate, maxDate])
                   .range([axisPadding + 5, axisWidth - axisPadding]);
                //    .nice();

    let xAxisGenerator = d3.axisBottom(xScale)
                           .tickFormat(d3.timeFormat('%b'))
                           .ticks(dataset.monthlySales.length - 1);

    let yScale = d3.scaleLinear()
                   .domain([
                       0,
                       d3.max(dataset.monthlySales, (dataitem: IMonthlySale) => dataitem.sales)
                    ])
                    .range([axisHeight - axisPadding, 10]);
                    // .nice();

    let yAxisGenerator = d3.axisLeft(yScale)
                           .ticks(4);

    let axisLine = d3.line<IMonthlySale>()
                     .x((dataitem: IMonthlySale) => xScale(getDate(dataitem.month)))
                     .y((dataitem: IMonthlySale) => yScale(dataitem.sales));

    let svg = d3.select(`#svg-${dataset.category}`);

    svg.selectAll('g.y-axis')
       .call(yAxisGenerator);

    svg.selectAll('g.x-axis')
       .call(xAxisGenerator);

    svg.selectAll(`.path-${dataset.category}`)
       .transition('bounce') // linear, elastic, circle, bounce
       .duration(1000)
       .attr('d', axisLine(dataset.monthlySales));
}

d3.json('https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json',
        (error: any, data: IMonthlySalesByCategoryApiResponse) => {
            if (error) {
                console.log(error);
            } else {
                // console.log(data);
            }

            let decodedData: { contents: IMonthlySalesByCategory[] } = JSON.parse(window.atob(data.content));
            // console.log(decodedData.contents);
            decodedData.contents.forEach((dataset: IMonthlySalesByCategory) => {
                // console.log(dataset);
                showHeader(dataset);
                axisBuildLine(dataset);
            });

            d3.select('#date-option')
              .on('change', (d, i) => {
                  let sel = +(<HTMLSelectElement> d3.select('#date-option')
                                                    .node())
                                                    .value;
                  let decodedData = JSON.parse(window.atob(data.content));
                  decodedData.contents.forEach((dataset: IMonthlySalesByCategory) => {
                    dataset.monthlySales.splice(0, dataset.monthlySales.length - sel);
                    axisUpdateLine(dataset);
                  });
              });
        }
);

// #endregion

// #region Map
// sample data can be found here: https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html
// can be translated to geoJSON data here: converter.mygeodata.eu/vector
let mapWidth = 500;
let mapHeight = 300;

let projection = d3.geoAlbersUsa()
                   .translate([mapWidth / 2, mapHeight / 2])
                   .scale(500);

let mapPath = d3.geoPath()
                .projection(projection);

let mapSvg = d3.select('body')
               .append('svg')
               .attr('width', mapWidth)
               .attr('height', mapHeight);

// http://colorbrewer2.org
let color = (<any>d3.scaleLinear())
                   .range(['rgb(255,255,204)','rgb(217,240,163)','rgb(173,221,142)','rgb(120,198,121)','rgb(49,163,84)','rgb(0,104,55)']);
d3.csv('data/state-sales.csv', (data) => {
    color.domain([
        0, d3.max(data, (d: any) => d.sales)
    ]);

    d3.json('data/us.json', (json) => {
        for(let i = 0, l = data.length; i < l; i++) {
            let salesState = data[i].state;
            let salesVal = parseFloat(data[i].sales);

            for(let j = 0, k = json.features.length; j < k; j++) {
                let usState = json.features[j].properties.NAME;

                if(salesState === usState) {
                    json.features[j].properties.value = salesVal;
                    break;
                }
            }
        }

        mapSvg.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', mapPath)
            .style('fill', (d: any) => {
                let value = d.properties.value;
                return value ? color(value) : '#666';
            });
    });
});
// #endregion

// #region Map with Cities
let cityMapWidth = 500;
let cityMapHeight = 300;

let cityMapProjection = d3.geoAlbersUsa()
                          .translate([mapWidth / 2, mapHeight / 2])
                          .scale(500);

let cityMapPath = d3.geoPath()
                    .projection(projection);

let cityMapSvg = d3.select('body')
                   .append('svg')
                   .attr('width', mapWidth)
                   .attr('height', mapHeight);

// http://colorbrewer2.org
d3.json('data/us.json', (json) => {
    cityMapSvg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', cityMapPath)
        .attr('fill', '#666');

    d3.csv('data/sales-by-city.csv', (data) => {
        cityMapSvg.selectAll('circle')
                  .data(data)
                  .enter()
                  .append('circle')
                  .attr('cx', (d: any) => {
                      let a = cityMapProjection([d.lon, d.lat]);
                      return a ? a[0] : null;
                  })
                  .attr('cy', (d: any) => {
                      let a = cityMapProjection([d.lon, d.lat]);
                      return a ? a[1] : null;
                  })
                  .attr('r', (d: any) => Math.sqrt(parseInt(d.sales) * 0.00005))
                  .attr('fill', 'red');
    });
});
// #endregion