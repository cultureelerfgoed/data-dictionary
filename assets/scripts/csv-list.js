function numberToHumanFormat(int) {
    let humanFormat = Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
    }).format(int);
    return humanFormat;
}

function searchList(list, input) {
    // Declare variables
    filter = input.toUpperCase();
    ul = list;
    li = ul.getElementsByTagName('li');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        } else {
        li[i].style.display = "none";
        }
    }
}

function sortList(list, order, type){
    ul = list
    if(order == 'desc' && type == 'numeric') {
        var new_ul = ul.cloneNode(false);
        var lis = [];
        for(var i = ul.childNodes.length; i--;){
            if(ul.childNodes[i].nodeName === 'LI')
                lis.push(ul.childNodes[i]);
        }
        lis.sort(function(a, b){
        return parseInt(b.childNodes[1].innerText, 10) - parseInt(a.childNodes[1].innerText, 10);
        });
        for(var i = 0; i < lis.length; i++)
            new_ul.appendChild(lis[i]);
            ul.parentNode.replaceChild(new_ul, ul);           
    }
    if(order == 'asc' && type == 'numeric') {
        var new_ul = ul.cloneNode(false);
        var lis = [];
        for(var i = ul.childNodes.length; i--;){
            if(ul.childNodes[i].nodeName === 'LI')
                lis.push(ul.childNodes[i]);
        }
        lis.sort(function(b, a){
            //console.log(parseInt(b.childNodes[1].innerText, 10))
        return parseInt(b.childNodes[1].innerText, 10) - parseInt(a.childNodes[1].innerText, 10);
        });   
        for(var i = 0; i < lis.length; i++)
            new_ul.appendChild(lis[i]);
            ul.parentNode.replaceChild(new_ul, ul);        
    }
    if(order == 'desc' && type == 'alpha') {
        Array.from(ul.getElementsByTagName("LI"))
        .sort((b, a) => a.childNodes[0].textContent.localeCompare(b.childNodes[0].textContent))
        .forEach(li => ul.appendChild(li));
    }
    if(order == 'asc' && type == 'alpha') {
        Array.from(ul.getElementsByTagName("LI"))
        .sort((a, b) => a.childNodes[0].textContent.localeCompare(b.childNodes[0].textContent))
        .forEach(li => ul.appendChild(li));         
    }          
}  

function load_csv_list_data(list, path) {
    //console.log(list);
    //console.log(path);
    list.innerHTML = "";

    Papa.parse(path, {
        download: true,
        header:false,
        delimiter: ";",
        complete: function(restults) {
            let i = 0;
            restults.data.map((data, index)=>{
                let value_name = data[0];
                let value_count_int = data[1];
                console.log('value_count_int: ' + value_count_int)
                if(value_count_int != '0' && value_count_int != undefined) {
                    let value_count_str = numberToHumanFormat(parseInt(data[1]));
                    let li = document.createElement('li');
                    let a = document.createElement('a');
                    let a_text = document.createTextNode(value_name);
                    a.appendChild(a_text)
                    let span_int = document.createElement('span');
                    let span_int_text = document.createTextNode(value_count_int);
                    span_int.appendChild(span_int_text);

                    let span_str = document.createElement('span');
                    let span_str_text = document.createTextNode(value_count_str);
                    span_str.appendChild(span_str_text);

                    li.append(a);
                    li.append(span_int);
                    li.append(span_str);
                    list.append(li);
                }
            });
        }
    });
}

const filter_buttons = document.querySelectorAll('article.csv-list button[sort]');
const filter_inputs = document.querySelectorAll('article.csv-list input.search');
const csv_lists = document.querySelectorAll('article.csv-list ul[csv-file]');
console.log(csv_lists);
!function(){
    //load csv data
    for (const csv_list of Array.from(csv_lists)) {
         //search list load csv data
        list = csv_list;
        csv_file = csv_list.attributes['csv-file'].nodeValue;
        console.log(list);
        console.log(list +'|'+ csv_file);
        if(csv_file != "") {
            load_csv_list_data(list, csv_file);
        }
    }

    //filter list init
    let selected_filter_buttons = document.querySelectorAll('article.csv-list button[sort][selected]')
    window.setTimeout(() => {    
        for(selected_filter_button of selected_filter_buttons) {
            list = selected_filter_button.parentNode.parentNode.querySelector('section ul');
            sort = selected_filter_button.attributes['sort'].nodeValue;
            order = sort.split('-')[1];
            type = sort.split('-')[0];
            //console.log(list);
            //console.log(list +'|'+ order +'|'+ type);
            sortList( list, order, type );
        }
    }, 100);

    //filter list button click
    for (const filter_button of Array.from(filter_buttons)) {
        filter_button.addEventListener("click", function() {    
            //.getAttribute('filter')
            list = this.parentNode.parentNode.querySelector('section ul');
            sort = this.attributes['sort'].nodeValue;
            order = sort.split('-')[1];
            type = sort.split('-')[0];
            //console.log(list +'|'+ order +'|'+ type);
            sortList( list, order, type );
            sibling_filter_buttons = this.parentNode.childNodes;
            for(sibling_filter_button of sibling_filter_buttons){
                //console.log(sibling_button)
                if (sibling_filter_button.tagName == "BUTTON") {
                    sibling_filter_button.removeAttribute('selected');
                }   
            }
            this.setAttribute('selected', '');
        });   
    }

    //search list
    window.setTimeout(() => {
        for (const filter_input of Array.from(filter_inputs)) {
            //search list with current input value
            search_value =  filter_input.value;
            list = filter_input.parentNode.parentNode.querySelector('section ul');
            csv_file = filter_input.parentNode.parentNode.querySelector('section ul[csv-file]').attributes['csv-file'].nodeValue;
            searchList(list, search_value);
        
            //search list after input keyup
            filter_input.addEventListener("keyup", function() {  
                list = this.parentNode.parentNode.querySelector('section ul');
                search_value =  this.value;
                searchList(list, search_value);
            });
        }
    }, 100);
}();
