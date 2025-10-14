function load_csv_data(table, path) {
    table.innerHTML = "";
    Papa.parse(path, {
        download: true,
        header:false,
        delimiter: ";",
        complete: function(restults) {
            let i = 0;
            restults.data.map((data, index)=>{
                if (i === 0) {

                    //let table = document.getElementById('tbl-data');
                    generateTableHead(table, data);
                } 
                else {
                    let tbody = table.querySelector('tbody');
                    if(data.length > 1) {
                        generateTableRows(tbody, data);
                    }  
                }
                i++;
            });

        }
    });  
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for(let key of data) {
        let th = document.createElement('th');
        let text = document.createTextNode(key)
        th.appendChild(text);
        row.appendChild(th);
    }
    let tbody = table.createTBody();  
}

function generateTableRows(tbody, data) {
    let newRow = tbody.insertRow(-1);
    data.map((row, index)=> {
        console.log(index +'|'+ row);
        let newCell = newRow.insertCell();
        let newText = document.createTextNode(row);
        newCell.appendChild(newText);
    });
}

const csv_table_buttons = document.querySelectorAll('button[csv-file]');
!function(){
    let csv_table_buttons_selected = document.querySelectorAll('button[csv-file][selected]');
    let csv_table_buttons_not_selected = document.querySelectorAll('button[csv-file]:not([selected])');
    let csv_table_buttons = document.querySelectorAll('button[csv-file]');
    let download_buttons = document.querySelectorAll('button[download]');

    for(csv_table_button_selected of csv_table_buttons_selected) {
        table = csv_table_button_selected.parentNode.parentNode.getElementsByTagName('table')[0];
        csv_file = csv_table_button_selected.attributes['csv-file'].nodeValue;
        download_button = csv_table_button_selected.parentNode.querySelector('button[download]');
        console.log(download_button);
        console.log(table);
        console.log(csv_file);
        table.setAttribute('csv-file', csv_file);
        download_button.setAttribute('download', csv_file);
        console.log(download_button);
    }

    let csv_tables = document.querySelectorAll('table[csv-file]');
    csv_tables.forEach(csv_table => {
        csv_file = csv_table.attributes['csv-file'].nodeValue;
        console.log(csv_table, csv_file);
        load_csv_data(csv_table, csv_file);
    });

    for (let csv_table_button of Array.from(csv_table_buttons)) {
        csv_table_button.addEventListener("click", function() { 
            if(this.hasAttribute("selected") == false)  {
                csv_file = this.attributes['csv-file'].nodeValue;
                csv_table = this.parentNode.parentNode.getElementsByTagName('table')[0];
                download_button = this.parentNode.querySelector('button[download]');
                csv_table.setAttribute('csv-file', csv_file);
                sibling_buttons = this.parentNode.childNodes;
                
                for(sibling_button of sibling_buttons){
                    //console.log(sibling_button)
                    if (sibling_button.tagName == "BUTTON") {
                        sibling_button.removeAttribute('selected');
                    }   
                }
                this.setAttribute('selected', '');
                download_button.setAttribute('download', csv_file);
                load_csv_data(csv_table, csv_file);
            } 
        });   
    }

    for (let download_button of Array.from(download_buttons)) {
        download_button.addEventListener("click", function() { 
            download_url = this.getAttribute('download');
            console.log(download_url);
            window.open(download_url);
        });   
    }    
}();

