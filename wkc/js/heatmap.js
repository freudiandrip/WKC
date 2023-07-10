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

// selecting chart
const svgChart = d3.select('svg.heatmap')

// selecting axis
const svgAxis = d3.select('svg.axis')

let data = []

let dogCSV = "https://raw.githubusercontent.com/sherbert-lemon/public-data/master/top_dogs.csv"

d3.csv(dogCSV, function(d) {
  // data handling
  dog = {}

  dog.group = d.group,
  dog.year = +d.year,
  dog.breed = d.breed,
  dog.name = d.dog,
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
      .range(['#E2C4FF', '#D8AEFF', '#C487FF', '#965ECD', '#69369B', '#462467', '#28153B'])

    const colourFn = function (cell) {
      const win = parseInt(cell.won)
      const purpleCell = purpleScale(cell.group)

      if (win === 0) { return '#C8C8C8' }
      else if (win === 2) { return '#F7B72A' }
      else { return purpleCell }
    }
    
    // fuck it manual axis, legend set-up
    // const groupsList = [
    //   'Sporting',
    //   'Working',
    //   'Terrier',
    //   'Toy',
    //   'Non-Sporting',
    //   'Hound',
    //   'Herding'
    // ]

    // const groupScale = d3.scalePoint()
    //   // .domain(data.values, d => { console.log(d.group); return d.group })
    //   .domain(groupsList)
    //   .range([60, (48 * 7) + 8 + padding.right])

    svgAxis
      .attr('width', 452)
      .attr('height', 88)

    // calling xAxis
    const xAxisGroup = svgAxis
      .append('g')
      .attr('class', 'xAxis')
      .attr('width', (d, i) => { return i * 48 + 8})
      .attr('transform', `translate(${(48 * 2) + padding.left }, 80)`)

    xAxisGroup
      .selectAll('text.label')
      .data(yearData[0].values, d => { console.log(d); return d })
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('transform', (d,i) => `translate(${ i * (cellSize + 4) + (cellSize + 8) / 2 }, 0) rotate(-45)`)
      .text(d => { return d.group })
    
    // const xAxis = d3.axisTop(groupScale)

    // xAxisGroup.call(xAxis)

    // legend
    const legend = d3
      .select('svg.legend')
      .attr('width', 120)
      .attr('height', 88)

    legend
      .append("circle")
      .attr("cx", 12)
      .attr("cy", 16)
      .attr("r", 6)
      .style("fill", "#F7B72A")
      
    legend
      .append("circle")
      .attr("cx", 12)
      .attr("cy", 44)
      .attr("r", 6)
      .attr('class', 'dogs') 
    
    legend
      .append("circle")
      .attr("cx", 12)
      .attr("cy", 72)
      .attr("r", 6)
      .style("fill", "#C8C8C8")
    
    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 16)
      .text("Best in show")
      .attr("alignment-baseline","middle")
    
    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 44)
      .text("Dog groups")
      .attr("alignment-baseline","middle")
    
    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 72)
      .text("Non-competitor")
      .attr("alignment-baseline","middle")

    // ENTERING + APPENDING -----------------------------------------
    // entering
    const group = svgChart.selectAll('g.row')
      .data(yearData, d=> { return d.values })

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
      .attr('y', (8 + cellSize) * 0.5)
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

    const tooltip = cell  
      .selectAll('g.tooltip')
      
    tooltip
      .append('g')
      .attr('class', 'tooltip')
    
    tooltip
      .append('rect')
      .attr('class', 'tooltip')
      .attr('width', 100)
      .attr('height', 100)
      .attr('fill', '#ff0000')

})









console.log("‧₊˚✩", "reached end of script", "✩˚₊‧")
