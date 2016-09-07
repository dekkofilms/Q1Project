$(function () {

  var latestEntry;
  var myCategories = {};
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

  var $showTrendBtn = $('<a class="waves-effect waves-light btn">Show Trends</a>');
  $('#show-trend').append($showTrendBtn);



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
      var selectedOption;
      for (var key in charge) {
        var lowerKey = key.toLowerCase();

        //Defining boolean statements for multiple CSV files
        var descriptionBoolean = lowerKey.includes('description') && !lowerKey.includes('raw')
        var amountBoolean = lowerKey.includes('amount') || lowerKey.includes('debit');
        var dateBoolean = lowerKey.includes('date');
        var categoryBoolean = lowerKey.includes('category');

        if (amountBoolean) {
          var $newAmount = $('<td>' + charge[key] + '</td>');
          // console.log('inside',dollaAmount);
        } else if (descriptionBoolean) {
          var $newDescription = $('<td>' + charge[key] + '</td>');
        } else if (dateBoolean) {
          var $newDate = $('<td>' + charge[key] + '</td>');
        } else if (categoryBoolean) {
          var categoryId = initialCategory(charge[key]);
          //Creating Dropdown elements
          var $categoryDiv = $('<div class="input-field col s12" class="catDiv">');
          var $select = $('<select>');
          var $food = $('<option value="food" class="Food">Food</option>');
          var $gas = $('<option value="gas" class="Gas/Automotive">Gas/Automotive</option>');
          var $income = $('<option value="income" class="Income">Income</option>');
          var $entertainment = $('<option value="entertainment" class="Entertainment">Entertainment</option>');
          var $education = $('<option value="education" class="Education">Education</option>');
          var $other = $('<option value="other" class="Other">Other</option>');
          var $newCategory = $('<td>');

          // var match = $('#catDiv option:contains("' + categoryId + '")');
          //Appending dropdown elements
          $select.append($food);
          $select.append($gas);
          $select.append($income);
          $select.append($entertainment);
          $select.append($education);
          $select.append($other);
          $categoryDiv.append($select);
          $newCategory.append($categoryDiv);

          var match = $select.children('.' + categoryId);
          match.attr('selected', 'selected');
        }
      }

      $newRow.append($newDate);
      $newRow.append($newDescription);
      $newRow.append($newCategory);
      $newRow.append($newAmount);

      // get the inner html for cate
      var amount = parseInt($newAmount.html());
      myCategories[categoryId] = amount + amount;
      // console.log(myCategories);
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
      var foundCategory = false;

      for (var id in categoryObj) {
        var categoryArray = categoryObj[id];

        categoryArray.forEach(function (synonym) {
          if (lowerCategory.includes(synonym)) {
            myCategories[id] = 0;
            foundCategory = id;
            return;
          }
        })
      }

      return foundCategory;
    }


    $('select').material_select();

  }

  //Event listener for the tabs inside of the table
  $(document).on("click", 'ul li', function(){
      $('ul li').removeClass('active');
      $(this).addClass('active');
  });

  $( "#table-collection" ).tabs();

  // console.log(myCategories);

  $(document).on("click", '#show-trend', function(){
      var newCanvas = $('#show-trend-results')
      var showResults = new Chart(newCanvas, {
                        type: 'horizontalBar',
                        data: {
                            labels: ["Food", "Gas/Automotive", "Income", "Entertainment", "Education"],
                            datasets: [{
                                label: 'Money Trends',
                                data: [Math.abs(myCategories.Food), Math.abs(myCategories['Gas/Automotive']), Math.abs(myCategories.Income), Math.abs(myCategories.Entertainment), Math.abs(myCategories.Education)],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255,99,132,1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            }
                        },
                        responsive : true
                    });
  });

})

//Object for the categories
var categoryObj = {
  'Food' : ['dining', 'food', 'fast food', 'restaurant', 'food & drink'],
  'Gas/Automotive' : ['gas', 'automotive', 'auto'],
  'Income' : ['paycheck', 'income', 'investment', 'financial', 'money', 'reimbursement'],
  'Entertainment' : ['arts', 'music', 'movie', 'culture', 'art'],
  'Education' : ['education'],
  'Other' : []
}

//append to an invisible table and then siphon through and change the categories

//show trends button for each bank account

//start working on chart.js
