// html elements, 전역변수들
const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let errorCount = 0;
let initialLoad = true;

// API variables
// GET /photos/random
//https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY
const apiKey = 'asYkkY8DcWuYrsLy7QhwumK6L-vOfruCxsib1XZEL4E';
// UX를 위해 처음 로딩할 때는 5개만 일단 로드
let count = 5;

// 모든 이미지가 로딩되었는지 확인하는 함수
function imageLoaded() {
    imagesLoaded += 1;

    if (imagesLoaded == totalImages) {
        ready = true;
        // loader 숨기기
        loader.hidden = true;

        if (initialLoad) {
            // 두번째 로딩부터는 30개씩 로드
            count = 30;
            initialLoad = false;
        }
    }
}

// 설정할 attribute 여러개 일 때 한꺼번에 할 수 있도록 도와주는 Helper function
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// 사진경로, 링크 element만들어 image container에 추가
function displayPhotos() {
    totalImages = photosArray.length;
    imagesLoaded = 0;

    photosArray.forEach(photo => {
        // a 링크 = unsplash연결
        const item = document.createElement('a');
        //item.setAttribute('href', photo.links.html);,...
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });

        // img 원소 만들기
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        // 각각의 img태그 이미지가 로딩되었는지 확인

        img.addEventListener('load', imageLoaded);

        // img태그를 a태그에 추가
        item.appendChild(img);

        // 완성된 a태그를 imageContainer에 추가
        imageContainer.appendChild(item);
    });

}

//unsplash API에서 랜덤으로 사진 가져오기
async function getPhotos() {
    try {
        // 데이터 받기
        // count에 맞춰 apiUrl 설정
        let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
        const response = await fetch(apiUrl);
        photosArray = await response.json();

        // 사진 보여주기
        displayPhotos();

    } catch (Error) {
        errorCount += 1;
        if (errorCount > 5) {
            // 에러가 5번 이상 나는 경우, 사과메시지 추가
            console.log('error too much');
            const errorItem = document.createElement('div');
            errorItem.innerText = 'Sorry, something is wrong :( We will fix it soon!';
            imageContainer.appendChild(errorItem);
        } else {
            // 5번 이하인 경우 재시도해봄
            console.log('error :(');
            getPhotos();
        }

    }
}


//on load
getPhotos();

// 바닥으로부터 1000px위까지 스크롤이 도착했는지 확인하고, 도착했으면 이미지 더 로드
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
});