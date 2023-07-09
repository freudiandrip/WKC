//-----------------------------------------------------------------------
// D3 Script for WKC winning dogs analysis
// Lede Project 2 - July 2023
//-----------------------------------------------------------------------
// set up SVG
padding = {
  'left' : 20,
  'right' : 20,
  'bottom' : 36
}

const svgChart = d3.select('svg.heatmap')

// set up axis
const svgAxis = d3.select('svg.axis')

let data = []

let dogCSV = "https://raw.githubusercontent.com/sherbert-lemon/public-data/master/top_dogs.csv"

d3.csv(dogCSV, function(d) {
  // data handling
  dog = {}

  dog.group = d.group,
  dog.year = +d.year,
  dog.breed = d.breed,
  dog.name = d.name,
  dog.bis = d.BIS,
  dog.won = d.won

  data.push(dog)
}) // d3 magic goes here
  .then( function() {
    // grouping by years
    const groupedData = d3.nest()
      .key(d => {return d.year})
      .entries(data)
    
    // sorting
    const yearData = groupedData.slice().sort(function (a, b) {
      return d3.ascending(a.key, b.key)
    })

    // svg set up
    const cellSize = 40

   svgChart
    .attr('width', 500)
    .attr('height', (d,i) => { return yearData.length * (cellSize + 4) + padding.bottom })
    // svgChart.attr("viewBox", `0 0 500 ${ years.length * cellSize }`)
   
    // making our colour scales
    const purpleScale = d3
      .scaleOrdinal()
      .domain(data.values, d => { console.log(d.group); return d.group })
      .range(['#E2C4FF', '#BBA6CF', '#D1A2FF', '#A46ADC', '#69369B', '#462467', '#28153B'])

    const colourFn = function (cell) {
      const win = parseInt(cell.won)

      if (win === 0) { return '#C8C8C8' }
      else if (win === 2) { return '#F7B72A' }
      else { return purpleScale(cell.group) }
    }

    // ENTERING + APPENDING -----------------------------------------
    // entering
    const group = svgChart.selectAll('g.row')
      .data(yearData)

    // each row: year text + dogs group per year
    const row = group
      .enter()
      .append('g')
      .attr('class', 'row')
      .attr('transform', (d,i) => { return `translate(${padding.left + cellSize}, ${i * (cellSize + 4)})` })

    row
      .append('text')
      .attr('class', 'year')
      .attr('x', padding.left)
      .attr('y', cellSize * 0.5)
      .text((d,i) => { return d.key })
    
    const dogGroup = row
      .append('g')
      .attr('class', 'group')
      .attr('transform', `translate(${cellSize + padding.left}, 0)`)

    // each dog group: 1 dog per cell, 7x dog cells 
    const cell = dogGroup
      .selectAll('g.cell')
      .data(d => { return d.values })
      .enter()
      .append('g')
      .attr('class', 'cell')
      .attr('height', cellSize + 8)
      .attr('width', cellSize + 8)
      .attr('transform', (d,i) => { return `translate(${i * cellSize + 8}, 0)` })

    cell
      .append('rect')
      .attr('height', cellSize)
      .attr('width', cellSize)
      .attr('fill', d =>{ return colourFn(d) })
      .attr('transform', (d,i) => { return `translate( ${4 * i}, 0)` })



})









console.log("‧₊˚✩", "reached end of script", "✩˚₊‧")
