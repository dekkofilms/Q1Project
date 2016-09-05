$(function () {

  var $submitBtn = $('#submitBtn');


  var newBank = [];
  var nickname;
  $submitBtn.click(function () {
    //Grabbing nickname
    nickname = $('[name="nickname"]').val();
    console.log(nickname);

    //Grabbing the file that the user inputs
    var selectedFile = $('#csv')[0].files[0];

    //Papa Parse function scanning CSV file
    Papa.parse(selectedFile, {
    	delimiter: "",	// auto-detect
    	newline: "",	// auto-detect
    	header: true,
    	dynamicTyping: false,
    	preview: 0,
    	encoding: "",
    	worker: false,
    	comments: false,
    	step: undefined,
    	complete: undefined,
    	error: undefined,
    	download: false,
    	skipEmptyLines: false,
    	chunk: undefined,
    	fastMode: undefined,
    	beforeFirstChunk: undefined,
    	withCredentials: undefined,
	    complete: function(results) {
        var totalTransactions = results.data.length;
        for (var i = 0; i < totalTransactions; i++) {
          for (var key in results.data[i]) {
            var noSpaces;
            (typeof key === 'string') ? noSpaces = key.trim() : key;
            // console.log(noSpaces);
          }
        }
        newBank.push(results);
        // console.log(newBank.pop());

        var latestEntry = newBank.pop();

        createTable(latestEntry);
      }
    });

    this.form.reset()
  });




  function createTable (entry) {
    //Setting the base for the table
    var $tableCollection = $('#table-collection');
    var $newBankTable = $('<table>');
    var $tableHead = $('<thead>');
    var $tableRow = $('<tr>');
    var $descriptionHeader = $('<th>Description</th>');
    var $priceHeader = $('<th>Price</th>');
    var $tableBody = $('<tbody>')

    //Building collapsible entry
    var $newListItem = $('<li>');
    var $newHeader = $('<div class="collapsible-header">' + '<h3>' + nickname + '</h3>' + '</div>');
    var $newBody = $('<div class="collapsible-body">')


    entry.data.forEach(function (charge) {
      //Building table body base
      var $newRow = $('<tr>');

      for (var key in charge) {
        var lowerKey = key.toLowerCase();

        //defining boolean statements for multiple CSV files
        var descriptionBoolean = lowerKey.includes('description') && !lowerKey.includes('raw')
        var amountBoolean = lowerKey.includes('amount') || lowerKey.includes('debit');

        if (amountBoolean) {
          var $newAmount = $('<td>' + charge[key] + '</td>');
          // console.log(charge[key]);

        } else if (descriptionBoolean) {
          var $newDescription = $('<td>' + charge[key] + '</td>');
          // console.log(charge[key]);
        }
      }
      $newRow.append($newDescription);
      $newRow.append($newAmount);
      $tableBody.append($newRow);
    })

    //Appending table to each other and then HTML

    $tableRow.append($descriptionHeader);
    $tableRow.append($priceHeader);
    $tableHead.append($tableRow);
    $newBankTable.append($tableHead);
    $newBankTable.append($tableBody);

    $newListItem.append($newHeader);
    $newBody.append($newBankTable);
    $newListItem.append($newBody);
    $tableCollection.append($newListItem);

  }





})






//function that takes the data and creates a table
//need to have a show trends button for each table
//
