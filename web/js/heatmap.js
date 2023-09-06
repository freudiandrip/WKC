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
    // data for annotations
    let annotatedData = [
      { year: 1925, img: "../web/assets/img/annotations/1925-MSG.jpg", alt : "Madison square garden from 1890 to 1925", text : "1924 marked the first year breeds were grouped, standardizing the judging process. Pictured is MSG from 1890 - 1925; MSG moved to 8th & 49th in 1926, where the show would be held until 1968."},
      { year: 1930, img: "None", alt : "alt text", text : "Hound breeds are officially recognized as their own separate group."},
      { year: 1937, img: "../web/assets/img/annotations/1937-spicypiece-bis.jpg", alt : "A vintage poster of 1937's best in show winner, spicy piece", text : "A vintage poster depicting 1937's champion, Spicy Piece the Wire Fox Terrier. The Terrier Group dominated Best in Show wins, with 10 titles over the last 14 shows." },
      { year: 1945, img: "None", alt : "alt text", text : "In addition to WW1 and the Great Depression, the show was held throughout the entirety of the second World War."},
      { year: 1958, img: "../web/assets/img/annotations/1958-BIS-lineup.jpg", alt : "a black and white photo of the finalists line-up, 1958", text : "The finalists line-up for Westminster's 81st Best in Show." },
      { year: 1964, img: "../web/assets/img/annotations/1964-whippet-BIS.jpg", alt : "Ricky looking pleased after winning best in show", text : "Ricky, a Whippet from the Hound Group took home 1965's BIS. He was the second hound and the only whippet to have won the title."},
      { year: 1977, img: "None", alt : "alt text", text : "The Centennial Westminster Dog Show took place on February 15th, 1977."},
      { year: 1983, img: "None", alt : "alt text", text : "Herding breeds are officially recognized as their own separate group."},
      { year: 1988, img: "../web/assets/img/annotations/1988-pom-BIS.jpg", alt : "a tiny dog named prince sitting in his trophy", text : "Prince, a Pomeranian from the Toy Group, was named Best in Show. The trophies and cups (which Prince is sitting in) are made of sterling silver and were at one point provided by Tiffany."},
      { year: 2002, img: "../web/assets/img/annotations/2002-Y2K-chi.jpg", alt : "paris hilton and her chihuahua, tinkerbell", text : "The chihuahua / toy breed craze peaked in early aughts."},
      { year: 2021, img: "None", alt : "alt text", text : "Westminster's  move to Tarrytown due to the pandemic marked the first time in history the show wasn't held at MSG."}
    ]
    // svg set up
   // const initializing 
    const padding = {
      'top' : 8,
      'left' : 24,
      'right' : 24,
      'bottom' : 36
    }
    const cellSize = 40
    const cellPadding = 8
    const chartHeight = (yearData.length * (cellSize + 4)) + padding.bottom

    // selecting chart
    const svgChart = d3.select('svg.heatmap')

    svgChart.attr("viewBox", `0 0 400 ${ chartHeight }`)

    // selecting axis
    const svgAxis = d3.select('svg.axis')
    
    // y-transform scale
    const yScale = d3.scaleLinear()
      .domain(0, yearData.lenth)
      .range([chartHeight, 0])

    // making our colour scales
    const purpleScale = d3.scaleOrdinal()
      .domain(data.values, d => { return d.group })
      // single purple heatmap (categorical)
      .range(['#9E95A8'])
      // for heatmap with gradient (quantifiable)
      // .range(['#E2C4FF', '#D8AEFF', '#C487FF', '#965ECD', '#69369B', '#462467', '#28153B'])

    // HELPER FUNCTIONS ###################################
    const colourFn = function (cell) {
      const win = parseInt(cell.won)
      const purpleCell = purpleScale(cell.group)

      if (win === 0) { return '#C8C8C8' }
      else if (win === 2) { return '#F7B72A' }
      else { return purpleCell }
    }

    let years = [1925, 1930, 1937, 1945, 1958, 1964, 1977, 1983, 1988, 2002, 2021]
    
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
        .style("left", `${mouseX + 24}px`)
        .style("top", `${mouseY - 2 * (8 +cellSize)}px`)
      
     if (+d.won === 0) {
        tooltip
          .html(`${d.group} group did not compete in ${d.year}.`) 
     } 
      else {
        const text = [`<b>${d.group} Group Winner</b>`,
          `<br>Breed: ${d.breed}`,
          `<br>Dog: ${d.name}`,
          `<br>Won Best in Show: ${d.bis}`
        ]
        tooltip.html(text[0] + text[1] + text[2] +text[3])
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
        const x = padding.left 
        const y = i * (cellSize + 4)

        return `translate(${x}, ${y})`
      })

    row
      .append('text')
      .attr('class', 'year')
      .attr('x', 0)
      .attr('y', (8 + cellSize) * 0.5)
      .text((d,i) => { return d.key })

    const dogGroup = row
      .append('g')
      .attr('class', 'group')
      .attr('class', (d,i) => classFn(d.key))
      .attr('transform', `translate(${cellSize}, 4)`)

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
      .attr('width', 400)
      .attr('height', 88)

    // calling xAxis
    const xAxisGroup = svgAxis
      .append('g')
      .attr('class', 'xAxis')
      .attr('width', (d, i) => { return i * 48 + 8})
      .attr('transform', `translate(${cellSize}, 80)`)

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

    // legend.attr("viewBox", "0 0 120 88")

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
      // class added for gradient fill
      // .attr('class', 'dogs') 
      .style("fill", "#9E95A8")

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
      // const offset = rowRect.top - bodyRect.top - marginTop - cellSize / 2 // distance of element from parent div
      const offset = rowRect.top - bodyRect.top - marginTop + cellSize // distance of element from parent div

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
      const alt = note.alt

      const noteTag = document.querySelector(`.y-${year}`)
      const textTag = noteTag.querySelector('p.annotation')
      const titleTag = noteTag.querySelector('p.year')
      const imgTag = noteTag.querySelector('img')

      // 1. positioning our annotation based on year
      noteTag.style.top = `${yPos}px`

      // 2. adding annotated text to content tag
      const yearEl = document.createTextNode(`${year}`)
      const textEl = document.createTextNode(text)
      titleTag.appendChild(yearEl)
      textTag.appendChild(textEl)

      // 3. adding alt text
      if (imgTag !== null) {
        imgTag.alt = alt
      }
    })

  })

console.log("‧₊˚✩", "reached end of script", "✩˚₊‧")
