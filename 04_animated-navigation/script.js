const overlay = document.getElementById("overlay");
const menuBars = document.getElementById("menu-bars");
const nav = document.getElementById("nav");
const menuItems = nav.children;

//toggle
function toggle() {
    // toggle: 메뉴바 열고닫기
    menuBars.classList.toggle('change');

    // toggle: menu active
    overlay.classList.toggle('overlay-active');

    if (overlay.classList.contains('overlay-active')) {
        // Animate in - Overlay
        overlay.classList.replace('overlay-slide-left', 'overlay-slide-right');
        // Animate in - Nav Items
        for (let i = 0; i < menuItems.length; i++) {
            menuItems[i].classList.replace(`slide-out-${i+1}`, `slide-in-${i+1}`);
        }
    } else {
        // Animate Out - Nav Items
        for (let i = 0; i < menuItems.length; i++) {
            menuItems[i].classList.replace(`slide-in-${i+1}`, `slide-out-${i+1}`);
        }
        // Animate Out - Overlay
        overlay.classList.replace('overlay-slide-right', 'overlay-slide-left');
    }
}


//Event Listeners

//menubar toggle
menuBars.addEventListener('click', toggle);

// 메뉴 아이템을 클릭하면 메뉴 닫기
for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', toggle);
}