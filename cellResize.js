function initResize(tid) {
    // *****************************************
    // based on work done by https://github.com/phuocng in
    // https://github.com/phuocng/html-dom/blob/master/contents/resize-columns-of-a-table.md
    // ******************************************

    var rTable, tm, info, down, move, up, touch;
    if (typeof tid === 'undefined' || tid === null) {
        return;
    }
    if (typeof tid === 'string') {
        rTable = document.getElementById(tid);
    } else {
        rTable = tid;
    }
    if (rTable.dataset.hasresize) {
        return {
            setHookAfterResize: setHookAfterResize
        };
    }

    if (isTouchDevice() === false) {
        down = 'mousedown';
        move = 'mousemove';
        up = 'mouseup';
        touch = false;
    } else {
        down = 'touchstart';
        move = 'touchmove';
        up = 'touchend';
        touch = true;
    }

    rTable.dataset.hasresize = '1';
    rTable.style.width = 'auto'; // all other settings except fit-content would not work with colspan>1 
    tm = makeStyle();
    function createResizableTable() {
        info = getInfo();
        [].forEach.call(info.cols, function (col) {
            // Add a resizer element to the column
            const resizer = document.createElement('div');
            resizer.classList.add(`resizer_${tm}_`);
            // Set the height
            resizer.style.height = `${rTable.tBodies[0].offsetHeight + info.height}px`;
            col.style.position = 'relative';
            col.appendChild(resizer);
            resizer.addEventListener(down, mouseDownHandler);
        });
    }

    function mouseDownHandler(e) {
        if (!touch) {
            this.x = e.clientX;
        } else {
            e.stopPropagation();
            e.preventDefault();
            this.x = e.touches[0].clientX;
        }
        this.w = this.parentNode.getBoundingClientRect().width;
        rTable.div = this;
        document.addEventListener(move, mouseMoveHandler);
        document.addEventListener(up, mouseUpHandler);
        this.classList.add(`resizing_${tm}_`);
    }

    function mouseMoveHandler(e) {
        let dx;
        if (!touch) {
            dx = e.clientX - rTable.div.x;
        } else {
            e.stopPropagation();
          
            dx = e.touches[0].clientX - rTable.div.x;
        }
        // *****************************************
        // set colum width for resized column
        // ******************************************
        rTable.div.parentNode.style.width = `${rTable.div.w + dx}px`;
    }

    function mouseUpHandler() {
        rTable.div.classList.remove(`resizing_${tm}_`);
        document.removeEventListener(move, mouseMoveHandler);
        document.removeEventListener(up, mouseUpHandler);
        hookAR();
    }
    function getInfo() {
        var info = {};
        if (rTable.tHead !== null) {
            info.last = rTable.tHead.rows.length - 1;
            info.cols = rTable.tHead.rows[info.last].cells;
            info.rows = rTable.tHead.rows;
            info.height = info.rows[info.last].offsetHeight;
        } else { // no header
            info.last = 0;
            info.cols = rTable.rows[0].cells;
            info.rows = rTable.rows;
            info.height = 0;
        }
        return info;
    }



    function makeStyle() {
        // *****************************************
        // make styles inside so user does not have
        // to deal with css.
        // ******************************************
        var styleElem, tm, exists = false, nodes;
        nodes = document.querySelectorAll('style');
        // *****************************************
        // does style already exist
        // ******************************************
        [].some.call(nodes, elem => {
            if (elem.innerText.indexOf('.resizer') !== -1) {
                tm = elem.innerText.split('_')[1];
                exists = true;
                return true;
            }
            return false;
        });
        if (exists) {
            return tm;
        }
        tm = Date.now(); // to make style 'unique' 
        styleElem = document.createElement('STYLE');
        styleElem.innerHTML = [
            `.resizer_${tm}_ {
                /* Displayed at the right side of column */
                position: absolute;
                top: 0;
                right: 0;
                width: 2px;
                cursor: col-resize;
                user-select: none;
            }`,
            `.resizer_${tm}_:hover,
            .resizing_${tm}_ {
                border-right: 2px solid blue;
            }`
        ].join('');
        document.getElementsByTagName('head')[0].appendChild(styleElem);
        return tm;
    }
    function hookAR() {
        // dummy
    }
    function setHookAfterResize(aFunc) {
        hookAR = aFunc;

    }

    function isTouchDevice() { // from chatGPT
        return 'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0;
    }
    createResizableTable();

    return {
        theTable: () => {
            return rTable;
        },
        setHookAfterResize: setHookAfterResize
    };
}
