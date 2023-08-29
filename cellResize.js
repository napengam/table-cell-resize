function initResize(tid) {
    // *****************************************
    // based on work done by https://github.com/phuocng in
    // https://github.com/phuocng/html-dom/blob/master/contents/resize-columns-of-a-table.md
    // ******************************************

    var rTable, tm;
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
    rTable.dataset.hasresize = '1';
    rTable.style.width = 'auto'; // all other settings except fit-content would not work with colspan>1 
    tm = makeStyle();
    function createResizableTable() {
        var cols, last, rows;
        if (rTable.tHead !== null) {
            last = rTable.tHead.rows.length - 1;
            cols = rTable.tHead.rows[last].cells;
            rows = rTable.tHead.rows;
        } else { // no header
            last = 0;
            cols = rTable.rows[0].cells;
            rows = rTable.rows;
        }

        [].forEach.call(cols, function (col) {
            // Add a resizer element to the column
            const resizer = document.createElement('div');
            resizer.classList.add('resizer' + tm);
            // Set the height
            resizer.style.height = `${rTable.tBodies[0].offsetHeight + rows[last].offsetHeight}px`;
            col.style.position = 'relative';
            col.appendChild(resizer);
            resizer.addEventListener('mousedown', mouseDownHandler);
        });
    }
    ;

    function mouseDownHandler(e) {
        this.x = e.clientX;
        const styles = window.getComputedStyle(this.parentNode);
        this.w = parseFloat(styles.width, 10);
        rTable.div = this;
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        this.classList.add('resizing' + tm);
    }

    function mouseMoveHandler(e) {
        const dx = e.clientX - rTable.div.x;
        // *****************************************
        // set colum width for resized column
        // ******************************************
        rTable.div.parentNode.style.width = `${rTable.div.w + dx}px`;
    }

    function mouseUpHandler() {
        rTable.div.classList.remove('resizing' + tm);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        hookAR();
    }

    function makeStyle() {
        // *****************************************
        // make styles inside so user does not have
        // to deal with css.
        // ******************************************

        var tm = Date.now(), styleElem = document.createElement('STYLE');
        styleElem.innerHTML = [
            `.resizer${tm} {
                /* Displayed at the right side of column */
                position: absolute;
                top: 0;
                right: 0;
                width: 2px;
                cursor: col-resize;
                user-select: none;
            }`,
            `.resizer${tm}:hover,
            .resizing${tm} {
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
    createResizableTable();

    return {
        theTable: () => {
            return rTable;
        },
        setHookAfterResize: setHookAfterResize
    };
}
