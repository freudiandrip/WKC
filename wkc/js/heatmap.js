//-----------------------------------------------------------------------
// D3 Script for WKC winning dogs analysis
// Lede Project 2 - July 2023
//-----------------------------------------------------------------------
let data = []
let dogCSV = "https://raw.githubusercontent.com/sherbert-lemon/public-data/master/top_dogs.csv"

d3.csv(dogCSV, function(d) {
  // data handling
  dog = {}

  dog.group = d.group
  dog.year = +d.year
  dog.breed = d.breed
  dog.name = d.dog
  dog.bis = String(d.BIS)
  dog.won = +d.won

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
    let annotatedData = [
      { year: 1925, img: "../assets/img/annotations/1925-MSG.jpg", alt : "alt text", text : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mi orci, pulvinar iaculis sodales nec, gravida sit amet sapien." },
      { year: 1930, img: "None", alt : "alt text", text : "Hound groups are officially recognized as their own separate group." },
      { year: 1937, img: "../assets/img/annotations/1937-spicypiece-bis.jpg", alt : "alt text", text : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mi orci, pulvinar iaculis sodales nec, gravida sit amet sapien." },
      { year: 1945, img: "None", alt : "alt text", text : "In addition to the great depression in the 30's, the show was also held during the war years."},
      { year: 1958, img: "../assets/img/annotations/1958-BIS-lineup.jpg", alt : "alt text", text : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mi orci, pulvinar iaculis sodales nec, gravida sit amet sapien." },
      { year: 1964, img: "../assets/img/annotations/1964-whippet-BIS.jpg", alt : "alt text", text : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mi orci, pulvinar iaculis sodales nec, gravida sit amet sapien." },
      { year: 1983, img: "None", alt : "alt text",text : "Herding breeds are officially recognized as their own separate group"},
      { year: 1988, img: "../assets/img/annotations/1988-pom-BIS.jpg", alt : "alt text", text : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mi orci, pulvinar iaculis sodales nec, gravida sit amet sapien." },
      { year: 2002, img: "../assets/img/annotations/2002-Y2K-chi.jpg", alt : "alt text", text : "The chihuahua / toy breed craze peaked in early aughts."},
      { year: 2021, img: "None", alt : "alt text", text : "Westminster's  move to Tarrytown due to the pandemic marked the first time in history the show wasn't held at MSG."}
    ]

    // svg set up
    // selecting chart
    const svgChart = d3.select('svg.heatmap')
    // selecting axis
    const svgAxis = d3.select('svg.axis')
    const padding = {
      'top' : 8,
      'left' : 20,
      'right' : 20,
      'bottom' : 36
    }
    const cellSize = 40
    const cellPadding = 8
    const chartHeight = (yearData.length * (cellSize + 4)) + padding.bottom

    svgChart
      .attr('width', 500)
      .attr('height', (d,i) => { return chartHeight })
    // svgChart.attr("viewBox", `0 0 450 ${ chartHeight }`)
    
    // y-transform scale
    const yScale = d3.scaleLinear()
      .domain(0, yearData.lenth)
      .range([chartHeight, 0])

    // making our colour scales
    const purpleScale = d3.scaleOrdinal()
      .domain(data.values, d => { return d.group })
      .range(['#E2C4FF', '#D8AEFF', '#C487FF', '#965ECD', '#69369B', '#462467', '#28153B'])

    // HELPER FUNCTIONS ###################################
    const colourFn = function (cell) {
      const win = parseInt(cell.won)
      const purpleCell = purpleScale(cell.group)

      if (win === 0) { return '#C8C8C8' }
      else if (win === 2) { return '#F7B72A' }
      else { return purpleCell }
    }

    let years = [1925, 1930, 1937, 1945, 1958, 1964, 1983, 1988, 2002, 2021]
    
    const classFn = function (year) {
      if (years.includes(+year)) { return `annotated` }
    }

    const mouseover = function(d) {
      tooltip
        .style("opacity", 1)

      d3.select(this)
        .style("stroke", "#ffffff")
        .style('stroke-width', 3)
        .style("opacity", 0.5)
    }

    const mousemove = function(d) {
      const mouseX = d3.event.pageX
      const mouseY = d3.event.pageY

      tooltip
        .style("left", `${mouseX + 20}px`)
        .style("top", `${mouseY - (cellSize + 16)}px`)
      
     if (+d.won === 0) {
        tooltip
          .html(`${d.group} group did not compete in ${d.year}.`) 
     } 
      else {
        const text = [`<b>${d.group} Group Winner</b>`,
          `<br>Breed: ${d.breed}`,
          `<br>Dog: ${d.name}`
        ]
        tooltip.html(text[0] + text[1] + text[2])
      }
    }
    
    const mouseleave = function(d) {
      tooltip
        .style("opacity", 0)

      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
    }

    // ENTERING + APPENDING -----------------------------------------
    // entering
    const chartDiv = d3.select('div.heatmap')
      
    const tooltip = chartDiv
      .append('div')
      .attr('class', 'tooltip')
    
    const group = svgChart.selectAll('g.row')
      .data(yearData, d => { return d.values })

    // each row: year text + dogs group per year
    const row = group
      .enter()
      .append('g')
      .attr('class', 'row')
      // scale transform
      .attr('transform', (d,i) => {
        const x = padding.left + cellSize
        const y = i * (cellSize + 4)

        return `translate(${x}, ${y})`
      })

    row
      .append('text')
      .attr('class', 'year')
      .attr('x', padding.left)
      .attr('y', (8 + cellSize) * 0.5)
      .text((d,i) => { return d.key })

    const dogGroup = row
      .append('g')
      .attr('class', 'group')
      .attr('class', (d,i) => classFn(d.key))
      .attr('transform', `translate(${cellSize + padding.left}, 4)`)

    // each dog group: 1 dog per cell, 7x dog cells
    const cell = dogGroup
      .selectAll('g.cell')
      .data(d => { return d.values })
      .enter()
      .append('g')
      .attr('class', 'cell')
      .attr('width', cellSize + 8)
      .attr('transform', (d,i) => { return `translate(${i * cellSize + 8}, 0)` })

    cell
      .append('rect')
      .attr('class', 'cell')
      .attr('height', cellSize)
      .attr('width', cellSize)
      .attr('fill', d => { return colourFn(d) })
      .attr('transform', (d,i) => { return `translate( ${4 * i}, 0)` })
  
    // tooltip behaviour
    cell
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    // END ENTER + APPEND ------------------------------------

    // fuck it manual axis, legend set-up -------------------------------
    //  setting up
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
      .data(yearData[0].values, d => { return d })
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('transform', (d,i) => `translate(${ i * (cellSize + 4) + (cellSize + 8) / 2 }, 0) rotate(-45)`)
      .text(d => { return d.group })

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
      .text("Group winners")
      .attr("alignment-baseline","middle")
    
    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 72)
      .text("Non-competitor")
      .attr("alignment-baseline","middle")

    //body viewport
    const bodyRect = document.body.getBoundingClientRect()
    // position of rows of interest
    const rowTags = document.querySelectorAll('g.annotated')
    const marginTop = rowTags[0].getBoundingClientRect().top - bodyRect.top // distance of element from body
    
    // looping + returning y position for translation
    rowTags.forEach( (row, i) => {
      const rowRect = row.getBoundingClientRect()
      const offset = rowRect.top - bodyRect.top - marginTop + cellSize// distance of element from parent div

      // adding as new key, value in data copy
      const item = annotatedData[i]
      item.yPos = offset 
    })
    
    // ANNOTATIONS
    annotatedData.forEach( note => {
      // defining tags
      const yPos = note.yPos
      const year = note.year
      const text = note.text
      // const imgSrc = note.img
      const noteTag = document.querySelector(`.y-${year}`)
      const textTag = noteTag.querySelector('p.annotation')
      const titleTag = noteTag.querySelector('p.year')

      // 1. positioning our annotation based on year
      noteTag.style.top = `${yPos}px`

      // 2. adding annotated text to content tag
      const yearEl = document.createTextNode(`${year}`)
      const textEl = document.createTextNode(text)
      titleTag.appendChild(yearEl)
      textTag.appendChild(textEl)
    })

  })

console.log("‧₊˚✩", "reached end of script", "✩˚₊‧")
