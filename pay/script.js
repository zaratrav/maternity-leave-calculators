
function calc(){
let salary=+document.getElementById('input1').value||0;
let pay=salary*0.6;
document.getElementById('res').innerText="Estimated pay: "+pay.toFixed(2);
}
