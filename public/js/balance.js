let balance = document.querySelectorAll('.balance');
balance.forEach(e => {
	let firstQuery = true;
	let accountNumber = e.value;
	let url =
		new URL(window.location).origin +
		'/api/accounts/balance/' +
		accountNumber;
	let newBalance = 0;
	let checkBalance = 0;
	console.log(accountNumber, url);
	function update() {
		if (firstQuery) {
			firstQuery = !firstQuery;
			let request = new Request('get', url, null);
			request
				.send()
				.then(result => {
					checkBalance = JSON.parse(result.response).balance;
				})
				.catch(err => console.log(err));
		} else {
			let request = new Request('get', url, null);
			request
				.send()
				.then(result => {
					let response = JSON.parse(result.response);
					newBalance = response.balance;
					if (newBalance == checkBalance) {
						console.log('No change');
					} else {
						console.log('Funds recieved');
						checkBalance = newBalance;
						window.location =
							window.location.origin +
							'/api/accounts/balance/update/' +
							response.accountNumber;
					}
				})
				.catch(err => console.log(err));
		}
	}
	let interval = setInterval(update, 5000);
});
