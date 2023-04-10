const optionQuantity = document.getElementById('quantity');
const optionSinglecheck = document.getElementById('single-check');
const quantityDiv = document.getElementById('quantity-div');
const joinForm = document.querySelector('.form-container');

// Show the quantity field when quantity radio button is selected
optionQuantity.addEventListener('change', () => {
	if (optionQuantity.checked) {
		quantityDiv.style.display = "block";
		Array.from(quantityDiv.children).forEach((child) => {
			child.setAttribute('required', '');
		});
	}
});

// Hide the quantity field when single check radio button is selected
optionSinglecheck.addEventListener('change', () => {
	if (optionSinglecheck.checked) {
		quantityDiv.style.display = "none";
		Array.from(quantityDiv.children).forEach((child) => {
			child.removeAttribute('required');
		});
	}
});

// Add the challenge to localstorage if the number of challenges exists is less than 3
joinForm.addEventListener('submit', (e) => {
	e.preventDefault();
	let data = new FormData(e.target);
	let challengeInfo = {};

	challengeInfo.name = data.get('name');
	challengeInfo.title = data.get('title');
	challengeInfo.duration = parseInt(data.get('duration'));
	challengeInfo.category = data.get('category');
	challengeInfo.motivationalWords = data.get('motivational-words');
	challengeInfo.lastDoneDate = new Date(new Date() - 86400000); // Yesterday date
	challengeInfo.days = 0;
	if (data.get('category') == 'quantity') {
		challengeInfo.quantity = parseInt(data.get('quantity'));
		challengeInfo.sets = parseInt(data.get('sets'));
		challengeInfo.currentSets = 0;
		challengeInfo.unit = data.get('unit');
	}

	let challengesList = localStorage.getItem('challengesList');
	if (challengesList == null) {
		localStorage.setItem('challengesList', JSON.stringify(Array()));
		challengesList = localStorage.getItem('challengesList');
	}
	challengesList = JSON.parse(challengesList);
	if (challengesList.length >= 3) {
		alert("Too many challenges at the same time bro")
	} else {
		challengesList.push(challengeInfo);
		localStorage.setItem('challengesList', JSON.stringify(challengesList));
		alert("Great job! A good start is half way done! You will be redirected to the index page after you click OK!")
	}

	window.location.replace('index.html')
})
