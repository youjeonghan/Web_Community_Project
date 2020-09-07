var drop = document.getElementById('drag_drop');
drop.ondragover = function(event) {
  event.preventDefault(); // 이 부분이 없으면 ondrop 이벤트가 발생하지 않습니다.
};
drop.ondrop = function(event) {
  event.preventDefault(); // 이 부분이 없으면 파일을 브라우저 실행해버립니다.
  var data = event.dataTransfer;
  const MAX_FILE = 5;
  if(data.items.length > MAX_FILE){
    alert(`이미지는 최대 ${MAX_FILE}개 까지 등록가능합니다`);
    return;
  }
  if (data.items) { // DataTransferItemList 객체 사용
    for (var i = 0; i < data.items.length; i++) { // DataTransferItem 객체 사용
      if (data.items[i].kind == "file") { //kind는 file인지 string인지 알려준다 
        var file = data.items[i].getAsFile();
        alert(file.name);
      }
    }
  } else { // File API 사용
    for (var i = 0; i < data.files.length; i++) {
      alert(data.files[i].name);
    }
  }
};