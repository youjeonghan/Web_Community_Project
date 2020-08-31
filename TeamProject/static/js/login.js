const main_login = document.querySelector(".main_login");
const login_container = document.querySelector("#login_container");
const login_modal = `
<div class="login_modal_back">
    <div class="login_modal">
        <div class="login_exit">X</div>
        <div class="login_title">
        Login
        </div>
        <div>
            <input type="text" id="login_id" name="id" class="login_input" placeholder="Enter Your ID"
                autocomplete="off">
        </div>
        <div>
            <input type="password" id="login_pw" name="pw" class="login_input" placeholder="Enter Your PW"
                autocomplete="off">
        </div>
        <div><button id="login_btn" class="login_btn">LOGIN</button></div>
    </div>
</div>`;

main_login.addEventListener("click", function () {
    login_container.innerHTML = login_modal;
    
    setTimeout(() => {
        document.querySelector(".login_modal").style.opacity ="1";
        document.querySelector(".login_modal").style.transform ="translateY(0%) translateX(0%) rotateX(0deg)";
    }, 50);

    document.querySelector(".login_exit").addEventListener("click", function () {
        login_container.innerHTML = '';
    })
})



// function login_FetchAPI() {

//     const id = document.querySelector("#login_id").value;
//     const pw = document.querySelector("#login_pw").value;

//     const send_data ={
//         'id' : id,
//         'pw' : pw
//     };

//     fetch('/auth/login', {
//         method : "POST",
//         headers : {
//             'Content-Type': "application/json"
//         },
//         body : JSON.stringify(send_data)
//     })
//     .then(res => res.json())
//     .then((res) => {
//         if(res['STATUS']=="SUCCESS"){        
//             sessionStorage.setItem('access_token', "Bearer "+res['access_token']);
//             window.location.href="/";
//         }
//         else if(res['STATUS'] == "INCORRECT ID"){
//             alert("존재하지 않는 ID입니다.");
//         }
//         else if(res['STATUS'] == "INCORRECT PW"){
//             alert("비밀번호를 확인해주세요.");
//         }
//     })
// }
