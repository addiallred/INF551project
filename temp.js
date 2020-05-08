
var songTables = ["albums",  "tracks", "artists", "genres", "media_types"];
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
  }












