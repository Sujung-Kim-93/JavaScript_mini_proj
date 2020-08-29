/*
Your API key for rlatn1993@naver.com is:
X7zFwXyQ7aFmrGrhwfgHjdagi2EN0ckukEot1YGS
https://api.nasa.gov/planetary/apod?api_key=X7zFwXyQ7aFmrGrhwfgHjdagi2EN0ckukEot1YGS
Account Email: rlatn1993@naver.com
Account ID: a70d4516-7c72-4ff2-a8f4-34bb99f5d60f
*/
const APIkey = 'X7zFwXyQ7aFmrGrhwfgHjdagi2EN0ckukEot1YGS';
let count = 5;
const url = `https://api.nasa.gov/planetary/apod?api_key=${APIkey}&count=${count}`;
let data = {};

let firstLoad = true;
let errorCount = 0;
let loadedImageCount = 0;
let favorites = {};

const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const card = document.querySelector('.card');
const imageContainer = document.querySelector('.image-container');
const favoritesButton = document.getElementById('favoritesButton');
const resultLoadMore = resultsNav.querySelector('.loadMore');
const favoriteLoadMore = favoritesNav.querySelector('.loadMore');


// saveFavorite
function saveFavorite(url) {
    // favorites에 localStroage 기록 가져옴
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));

    // 추가한 적이 없다면
    if (favorites[url] == undefined) {
        // favorites에 추가
        // Loop through Array to select Favorite
        data.forEach((item) => {
            if (item.url == url) {
                favorites[url] = item;
                //console.log(JSON.stringify(favorites));
            }
        });
        // added 싸인 2초동안 보여주기
        saveConfirmed.hidden = false;
        setTimeout(() => {
            saveConfirmed.hidden = true;
        }, 2000);
        // localStorage에 업데이트된 favorites 저장
        // stringify 필요(중요)
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }

}

//removeFavorite
function removeFavorite(url) {
    // favorites객체에서 해당요소 제거
    delete favorites[url];
    // localStorage에 업데이트된 favorites 저장
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    // refresh favorites page
    showFavorites();
}

//showFavorite
function showFavorites() {
    console.log(localStorage.getItem("nasaFavorites"));
    // favorite 내역이 있다면
    if (localStorage.getItem("nasaFavorites") != '{}') {
        // loader 보여주기
        loader.classList.remove('hidden');
        // favorite 가져오기
        let saved = window.localStorage.getItem("nasaFavorites");
        favorites = JSON.parse(saved);


        //이미지컨테이너 비움
        imageContainer.innerHTML = '';
        displayPhoto(favorites, 'favorites');

    } else {
        imageContainer.innerHTML = '';
        const noFavorites = document.createElement('p');
        noFavorites.textContent = 'No favorites added yet!';
        noFavorites.style.fontSize = '20px';
        imageContainer.appendChild(noFavorites);
    }

}

// html element에 사진 넣기
function displayPhoto(data, type) {
    let result = data;

    if (type == 'favorites') {
        result = Object.values(data);
    }

    //navbar 설정
    if (type == 'newLoad') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else if (type == 'favorites') {
        // resultsnav 보여줌
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }

    result.forEach((item) => {

        // card element 복제
        let cardCopy = card.cloneNode(true);
        if (firstLoad == true) {
            //첫 카드인 경우 html에 있는 카드 사용
            cardCopy = card;
            firstLoad = false;
        }

        // 각 element의 속성 설정
        //data.date, data.explanation, data.hdurl, data.copyright, data.title data.url

        if (item.media_type == 'image') {
            // 이미지인 경우
            cardCopy.querySelector('a').setAttribute('href', item.url);
            cardCopy.querySelector('img').setAttribute('src', item.hdurl);
            cardCopy.querySelector('img').setAttribute('loading', 'lazy');

        } else if (item.media_type == 'video') {
            // 비디오인 경우
            //console.log(i, item);
            cardCopy.removeChild(cardCopy.querySelector('a'));
            const video = document.createElement('div');
            video.innerHTML = `<iframe src=${item.url} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            video.children[0].style.width = '100%';
            video.children[0].style.height = '30vh';
            cardCopy.prepend(video);

        }
        // 카드 제목, 설명, 날짜, 저작권자
        cardCopy.querySelector('.card-title').innerText = item.title;
        cardCopy.querySelector('.card-text').innerText = item.explanation;
        cardCopy.querySelector('strong').innerText = item.date;
        if (item.copyright == undefined) {
            cardCopy.querySelector('span').innerText = 'Unknown';
        } else {
            cardCopy.querySelector('span').innerText = item.copyright;
        }

        // add to favorite, remove from favorite 기능추가
        if (type == 'newLoad') {
            // add to favorite 이벤트리스너 추가
            cardCopy.querySelector('.clickable').setAttribute('onclick', `saveFavorite('${item.url}')`);
        } else if (type == 'favorites') {
            // add to favorites remove from favorites로 바꿈
            cardCopy.querySelector('.clickable').textContent = 'Remove from Favorites';
            // remove from favorite 이벤트리스너 추가
            cardCopy.querySelector('.clickable').setAttribute('onclick', `removeFavorite('${item.url}')`);

        }

        // 카드 hidden 풀기
        cardCopy.hidden = false;

        // 카드 추가
        imageContainer.append(cardCopy);

        // 스크롤 맨 위로
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
        // 로더 제거
        loader.classList.add('hidden');

    });


}

// NASA API data 받기
async function getData() {
    // show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(url);
        data = await response.json();
        //console.log(data);

        displayPhoto(data, 'newLoad');
    } catch (error) {
        console.log(error);
        errorCount += 1;
        if (errorCount >= 10) {
            imageContainer.innerText = 'Sorry, there is an error. We will fix this ASAP!';
        } else {
            getData();
        }
    }

}

// favorite 보여주기
favoritesButton.addEventListener('click', function () {
    showFavorites();
});

// load more 기능
resultLoadMore.addEventListener('click', () => {
    //이미지컨테이너 비움
    imageContainer.innerHTML = '';
    getData();
});
favoriteLoadMore.addEventListener('click', () => {
    //이미지컨테이너 비움
    imageContainer.innerHTML = '';
    getData();
});

//onLoad
getData();