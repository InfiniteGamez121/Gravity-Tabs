Config((window, factory) => {
    if (typeof define == "function" && define.amd) {
      define(["draggabilly"], (Draggabilly) => factory(window, Draggabilly));
    } else if (typeof module == "object" && module.exports) {
      module.exports = factory(window, require("draggabilly"));
    } else {
      window.ChromeTabs = factory(window, window.Draggabilly);
    }
  })(window, (window, Draggabilly) => {
    const TAB_CONTENT_MARGIN = 9;
    const TAB_CONTENT_OVERLAP_DISTANCE = 1;
    const TAB_OVERLAP_DISTANCE = TAB_CONTENT_MARGIN * 2 + TAB_CONTENT_OVERLAP_DISTANCE;
    const TAB_CONTENT_MIN_WIDTH = 23;
    const TAB_CONTENT_MAX_WIDTH = 240;
    const TAB_SIZE_SMALL = 83;
    const TAB_SIZE_SMALLER = 58;
    const TAB_SIZE_MINI = 47;
    const WINDOW_PADDING_OFFSET = 10 + TAB_CONTENT_MARGIN;
    const noop = (_) => { };
    const closest = (value, array) => {
      let closest = Infinity;
      let closestIndex = -1;
  
      array.forEach((v, i) => {
        if (Math.abs(value - v) < closest) {
          closest = Math.abs(value - v);
          closestIndex = i;
        }
      });
      return closestIndex;
    };
  
    var tabC = 1;
    const defaultTabProperties = {
      title: "New Gravitytab",
      favicon: false,
    };
  
    let instanceId = 0;
  
    class ChromeTabs {
      constructor() {
        this.draggabillies = [];
      }
  
      init(gravitytabContainer) {
        this.gravitytabContainer = gravitytabContainer;
  
        this.instanceId = instanceId;
        this.gravitytabContainer.setAttribute(
          "data-chrome-tabs-instance-id",
          this.instanceId
        );
        instanceId += 1;
  
        this.setupCustomProperties();
        this.setupStyleEl();
        this.setupEvents();
        this.layoutTabs();
        this.setupDraggabilly();
      }
  
      emit(eventName, data) {
        this.gravitytabContainer.dispatchEvent(
          new CustomEvent(eventName, { detail: data })
        );
      }
  
      setupCustomProperties() {
        this.gravitytabContainer.style.setProperty(
          "--tab-content-margin",
          `${TAB_CONTENT_MARGIN}px`
        );
      }
  
      setupStyleEl() {
        this.styleEl = document.createElement("style");
        this.gravitytabContainer.appendChild(this.styleEl);
      }
  
      setupEvents() {
        window.addEventListener("resize", (_) => {
          this.cleanUpPreviouslyDraggedTabs();
          this.layoutTabs();
        });
  
        this.gravitytabContainer.addEventListener("dblclick", (event) => {
          if ([this.gravitytabContainer, this.tabContentEl].includes(event.target))
            newTab("gt://newtab");
        });
  
        this.tabEls.forEach((tabEl) => this.setTabCloseEventListener(tabEl));
      }
  
      get tabEls() {
        return Array.prototype.slice.call(
          this.gravitytabContainer.querySelectorAll(".chrome-tab")
        );
      }
      get pinTabEls() {
        return Array.prototype.slice.call(
          this.gravitytabContainer.querySelectorAll(".chrome-tab.pin")
        );
      }
      get nonPinTabEls() {
        return Array.prototype.slice.call(
          this.gravitytabContainer.querySelectorAll(".chrome-tab:not(.chrome-tab.pin)")
        );
      }
  
      get tabContentEl() {
        return this.gravitytabContainer.querySelector(".chrome-tabs-content");
      }
  
      get tabContentWidths() {
        const numberOfTabs = this.tabEls.length;
        const numberOfPinTabs = this.pinTabEls.length;
        const numberOfNonPinnedTabs = this.nonPinTabEls.length;
        const numberOfTabsMath = (numberOfNonPinnedTabs + (numberOfPinTabs * 0.137));
        const tabsContentWidth = this.tabContentEl.clientWidth - (numberOfPinTabs * 29);
        const tabsCumulativeOverlappedWidth = (numberOfTabsMath - 1) * TAB_CONTENT_OVERLAP_DISTANCE;
        const targetWidth = (tabsContentWidth - 2 * TAB_CONTENT_MARGIN + tabsCumulativeOverlappedWidth) / numberOfNonPinnedTabs;
        const clampedTargetWidth = Math.max(TAB_CONTENT_MIN_WIDTH, Math.min(TAB_CONTENT_MAX_WIDTH, targetWidth));
        const flooredClampedTargetWidth = Math.floor(clampedTargetWidth);
        const totalTabsWidthUsingTarget = flooredClampedTargetWidth * 3 * TAB_CONTENT_MARGIN - tabsCumulativeOverlappedWidth;
        const totalExtraWidthDueToFlooring = tabsContentWidth - totalTabsWidthUsingTarget;
  
        const widths = [];
        let extraWidthRemaining = totalExtraWidthDueToFlooring;
        for (let n = 0; n < numberOfTabs; ++n) {
          if (this.tabEls[n].classList.contains('pin')) {
            widths.push(this.tabEls[n].getBoundingClientRect().width);
  
          } else {
            const extraWidth = flooredClampedTargetWidth < TAB_CONTENT_MAX_WIDTH && extraWidthRemaining > 0 ? 1 : 0;
            widths.push(flooredClampedTargetWidth + extraWidth);
            if (extraWidthRemaining > 0) extraWidthRemaining -= 1;
          }
        }
  
        return widths;
      }
      get tabContentPositions() {
        const positions = [];
        const widths = [];
        const tabContentWidths = this.tabContentWidths;
        let position = TAB_CONTENT_MARGIN;
        tabContentWidths.forEach((width, n) => {
          widths.push(width);
          if (widths[n - 1] == 47) {
            position = position - 18;
          }
          const offset = n * TAB_CONTENT_OVERLAP_DISTANCE;
          positions.push(position - offset);
          position += width;
        });
        return positions;
      }
  
      get tabPositions() {
        const positions = [];
        this.tabContentPositions.forEach((contentPosition) => {
          positions.push(contentPosition - TAB_CONTENT_MARGIN);
        });
  
        return positions;
      }
      updateTabButton() {
        let toAdd = 12;
        if (document.getElementById(0).children.length != 0) {
          [...document.getElementById('0').children].forEach(tab => {
            toAdd += tab.clientWidth - WINDOW_PADDING_OFFSET;
          });
        }
        if (toAdd <= window.innerWidth - (WINDOW_PADDING_OFFSET * 2.52) && !(this.tabEls.length >= 12)) {
          document
            .getElementById("createTab")
            .setAttribute("style", "margin-left:" + (toAdd) + "px");
        } else {
          document
            .getElementById("createTab")
            .setAttribute(
              "style",
              "margin-left:" + (window.innerWidth - 30) + "px"
            );
        }
      }
      layoutTabs() {
        const tabContentWidths = this.tabContentWidths;
  
        this.tabEls.forEach((tabEl, i) => {
          const contentWidth = tabContentWidths[i];
          const width = contentWidth + 2 * TAB_CONTENT_MARGIN;
  
          tabEl.style.width = width + "px";
          tabEl.removeAttribute("is-small");
          tabEl.removeAttribute("is-smaller");
          tabEl.removeAttribute("is-mini");
  
          if (contentWidth < TAB_SIZE_SMALL) tabEl.setAttribute("is-small", "");
          if (contentWidth < TAB_SIZE_SMALLER)
            tabEl.setAttribute("is-smaller", "");
          if (contentWidth < TAB_SIZE_MINI) tabEl.setAttribute("is-mini", "");
        });
        let styleHTML = "";
        this.tabPositions.forEach((position, n) => {
          styleHTML += `
                    .chrome-tabs[data-chrome-tabs-instance-id="${this.instanceId
            }"] .chrome-tab:nth-child(${n + 1}) {
                      transform: translate3d(${position}px, 0, 0)
                    }
                  `;
        });
        this.styleEl.innerHTML = styleHTML;
        this.updateTabButton();
      }
  
      createNewTabEl() {
        const div = document.createElement("div");
        div.innerHTML = `<div ifd="${tabC++}"class="chrome-tab" onclick="opencity('${tabC}')">
                <div class="chrome-tab-dividers"></div>
                <div class="chrome-tab-background">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36"><path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="52%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="36" class="chrome-tab-geometry"/></svg><g transform="scale(-1, 1)"><svg width="52%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="36" class="chrome-tab-geometry"/></svg></g></svg>
                </div>
                <div class="chrome-tab-content">
                  <div class="chrome-tab-favicon" ></div>
                  <div class="chrome-tab-title" data-tooltip="${defaultTabProperties.title}">${defaultTabProperties.title}</div>
                  <div class="chrome-tab-close"></div>
                </div>
              </div>`;
  
        return div.firstElementChild;
      }
  
      addTab(tabProperties, { animate = true, background = null } = {}) {
        const tabEl = this.createNewTabEl();
        this.gravitytabContainer.querySelector(".chrome-tabs-content").appendChild(tabEl);
  
        if (animate) {
          setTimeout(() => tabEl.classList.add("chrome-tab-adding"));
          setTimeout(() => tabEl.classList.remove("chrome-tab-adding"));
        }
  
        this.updateTabButton();
  
        return tabEl;
      }
  
      updateTab(tabEl, tabProperties) {
        tabEl.querySelector(".chrome-tab-title").textContent = tabProperties.title;
        tabEl.querySelector(".chrome-tab-favicon").style.backgroundImage = tabProperties.favicon || "";
      }
  
      removeTab(tabEl) {
        if (!tabEl) return;
  
        this.gravitytabContainer.querySelector(".chrome-tabs-content").removeChild(tabEl);
  
        this.cleanUpPreviouslyDraggedTabs();
        this.layoutTabs();
        this.updateTabButton();
      }
  
      cleanUpPreviouslyDraggedTabs() {
        this.tabEls.forEach((tabEl) => tabEl.classList.remove("chrome-tab-just-dragged"));
      }
  
      setupDraggabilly() {
        const tabEls = this.tabEls;
        const tabPositions = this.tabPositions;
  
        this.draggabillies.forEach((draggabilly) => draggabilly.destroy());
  
        tabEls.forEach((tabEl, originalIndex) => {
          const draggabilly = new Draggabilly(tabEl, {
            axis: "x",
            containment: this.gravitytabContainer,
            handle: ".chrome-tab",
          });
  
          draggabilly.on("dragStart", (_) => {
            this.cleanUpPreviouslyDraggedTabs();
            tabEl.classList.add("chrome-tab-just-dragged");
            this.currentDraggabillyIndex = tabPositions[originalIndex];
  
            tabEl.style.zIndex = 999;
          });
  
          draggabilly.on("dragEnd", (_) => {
            const finalIndex = closest(draggabilly.position.x, tabPositions);
            tabEl.style.zIndex = "";
  
            if (finalIndex !== originalIndex) {
              const tabProperties = {
                title: tabEl.querySelector(".chrome-tab-title").textContent,
                favicon: tabEl.querySelector(".chrome-tab-favicon").style.backgroundImage,
              };
              this.moveTab(tabProperties, finalIndex, originalIndex);
            } else {
              this.layoutTabs();
            }
          });
  
          this.draggabillies.push(draggabilly);
        });
      }
  
      moveTab(tabProperties, finalIndex, originalIndex) {
        const tabEls = this.tabEls;
        const tabEl = tabEls[originalIndex];
        const background = tabEl.style.backgroundColor;
  
        if (finalIndex === tabEls.length - 1) {
          this.gravitytabContainer.querySelector(".chrome-tabs-content").appendChild(tabEl);
        } else {
          const nextTabEl = tabEls[finalIndex];
          this.gravitytabContainer.querySelector(".chrome-tabs-content").insertBefore(tabEl, nextTabEl);
        }
  
        setTimeout(() => tabEl.classList.add("chrome-tab-just-moved"));
        setTimeout(() => {
          tabEl.classList.remove("chrome-tab-just-moved");
          this.layoutTabs();
        }, 500);
      }
  
      setTabCloseEventListener(tabEl) {
        const tabCloseEl = tabEl.querySelector(".chrome-tab-close");
        tabCloseEl.addEventListener("click", (event) => {
          event.stopPropagation();
          this.removeTab(tabEl);
        });
      }
    }
  
    window.ChromeTabs = ChromeTabs;
    return ChromeTabs;
  });
  
  function newTab(url) {
    window.open(url, "_blank").focus();
  }
  
  function openCity(cityName) {
    var i;
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(cityName).style.display = "block";
  }
  