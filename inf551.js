// Initialize Firebase

  // Your web app's Firebase configuration
  // ************  please change this to your project configuration ********
  var firebaseConfig = {
    apiKey: "AIzaSyBqBHkOU65xTXwauBbHDJHcuF5ap39UC28",
    authDomain: "project551-5d799.firebaseapp.com",
    databaseURL: "https://project551-5d799.firebaseio.com",
    projectId: "project551-5d799",
    storageBucket: "project551-5d799.appspot.com",
    messagingSenderId: "391020025195",
    appId: "1:391020025195:web:619e7f2a7396e00106682e",
    measurementId: "G-XTZZP4GEVD"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
    var state = {
    'querySet': [],

    'page': 1,
    'rows': 15,
    'window': 5,
}



	function pagination(querySet, page, rows) {

	    var trimStart = (page - 1) * rows
	    var trimEnd = trimStart + rows
	    console.log(querySet.length)
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
	    console.log(trimmedData);
	    console.log(querySet.length)
	    var pages = Math.ceil(querySet.length / rows);
	    console.log(pages)

	    return {
	        'querySet': trimmedData,
	        'pages': pages,
	    }
	}

	function pageButtons(pages) {
	    var wrapper = document.getElementById('pagination-wrapper')

	    wrapper.innerHTML = ``
		console.log('Pages:', pages)

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

	        buildTable()
	    })

	}


	function buildTable() {
	    var table = $('#myTable')

	    var data = pagination(state.querySet, state.page, state.rows)
	    var table = document.getElementById("myTable");
	    for(var i = 0; i < data.querySet.length; i++){
			var row = table.insertRow();
			for(var l = 0; l < data.querySet[i].length; l++){
				 var cell = row.insertCell();
				 cell.innerHTML = data.querySet[i][l];
			}
	    }

	    pageButtons(data.pages)
	}
  function worldSearch(searchInput){
  		var search = searchInput.split(" ");
  		const tables = ["city", "country", "countrylanguage"];
  		for(var i = 0; i < tables.length; i++){
	  		for(var j = 0; j < search.length; j++){
	  			var searchW = search[j].toLowerCase();
	  			var dbRef = firebase.database().ref().child("world").child(tables[i]).child(search[j]);
	  			const index = i;
	  			dbRef.once('value', snapshot=>{
				  if (snapshot){
				    var res = JSON.stringify(snapshot.val());
				    var myObj = JSON.parse(res);
				    if(myObj != null){
				    	for(var k = 0; k < myObj.length; k++){
				    		state.querySet.push(myObj[k]);
				    	}
				    }
				    if(index == tables.length-1){
  						buildTable();
				    }
				   }
				});
	  			
	  		}
  		}

  }

  function movieSearch(searchInput){
  		var search = searchInput.split(" ");
  		const tables = ["dvd_titles", "formats", "genres", "labels", "ratings", "sounds"];
  		for(var i = 0; i < tables.length; i++){
	  		for(var j = 0; j < search.length; j++){
	  			var searchW = search[j].toLowerCase();
	  			var dbRef = firebase.database().ref().child("movies").child(tables[i]).child(search[j]);
	  			const index = i;
	  			dbRef.once('value', snapshot=>{
				  if (snapshot ){
				    var res = JSON.stringify(snapshot.val());
				    var myObj = JSON.parse(res);
				    if(myObj != null){
				    	for(var k = 0; k < myObj.length; k++){
				    		state.querySet.push(myObj[k]);
				    	}
				    }
				    if(index == tables.length-1){
  						buildTable();
				    }
				   }
				});
	  			
	  		}
  		}
  }

  function songSearch(searchInput){
  		var search = searchInput.split(" ");
  		const tables = ["albums", "artists", "formats", "genres", "media_types", "tracks"];
  		for(var i = 0; i < tables.length; i++){
	  		for(var j = 0; j < search.length; j++){
	  			var searchW = search[j].toLowerCase();
	  			var dbRef = firebase.database().ref().child("movies").child(tables[i]).child(search[j]);
	  			const index = i;
	  			dbRef.once('value', snapshot=>{
				  if (snapshot ){
				    var res = JSON.stringify(snapshot.val())
				    var myObj = JSON.parse(res);
				    if(myObj != null){
				    	for(var k = 0; k < myObj.length; k++){
				    		state.querySet.push(myObj[k]);
				    	}
				    }
				    if(index == tables.length-1){
  						buildTable();
				    }
				  }
				});
	  			
	  		}
  		}
  }

  document.getElementById("search-form").onsubmit = function(event){
	event.preventDefault();
	state.querySet = [];
	let searchInput = document.querySelector(".form-control").value.trim();
	const database = document.querySelector('#database');
	var Parent = document.getElementById("myTable");
	while(Parent.hasChildNodes())
	{
   		Parent.removeChild(Parent.firstChild);
	}
	if(database.value == "world"){
		worldSearch(searchInput);
	}
	else if(database.value == "movie"){
		movieSearch(searchInput);
	}
  	
};