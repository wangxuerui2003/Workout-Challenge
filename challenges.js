const challengesContainer = document.querySelector('.challenges-container');
const todayChallenges = document.querySelector('#today-challenges');

function removeChildrenNodes(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function insertChallengeTask(task) {
	let ret = 0;
	let markup = `<div class="challenge-task" id="${task.title}">`;
	markup += `<p><strong>${task.title}</strong> (${task.days}/${task.duration} Days)</p>`
	if (new Date(task.lastDoneDate).getDate() != new Date().getDate()) {
		if (task.category === 'quantity') {
			markup += `<button class="check-button">Set ${task.currentSets}/${task.sets} | ${task.currentSets * task.quantity} ${task.unit}</button>
				<button class="giveup-button">Give up</button></div>`;
		} else {
			markup += '<button class="check-button">Check for today!</button><button class="giveup-button">Give up</button></div>'	
		}
		ret = 1;
	}
	todayChallenges.insertAdjacentHTML('beforeend', markup);
	return ret;
}

function displayChallenges() {
	const challengesListStr = localStorage.getItem('challengesList');

	if (!challengesListStr || challengesListStr == '[]') {
		const markup = '<h3>No challenges yet</h3>'
		todayChallenges.insertAdjacentHTML('beforeend', markup);
	} else {
		removeChildrenNodes(todayChallenges);
		let todayChallengesLeft = 0;
		const challengesListJson = JSON.parse(challengesListStr);
		for (let i = 0; i < challengesListJson.length; i++) {
			todayChallengesLeft += insertChallengeTask(challengesListJson[i]);
		}
		if (todayChallengesLeft == 0) {
			const markup = '<h3 style="text-align: center; color: green;">All challenges for today is Done! Congrats!</h3>'
			todayChallenges.insertAdjacentHTML('beforebegin', markup);
		}
	}
}

displayChallenges();

function checkTodayChallenge(challenge) {
	challenge.lastDoneDate = new Date();
	alert(challenge.motivationalWords);	
	challenge.days++;
}

function deleteChallenge(challenge) {
	const challengesListStr = localStorage.getItem('challengesList');
	let challengesListJson = JSON.parse(challengesListStr);
	let challengesLeft = challengesListJson.filter((item) => item.title !== challenge);
	localStorage.setItem('challengesList', JSON.stringify(challengesLeft));
	console.log(challengesLeft);
	window.location.reload();
}

todayChallenges.querySelectorAll('.challenge-task').forEach(child => {
	if (child.querySelector('.check-button') == null) {
		return ;
	}
	child.querySelector('.check-button').addEventListener('click', (e) => {
		const challenge = e.target.parentNode.querySelector('strong').innerHTML;
		const challengesListStr = localStorage.getItem('challengesList');
		let challengesListJson = JSON.parse(challengesListStr);
		let challengeInfo = challengesListJson.find((item) => item.title == challenge);

		if (challengeInfo.category == 'quantity') {
			challengeInfo.currentSets++;
			e.target.innerHTML = `Set ${challengeInfo.currentSets}/${challengeInfo.sets}
				| ${challengeInfo.currentSets * challengeInfo.quantity} ${challengeInfo.unit}`;

			if (challengeInfo.currentSets >= challengeInfo.sets) {
				challengeInfo.currentSets = 0;
				checkTodayChallenge(challengeInfo);
				if (challengeInfo.days == challengeInfo.duration) {
					alert(`Congratulations! You have done the challenge:\n${challengeInfo.title}`);
					deleteChallenge(challenge);
				} else {
					localStorage.setItem('challengesList', JSON.stringify(challengesListJson));
					displayChallenges();
				}
				return ;
			}
		} else {
			checkTodayChallenge(challengeInfo);
			if (challengeInfo.days == challengeInfo.duration) {
				alert(`Congratulations! You have done the challenge:\n${challengeInfo.title}`);
				deleteChallenge(challenge);
			} else {
				localStorage.setItem('challengesList', JSON.stringify(challengesListJson));
				displayChallenges();
			}
			return ;
		}
		localStorage.setItem('challengesList', JSON.stringify(challengesListJson));
	});

	child.querySelector('.giveup-button').addEventListener('click', (e) => {
		if (confirm("Are you sure you want to give up this challenge?") == true) {
			const challenge = e.target.parentNode.querySelector('strong').innerHTML;
			deleteChallenge(challenge);
		}
	})
});

