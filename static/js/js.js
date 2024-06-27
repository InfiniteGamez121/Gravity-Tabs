/*
_____ _ _ _
| __ \ | | | | | |
| |__) | ___ _ __ | |_ ___ __| | | |__ _ _
| ___/ / _ \ | '__| | __| / _ \ / _` | | '_ \ | | | |
| | | (_) | | | | |_ | __/ | (_| | | |_) | | |_| |
|_| \___/ |_| \__| \___| \__,_| |_.__/ \__, |
__/ |
|___/
*/

console.log(`Gravity Tabs
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>.`)
    
    const prefix = __uv$config.prefix;
    const bare = new BareClient(__uv$config.bare);
    const URL_BAR = document.getElementById('urlbar');
    const ACTIVE_WINDOW = () => {
    return document.getElementById(getActiveFrameId()).contentWindow;
    };
    const CONTENT_WINDOW = (n) => {
    return document.getElementById(n).contentWindow;
    };
    const ACTIVE_DOCUMENT = () => {
    return document.getElementById(getActiveFrameId()).contentDocument;
    };
    
    let history = {},
    sir = true;
    
    const gtHandler = (url) => {
    // handle URLs accessed through the `gt://` "protocol"
    url = url.slice(5);
    return (
    internal_pages[url] ||
    internal_pages['newtab'] ||
    alert('Something is very wrong, please refresh')
    );
    };
    
    const getActiveFrameId = () => {
    if (document.querySelector('.chrome-tab[active]'))
    return (
    +document.querySelector('.chrome-tab[active]').getAttribute('ifd') + 1
    );
    return null;
    };
    
    function addPageToHistory(id, page) {
    if (!sir) {
    sir = true;
    return;
    }
    
    if (!(id in history)) {
    history[id] = [[], -1];
    }
    
    if (history[id][1] < history[id][0].length - 1) {
    history[id][0] = history[id][0].slice(0, history[id][1] + 1);
    }
    
    if (history[id][0][[history[id].length - 1]] == page) return;
    
    history[id][0].push(page);
    history[id][1] = history[id][0].length - 1;
    }
    
    function getPage(id) {
    return (
    ((history[id] || [])[0] || [])[history[id][1]] || gtHandler('gt://newtab')
    );
    }
    
    function getBack(id) {
    sir = false;
    history[id][1]--;
    return getPage(id);
    }
    
    function getForward(id) {
    if (history[id][1] >= history[id][0].length - 1) return getPage(id);
    
    sir = false;
    history[id][1]++;
    return getPage(id);
    }
    
    // Get bookmark URL
    async function getIcon(id) {
    let urlIco = CONTENT_WINDOW(id).document.querySelector(
    'link[rel="favicon"], link[rel="shortcut icon"], link[rel="icon"]'
    );
    if (urlIco !== null) {
    if (urlIco.href.includes('data:image/png;base64')) return urlIco.href;
    
    const res = await bare.fetch(urlIco.href);
    const obj = URL.createObjectURL([await res.blob()], {
    type: res.headers.get('content-type') || 'image/x-icon',
    });
    
    setTimeout(() => URL.revokeObjectURL(obj), 1e3);
    
    return obj;
    } else {
    const res = await bare.fetch(
    new URL('/favicon.ico', CONTENT_WINDOW(id).location)
    );
    const obj = URL.createObjectURL([await res.blob()], {
    type: res.headers.get('content-type') || 'image/x-icon',
    });
    
    setTimeout(() => URL.revokeObjectURL(obj), 1e3);
    
    return obj;
    }
    }
    
    // Sets tab information
    async function setInfo(frameId) {
    // If the site we are on is not proxied.
    CONTENT_WINDOW(frameId).addEventListener('keydown', function (key) {
    if (key.ctrlKey) {
    if (
    window.parent.document.getElementsByClassName('chrome-tab')[key.key - 1]
    ) {
    window.parent.document
    .getElementsByClassName('chrome-tab')
    [key.key - 1].click();
    chromeTabs.setCurrentTab(
    document.getElementsByClassName('chrome-tab')[key.key - 1]
    );
    }
    }
    });
    CONTENT_WINDOW(frameId).addEventListener('mousedown', function () {
    window.parent.hideId('optionsdrop');
    window.parent.hideId('ctx');
    if (document.querySelectorAll('.extension_menu'))
    document
    .querySelectorAll('.extension_menu')
    .forEach((a) => (a.style.display = 'none'));
    });
    URL_BAR.value = '';
    if (!CONTENT_WINDOW(frameId).location.href.includes(__uv$config.prefix)) {
    // Do this for history then return..
    addPageToHistory(frameId, CONTENT_WINDOW(frameId).location.href);
    return;
    }
    // Get current page URL.
    let regUrl = CONTENT_WINDOW(frameId).location.href;
    // Grabbing title stuff (corrosion sucks with this)
    if (
    CONTENT_WINDOW(frameId).document.getElementsByTagName('title')[0].firstChild
    .textContent
    )
    document.getElementsByClassName(frameId)[0].firstChild.data =
    CONTENT_WINDOW(frameId).document.getElementsByTagName(
    'title'
    )[0].firstChild.textContent;
    else
    document.getElementsByClassName(frameId)[0].firstChild.data = xor.decode(
    regUrl.split(__uv$config.prefix).slice(1).join(__uv$config.prefix)
    );
    // Set URL bar
    if (getActiveFrameId() == frameId) {
    URL_BAR.value = xor.decode(
    regUrl.split(__uv$config.prefix).slice(1).join(__uv$config.prefix)
    );
    }
    // Set the favicon of page
    document.querySelector(
    `div[ifd="${+frameId - 1}"]`
    ).children[2].children[0].attributes[1].value = `background-image: url(${await getIcon(
    frameId
    )})`;
    if (
    document
    .querySelector(`div[ifd="${+frameId - 1}"]`)
    .hasAttribute('tab-is-pinned')
    ) {
    chromeTabs.pinTab(+frameId - 1);
    }
    // Add the page to local history
    addPageToHistory(frameId, ACTIVE_WINDOW().location.href);
    }
    
    function hideId(...x) {
    // Hides gravity tab ID.
    x.forEach((frame) => {
    document.getElementById(frame).style.display = 'none';
    });
    }
    
    function showId(...x) {
    // Shows gravity tab ID.
    x.forEach((frame) => {
    document.getElementById(frame).style.display = 'block';
    });
    }
    
    function toggleId(...x) {
    // Toggles between two gravity tabs
    x.forEach((frame) => {
    if (getComputedStyle(document.getElementById(frame)).display === 'none') {
    showId(frame);
    } else {
    hideId(frame);
    }
    });
    }
    
    function openMenu(...x) {
    // Displays additional settings!
    let elems = x.map((id) => document.getElementById(id));
    let shouldOpen = true;
    elems.forEach((elm) => {
    if (getComputedStyle(elm).display !== 'none') shouldOpen = false;
    });
    if (shouldOpen) showId(elems[0].id);
    else elems.forEach((elm) => hideId(elm.id));
    }
    
    function inspect() {