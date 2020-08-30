const {
    body
} = document;

function changeBackground(num) {
    if (!body.classList.contains(`background-${num}`)) {
        // Reset CSS class for body
        body.className = '';
        body.classList.add(`background-${num}`);
    } else {
        body.classList.remove(`background-${num}`);
    }
}