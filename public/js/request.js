class Request {
	constructor(method, url, json = null) {
		this.method = method;
		this.url = url;
		this.json = json;
	}
	send() {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open(this.method, this.url, true);
			xhr.send(this.json);
			xhr.onerror = function(){
				reject({
					status: xhr.status,
					response: xhr.responseText
				})
			} 
			xhr.onload = function(){
				resolve({
					status: xhr.status,
					response: xhr.responseText
				})
			}
		})

	}
}