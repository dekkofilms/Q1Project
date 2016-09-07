$(function () {

  var individualCharge;

  var $submitBtn = $('#submitBtn');

  var newBank = [];
  var nickname;
  $submitBtn.click(function () {
    //Grabbing nickname
    nickname = $('[name="nickname"]').val();

    //Grabbing the file that the user inputs
    var selectedFile = $('#csv')[0].files[0];

    //Papa Parse function scanning CSV file
    Papa.parse(selectedFile, {
    	delimiter: "",	// auto-detect
    	newline: "",	// auto-detect
    	header: true,
    	dynamicTyping: false,
    	preview: 10,
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
    var $newBankTable = $('<table class="fixedHead">');
    var $tableHead = $('<thead>');
    var $tableRow = $('<tr>');
    var $dateHeader = $('<th>Date</th>');
    var $descriptionHeader = $('<th>Description</th>');
    var $categoryHeader = $('<th>Category</th>');
    var $priceHeader = $('<th>Price</th>');
    var $tableBody = $('<tbody>')

    //Building collapsible entry
    var $unorderedTabs = $('#table-tabs');
    var $newListItem = $('<li class="tab">');
    var $tabbedLink = $('<a href="#' + nickname + '">' + nickname + '</a>');
    var $divForTable = $('<div id="' + nickname + '" class="col s12 overflow"></div>')


    entry.data.forEach(function (charge) {
      //Need a row for each of the charges
      var $newRow = $('<tr>');

      //Looping through each property in the charge
      for (var key in charge) {
        individualCharge = charge[key]
        var lowerKey = key.toLowerCase();

        //Defining boolean statements for multiple CSV files
        var descriptionBoolean = lowerKey.includes('description') && !lowerKey.includes('raw')
        var amountBoolean = lowerKey.includes('amount') || lowerKey.includes('debit');
        var dateBoolean = lowerKey.includes('date');
        var categoryBoolean = lowerKey.includes('category');

        if (amountBoolean) {
          var $newAmount = $('<td>' + charge[key] + '</td>');

        } else if (descriptionBoolean) {
          var $newDescription = $('<td>' + charge[key] + '</td>');
        } else if (dateBoolean) {
          var $newDate = $('<td>' + charge[key] + '</td>');
        } else if (categoryBoolean) {
          //Creating Dropdown elements
          var $categoryDiv = $('<div class="input-field col s12" id="catDiv">');
          var $select = $('<select>');
          var $food = $('<option value="food" id="Food">Food</option>');
          var $gas = $('<option value="gas" id="Gas/Automotive" selected>Gas/Automotive</option>');
          var $income = $('<option value="income" id="Income">Income</option>');
          var $entertainment = $('<option value="entertainment" id="Entertainment">Entertainment</option>');
          var $education = $('<option value="education" id="Education">Education</option>');
          var $newCategory = $('<td>');

          //Appending dropdown elements
          $select.append($food);
          $select.append($gas);
          $select.append($income);
          $select.append($entertainment);
          $select.append($education);
          $categoryDiv.append($select);
          $newCategory.append($categoryDiv);



        }
      }
      $newRow.append($newDate);
      $newRow.append($newDescription);
      $newRow.append($newCategory);
      $newRow.append($newAmount);
      $tableBody.append($newRow);
    })

    //Appending table together]
    $tableRow.append($dateHeader);
    $tableRow.append($descriptionHeader);
    $tableRow.append($categoryHeader);
    $tableRow.append($priceHeader);
    $tableHead.append($tableRow);
    $newBankTable.append($tableHead);
    $newBankTable.append($tableBody);

    //Appending this table to the HTML
    $newListItem.append($tabbedLink);
    $unorderedTabs.append($newListItem);
    $divForTable.append($newBankTable);
    $tableCollection.append($divForTable);

    function initialCategory (value) {
      var lowerCategory = value.toLowerCase();

      for (var id in categoryObj) {
        var categoryArray = categoryObj[id];

        categoryArray.forEach(function (synonym) {
          if (lowerCategory.includes(synonym)) {
            console.log(id);
            var match = $('#catDiv option:contains("' + id + '")');
            console.log(match);
            // $income.attr('selected', 'selected')
          }
        })
      }
    }

    // initialCategory(charge[key]);
    $('select').material_select();
  }

  //Event listener for the tabs inside of the table
  $(document).on("click", 'ul li', function(){
      $('ul li').removeClass('active');
      $(this).addClass('active');
  });

  $( "#table-collection" ).tabs();




})

//Object for the categories
var categoryObj = {
  'Food' : ['dining', 'food', 'fast food', 'restaurant', 'food & drink'],
  'Gas/Automotive' : ['gas', 'automotive', 'auto'],
  'Income' : ['paycheck', 'income', 'investment', 'financial', 'money', 'reimbursement'],
  'Entertainment' : ['arts', 'music', 'movie', 'culture', 'art'],
  'Education' : []
}

//append to an invisible table and then siphon through and change the categories

//show trends button for each bank account

//start working on chart.js
