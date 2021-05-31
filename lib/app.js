"use strict";
let waiting = 0;
function givememe() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.onchange = (e) => {
        if (!input.files)
            return input.click();
        for (const file of input.files) {
            ++waiting;
            fetch('https://memestream.nodesite.eu/static/put', {
                method: 'PUT',
                body: file,
            }).then(res => res.text()).then(a => fetch('/post', {
                method: 'POST',
                body: a,
            })).then(response => response.json()).then(res => {
                --waiting;
                if (res.error) {
                    if (waiting == 0) {
                        alert(res.error);
                        input.click();
                    }
                }
                else {
                    showmemes(+res);
                }
            }).catch(console.log);
        }
    };
    input.click();
}
function showmemes(res) {
    function resizememes() {
        for (const img of document.querySelectorAll('img')) {
            img.style.width = `${innerWidth - 28}px`;
        }
    }
    let memenow = +res;
    waiting = -1;
    function givememe() {
        if (!memenow)
            return;
        fetch(`/get/${--memenow}`)
            .then(res => res.json())
            .then((id) => {
            const img = document.createElement('img');
            if (!img || !id)
                return givememe();
            img.src = `https://memestream.nodesite.eu/static/${id}.jpg`;
            img.onload = img.onerror = () => {
                resizememes();
                testmeme();
            };
            document.querySelector('#memes').appendChild(img);
        })
            .catch(console.log);
    }
    function testmeme() {
        const img = [...document.querySelectorAll('img')].pop();
        if (!img || (img.offsetTop < (window.innerHeight + window.pageYOffset))) {
            givememe();
        }
    }
    document.onscroll = testmeme;
    givememe();
    window.onresize = resizememes;
}
