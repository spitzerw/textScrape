let getText = document.getElementById("getText");
let filename = document.getElementById("filename");

// When the button is clicked, inject setPageBackgroundColor into current page
getText.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	let value = filename.value;

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: getArticles,
		args: [value]
	});
});

function getArticles(fn) {
	const elements = document.getElementsByTagName("article");
	let rawText = '';
	for (let i = 0; i < elements.length; i++ ) {
		let el = elements[i];
		rawText = rawText + el.innerText;
	}

	function download(data, filename, type) {
		var file = new Blob([data], {type: type});
	
		var a = document.createElement("a"),
				url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}

	// replace nothing with book_title value
	if (fn === '') {
		fn = document.getElementsByClassName("book_title")[1].innerText;
	}

	// add .txt
	if (fn.indexOf('.txt') === -1) {
		fn = fn + '.txt';
	} 
	download(rawText, fn, 'text/json');
}
