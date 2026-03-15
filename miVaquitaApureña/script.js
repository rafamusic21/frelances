const cowSVG = `
<svg viewBox="0 0 120 120">
<ellipse cx="60" cy="70" rx="40" ry="30" fill="#fff"/>
<circle cx="40" cy="60" r="10" fill="#333"/>
<circle cx="75" cy="75" r="8" fill="#333"/>
<circle cx="50" cy="60" r="4" fill="#fff"/>
<circle cx="75" cy="75" r="3" fill="#fff"/>
<ellipse cx="60" cy="50" rx="20" ry="18" fill="#fff"/>
<circle cx="52" cy="48" r="3"/>
<circle cx="68" cy="48" r="3"/>
<ellipse cx="60" cy="56" rx="6" ry="4" fill="#ffb6c1"/>
</svg>
`;

const layer = document.getElementById("cow-layer");

function randomPos(){
return {
x: Math.random()*90,
y: Math.random()*85
};
}

function moveCow(cow){
const p = randomPos();
cow.style.left = p.x+"%";
cow.style.top = p.y+"%";
}

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
spark.style.zIndex="999";

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

function createCows(){

for(let i=0;i<3;i++){

const cow = document.createElement("div");

cow.className="cow";

cow.innerHTML=cowSVG;

moveCow(cow);

cow.addEventListener("click",()=>{

const rect=cow.getBoundingClientRect();

fireworks(
rect.left+rect.width/2,
rect.top+rect.height/2
);

cow.style.transform="scale(1.2)";

setTimeout(()=>{
moveCow(cow);
cow.style.transform="scale(1)";
},300);

});

layer.appendChild(cow);

setInterval(()=>moveCow(cow),10000);

}

}

document.addEventListener("DOMContentLoaded",createCows);
