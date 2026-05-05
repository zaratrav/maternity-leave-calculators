
function calc(){
let hours=+document.getElementById('input1').value||0;
document.getElementById('res').innerText=(hours>=1250)?"Eligible":"Not eligible";
}
