$(function () {

  // $('#table-collection').hide()

  var $showTrendBtn = $('<a class="waves-effect waves-light btn-flat">Show Trends</a>');
  $('#show-trend').append($showTrendBtn);
  $showTrendBtn.hide();

  var latestEntry;
  var myCategories = {};
  var $submitBtn = $('#submitBtn');

  var foodSum, autoSum, incomeSum, entertainmentSum, educationSum, otherSum;

  var newBank = [];
  var nickname;
  $submitBtn.click(function () {
    $showTrendBtn.show();

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
        newBank.push(results);
        // console.log(newBank.pop());
        var latestEntry = newBank.pop();

        createTable(latestEntry);

        // $('li').last().addClass('active')

        // console.log(myCategories);
      }
    });

    // $('#table-collection').removeClass('hide');
    $showTrendBtn.show();
    this.form.reset()
  });

  function createTable (entry) {
    //Setting the base for the table
    var $tableCollection = $('#table-collection');
    var $newBankTable = $('<table>');
    var $tableHead = $('<thead>');
    var $tableRow = $('<tr>');
    var $dateHeader = $('<th>Date</th>');
    var $descriptionHeader = $('<th>Description</th>');
    var $categoryHeader = $('<th>Category</th>');
    var $priceHeader = $('<th>Price</th>');
    var $tableBody = $('<tbody>')

    //Building collapsible entry
    var $unorderedTabs = $('#table-tabs');
    var $newListItem = $('<li class="tab col s3">');
    //Need to create a safe guard if they try to name tables multiple names
    var $tabbedLink = $('<a class="active" href="#' + nickname + '">' + nickname + '</a>');
    var $divForTable = $('<div id="' + nickname + '" class="overflow"></div>')

    var charge = entry.data;
    for (var i = 0; i < charge.length - 1; i++) {
      //Need a row for each of the charges
      var $newRow = $('<tr>');

      //Looping through each property in the charge
      var selectedOption;
      for (var key in charge[i]) {
        var lowerKey = key.toLowerCase();

        //Defining boolean statements for multiple CSV files
        var descriptionBoolean = lowerKey.includes('description') && !lowerKey.includes('raw')
        var amountBoolean = lowerKey.includes('amount') || lowerKey.includes('debit');
        var dateBoolean = lowerKey.includes('date');
        var categoryBoolean = lowerKey.includes('category');

        if (amountBoolean) {
          var $newAmount = $('<td>' + charge[i][key] + '</td>');
          // console.log('inside',dollaAmount);
        } else if (descriptionBoolean) {
          var $newDescription = $('<td>' + charge[i][key] + '</td>');
        } else if (dateBoolean) {
          var $newDate = $('<td>' + charge[i][key] + '</td>');
        } else if (categoryBoolean) {
          var categoryId = initialCategory(charge[i][key]);
          //Creating Dropdown elements
          var $categoryDiv = $('<div class="input-field col s12" class="catDiv">');
          var $select = $('<select>');
          var $food = $('<option value="food" class="Food">Food</option>');
          var $gas = $('<option value="gas" class="Auto">Auto</option>');
          var $income = $('<option value="income" class="Income">Income</option>');
          var $entertainment = $('<option value="entertainment" class="Entertainment">Entertainment</option>');
          var $education = $('<option value="education" class="Education">Education</option>');
          var $other = $('<option value="other" class="Other" selected>Other</option>');
          var $newCategory = $('<td>');

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
          if ($newAmount) {
            console.log(categoryId);
            $newAmount.addClass(categoryId + 'Amount')
          }
        }
      }

      $newRow.append($newDate);
      $newRow.append($newDescription);
      $newRow.append($newCategory);
      $newRow.append($newAmount);

      // console.log($newAmount.html());
      // get the inner html for category
      // console.log(myCategories);
      var amount = parseInt($newAmount.html());
      // console.log(amount);
      $tableBody.append($newRow);
    }

    myCategories[categoryId] += amount;
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
      var foundCategory = "Other";

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
  // $(document).on("click", 'ul li', function(){
  //     $('ul li').removeClass('active');
  //     $(this).addClass('active');
  // });

  $('ul.tabs').tabs();

  $(document).on("click", '#show-trend', function(){
    var foodArray = $('.FoodAmount').toArray();
    console.log(foodArray);
    foodArray.reduce(function (prev, curr) {
      if (parseInt($(curr).html())) {
        foodSum = prev
        foodSum += parseInt($(curr).html());
        console.log(foodSum);
      }
      return foodSum;
    }, 0)

    var autoArray = $('.AutoAmount').toArray();
    autoArray.reduce(function (prev, curr) {
      autoSum = prev
      autoSum += parseInt($(curr).html());
      return autoSum;
    }, 0)

    var incomeArray = $('.IncomeAmount').toArray();
    incomeArray.reduce(function (prev, curr) {
      incomeSum = prev
      incomeSum += parseInt($(curr).html());
      return incomeSum;
    }, 0)

    var entertainmentArray = $('.EntertainmentAmount').toArray();
    entertainmentArray.reduce(function (prev, curr) {
      entertainmentSum = prev
      entertainmentSum += parseInt($(curr).html());
      return entertainmentSum;
    }, 0)

    var educationArray = $('.EducationAmount').toArray();
    educationArray.reduce(function (prev, curr) {
      educationSum = prev
      educationSum += parseInt($(curr).html());
      return educationSum;
    }, 0)

    var otherArray = $('.OtherAmount').toArray();
    otherArray.reduce(function (prev, curr) {
      otherSum = prev
      otherSum += parseInt($(curr).html());
      return otherSum;
    }, 0)

    var newCanvas = $('#show-trend-results')
    var showResults = new Chart(newCanvas, {
                                            type: 'horizontalBar',
                                            data: {
                                                labels: ["Food", "Auto", "Income", "Entertainment", "Education", "Other"],
                                                datasets: [{
                                                    label: 'Money Trends',
                                                    data: [foodSum, autoSum, incomeSum, entertainmentSum, educationSum, otherSum],
                                                    backgroundColor: [
                                                        'rgba(255, 99, 132, 0.2)',
                                                        'rgba(54, 162, 235, 0.2)',
                                                        'rgba(255, 206, 86, 0.2)',
                                                        'rgba(75, 192, 192, 0.2)',
                                                        'rgba(153, 102, 255, 0.2)',
                                                        'rgba(54, 162, 235, 0.2)',
                                                    ],
                                                    borderColor: [
                                                        'rgba(255, 99, 132, 1)',
                                                        'rgba(54, 162, 235, 1)',
                                                        'rgba(255, 206, 86, 1)',
                                                        'rgba(75, 192, 192, 1)',
                                                        'rgba(153, 102, 255, 1)',
                                                        'rgba(54, 162, 235, 1)',
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
  'Food' : ['dining', 'food', 'fast food', 'restaurant', 'food & drink', 'groceries', 'grocery'],
  'Auto' : ['gas', 'automotive', 'auto'],
  'Income' : ['paycheck', 'income', 'investment', 'financial', 'money', 'reimbursement'],
  'Entertainment' : ['arts', 'music', 'movie', 'culture', 'art'],
  'Education' : ['education'],
  'Other' : []
}

//append to an invisible table and then siphon through and change the categories

//show trends button for each bank account

//start working on chart.js
