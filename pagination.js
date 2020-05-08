function pagination(querySet, page, rows) {
	    var trimStart = (page - 1) * rows
	    var trimEnd = trimStart + rows
	    var trimmedData = [];
	    var add = true;
	    for(var i = trimStart; i <= trimEnd; i++){
	    	if(i >= querySet.length){
	    		add = false;
	    	}
	    	if(add){
	    		trimmedData.push(querySet[i]);
	    	}
	    }
	    var pages = Math.ceil(querySet.length / rows);
	    return {
	        'querySet': trimmedData,
	        'pages': pages,
	    }
	}

	function pageButtons(pages) {
	    var wrapper = document.getElementById('pagination-wrapper')
	    wrapper.innerHTML = ``
	    var maxLeft = (state.page - Math.floor(state.window / 2))
	    var maxRight = (state.page + Math.floor(state.window / 2))
	    if (maxLeft < 1) {
	        maxLeft = 1
	        maxRight = state.window
	    }
	    if (maxRight > pages) {
	        maxLeft = pages - (state.window - 1)
	        
	        if (maxLeft < 1){
	        	maxLeft = 1
	        }
	        maxRight = pages
	    }
	    for (var page = maxLeft; page <= maxRight; page++) {
	    	wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`
	    }
	    if (state.page != 1) {
	        wrapper.innerHTML = `<button value=${1} class="page btn btn-sm btn-info">&#171; First</button>` + wrapper.innerHTML
	    }

	    if (state.page != pages) {
	        wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`
	    }

	    $('.page').on('click', function() {
	        $('#myTable').empty()

	        state.page = Number($(this).val())
	        const database = document.querySelector('#database');
	        buildTable(database.value);
	    })

	}