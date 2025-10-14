function load_csv_data(table, path) {
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

let csv_tables = document.querySelectorAll('table[csv-file]');
csv_tables.forEach(csv_table => {
    csv_file = csv_table.attributes['csv-file'].nodeValue;
    console.log(csv_table, csv_file)
    load_csv_data(csv_table, csv_file)
});