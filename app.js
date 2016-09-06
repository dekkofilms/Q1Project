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
    // $("#fixedHead").freezeHeader();
    //Setting the base for the table
    var $tableCollection = $('#table-collection');
    var $newBankTable = $('<table id="fixedHead">');
    var $tableHead = $('<thead>');
    var $tableRow = $('<tr>');
    var $dateHeader = $('<th>Date</th>');
    var $descriptionHeader = $('<th>Description</th>');
    var $priceHeader = $('<th>Price</th>');
    var $tableBody = $('<tbody>')

    //Building collapsible entry
    var $unorderedTabs = $('#table-tabs');
    var $newListItem = $('<li class="tab" id="tabs">');
    var $tabbedLink = $('<a href="#' + nickname + '">' + nickname + '</a>');
    var $divForTable = $('<div id="' + nickname + '" class="overflow"></div>')


    entry.data.forEach(function (charge) {
      //Need a row for each of the charges
      var $newRow = $('<tr>');

      //Looping through each property in the charge
      for (var key in charge) {
        var lowerKey = key.toLowerCase();

        //Defining boolean statements for multiple CSV files
        var descriptionBoolean = lowerKey.includes('description') && !lowerKey.includes('raw')
        var amountBoolean = lowerKey.includes('amount') || lowerKey.includes('debit');
        var dateBoolean = lowerKey.includes('date')

        if (amountBoolean) {
          var $newAmount = $('<td>' + charge[key] + '</td>');

        } else if (descriptionBoolean) {
          var $newDescription = $('<td>' + charge[key] + '</td>');
        } else if (dateBoolean) {
          var $newDate = $('<td>' + charge[key] + '</td>');
        }
      }
      $newRow.append($newDate);
      $newRow.append($newDescription);
      $newRow.append($newAmount);
      $tableBody.append($newRow);
    })

    //Appending table together]
    $tableRow.append($dateHeader);
    $tableRow.append($descriptionHeader);
    $tableRow.append($priceHeader);
    $tableHead.append($tableRow);
    $newBankTable.append($tableHead);
    $newBankTable.append($tableBody);

    //Appending this table to the HTML
    $newListItem.append($tabbedLink);
    $unorderedTabs.append($newListItem);
    $divForTable.append($newBankTable);
    $tableCollection.append($divForTable);
  }

  //Event listener for the tabs inside of the table
  $(document).on("click", 'ul li', function(){
      $('ul li').removeClass('active');
      $(this).addClass('active');
  });

  $( "#table-collection" ).tabs();



})
//need to have a show trends button for each table
//
