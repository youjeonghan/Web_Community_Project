export function handle_error(error){
    
    if(!error || !(error.res)){
        console.log(error);
        alert('에러가 발생하였습니다. 다시 시도해주세요.');
    }

}

export function check_token(token){

    if (token === null || token === undefined || token === 'undefined') return false;
    else return true;
    
}