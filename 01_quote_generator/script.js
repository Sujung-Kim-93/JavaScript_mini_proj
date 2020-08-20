/*
http://api.forismatic.com/api/1.0/
*/
// https://twitter.com/intent/tweet

const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

// show loading
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide loading
function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote from API

// 에러 5번이상나면 로딩중지
let errorCounter = 0

async function getQuote() {
    // 최초 : 로딩중
    showLoadingSpinner();

    // 이 무료 api는 프록시 필요
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

    try {
        //fetch 결과 받을때까지 기다림
        const response = await fetch(proxyUrl + apiUrl);
        // json으로 변환 기다림
        const data = await response.json();

        // 각 json데이터 html element에 삽입
        // 필터 1: 작가가 blank이면 unknown으로 바꿔줌
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // 필터 2: 명언이 120자 이상이면 폰트사이즈 줄임
        if (data.quoteText.length > 120) {
            //quoteText.style.fontSize = '2rem';
            quoteText.classList.add('long-quote');
        } else {
            // 전 명언이 길었고 새 명언이 짧으면 다시 폰트사이즈 키워줌
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;

        // 모든 과정이 끝났으므로 로딩 숨기고 quote 보여줌
        removeLoadingSpinner();

        // 에러기능 실험
        //throw new Error('opps');
    } catch (error) {
        errorCounter += 1;
        console.log('whoops, no quote', errorCounter, error);

        if (errorCounter >= 5) {
            // 홈페이지에 이상 있음을 알림
            quoteText.classList.add('long-quote');
            quoteText.innerText = 'Sorry, something is wrong with our page :( We will fix it soon!';
            authorText.innerText = 'Admin';
            twitterBtn.hidden = true;
            newQuoteBtn.hidden = true;
            removeLoadingSpinner();
        } else {
            getQuote();
        }

    }
}

//Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    //console.log('twitter');
    window.open(tweetUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();