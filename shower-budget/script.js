
function calc(){
let guests=+document.getElementById('input1').value||0;
let cost=guests*20;
document.getElementById('res').innerText="Estimated budget: "+cost;
}
