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
	var world = [[], [], []];
	var worldS = [{}, {}, {}];
	var worldCount = [{}, {}, {}];
	var movies = [[], [], [], [], [], []];
	var moviesS = [{}, {}, {}, {}, {}, {}];
	var moviesCount = [{}, {}, {}, {}, {}, {}];
	var songs = [[], [], [], [], []];
	var songsS = [{}, {}, {}, {}, {}];
	var songsCount = [{}, {}, {}, {}, {}];
	const tables = ["city", "country", "countrylanguage"];
	var songTables = ["albums",  "tracks", "artists", "genres", "media_types"];
	const movieTables = ["dvd_titles", "labels", "sounds", "genres", "ratings", "formats"];
	var worldHead = [["ID", "Name", "CountryCode", "District", "Population"], 
					["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], 
					["CountryCode", "Language", "IsOfficial", "Percentage"]];
	var moviesHead = [["dvd_titles_id", "title", "release_date", "award", "label_id", "sound_id", "genre_id", "rating_id", "format_id"],
					["label_id", "label"],
					["sound_id", "sound"],
					["genre_id", "genre"],
					["rating_id", "rating"],
					["format_id", "format"]];
	var songsHead = [["album_id", "title", "artist_id"], 
					["track_id", "name", "album_id", "media_type_id", "genre_id", "composer", "milliseconds", "bytes", "unit_price"],
					["artist_id", "name"], 
					["genre_id", "name"], 
					["media_type_id", "name"]
					];
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
						world[0].push(object);
		    		}
		       }
			}
			buildTableW();
			
 		});
	}
	function primaryKeyW(key){
		var Parent = document.getElementById("myTable");
		while(Parent.hasChildNodes()){
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
						world[2].push(object);
		    	}
		       }
			}
			city(key);
 		});
	}
	function foreignKeyW(key){
		var Parent = document.getElementById("myTable");
		while(Parent.hasChildNodes()){
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
							world[1].push(object);
						}
						else if(object[table] == "city"){
							world[0].push(object);
						}
						else{
							world[1].push(object);
						}
				    }
				}
				buildTableW();
			}
		});
	}
	function buildTableM(){
		var append = document.getElementById("addTables");
		while(append.hasChildNodes()){
   			append.removeChild(append.firstChild);
		}
		for(var i = 0; i < moviesHead.length; i++){
			var table = document.createElement('table');
			var headR = document.createElement('tr');
			for(var j = 0; j < moviesHead[i].length; j++){
				var th = document.createElement('th');
				th.innerHTML = moviesHead[i][j].toUpperCase();
				headR.appendChild(th);
			}
			table.appendChild(document.createElement('thead').appendChild(headR));
			var data = movies[i];
			if(data.length == 0){
				var row = document.createElement('tr');
				var cell = document.createElement('td');
				cell.innerHTML = "No Results Found";
				row.appendChild(cell);
				table.appendChild(row);
			}
			for(var j = 0; j < data.length; j++){
				var row = document.createElement('tr');
				for(var l = 0; l < data[j].length -2; l++){
					var cell = document.createElement('td');
					cell.innerHTML = data[j][l];
					if(i == 0){
						if(l == 4){
							cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
							    foreignKeyM(this.innerHTML, "labels", 1);
							};
						}
					 	else if(l == 5){
					 		cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
								cell.setAttribute("class", "foreignK");
							    foreignKeyM(this.innerHTML, "sounds", 2);
							};
					 	}
					 	else if(l == 6){
					 		cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
								cell.setAttribute("class", "foreignK");
							    foreignKeyM(this.innerHTML, "genres", 3);
							};
					 	}
					 	else if(l == 7){
					 		cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
								cell.setAttribute("class", "foreignK");
							    foreignKeyM(this.innerHTML, "ratings", 4);
							};
					 	}
					 	else if(l == 8){
					 		cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
								cell.setAttribute("class", "foreignK");
							    foreignKeyM(this.innerHTML, "formats", 5);
							};
					 	}
					}
					else if(l == 0 && i != 0){
						if(i == 1){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "labels", 4);
						 	};
						}
						else if(i == 2){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "sounds", 5);
						 	};
						}
						else if(i == 3){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "genres", 6);
						 	};
						}
						else if(i == 4){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "ratings", 7);
						 	};
						 }else{
						 	cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyM(this.innerHTML, "formats", 8);
						 	};
						 }
					}
					row.appendChild(cell);
				}
				table.appendChild(row);
			}
			table.classList.add("table-dark", "table");
			append.appendChild(table);
		}
		movies = [[], [], [], [], [], []];
	    moviesS = [{}, {}, {}, {}, {}, {}];
	    moviesCount = [{}, {}, {}, {}, {}, {}];
	}
	function buildTableS(){
		var append = document.getElementById("addTables");
		while(append.hasChildNodes()){
   			append.removeChild(append.firstChild);
		}
		for(var i = 0; i < songsHead.length; i++){
			var table = document.createElement('table');
			var headR = document.createElement('tr');
			for(var j = 0; j < songsHead[i].length; j++){
				var th = document.createElement('th');
				th.innerHTML = songsHead[i][j].toUpperCase();
				headR.appendChild(th);
			}
			table.appendChild(document.createElement('thead').appendChild(headR));
			var data = songs[i];
			if(data.length == 0){
				var row = document.createElement('tr');
				var cell = document.createElement('td');
				cell.innerHTML = "No Results Found";
				row.appendChild(cell);
				table.appendChild(row);
			}
			for(var j = 0; j < data.length; j++){
				var row = document.createElement('tr');
				for(var l = 0; l < data[j].length-2; l++){
					var cell = document.createElement('td');
					cell.innerHTML = data[j][l];
					if(i == 0){
						if(l == 0){
						cell.setAttribute("class", "foreignK");
						 cell.onclick = function(){
						 	primaryKeyS(this.innerHTML,2 , "tracks", 1);
						 };
						}
						if(l == 2){
							cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
							    foreignKeyS(this.innerHTML, "artists", 2);
							};
						}
					}
					else if(i == 1){
						if(l == 2){
							cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
							    foreignKeyS(this.innerHTML, "albums", 0);
							};
						}
						else if(l == 3){
							cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
							    foreignKeyS(this.innerHTML, "media_types", 4);
							};
						}
						else if(l == 4){
							cell.setAttribute("class", "foreignK");
							cell.onclick = function () {
							    foreignKeyS(this.innerHTML, "genres", 3);
							};
						}
					}
					else if(l == 0 && i > 1){
						if(i == 2){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyS(this.innerHTML, 2, "albums", 0);
						 	};
						}
						else if(i == 3){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyS(this.innerHTML, 4, "tracks", 1);
						 	};
						}
						else if(i == 4){
							cell.setAttribute("class", "foreignK");
						 	cell.onclick = function(){
						 		primaryKeyS(this.innerHTML, 3, "tracks", 1);
						 	};
						}
					}
					row.appendChild(cell);
				}
				table.appendChild(row);
			}
			table.classList.add("table-dark", "table");
			append.appendChild(table);
		}
		songs = [[], [], [], [], []];
		songsS = [{}, {}, {}, {}, {}];
	    songsCount = [{}, {}, {}, {}, {}];
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
				th.innerHTML = worldHead[i][j].toUpperCase();
				headR.appendChild(th);
			}
			table.appendChild(document.createElement('thead').appendChild(headR));
			var data = world[i];
			if(data.length == 0){
				var row = document.createElement('tr');
				var cell = document.createElement('td');
				cell.innerHTML = "No Results Found";
				row.appendChild(cell);
				table.appendChild(row);
			}
			for(var j = 0; j < data.length; j++){
				var row = document.createElement('tr');
				for(var l = 0; l < data[j].length-2; l++){
					var cell = document.createElement('td');
					cell.innerHTML = data[j][l];
					if(i == 0){
						if(l == 2){
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
		world = [[],[],[]];
		worldS = [{}, {}, {}];
	    worldCount = [{}, {}, {}];
	}
	function foreignKeyM(key, table, index){
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
				    	movies[index].push(myObj[k]);
				    }
				}
			}
			buildTable("movie");
		});
	}
	function foreignKeyS(key, table, tIndex){
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
				    	console.log(myObj[k]);
				    	songs[tIndex].push(myObj[k]);
				    }
				}
			}
			buildTable("song");
		});
	}
	function primaryKeyS(key, index, table, tIndex){
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
				    		songs[tIndex].push(myObj[k]);
				    	}
				    }
				}
			}
			buildTable("song");
		});
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
				    		movies[0].push(myObj[k]);
				    	}
				    	
				    }
				}
			}
			buildTable("movie");
		});
	}
	function sortData(dataC, dataP, dataSet){
		var keysSorted;
		for(var i = 0; i < dataC.length; i++){
			keysSorted = Object.keys(dataC[i]).sort(function(a,b){return dataC[i][b]-dataC[i][a]});
			for(var j = 0; j < keysSorted.length; j++){
				dataSet[i].push(dataP[i][keysSorted[j]]);
			}
		}
		world = dataSet;
	}
	function buildTable(dataBase) {
		if(dataBase == "world"){
			sortData(worldCount, worldS, world);
			buildTableW();
		}
		else if(dataBase == "movie"){
			sortData(moviesCount, moviesS, movies);
			buildTableM();
		}
		else if(dataBase == "song"){
			sortData(songsCount, songsS, songs);
			buildTableS();
		}
	}
  function worldSearch(searchInput){
  		var search = searchInput.split(" ");
  		for(var i = 0; i < tables.length; i++){
	  		for(var j = 0; j < search.length; j++){
	  			var searchW = search[j].toLowerCase();
	  			var dbRef = firebase.database().ref().child("world").child("search").child(tables[i]).child(searchW);
	  			const index = i;
	  			const searchI = j;
	  			const res = searchW;
	  			dbRef.once('value', snapshot=>{
				  if (snapshot){
				  	console.log(searchW);
				    var res = JSON.stringify(snapshot.val());
				    var myObj = JSON.parse(res);
				    if(myObj != null){
				    	for(var k = 0; k < myObj.length; k++){
				    		if(worldS[index].hasOwnProperty(myObj[k][0])){
				    			worldCount[index][myObj[k][0]] += 50;
				    			var colsNew = myObj[k][myObj[k].length-1];
				    			var cols = worldS[index][myObj[k][0]][worldS[index][myObj[k][0]].length - 1];
				    			for(var i = 0; i < colsNew.length; i++){
				    				if(cols.includes(colsNew[i])){
				    					worldCount[index][myObj[k][0]] += 2;
				    				}
				    				else{
				    					cols.push(colsNew[i]);
				    					worldS[index][myObj[k][0]][worldS[index][myObj[k][0]].length - 1] = cols;
				    					worldCount[index][myObj[k][0]] += 0.001;
				    				}
				    			}
				    		}
				    		else{
				    			worldS[index][myObj[k][0]] = myObj[k];
				    			worldCount[index][myObj[k][0]] = 50;
				    			var cols = worldS[index][myObj[k][0]][worldS[index][myObj[k][0]].length - 1];
				    			for(var i = 0; i < cols.length; i++){
				    				worldCount[index][myObj[k][0]] += 0.001;
				    			}
				    		}
				    	}
				    }
				    if(index == tables.length-1 && searchI == search.length-1){
  						buildTable("world");
				    }
				   }
				});
	  		}
  		}
  }

  function movieSearch(searchInput){
  		var search = searchInput.split(" ");
  		for(var i = 0; i < movieTables.length; i++){
	  		for(var j = 0; j < search.length; j++){
	  			var searchW = search[j].toLowerCase();
	  			var dbRef = firebase.database().ref().child("movies").child("search").child(movieTables[i]).child(searchW);
	  			const index = i;
	  			const searchI = j;
	  			dbRef.once('value', snapshot=>{
				  if (snapshot ){
				    var res = JSON.stringify(snapshot.val());
				    var myObj = JSON.parse(res);
				    if(myObj != null){
				    	for(var k = 0; k < myObj.length; k++){
				    		if(moviesS[index].hasOwnProperty(myObj[k][0])){
				    			moviesCount[index][myObj[k][0]] += 50;
				    			var colsNew = myObj[k][myObj[k].length-1];
				    			var cols = moviesS[index][myObj[k][0]][moviesS[index][myObj[k][0]].length - 1];
				    			for(var i = 0; i < colsNew.length; i++){
				    				if(cols.includes(colsNew[i])){
				    					moviesCount[index][myObj[k][0]] += 2;
				    				}
				    				else{
				    					cols.push(colsNew[i]);
				    					moviesS[index][myObj[k][0]][moviesS[index][myObj[k][0]].length - 1] = cols;
				    					moviesCount[index][myObj[k][0]] += 0.001;
				    				}
				    			}
				    		}
				    		else{
				    			moviesS[index][myObj[k][0]] = myObj[k];
				    			moviesCount[index][myObj[k][0]] = 50;
				    			var cols = moviesS[index][myObj[k][0]][moviesS[index][myObj[k][0]].length - 1];
				    			for(var i = 0; i < cols.length; i++){
				    				moviesCount[index][myObj[k][0]] += 0.001;
				    			}
				    		}
				    	}
				    }
				    if(index == movieTables.length-1 && searchI == search.length-1){
  						buildTable("movie");
				    }
				   }
				});
	  		}
  		}
  }

  function songSearch(searchInput){
  		var search = searchInput.split(" ");
  		for(var i = 0; i < songTables.length; i++){
	  		for(var j = 0; j < search.length; j++){
	  			var searchW = search[j].toLowerCase();
	  			var dbRef = firebase.database().ref().child("songs").child("search").child(songTables[i]).child(searchW);
	  			const index = i;
	  			const searchI = j;
	  			dbRef.once('value', snapshot=>{
				  if (snapshot ){
				    var res = JSON.stringify(snapshot.val())
				    var myObj = JSON.parse(res);
				    if(myObj != null){
				    	for(var k = 0; k < myObj.length; k++){
				    		if(songsS[index].hasOwnProperty(myObj[k][0])){
				    			songsCount[index][myObj[k][0]] += 50;
				    			var colsNew = myObj[k][myObj[k].length-1];
				    			var cols = songsS[index][myObj[k][0]][songsS[index][myObj[k][0]].length - 1];
				    			for(var i = 0; i < colsNew.length; i++){
				    				if(cols.includes(colsNew[i])){
				    					songsCount[index][myObj[k][0]] += 2;
				    				}
				    				else{
				    					cols.push(colsNew[i]);
				    					songsS[index][myObj[k][0]][songsS[index][myObj[k][0]].length - 1] = cols;
				    					songsCount[index][myObj[k][0]] += 0.001;
				    				}
				    			}
				    		}
				    		else{
				    			songsS[index][myObj[k][0]] = myObj[k];
				    			songsCount[index][myObj[k][0]] = 50;
				    			var cols = songsS[index][myObj[k][0]][songsS[index][myObj[k][0]].length - 1];
				    			for(var i = 0; i < cols.length; i++){
				    				songsCount[index][myObj[k][0]] += 0.001;
				    			}
				    		}
				    	}
				    }
				    if(index == songTables.length-1 && searchI == search.length-1){
				      	buildTable("song");
				    }
				  }
				});
	  			
	  		}
  		}
  }
  document.getElementById("search-form").onsubmit = function(event){
	event.preventDefault();
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
