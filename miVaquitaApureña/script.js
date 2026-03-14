let index = 0;

function update(){

const track = document.getElementById("track");
track.style.transform = `translateX(-${index*100}%)`;

}

function next(){

const total = document.querySelectorAll(".product").length;

index++;

if(index >= total){
index = 0;
}

update();

}

function prev(){

const total = document.querySelectorAll(".product").length;

index--;

if(index < 0){
index = total - 1;
}

update();

}

function generarVacas(){

    const totalVacas = 4;
    
    for(let i=0;i<totalVacas;i++){
    
    const vaca = document.createElement("div");
    
    vaca.classList.add("cow");
    
    vaca.innerHTML = "🐮";
    
    vaca.style.left = Math.random()*90 + "%";
    vaca.style.top = Math.random()*90 + "%";
    
    vaca.style.animationDelay = Math.random()*5 + "s";
    
    document.body.appendChild(vaca);
    
    }
    
    }
    
    generarVacas();