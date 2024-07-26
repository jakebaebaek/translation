let symptoms_ul = document.querySelector('.symptoms ul');
let inputValue = document.querySelector('.sympInput');
const symptoms_btn = document.querySelector('.CCB');
const deleteBTN = document.querySelectorAll('#delete');
const closeBtn = document.querySelector('.windowCloseBtn');

deleteBTN.forEach(e => e.innerHTML='❌')
function paintInput (e) {
    e.preventDefault();
    const appendVal = e.target[0].value;
    let li_val = validate(appendVal);
    const li = document.createElement('li');
    const deleteBTN = document.createElement('button');
    deleteBTN.id = 'deleteli'
    deleteBTN.innerHTML='❌'
    deleteBTN.style.margin='0 0 0 5px'
    li_val === false ? null :(
        li.innerHTML =  li_val,
        symptoms_ul.appendChild(li),
        li.appendChild(deleteBTN),
        inputValue.value = ""
        )
}

function validate(data) {
    data.length < 1 ? data = false : data;
    return data;
}

closeBtn.onclick = function (event) {
    window.close();
}
