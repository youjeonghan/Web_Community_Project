// --------------------------- slider animation --------------------------- //

let left_btn = document.querySelector(".s_btn_left");
let right_btn = document.querySelector(".s_btn_right");
let slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slide");
let dots = documnet.querySelectorAll(".box");
var index = 0;

left_btn.addEventListener("click", function () { 

    index--;
    if(index<0){
        index=slides.length-4;
    }
    
    const move = index*-24.5;
    slider.style.left= move + "vw";


})

right_btn.addEventListener("click", function () {

    index++;
    if(index>slides.length-4){
        index=0;
    }

    const move = index*-24.5;
    slider.style.left= move + "vw";
})

