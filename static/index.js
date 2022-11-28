const submitBtn = document.querySelector('.submit');
const input = document.querySelector('input');
var loadingText = '<img src="loading.png" class="loading" height="16">';

function inFrame () {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function encodeUrl(str){
  if (!str) return str;
  return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}

function decodeUrl(str) {
  if (!str) return str;
  let [ input, ...search ] = str.split('?');

  return decodeURIComponent(input).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join('') + (search.length ? '?' + search.join('?') : '');
}

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

/*if(params.open){
  window.navigator.serviceWorker.register('./sw.js', {
      scope: __uv$config.prefix
  }).then(() => {
      window.location.href = "https://" + window.location.hostname.substring(2) + "/uvLoading.html?uv=" + params.open;
  });
}*/

submitBtn.addEventListener('click', async event => {
    event.preventDefault();
    if(input.value != ""){
      submitBtn.innerHTML = loadingText;
      submitBtn.style.height = "42px";
      window.navigator.serviceWorker.register('./sw.js', {
          scope: __uv$config.prefix
      }).then(() => {
          let url = input.value.trim();
          if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
          else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;
  
        if(params.main) {
window.location.href = "https://www." + window.location.hostname.split('.').slice(1).join('.') + "/uvLoading.html?uv=" + escape(encodeUrl(url)) + "&s=" + escape(encodeUrl(input.value));
        } else {
          window.location.href = "/service/" + encodeUrl(url);
        }
      });
    }
});

input.addEventListener('keyup', function onEvent(e) {
  if (e.keyCode === 13) {
    submitBtn.click()
  }
})

function isUrl(val = ''){
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
};
