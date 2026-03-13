let index = 0;

function update(){

const track = document.getElementById("track");
track.style.transform = `translateX(-${index*99}%)`;

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