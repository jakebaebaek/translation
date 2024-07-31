
let symptoms_ul = document.querySelector('.symptoms ul');
let inputValue = document.querySelector('.sympInput');
const deleteBTN = document.querySelectorAll('#delete');
const closeBtn = document.querySelector('.windowCloseBtn');
const { spawn } = require('child_process');

spawn('py',['./googleSide.py']);

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

document.addEventListener("DOMContentLoaded", function() {
    // 웹 페이지가 로드될 때 Python 코드를 실행
    const pythonProcess = spawn('python', ['C:\Users\HillsDT12\dev\translation_DangJiN\googleSide.py']);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        document.getElementById('result').innerText = data;
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});