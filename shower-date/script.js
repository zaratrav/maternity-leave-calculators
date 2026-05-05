
function calc(){
let d=new Date();
d.setDate(d.getDate()+210);
document.getElementById('res').innerText="Suggested date: "+d.toDateString();
}
