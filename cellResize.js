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
    const createResizableTable = function () {
        let last = rTable.tHead.rows.length - 1;
        const cols = rTable.tHead.rows[last].cells;
        [].forEach.call(cols, function (col) {
            // Add a resizer element to the column
            const resizer = document.createElement('div');
            resizer.classList.add('resizer' + tm);
            // Set the height
            resizer.style.height = `${rTable.tBodies[0].offsetHeight + rTable.tHead.rows[last].offsetHeight}px`;
            col.style.position = 'relative';
            col.appendChild(resizer);
            createResizableColumn(col, resizer);
        });
    };

    const createResizableColumn = function (col, resizer) {
        var x = 0;
        var w = 0;
        const mouseDownHandler = function (e) {
            x = e.clientX;
            const styles = window.getComputedStyle(col);
            w = parseFloat(styles.width, 10);
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
            resizer.classList.add('resizing' + tm);
        };
        const mouseMoveHandler = function (e) {
            const dx = e.clientX - x;
            // *****************************************
            // set colum width for resized column
            // ******************************************
            col.style.width = `${w + dx}px`;
        };
        const mouseUpHandler = function () {
            resizer.classList.remove('resizing' + tm);
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            x = 0;
            w = 0;
            hookAR();
        };

        resizer.addEventListener('mousedown', mouseDownHandler);

    };
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
