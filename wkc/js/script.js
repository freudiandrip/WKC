console.log('script loading!')


//body viewport
const bodyRect = document.body.getBoundingClientRect()
// position of rows of interest
const rowTags = document.querySelectorAll('.annotated')
var annotationsList = []

// looping + returning y position for translation
rowTags.forEach(row => {
  const rowRect = row.getBoundingClientRect()
  const offset = rowRect.top - bodyRect.top
  console.log(offset)
  // adding as new key, value in data copy
  annotationsList = annotatedData.map(x => {return x.yPos = offset })
})

// positioning function
const repositionFn = function(year) {

}



// ANNOTATIONS
annotatedData.forEach( note => {
  const year = note.year
  const yearTag = document.querySelector(`.y-${year}`)
  const imgTag = yearTag.querySelector('img')
  const textTag = yearTag.querySelector('p.content') 
  
  

  const text = document.createTextNode('hello world')
  textTag.appendChild(text)

  
})
  // .then ( function (d) {
  //   console.log('world')
  
  // }










