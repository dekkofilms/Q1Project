$(function () {

  var $submitBtn = $('#submitBtn');


  var newBank = [];
  $submitBtn.click(function () {
    //Grabbing the file that the user inputs
    var selectedFile = $('#csv')[0].files[0];

    //Papa Parse function scanning CSV file
    Papa.parse(selectedFile, {
    	delimiter: "",	// auto-detect
    	newline: "",	// auto-detect
    	header: true,
    	dynamicTyping: false,
    	preview: 2,
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
        console.log(newBank);
      }
    });

    this.form.reset()
  });









})
