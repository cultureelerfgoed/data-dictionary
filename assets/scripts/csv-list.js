const filter_inputs = document.querySelectorAll('input[search]');
for (const filter_input of Array.from(filter_inputs)) {
    filter_input.addEventListener("keyup", function() {   
        list = this.parentNode.attributes['filter-list'].nodeValue;
        search_value =  this.value
        //console.log(list+'|'+search_value)
        searchBrowseList(list, search_value)
    }); 
}

function searchBrowseList(list, input) {
    filter = input.toUpperCase();
    var uls = document.querySelectorAll('ul[filter-list="'+list+'"]');
    var ul = uls[uls.length - 1]
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