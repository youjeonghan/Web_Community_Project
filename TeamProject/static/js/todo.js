const toDoForm = document.querySelector(".Board__input"),
      toDoInput = toDoForm.querySelector("input"),
      toDoList =  document.querySelector(".Board__list");

const TODOS_LS = "toDos";

let toDos = [];

function deleteToDo(event){
    // console.dir(event.target) // 이 방법으로 event.target의 부모 노드를 확인할 수 있음.
    // event.target.parentNode // event.target.parentNode는 여러 개의 버튼 중 어느 버튼이 클릭됐는지 알려준다. 정확히는, 클릭된 버튼 태드의 부모 태그를 불러온다.
    const btn = event.target; // 클릭된 버튼을 할당.
    const li = btn.parentNode; // 그리고 그 부모 태그(li)를 할당.
    toDoList.removeChild(li); // 해당 태그를 지움.
    // filter 함수는 array의 모든 요소들에 함수를 실행하고, 값이 true인 것들만 가지고 새로운 array를 만들어 반환함.
    const cleanToDos = toDos.filter(function(toDo){
        return toDo.id !== parseInt(li.id); //로컬에서 나와서 스트링임 -> 변환 
    });
    toDos = cleanToDos;
    saveToDos();
}

// to-do-list를 local storage에 저장하는 함수
function saveToDos(){
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos)); // JSON.stringify 함수를 사용해 자바스크립트 objectfmf string으로 바꿔준다.
}

function paintToDo(text){
    const li = document.createElement("li"); // li 태그를 만들어서 변수에 할당
    const delBtn = document.createElement("button"); // button 태그를 만들어서 변수에 할당
    const span = document.createElement("span"); // span 태그를 만들어서 변수에 할당
    const newId = toDos.length + 1 
    delBtn.innerText = "X"; // 버튼의 텍스트는 "X"로 설정
    delBtn.addEventListener("click", deleteToDo);
    span.innerText = text; // 사용자가 입력한 텍스트가 span태그의 텍스트가 되도록 설정
    li.appendChild(delBtn); // li 태그의 자식 태그로 버튼을 삽입
    li.appendChild(span); // li 태그의 자식 태그로 span 태그 삽입
    li.id = newId; // li태그의 id 속성을 object의 id와 같게 함.
    toDoList.appendChild(li); // 위에서 설정한 li 태그들을 최종적으로 toDoList에 삽입.
   //객ㄱ체 
    const toDoObj = {
        text : text,
        id : newId
    };
    toDos.push(toDoObj); // toDos라는 Array 안에 toDoObj 객체를 넣음.
    saveToDos();
}

function handleSubmit(event){
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
    toDoInput.value = ""; // 텍스트를 입력하고 엔터를 치면 사라지게 하기
}

function loadToDos(){
    const  loadedToDos = localStorage.getItem(TODOS_LS); // 로컬스토리지에서 키가 TODOS_LS인 값을 가져오기
    if (loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos); // JSON을 자바스크립트가 이해할 수 있는 object 데이터 형식으로 변형
        parsedToDos.forEach(function(toDo){
            paintToDo(toDo.text);
        })
    }
}

function init(){
    loadToDos();
    toDoForm.addEventListener("submit", handleSubmit);
}

init();