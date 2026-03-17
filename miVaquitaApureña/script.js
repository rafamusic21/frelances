const layer = document.getElementById("cow-layer");

/* posición aleatoria */
function randomPos(){
return {
x: Math.random()*90,
y: Math.random()*90
};
}

/* mover vaca */
function moveCow(cow){
const p = randomPos();
cow.style.left = p.x + "%";
cow.style.top = p.y + "%";
}

/* fuegos artificiales */
function fireworks(x,y){

for(let i=0;i<8;i++){

const spark = document.createElement("div");

spark.style.position="fixed";
spark.style.left=x+"px";
spark.style.top=y+"px";
spark.style.width="6px";
spark.style.height="6px";
spark.style.background="#3a7bfd";
spark.style.borderRadius="50%";
spark.style.pointerEvents="none";
spark.style.zIndex="10001";

const angle = Math.random()*360;
const distance = 40+Math.random()*20;

spark.animate([
{transform:"translate(0,0)",opacity:1},
{transform:`translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px)`,opacity:0}
],{
duration:600,
easing:"ease-out"
});

document.body.appendChild(spark);

setTimeout(()=>spark.remove(),600);

}

}

/* crear vacas */
function createCows(){

const total = 3;

for(let i=0;i<total;i++){

const cow = document.createElement("div");

cow.className="cow";
cow.innerHTML="🐮";

moveCow(cow);

/* movimiento automático */
setInterval(()=>{
moveCow(cow);
},8000);

/* click */
cow.addEventListener("click",()=>{

const rect = cow.getBoundingClientRect();

fireworks(
rect.left + rect.width/2,
rect.top + rect.height/2
);

cow.style.transform="scale(1.3)";

setTimeout(()=>{
moveCow(cow);
cow.style.transform="scale(1)";
},300);

});

layer.appendChild(cow);

}

}

document.addEventListener("DOMContentLoaded",createCows);