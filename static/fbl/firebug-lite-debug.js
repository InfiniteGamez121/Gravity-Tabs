@import url("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap");

html, body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  background: #f1f3f4;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

html.dark-theme {
  background: #1c1c1c;
}

.pointer {
  cursor: pointer;
}
.pointer:hover {
  background: #3f4042;
}

.surface {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-direction: column;
}

@media (min-width: 100%) {
  .surface {
    padding: 60px;
  }
  .mock-browser {
    width: 100%;
    background: #dee1e6;
    border-radius: 8px;
    flex-shrink: 0;
    overflow: hidden;
  }
  html.dark-theme .mock-browser {
    background: #202123;
  }
  .mock-browser-content {
    position: relative;
    z-index: 1;
    margin-top: -1px;
    display: flex;
  }
  .chrome-tabs-optional-shadow-below-bottom-bar {
    z-index: 2;
  }
}

@media (max-width: 799px) {
  html {
    background: #fff;
  }
  html.dark-theme {
    background: #252729;
  }
  .mock-browser .chrome-tabs {
    border-radius: 0;
  }
}

body {
  font-family: "Open Sans", sans-serif;
}
.center {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
}
.btn, .btn1 {
  color: antiquewhite;
  background-color: transparent;
  border: none;
  outline: none;
}
.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
}
.head-titl, .duce, .covid, .b3at {
  text-align: center;
  color: #fff;
}
.games-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  background: #222;
}
.crm {
  width: 112px;
  height: 84px;
  display: grid;
  text-align: center;
  justify-items: center;
  align-items: center;
}
.icn {
  width: 48px;
  height: 48px;
}
.bookmarks {
  border-bottom: 1px solid black !important;
  white-space: nowrap;
}
#ad {
  margin: 14px auto;
  width: 32%;
  border: 1px solid green;
  padding: 10px;
}
#ht {
  max-width: 15%;
  height: auto;
}
fieldset {
  border: 1px solid #000;
}
#input, #inputb {
  border: none;
  border-radius: calc(0.5 * 44px);
  font-size: 16px;
  outline: none;
}
#inputb {
  padding-inline-end: 40px;
  padding-inline-start: 52px;
  width: 80%;
  height: 44px;
}
#inputimg {
  position: absolute;
  left: 0;
  top: -1px;
  padding-left: 14px;
  outline: none;
}
#txt {
  padding: 50px 0 40px;
  font-size: 25px;
  color: #fff;
  font-weight: normal;
  margin: 0;
}
#headtxt {
  font-size: 80px;
  color: bisque;
}
@media only screen and (max-width: 600px) {
  #txt {
    font-size: 14px;
  }
  .center {
    width: 410px;
  }
  #inputb {
    width: 69%;
  }
  .crm {
    width: 93px;
  }
  #headtxt {
    font-size: 70px;
  }
}
@media only screen and (max-width: 400px) {
  #txt {
    font-size: 12px;
    width: 97%;
  }
  .center {
    width: 350px;
  }
  #inputb {
    width: 57%;
  }
  .crm {
    width: 85px;
  }
  #headtxt {
    font-size: 60px;
  }
}
@media only screen and (max-width: 330px) {
  .center {
    width: 300px;
  }
  #weather {
    visibility: hidden;
  }
}
#bmenu {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 175px;
}
#bul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  min-width: 180px;
}
#bookmarka {
  display: inline-block;
  height: 29.2px;
  padding-left: 29.2px;
  font-size: 14px;
  text-decoration: none;
  background-size: 20px 20px;
  background-position: 4.1px 0;
  background-repeat: no-repeat;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 169px;
  white-space: nowrap;
}
.info {
  margin: 0;
  position: absolute;
  top: 2.5em;
  right: 2em;
  width: auto;
  text-align: center;
  color: bisque;
}
#alerts {
  text-decoration: underline;
}
.chrome-tabs {
  box-sizing: border-box;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 12px;
  height: 46px;
  padding: 8px 3px 4px 3px;
  background: #dee1e6;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}
.chrome-tabs * {
  box-sizing: inherit;
  font: inherit;
}
.chrome-tabs-content {
  position: relative;
  width: 100%;
  height: 100%;
}
.chrome-tab {
  position: absolute;
  left: 0;
  height: 36px;
  width: 240px;
  border: 0;
  margin: 0;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  cursor: default;
}
.chrome-tab-dividers {
  position: absolute;
  top: 7px;
  bottom: 7px;
  left: var(--tab-content-margin);
  right: var(--tab-content-margin);
  pointer-events: none;
}
.chrome-tab-dividers::before, .chrome-tab-dividers::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #a9adb0;
  opacity: 1;
  transition: opacity .2s ease;
}
.chrome-tab-dividers::before {
  left: 0;
}
.chrome-tab-dividers::after {
  right: 0;
}
.chrome-tab:first-child .chrome-tab-dividers::before,
.chrome-tab:last-child .chrome-tab-dividers::after {
  opacity: 0;
}
.chrome-tab-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}
.chrome-tab-background > svg {
  width: 100%;
  height: 100%;
}
.chrome-tab-background > svg .chrome-tab-geometry {
  fill: #f4f5f6;
}
.chrome-tab[active] {
  z-index: 5;
}
.chrome-tab[active] .chrome-tab-background > svg .chrome-tab-geometry {
  fill: #fff;
}
.chrome-tab:not([active]) .chrome-tab-background {
  transition: opacity .2s ease;
  opacity: 0;
}
.chrome-tab:hover {
  z-index: 2;
}
.chrome-tab:hover .chrome-tab-background {
  opacity: 1;
}
@keyframes chrome-tab-was-just-added {
  to {
    top: 0;
  }
}
.chrome-tab.chrome-tab-was-just-added {
  top: 10px;
  animation: chrome-tab-was-just-added 120ms forwards ease-in-out;
}
.chrome-tab-content {
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: var(--tab-content-margin);
  right: var(--tab-content-margin);
  padding: 9px 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
  pointer-events: all;
}
.chrome-tab[is-mini] .chrome-tab-content {
  padding-left: 8px;
  padding-right: 8px;
}
.chrome-tab-title {
  display: block;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
