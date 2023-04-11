const challengesContainer = document.querySelector('.challenges-container');
const todayChallenges = document.querySelector('#today-challenges');

function removeChildrenNodes(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function getTimePassed(lastDoneDate) {
	let doneDate = new Date(lastDoneDate);
	let today = new Date();
	return (
		new Date(
			`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
		) -
		new Date(
			`${doneDate.getFullYear()}-${
				doneDate.getMonth() + 1
			}-${doneDate.getDate()}`
		)
	);
}

function insertChallengeTask(task) {
	let ret = 0;

	let markup = `<div class="challenge-task" id="${task.title}"><p>Challenger: ${task.name}</p>`;
	markup += `<p><strong>${task.title}</strong> (${task.days}/${task.duration} Days)</p>`;

	console.log(getTimePassed(task.lastDoneDate));
	if (getTimePassed(task.lastDoneDate) > 1000 * 24 * 60 * 60) {
		failChallenge(task);
		return 1;
	}

	if (new Date(task.lastDoneDate).getDate() != new Date().getDate()) {
		if (task.category === 'quantity') {
			markup += `<button class="check-button">Set ${task.currentSets}/${
				task.sets
			} | ${task.currentSets * task.quantity} ${task.unit}</button>
				<button class="giveup-button">Give up</button></div>`;
		} else {
			markup += `<button class="check-button">Check for today!</button>
				<button class="giveup-button">Give up</button></div>`;
		}
		ret = 1;
	}
	todayChallenges.insertAdjacentHTML('beforeend', markup);
	return ret;
}

function displayChallenges() {
	const challengesListStr = localStorage.getItem('challengesList');

	if (!challengesListStr || challengesListStr == '[]') {
		const markup = '<h3>No challenges yet</h3>';
		todayChallenges.insertAdjacentHTML('beforeend', markup);
	} else {
		removeChildrenNodes(todayChallenges);
		let todayChallengesLeft = 0;
		const challengesListJson = JSON.parse(challengesListStr);
		for (let i = 0; i < challengesListJson.length; i++) {
			todayChallengesLeft += insertChallengeTask(challengesListJson[i]);
		}
		if (todayChallengesLeft == 0) {
			const markup =
				'<h3 style="text-align: center; color: green;">All challenges for today is Done! Congrats!</h3>';
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
	let challengesLeft = challengesListJson.filter(
		(item) => item.title !== challenge
	);
	localStorage.setItem('challengesList', JSON.stringify(challengesLeft));
	console.log(challengesLeft);
}

function failChallenge(challenge) {
	alert(`You have failed the challenge\n${challenge.title}`);
	playAudio('fail.mp3');
	deleteChallenge(challenge);
}

async function playAudio(audioFile) {
	const audio = new Audio('./assets/' + audioFile);
	audio.play();
}

todayChallenges.querySelectorAll('.challenge-task').forEach((child) => {
	if (child.querySelector('.check-button') == null) {
		return;
	}
	child.querySelector('.check-button').addEventListener('click', (e) => {
		const challenge = e.target.parentNode.querySelector('strong').innerHTML;
		const challengesListStr = localStorage.getItem('challengesList');
		let challengesListJson = JSON.parse(challengesListStr);
		let challengeInfo = challengesListJson.find(
			(item) => item.title == challenge
		);

		if (challengeInfo.category == 'quantity') {
			challengeInfo.currentSets++;
			if (challengeInfo.currentSets >= challengeInfo.sets) {
				challengeInfo.currentSets = 0;
				playAudio('success_done.mp3');
				checkTodayChallenge(challengeInfo);
				if (challengeInfo.days == challengeInfo.duration) {
					alert(
						`Congratulations! You have done the challenge:\n${challengeInfo.title}`
					);
					playAudio('crowd_cheers.mp3');
					deleteChallenge(challenge);
					setTimeout(() => {
						window.location.reload();
					}, 20 * 1000);
				} else {
					localStorage.setItem(
						'challengesList',
						JSON.stringify(challengesListJson)
					);
					displayChallenges();
				}
				return;
			}
			playAudio('success1.mp3');
			e.target.innerHTML = `Set ${challengeInfo.currentSets}/${
				challengeInfo.sets
			}
				| ${challengeInfo.currentSets * challengeInfo.quantity} ${challengeInfo.unit}`;
		} else {
			playAudio('success-done.mp3');
			checkTodayChallenge(challengeInfo);
			if (challengeInfo.days == challengeInfo.duration) {
				alert(
					`Congratulations! You have done the challenge:\n${challengeInfo.title}`
				);
				playAudio('crowd_cheers.mp3');
				deleteChallenge(challenge);
				setTimeout(() => {
					window.location.reload();
				}, 20 * 1000);
			} else {
				localStorage.setItem(
					'challengesList',
					JSON.stringify(challengesListJson)
				);
				displayChallenges();
			}
			return;
		}
		localStorage.setItem('challengesList', JSON.stringify(challengesListJson));
	});

	child.querySelector('.giveup-button').addEventListener('click', (e) => {
		if (confirm('Are you sure you want to give up this challenge?') == true) {
			const challenge = e.target.parentNode.querySelector('strong').innerHTML;
			playAudio('fail.mp3');
			deleteChallenge(challenge);
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}
	});
});
