// --------------------------- slider animation --------------------------- //

let left_btn = document.querySelector(".s_btn_left");
let right_btn = document.querySelector(".s_btn_right");
let slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slide");
let bar = document.querySelector(".bar");
var index = 0;

left_btn.addEventListener("click", function () { 

    index--;
    if(index<0){
        index=slides.length-4;
        bar.style.left = 100-(100/7) + '%';
    }
    
    const move = index*-24.7;
    slider.style.left= move + "vw";

    const bar_move = index*(100/7);
    bar.style.left= bar_move + '%';

})

right_btn.addEventListener("click", function () {

    index++;
    if(index>slides.length-4){
        index=0;
        bar.style.left = "0";
    }

    const move = index*-24.7;
    slider.style.left= move + "vw";

    const bar_move = index*(100/7);
    bar.style.left= bar_move + '%';

})

