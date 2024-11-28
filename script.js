// const GITHUB_TOKEN = 'tokentokentoken';

const logo = document.getElementById("logo-btn")
logo.addEventListener('click', () => {
		window.location.href = "index.html";
		document.getElementById('search-input').value = '';
})



const searchInput = document.getElementById('search-input'); // search-input element 가져오기

searchInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
    const username = event.target.value.trim(); // 입력된 값 가져오기
		if (!username) {
			window.location.href = "index.html";
		} else {
			fetchUserData(username);
			fetchUserRepos(username);
		}
	}
});

function formatDate(created_at) {
  const date = new Date(created_at);

  // 월 이름 배열
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 날짜의 순위를 계산
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // 11th ~ 19th 예외 처리
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
}


function updateProfile(data) {
	const profileContainer = document.getElementById("profile-container")

	profileContainer.innerHTML = `
		<div id="left">
			<img id="user-avatar" src="${data.avatar_url}" alt=${data.login}/>
			<a id="github-btn" href="https://github.com/${data.login}" target="blank">GitHub Visit</a>
		</div>
		<div id="right">
			<div id="right-btns">
				<button id="right-btn1" disabled>Public Repos: ${data.public_repos}</button>
				<button id="right-btn2" disabled>Public Gists: ${data.public_gists}</button>
				<button id="right-btn3" disabled>Followers: ${data.followers}</button>
				<button id="right-btn4" disabled>Following: ${data.following}</button>
			</div>
			<ul id="right-lists">
				<li id="right-profile">Company: ${data.company}</li>
				<li id="right-profile">Blog: 
				${data.blog ? `<a href="${data.blog}" target="_blank">${data.blog}</a>` : "N/A"}</li>
				<li id="right-profile">Location: ${data.location}</li>
				<li id="right-profile">Member Since: ${formatDate(data.created_at)}</li>
			</ul>
		</div>
	`
}


function updateRepos(repos) {
	const latestRepos = document.getElementById("latest-repos")
	
	// 기존 내용 비우기
	latestRepos.innerHTML = ``;
	
	repos.slice(0, 5).forEach(repo => {
		latestRepos.innerHTML += `
		<li id="repo">
			<a id="repo-name" href="${repo.html_url}" target="_blank">${repo.name}</a>
			<div id="repo-btns">
				<button id="repo-btn1" disabled>Stars: ${repo.stargazers_count}</button>
				<button id="repo-btn2" disabled>Watchers: ${repo.watchers_count}</button>
				<button id="repo-btn3" disabled>Forks: ${repo.forks_count}</button>
			</div>
		</li>
	`
	})
};



function clearProfile() {
	document.getElementById('profile-container').innerHTML = '';
	document.getElementById('repos-list').innerHTML = '';
}

async function fetchUserData(username) {
	try {
		const response = await fetch(`https://api.github.com/users/${username}`
			// , {
			// 	headers: {
			// 		Authorization: `token ${GITHUB_TOKEN}` // 토큰 추가
			// 	}
			// }
		);

		 // 요청 실패 시 에러 처리
		 if (!response.ok) {
			throw new Error('User not found');
			}
			const data = await response.json(); // 응답 데이터를 JSON으로 변환
			updateProfile(data, username);
			console.log(data); // 데이터 출력
	} catch (error) {
			console.error(error); // 에러 처리
			displayErrorMessage();
	}
}


async function fetchUserRepos(username) {
	try {
			const response = await fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=desc`
				// , {
				// 	headers: {
				// 		Authorization: `token ${GITHUB_TOKEN}` // 토큰 추가
				// 	}
				// }
			);
			const repos = await response.json();
			updateRepos(repos);
			console.log(repos); // 리포지토리 데이터를 확인
	} catch (error) {
			console.error(error.message); // 에러 메시지 출력
			
	}
}

function displayErrorMessage() {
	const profileContainer = document.getElementById('profile-container');
	const latestRepos = document.getElementById('latest-repos');

	// 기존 내용 비우기
	profileContainer.innerHTML = `<p style="color: #333; text-align: center; font-size: 20px; margin-top: 20px;" >No such user exists. Please check for typos.</p>`;
	latestRepos.innerHTML = '';
}


