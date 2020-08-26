const form = document.getElementById("form");
const password1 = document.getElementById("password1");
const password2 = document.getElementById("password2");
const messageContainer = document.querySelector('.message-container');
const message = document.getElementById('message');

let isValid = false;
let passwordsMatch = false;

function validateForm() {
    // Using Constraint API
    isValid = form.checkValidity();
    if (isValid == false) {
        // 에러메시지 element 꾸미기
        message.textContent = "Please fill out all fields.";
        message.style.color = 'red';
        messageContainer.style.borderColor = 'red';
        return false;
    }
    // 패스워드 일치하는지 확인
    if (password1.value === password2.value) {
        passwordsMatch = true;
        password1.style.borderColor = 'green';
        password2.style.borderColor = 'green';
    } else {
        passwordsMatch = false;
        message.textContent = "Make sure passwords match";
        message.style.color = 'red';
        messageContainer.style.borderColor = 'red';
        password1.style.borderColor = 'red';
        password2.style.borderColor = 'red';
        return false;
    }

    // 모든 입력이 기준에 일치할 경우
    if (isValid && passwordsMatch) {
        message.textContent = "Successfully Registered!";
        message.style.color = 'green';
        messageContainer.style.borderColor = 'green';
        return true;
    }
}

// 통과한 데이터 저장하기
function storeFormData() {
    const user = {
        name: form.name.value,
        phone: form.phone.value,
        email: form.email.value,
        website: form.url.value,
        password: form.password.value
    };
    console.log(user);
}

// 데이터 프로세스
function processFormData(e) {
    // 서버에 제대로 보내지지 않으면, 자동으로 새로고침하는 것이 디폴트
    e.preventDefault();
    // validate form
    result = validateForm();
    // store user data
    if (result) {
        storeFormData();
    } else {
        console.log('error');
    }
}
// Event Listener

form.addEventListener('submit', processFormData);