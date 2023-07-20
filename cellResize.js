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
    tm = makeStyle();
    const createResizableTable = function () {
        let last = rTable.tHead.rows.length - 1;
        const cols = rTable.tHead.rows[last].cells;
        [].forEach.call(cols, function (col) {
            // Add a resizer element to the column
            const resizer = document.createElement('div');
            resizer.classList.add('resizer'+tm);
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
            resizer.classList.add('resizing'+tm);
        };
        const mouseMoveHandler = function (e) {
            const dx = e.clientX - x;
            /* dx must also be aplyed to the original column width 
             * of any columsn above 
             */
            let ri = col.parentNode.rowIndex - 1;
            for (; ri >= 0; ri--) {
                [].some.call(rTable.rows[ri].cells, (elem) => {
                    if (!elem.hasAttribute('orgWidth')) {
                        elem.setAttribute('orgWidth', elem.clientWidth);
                    }
                    if (elem.offsetLeft <= col.offsetLeft && col.offsetLeft <= elem.offsetLeft + elem.clientWidth) {
                        // *****************************************
                        // while dragging the marker with the mouse 
                        // set column width also for columns in rows above
                        // ******************************************
                        elem.style.width = `${parseFloat(elem.getAttribute('orgWidth'), 10) + dx}px`;
                        return true;
                    }
                    return false;
                });
            }
            // *****************************************
            // finaly set colum width for resized column
            // ******************************************
            col.style.width = `${w + dx}px`;
        };
        const mouseUpHandler = function () {
            resizer.classList.remove('resizing'+tm);
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            x = 0;
            w = 0;
            // *****************************************
            // remove all traces of a resize done before
            // ******************************************
            let cells = rTable.querySelectorAll('[orgWidth]');
            cells.forEach((elem) => {
                elem.removeAttribute('orgWidth');
            });
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
    createResizableTable();
}