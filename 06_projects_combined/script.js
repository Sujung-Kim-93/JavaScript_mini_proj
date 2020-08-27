const menuBar = document.getElementById('menu-bar');
const favoritesButton = document.getElementById('favorites-button');
const favoritesContainer = document.getElementById('favorites-container');
const favoritesBar = document.getElementById('favorites-bar');
const nav = document.getElementById('nav');
const menus = nav.getElementsByTagName('li');
const contactMenu = menus[menus.length - 1];
const contact = document.getElementById('contact');
const form = document.querySelector('form');
const success = document.querySelector('.success');
const contactCloseButton = document.getElementById('contact-close-button');
const body = document.querySelector("body");
const lightDarkButton = document.getElementById('light-dark-mode-button');
const lightDarkStorage = window.localStorage.getItem("theme-data");
const products = document.getElementById('products');

let isNavOpen = false;
let isContactOpen = false;
let isDarkMode = false;
let tryCount = 0;
let ready = false;
let wholeData = {};

const productLimit = 90;
let loadedPhotos = 0;
const count = 30;
const query = 'product';
const orientation = 'portrait';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=asYkkY8DcWuYrsLy7QhwumK6L-vOfruCxsib1XZEL4E&count=${count}&query=${query}&orientation=${orientation}`;


//menubar toggle function
function menuBarToggle() {
    menuBar.classList.toggle("change");
    if (!isNavOpen) {
        nav.classList.add('open');
        isNavOpen = true;
    } else {
        nav.classList.remove('open');
        isNavOpen = false;
    }
}

// light/dark mode toggle function
function lightDarkMode(mode) {
    if (mode == 'light') {
        isDarkMode = false;
        document.documentElement.setAttribute("theme-data", "light");
        window.localStorage.setItem("theme-data", "light");
        lightDarkButton.innerHTML = '<div><i class="fas fa-sun"></i> Light Mode On</div>';

    } else if (mode == 'dark') {
        isDarkMode = true;
        document.documentElement.setAttribute("theme-data", "dark");
        window.localStorage.setItem("theme-data", "dark");
        lightDarkButton.innerHTML = '<div><i class="fas fa-moon"></i> Dark Mode On</div>';
    }
}

// product infinite scroll

// 제품사진 html element로 업로드
function displayPhotos(data) {

    data.forEach((item) => {
        loadedPhotos += 1;

        // 추가된 적 없는 정보라면 사진정보 wholeData 전역변수에 추가
        if (wholeData[item['id']] == undefined) {
            wholeData[item['id']] = item;
        }

        // html element 생성
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.setAttribute('href', item.links.html);
        link.setAttribute('target', '_blank');
        const img = document.createElement('img');
        img.setAttribute('src', item.urls.regular);
        img.setAttribute('alt', item.alt_description);

        // like버튼 추가
        const likeButton = document.createElement('button');
        likeButton.setAttribute('onclick', `liked(this,'${item['id']}')`);

        likeButton.innerHTML = '<i class="far fa-heart"></i>';

        // append
        link.appendChild(img);
        listItem.append(likeButton, link);
        products.querySelector('ul').appendChild(listItem);

    });

    ready = true;

}
// db에서 사진데이터 가져오기
async function getPhotos() {

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        //console.log(data);
        displayPhotos(data);
    } catch (error) {
        console.log(error);
        if (tryCount >= 10) {
            console.log('Stopped retrying');
        } else {
            //재귀
            //getPhotos();
        }
    }

}

// like버튼 설정
function liked(elem, id) {

    // data 찾기
    const foundData = wholeData[id];
    // localStorage favorites 가져오기
    let favorites = {};

    if (localStorage.getItem('favorites') != null) {
        favorites = JSON.parse(localStorage.getItem('favorites'));
    }

    // favorites에 data 추가
    favorites[id] = foundData;
    // localStorage에 저장
    localStorage.setItem('favorites', JSON.stringify(favorites));
    // localStorage콘솔에표시
    console.log(localStorage);
    // 성공하면 heart solidheart로 바꾸기
    elem.children[0].classList.replace('far', 'fas');
    elem.children[0].style.color = 'rgb(202, 30, 0)';
}

// favorite 바에 아이템 리스트 보여주는 기능
function showFavorite() {

    // open favoritescontainer
    favoritesContainer.hidden = false;

    // 다 비우기
    favoritesBar.textContent = '';

    // favorites에 아이템이 있는 경우
    if (localStorage.getItem('favorites') != null && localStorage.getItem('favorites') != '{}') {

        // localStrage 가져오기
        // console.log(localStorage.getItem('favorites'));
        const stored = JSON.parse(localStorage.getItem('favorites'));

        Object.values(stored).forEach((item) => {
            //console.log(item)
            // element생성
            const lst = document.createElement('li');
            const delButton = document.createElement('button');
            delButton.innerHTML = '<i class="far fa-trash-alt"></i>';
            // trash버튼 이벤트추가하기
            delButton.setAttribute('onclick', `cancelFavorite('${item["id"]}')`);
            const link = document.createElement('a');
            link.href = item.links.html;
            const img = document.createElement('img');
            img.src = item.urls.thumb;
            img.alt = item.alt_description;
            const info = document.createElement('div');
            info.classList.add('information');
            const productId = document.createElement('div');
            productId.classList.add('product-id');
            productId.textContent = item["id"];
            const productName = document.createElement('div');
            productName.classList.add('product-name');
            productName.textContent = item.description;
            const productDescription = document.createElement('div');
            productDescription.classList.add('product-description');
            productDescription.textContent = item.alt_description;
            const productColor = document.createElement('div');
            productColor.classList.add('product-color');
            const color1 = document.createElement('div');
            color1.classList.add('color1');
            const color2 = document.createElement('div');
            color2.classList.add('color2');
            const color3 = document.createElement('div');
            color3.classList.add('color3');
            const productStock = document.createElement('div');
            productStock.classList.add('product-stock');
            productStock.innerText = `stock : ${item.likes}`;

            // append
            productColor.append(color1, color2, color3);
            info.append(productId, productName, productDescription, productColor, productStock);
            link.append(img, info);
            lst.append(delButton, link);
            favoritesBar.append(lst);
        });
    } else {
        const lst = document.createElement('li');
        const message = document.createElement('span');
        message.innerText = "No items are liked";
        lst.appendChild(message);
        favoritesBar.append(lst);
    }
}
// favorite delete 버튼 설정
function cancelFavorite(id) {

    const stored = JSON.parse(localStorage.getItem('favorites'));
    //console.log(stored[`${id}`]);
    delete stored[`${id}`];
    localStorage.setItem('favorites', JSON.stringify(stored));
    showFavorite();

}

//eventlisteners


// 메뉴바 열고 닫기 이벤트
menuBar.addEventListener('click', menuBarToggle);
for (let i = 0; i < menus.length; i++) {
    menus[i].addEventListener('click', menuBarToggle);
}

// 메뉴목록에서 contact us 누르면 팝업오픈
contactMenu.addEventListener('click', () => {
    contact.classList.toggle('close');
});

// 닫기 버튼으로 contact us 끄기
contactCloseButton.addEventListener('click', () => {
    contact.classList.toggle('close');
});

// 스크롤이 화면 끝까지 오면 contact us 자동로드
window.addEventListener('scroll', () => {
    let scrollBottom = document.body.offsetHeight - window.innerHeight - window.scrollY; //스크롤바텀값
    //console.log(scrollBottom)
    if (scrollBottom <= 0 && contact.classList.contains('close')) {
        contact.classList.toggle('close');
    }
});

//light-dark mode 변경
lightDarkButton.addEventListener('click', () => {
    if (!isDarkMode) {
        lightDarkMode('dark');
    } else {
        lightDarkMode('light');
    }
});

// 스크롤이 밑에서부터 700px위치이고 productLimit에 도달하지 않았으면 사진 재로드
/*
window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 800 && loadedPhotos < productLimit && ready) {
        // ready 기능 꼭 넣어야됨
        ready = false;
        getPhotos();
        //console.log('getPhotos');
    }
});
*/

// favorite 보여주기
favoritesButton.addEventListener('click', showFavorite);

// contact us 데이터처리
function sendData(e) {
    // 폼 기본 refresh 기능 없애기
    e.preventDefault();
    if (form.checkValidity()) {
        // 데이터 콘솔에 출력
        const data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            title: form.title.value,
            content: form.content.value
        };
        console.log(data);
        // 서버에 잘 도착했는지 확인(추후)
        // sent successfully 메시지 보내기
        form.classList.add('close');
        success.classList.remove('close');

        // sent successfully 싸인 2초간 보여주고 닫기
        setTimeout(() => {
            contact.classList.add('close');
            form.classList.remove('close');
            success.classList.add('close');
            // 폼 리셋
            form.reset();
        }, 1000);

    }
}

// contact us submit
form.addEventListener('submit', sendData);

// on load

if (lightDarkStorage == 'dark') {
    lightDarkMode('dark');
} else {
    lightDarkMode('light');
}

//localStorage.removeItem('favorites');
// getPhotos();

/*
ReferenceError: id is not defined
    at script.js:66
    at Array.forEach (<anonymous>)
    at displayPhotos (script.js:62)
    at getPhotos (script.js:93)
*/