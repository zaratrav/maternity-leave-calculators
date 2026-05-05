
function calc(){
let monthly=+document.getElementById('input1').value||0;
document.getElementById('res').innerText="Estimated yearly cost: "+(monthly*12);
}
