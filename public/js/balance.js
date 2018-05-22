let balance = document.querySelectorAll('.balance');
balance.forEach(e => {
    let firstQuery = true;
    let accountNumber = e.value;
    let url = new URL(window.location).origin + '/api/accounts/' + accountNumber;
    let newBalance = 0;
    let checkBalance = 0;
    console.log(accountNumber, url)
    function update() {
        if (firstQuery) {
            firstQuery = !firstQuery;
            let request = new Request('get', url, null);
            request.send().then(result => {
                console.log(result);
                checkBalance = JSON.parse(result.response).balance;
            }).catch(err => console.log(err));
        } else {
            let request = new Request('get', url, null);
            request.send().then(result => {
                console.log(result);
                newBalance = JSON.parse(result.response).balance;
                if (newBalance == checkBalance) {
                    console.log('No change');
                } else {
                    console.log('Funds recieved');
                    checkBalance = newBalance
                }

            }).catch(err => console.log(err));
        }
    }
    let interval = setInterval(update, 5000);
});