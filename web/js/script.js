//#######################################################
// Scrollama script 
// adapted from: https://jsoma.github.io/simplified-scrollama-scrollytelling/sticky-overlay.html
//#######################################################
// const initializing
const main = document.querySelector("div.content-wrapper");
const scrolly = main.querySelector("section#scrolly");
const sticky = scrolly.querySelector("div.sticky-thing");
const article = scrolly.querySelector("article");
const steps = article.querySelectorAll(".step");
const desktopTag = sticky.querySelector('img.desktop')
const mobileTag = sticky.querySelector('img.mobile') 

// initialize the scrollama
const scroller = scrollama();

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  const el = response.element;

  // remove is-active from all steps
  // then add is-active to this step
  steps.forEach(step => step.classList.remove('is-active'));
  el.classList.add('is-active');

  // removing url
  desktopTag.removeAttribute("src")
  mobileTag.removeAttribute("src")

  // update graphic based on step
  if (el.id === "last")  {
    desktopTag.src = "./web/assets/img/BIS-bracket-win-h.png" 
    mobileTag.src = "./web/assets/img/BIS-bracket-win-v.png" 
  }
  else { 
    desktopTag.src = "./web/assets/img/BIS-bracket-h.png" 
    mobileTag.src = "./web/assets/img/BIS-bracket-v.png" 
  }
  // removing active step after scrolling out of view.
  // steps.forEach(step => step.classList.remove('is-active'));
}

function init() {
  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      // offset: 0.33,
      debug: false 
    })
    .onStepEnter(handleStepEnter);

  // setup resize event
  window.addEventListener("resize", scroller.resize);
}

// kick things off
init()





