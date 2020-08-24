const toggleSwitch = document.querySelector('input[type="checkbox"]');
const toggleIcon = document.getElementById('toggle-icon');
const nav = document.getElementById('nav');
const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');
const image3 = document.getElementById('image3');
const textBox = document.getElementById('text-box');


function changeMode(input) {
    // css data-theme 바꿔줌
    document.documentElement.setAttribute("data-theme", input);

    // 모드가 dark인 경우, 무조건 스위치 on
    if (input == 'dark') {
        toggleSwitch.checked = true;
    }

    /*
    아래부분 ternary condition으로 바꿔줘도 됨
    ex) nav.style.backgroundColor = (input == 'dark') ? 'rgb(0 0 0 / 50%)': 'rgb(255 255 255 / 50%)';
    */

    // 기타 element css 바꿔줌 
    const dark = ['rgb(0 0 0 / 50%)', 'rgb(255 255 255 / 50%)', 'Dark Mode', 'fa-sun', 'fa-moon', 'dark'];
    const light = ['rgb(255 255 255 / 50%)', 'rgb(0 0 0 / 50%)', 'Light Mode', 'fa-moon', 'fa-sun', 'light'];

    mode = (input == 'dark') ? dark : light;

    nav.style.backgroundColor = mode[0];
    textBox.style.backgroundColor = mode[1];
    toggleIcon.children[0].textContent = mode[2];
    toggleIcon.children[1].classList.replace(mode[3], mode[4]);
    image1.src = `img/undraw_proud_coder_${mode[5]}.svg`;
    image2.src = `img/undraw_feeling_proud_${mode[5]}.svg`;
    image3.src = `img/undraw_conceptual_idea_${mode[5]}.svg`;

}

// Switch Theme Dynamically
function switchTheme(event) {
    if (event.target.checked) {
        // switch를 on 이벤트 발생한경우
        localStorage.setItem('theme', 'dark');
        changeMode('dark');
    } else {
        // switch off 이벤트 발생한경우
        localStorage.setItem('theme', 'light');
        changeMode('light');
    }
}

// Event Listener
toggleSwitch.addEventListener('change', switchTheme);

// Check Local Storage For theme
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    changeMode(currentTheme);
}