const slider = document.querySelector('div#slider');
const right = document.querySelector('div#right');
const left = document.querySelector('div#left');

/*const balls = document.querySelector('div#balls');
for(let a = 1 ; a<=slider.children.length ; a++){
  let element = document.createElement('div');
  element.classList.add("ball");
  balls.appendChild(element);
}*/

right.addEventListener("click", event => {
  let scroll = (slider.scrollWidth -slider.scrollLeft)*slider.children.length;
  console.log(scroll);
  console.log(slider.scrollLeft)
  console.log(slider.scrollWidth)
  
  slider.scrollBy(300, 0);
})

left.addEventListener("click", event => {
  slider.scrollBy(-300, 0);
})

slider.addEventListener("wheel", event => {
  if(event.deltaY > 0){
    event.target.scrollBy(300, 0);
  }else{
    event.target.scrollBy(-300, 0);
  }
});

document.addEventListener("keydown", event => {
  const keyPressed = event.key;
  const move = moveSlider()[keyPressed];
  move();
})

function moveSlider(){
  const acceptMoves = {
    ArrowUp() {
      slider.scrollBy(300, 0);
    },  
    ArrowDown() {
      slider.scrollBy(-300, 0);
    },
    ArrowRight() {
      slider.scrollBy(300, 0);
    },
    ArrowLeft() {
      slider.scrollBy(-300, 0);
    }
  } 
  return acceptMoves;
}