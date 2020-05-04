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
	var world = {
		'city' : [], 
		'country' : [],
		'countrylanguage' : []
	}
	var worldHead = [["ID", "Name", "CountryCode", "District", "Population"], 
					["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], 
					["CountryCode", "Language", "IsOfficial", "Percentage"]];

	var cityFk = 2;

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
	function city(key){
		key = key.toLowerCase();
		var dbRef = firebase.database().ref().child("world").child("search").child("city").child(key);
		dbRef.once('value', snapshot=>{
		  if (snapshot){
		    	var res = JSON.stringify(snapshot.val());
		  	    var myObj = JSON.parse(res);
			    if(myObj != null){
			    	for(var k = 0; k < myObj.length; k++){
			    		var object = myObj[k];
						world.city.push(object);
		    		}
		       }
			}
			buildTable("world");
			
 		});
	}
	function primaryKeyW(key){
		var Parent = document.getElementById("myTable");
		while(Parent.hasChildNodes())
		{
   			Parent.removeChild(Parent.firstChild);
		}
		var dbRef = firebase.database().ref().child("world").child("f_keys").child("countrylanguage").child(key);
		dbRef.once('value', snapshot=>{
		  if (snapshot){
		    var res = JSON.stringify(snapshot.val());
		  	    var myObj = JSON.parse(res);
			    if(myObj != null){
		    	for(var k = 0; k < myObj.length; k++){
		    			var object = myObj[k];
						world.countrylanguage.push(object);
		    	}
		       }
			}
			city(key);
 		});
		
		
	}
	function foreignKeyW(key){
		var Parent = document.getElementById("myTable");
		while(Parent.hasChildNodes())
		{
   			Parent.removeChild(Parent.firstChild);
		}
		var dbRef = firebase.database().ref().child("world").child("f_keys").child("country").child(key);
		dbRef.once('value', snapshot=>{
			if (snapshot){
				var res = JSON.stringify(snapshot.val());
				var myObj = JSON.parse(res);
				if(myObj != null){
					for(var k = 0; k < myObj.length; k++){
						var object = myObj[k];
						var table = myObj[k].length-1;
						if(object[table] == "country"){
							world.country.push(object);
						}
						else if(object[table] == "city"){
							world.city.push(object);
						}
						else{
							world.countrylanguage.push(object);
						}
				    }
				}
				buildTable("world");
			}
		});

		
	}
	function buildTableW(){
		var append = document.getElementById("addTables");
		while(append.hasChildNodes())
		{
   			append.removeChild(append.firstChild);
		}
		for(var i = 0; i < 3; i++){
			var table = document.createElement('table');
			var headR = document.createElement('tr');
			for(var j = 0; j < worldHead[i].length; j++){
				var th = document.createElement('th');
				th.innerHTML = worldHead[i][j];
				headR.appendChild(th);
			}
			table.appendChild(document.createElement('thead').appendChild(headR));
			var data = world.countrylanguage;
			if(i == 0){
				data = world.city;
			}
			else if(i == 1){
				data = world.country;
			}
			if(data.length == 0){
				var row = document.createElement('tr');
				var cell = document.createElement('td');
				cell.innerHTML = "No Results Found";
				row.appendChild(cell);
				table.appendChild(row);
			}
			for(var j = 0; j < data.length; j++){
				var row = document.createElement('tr');
				for(var l = 0; l < data[j].length -1; l++){
					var cell = document.createElement('td');
					cell.innerHTML = data[j][l];
					if(i == 0){
						if(l == cityFk){
							cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
							    foreignKeyW(this.innerHTML);
								};
						}
					}
					if(i == 1 || i == 2){
						if(l == 0){
							cell.setAttribute("class", "foreignK");
							if(i == 1){
								cell.onclick = function () {
							    	primaryKeyW(this.innerHTML);
								};
							}
							else{
								cell.onclick = function () {
	 					    		foreignKeyW(this.innerHTML);
	 							};
							}
						}
					}
					row.appendChild(cell);
				}
				table.appendChild(row);
			}
			table.classList.add("table-dark", "table");
			append.appendChild(table);
		}
		world.city = [];
		world.country = [];
		world.countrylanguage = [];
	}
	// function buildTableW(){
	// 	var table = $('#myTable');
	//     var data = pagination(state.querySet, state.page, state.rows)
	//     var table = document.getElementById("myTable");
	//     for(var i = 0; i < data.querySet.length; i++){
	// 		var row = table.insertRow();
	// 		if(data.querySet[i][data.querySet[i].length-1] == "city"){
	// 			for(var l = 0; l < data.querySet[i].length-1; l++){
	// 				var cell = row.insertCell();
	// 				if(l == cityFk){
	// 					cell.innerHTML = data.querySet[i][l];
	// 					cell.setAttribute("class", "foreignK");
	// 					cell.onclick = function () {
	// 					    foreignKeyW(this.innerHTML);
	// 					};
	// 				}
	// 				else{
	// 					cell.innerHTML = data.querySet[i][l];
	// 				}
				 	
	// 			}
	// 		}
	// 		else if(data.querySet[i][data.querySet[i].length-1] == "country"){
	// 			for(var l = 0; l < data.querySet[i].length-1; l++){
	// 				var cell = row.insertCell();
	// 				if(l == 0){
	// 					cell.innerHTML = data.querySet[i][l];
	// 					cell.setAttribute("class", "foreignK");
	// 					cell.onclick = function () {
	// 					    primaryKeyW(this.innerHTML);
	// 					};
	// 				}
	// 				else{
	// 					cell.innerHTML = data.querySet[i][l];
	// 				}
	// 			}
	// 		}
	// 		else{
	// 			for(var l = 0; l < data.querySet[i].length-1; l++){
	// 				var cell = row.insertCell();
	// 				if(l == 0){
	// 					cell.innerHTML = data.querySet[i][l];
	// 					cell.setAttribute("class", "foreignK");
	// 					cell.onclick = function () {
	// 					    foreignKeyW(this.innerHTML);
	// 					};
	// 				}
	// 				else{
	// 					cell.innerHTML = data.querySet[i][l];
	// 				}
	// 			}
	// 		}
			
	//     }

	//     pageButtons(data.pages)
	//}
	function foreignKeyM(key, table){
		var Parent = document.getElementById("myTable");
		while(Parent.hasChildNodes())
		{
   			Parent.removeChild(Parent.firstChild);
		}
		var dbRef = firebase.database().ref().child("movies").child("f_keys").child(table).child(key);
		dbRef.once('value', snapshot=>{
			if (snapshot){
				var res = JSON.stringify(snapshot.val());
				var myObj = JSON.parse(res);
				if(myObj != null){
				    for(var k = 0; k < myObj.length; k++){
				    	state.querySet.push(myObj[k]);
				    }
				}
			}
			buildTable("movie");
		});
	}
	function foreignKeyS(key, table){
		var Parent = document.getElementById("myTable");
		while(Parent.hasChildNodes())
		{
   			Parent.removeChild(Parent.firstChild);
		}
		var dbRef = firebase.database().ref().child("songs").child("f_keys").child(table).child(key);
		dbRef.once('value', snapshot=>{
			if (snapshot){
				var res = JSON.stringify(snapshot.val());
				var myObj = JSON.parse(res);
				if(myObj != null){
				    for(var k = 0; k < myObj.length; k++){
				    	state.querySet.push(myObj[k]);
				    }
				}
			}
			buildTable("song");
		});
	}
	function primaryKeyS(key, index, table){
		var Parent = document.getElementById("myTable");
		while(Parent.hasChildNodes())
		{
   			Parent.removeChild(Parent.firstChild);
		}
		var dbRef = firebase.database().ref().child("songs").child("search").child(table).child(key);
		dbRef.once('value', snapshot=>{
			if (snapshot){
				var res = JSON.stringify(snapshot.val());
				var myObj = JSON.parse(res);
				if(myObj != null){
				    for(var k = 0; k < myObj.length; k++){
				    	if(myObj[k][index] == key){
				    		state.querySet.push(myObj[k]);
				    	}
				    }
				}
			}
			buildTable("song");
		});
	}
	function buildTableS(){
		var table = $('#myTable');
		var data = pagination(state.querySet, state.page, state.rows)
	    var table = document.getElementById("myTable");
	    for(var i = 0; i < data.querySet.length; i++){
			var row = table.insertRow();
			if(data.querySet[i][data.querySet[i].length-1] == "albums"){
				for(var l = 0; l < data.querySet[i].length-1; l++){
					var cell = row.insertCell();
					cell.innerHTML = data.querySet[i][l];
					if(l == 0){
						cell.setAttribute("class", "foreignK");
						 cell.onclick = function(){
						 	primaryKeyS(this.innerHTML,2 , "tracks");
						 };
					}
					if(l == 2){
						cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyS(this.innerHTML, "artists");
						};
					}
				}
			}
			else if(data.querySet[i][data.querySet[i].length-1] == "tracks"){
				for(var l = 0; l < data.querySet[i].length-1; l++){
				 	var cell = row.insertCell();
					cell.innerHTML = data.querySet[i][l];
					if(l == 2){
						cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyS(this.innerHTML, "albums");
						};
					}
					else if(l == 3){
						cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyS(this.innerHTML, "media_types");
						};
					}
					else if(l == 4){
						cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyS(this.innerHTML, "genres");
						};
					}
				}
			}
			else{
				for(var l = 0; l < data.querySet[i].length-1; l++){
					var cell = row.insertCell();
					cell.innerHTML = data.querySet[i][l];
					if(l == 0){
						if(data.querySet[i][data.querySet[i].length-1] == "artists"){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyS(this.innerHTML, 2, "albums");
						 	};
						}
						else if(data.querySet[i][data.querySet[i].length-1] == "genres"){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyS(this.innerHTML, 4, "tracks");
						 	};
						}
						else if(data.querySet[i][data.querySet[i].length-1] == "media_types"){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyS(this.innerHTML, 3, "tracks");
						 	};
						}
					}
				}
			}
	    }
	    pageButtons(data.pages)
	}
	function primaryKeyM(key, table, index){
		var Parent = document.getElementById("myTable");
		while(Parent.hasChildNodes())
		{
   			Parent.removeChild(Parent.firstChild);
		}
		var dbRef = firebase.database().ref().child("movies").child("search").child("dvd_titles").child(key);
		dbRef.once('value', snapshot=>{
			if (snapshot){
				var res = JSON.stringify(snapshot.val());
				var myObj = JSON.parse(res);
				if(myObj != null){
				    for(var k = 0; k < myObj.length; k++){
				    	if(myObj[k][index] == key){
				    		state.querySet.push(myObj[k]);
				    	}
				    	
				    }
				}
			}
			buildTable("movie");
		});
	}
	function buildTableM(){
		var table = $('#myTable');
		var data = pagination(state.querySet, state.page, state.rows)
	    var table = document.getElementById("myTable");
	    for(var i = 0; i < data.querySet.length; i++){
			var row = table.insertRow();
			if(data.querySet[i][data.querySet[i].length-1] == "dvd_titles"){
				for(var l = 0; l < data.querySet[i].length-1; l++){
					var cell = row.insertCell();
					cell.innerHTML = data.querySet[i][l];
					if(l == 4){
						cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyM(this.innerHTML, "labels");
						};
					}
				 	else if(l == 5){
				 		cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyM(this.innerHTML, "sounds");
						};
				 	}
				 	else if(l == 6){
				 		cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyM(this.innerHTML, "genres");
						};
				 	}
				 	else if(l == 7){
				 		cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyM(this.innerHTML, "ratings");
						};
				 	}
				 	else if(l == 8){
				 		cell.setAttribute("class", "foreignK");
						cell.onclick = function () {
						    foreignKeyM(this.innerHTML, "formats");
						};
				 	}
				}
			}
			else{
				for(var l = 0; l < data.querySet[i].length-1; l++){
					var cell = row.insertCell();
					cell.innerHTML = data.querySet[i][l];
					if(l == 0){
						if(data.querySet[i][data.querySet[i].length-1] == "genres"){
						 	cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "genres", 6);
						 	};
						}
						else if(data.querySet[i][data.querySet[i].length-1] == "labels"){
						 	cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "labels", 4);
						 	};
						}
						else if(data.querySet[i][data.querySet[i].length-1] == "sounds"){
						 	cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "sounds", 5);
						 	};
						}
						else if(data.querySet[i][data.querySet[i].length-1] == "ratings"){
						 	cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "ratings", 7);
						 	};
						}
						else if(data.querySet[i][data.querySet[i].length-1] == "formats"){
						 	cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "formats", 8);
						 	};
						}
					}
				}
			}
	    }
	    pageButtons(data.pages)
	}
	function buildTable(dataBase) {
		if(dataBase == "world"){
			buildTableW();
			console.log(world.city);
		}
		else if(dataBase == "movie")
		{
			buildTableM();
		}
		else if(dataBase == "song"){
			buildTableS();
		}
	}
  function worldSearch(searchInput){
  		var search = searchInput.split(" ");
  		const tables = ["city", "country", "countrylanguage"];
  		for(var i = 0; i < tables.length; i++){
	  		for(var j = 0; j < search.length; j++){
	  			var searchW = search[j].toLowerCase();
	  			var dbRef = firebase.database().ref().child("world").child("search").child(tables[i]).child(searchW);
	  			const index = i;
	  			dbRef.once('value', snapshot=>{
				  if (snapshot){
				    var res = JSON.stringify(snapshot.val());
				    var myObj = JSON.parse(res);
				    if(myObj != null){
				    	for(var k = 0; k < myObj.length; k++){
				    		state.querySet.push(myObj[k]);
				    		if(tables[index] == "city"){
				    			world.city.push(myObj[k]);
				    		}
				    		else if(tables[index] == "country"){
				    			world.country.push(myObj[k]);
				    		}
				    		else{
				    			world.countrylanguage.push(myObj[k]);
				    		}
				    	}
				    }
				    if(index == tables.length-1){
  						buildTable("world");
				    }
				   }
				});
	  		}
  		}
  		console.log(world.country);
  }

  function movieSearch(searchInput){
  		var search = searchInput.split(" ");
  		const tables = ["dvd_titles", "formats", "genres", "labels", "ratings", "sounds"];
  		for(var i = 0; i < tables.length; i++){
	  		for(var j = 0; j < search.length; j++){
	  			var searchW = search[j].toLowerCase();
	  			var dbRef = firebase.database().ref().child("movies").child("search").child(tables[i]).child(searchW);
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
  						buildTable("movie");
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
	  			var dbRef = firebase.database().ref().child("songs").child("search").child(tables[i]).child(searchW);
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
  						buildTable("song");
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
  	else if(database.value == "song"){
  		songSearch(searchInput);
  	}
};