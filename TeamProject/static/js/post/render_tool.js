
/*tag 생성기 , A = 속성 ,B = 속성정보 , C= textNode*/
const get_htmlObject = (tag,A,B,C)=>{
	const object = document.createElement(`${tag}`);
	for (var i = 0; i <= A.length - 1; i++) {
		object.setAttribute(`${A[i]}`,`${B[i]}`);
	}
	if(C != undefined){
		const textNode = document.createTextNode(`${C}`);
		object.appendChild(textNode);
	}
	return object;
}