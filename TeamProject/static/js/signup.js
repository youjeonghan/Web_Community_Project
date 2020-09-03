const main_signup = document.querySelector(".main_signup");
const signup_container = document.querySelector("#signup_container");

const signup_modal = `<div class="signup_modal_back">
<div class="signup_modal">
    <div class="signup_exit">X</div>
    <div class="signup_title">
        Sign Up
    </div>
    <div>
        <span class="signup_sub">NAME</span> 
        <input type="text" id="signup_name" name="name" class="signup_input" placeholder="Name"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">ID</span>
        <input type="text" id="signup_id" name="id" class="signup_input" placeholder="ID"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">PW</span>
        <input type="password" id="signup_pw" name="pw" class="signup_input" placeholder="PW"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">Confirm PW</span>
        <input type="password" id="signup_pw2" name="pw" class="signup_input" placeholder="Confirm PW"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">Nickname</span>
        <input type="text" id="signup_nickname" name="nickname" class="signup_input" placeholder="Nickname"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">E-MAIL</span>
        <input type="text" id="signup_email" name="email" class="signup_input" placeholder="E-Mail"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">BIRTH</span>
        <input type="text" id="signup_birth" name="birth" class="signup_input" placeholder="Birth"
            autocomplete="off">
    </div>
    <div><button id="signup_btn" class="signup_btn">SIGN UP</button></div>
</div>
</div>`;


main_signup.addEventListener("click", function () {
    signup_container.innerHTML = signup_modal;

    setTimeout(() => {
        document.querySelector(".signup_modal").style.opacity ="1";
        document.querySelector(".signup_modal").style.transform ="translateY(0%) translateX(0%) rotateX(0deg)";
    }, 50);

    document.querySelector(".signup_exit").addEventListener("click", function () {
        signup_container.innerHTML = '';
    })
})



// ------------------------------ 회원가입 Fetch Api ------------------------------------
// function signup_FetchAPI_v1(){
    
//     let name = document.querySelector("#signup_name").value;
//     let id = document.querySelector("#signup_id").value;
//     let pw = document.querySelector("#signup_pw").value;
//     let pw2 = document.querySelector("#signup_pw2").value;
//     let email = document.querySelector("#signup_email").value;
//     var nick = document.querySelector("#signup_nickname").value;
//     var birth = document.querySelector("#signup_birth").value;
//     var gender = $("input[type=radio][name=gender]:checked").val();
    
//     var file;
//     if (document.querySelector(".modal_image").files.length == 0) file = '';
//     else file = document.querySelector(".modal_image").files[0];
    
//     var send_data = new FormData();
    
//     send_data.append('id', id);
//     send_data.append('pw', pw);
//     send_data.append('pw2', pw2);
//     send_data.append('email', email);
//     send_data.append('name', name);
//     send_data.append('nick', nick);
//     send_data.append('birth', birth);
//     send_data.append('gender', gender);
//     send_data.append('file', file);
    
//     fetch("/auth/sign_up",{
//         method:"POST",
//         headers:{},
//         body : send_data
//     })
//     .then(res => res.json())
//     .then(res => {
//         if(res['STATUS'] == "SUCCESS"){
//             alert("회원가입 완료! 환영합니다. "+ name + "님!");
//         }
//         else if(res['STATUS'] == "ID EXIST"){
//             alert("이미 존재하는 ID입니다.");
//         }
//         else if(res['STATUS'] == "Wrong ID"){
//             alert("사용할 수 없는 ID입니다.");
//         }
//         else if(res['STATUS'] == "BLANK ID"){
//             alert("사용할 수 없는 ID입니다.");
//         }
//         else if(res['STATUS'] == "NICK EXIST"){
//             alert("이미 존재하는 닉네임입니다.");
//         }
//         else if(res['STATUS'] == "Wrong EMAIL or NOT EMAIL FORMAT"){
//             alert("사용할 수 없는 EMAIL입니다.");
//         }
//         else if(res['STATUS'] == "PW MATCH FAIL"){
//             alert("패스워드가 일치하지 않습니다.");
//         }
//         else if(res['STATUS'] == "EMAIL EXIST"){
//             alert("이미 존재하는 EMAIL입니다.");
//         }
//         else if(res['STATUS'] == "Wrong NAME"){
//             alert("사용할 수 없는 NAME입니다.");
//         }
//         else if(res['STATUS'] == "INSERT ID"){
//             alert("ID를 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT PW"){
//             alert("PW를 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT EMAIL"){
//             alert("EMAIL을 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT NAME"){
//             alert("NAME을 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT NICK"){
//             alert("NICKNAME을 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT ID"){
//             alert("ID를 입력하세요.");
//         }
//         else if(res['STATUS'] == "LONG ID"){
//             alert("ID를 확인하세요.");
//         }
//         else if(res['STATUS'] == "SHORT ID"){
//             alert("ID를 확인하세요.");
//         }
//         else if(res['STATUS'] == "LONG PW"){
//             alert("PW를 확인하세요.");
//         }
//         else if(res['STATUS'] == "LONG EMAIL"){
//             alert("EMAIL을 확인하세요.");
//         }
//         else if(res['STATUS'] == "LONG NAME"){
//             alert("NAME을 확인하세요.");
//         }
//         else if(res['STATUS'] == "LONG NICK"){
//             alert("NICKNAME을 확인하세요.");
//         }
//         else if(res['STATUS'] == "fail"){
//             alert("알 수 없는 오류가 발생하였습니다. 다시 시도 해주세요.");
//         }
//     })
//     .catch(err => console.log(err))
// }
