let created = document.getElementById('created');
let birth = document.getElementById('birth');
let login = document.getElementById('login');

let formatDate = field => {
	let date = new Date(field.innerText);
	let year = date.getFullYear();
	let month = date.getMonth();
	let day = date.getDate();

	field.innerText = day + '/' + month + '/' + year;
};
let formatDatePrecise = field => {
	let date = new Date(field.innerText);
	let year = date.getFullYear();
	let month = date.getMonth();
	let day = date.getDate();
	let hours = date.getHours();
	if (hours < 10) hours = '0' + hours;
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

	field.innerText =
		day +
		'/' +
		month +
		'/' +
		year +
		' ' +
		hours +
		':' +
		minutes +
		':' +
		seconds;
};
document.querySelectorAll('.toFormat').forEach(field => {
	formatDate(field);
});
document.querySelectorAll('.toFormatPrecise').forEach(field => {
	formatDatePrecise(field);
});
document.querySelectorAll('.nav-item')[0].classList.add('active');
class Request {
	constructor(method, url, json = null) {
		this.method = method;
		this.url = url;
		this.json = json;
	}
	send() {
		if (confirm('Are you sure?')) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					location.reload();
				}
				if (this.readyState == 4 && this.status == 201) {
					location.reload();
				}
			};
			xhr.open(this.method, this.url, true);
			xhr.send(this.json);
		}
	}
}
let btns = document.querySelectorAll('[data-btn-type="request"]');
btns.forEach(btn => {
	btn.addEventListener('click', e => {
		let method = e.target.attributes['data-method'].value;
		let id =
			e.target.parentElement.parentElement.parentElement.parentElement.id;
		if (method == 'delete') {
			let url = new URL(window.location).origin + '/accounts/' + id;
			let request = new Request(method, url, null, true);
			request.send();
		}
	});
});
let sorted = false;
let sortCritera = document.querySelectorAll('.sortCriteria');
sortCritera.forEach(element => {
	element.addEventListener('click', event => {
		let cc, ci, rows, chevron;
		if (event.target.nodeName == 'I') {
			chevron = event.target;
			cc = Array.prototype.slice.call(
				event.target.parentElement.parentElement.children
			);
			ci = 'c' + cc.indexOf(event.target.parentElement);
			rows = Array.prototype.slice.call(
				event.target.parentElement.parentElement.parentElement.children
			);
		} else {
			chevron = event.target.firstElementChild;
			cc = Array.prototype.slice.call(
				event.target.parentElement.children
			);
			ci = 'c' + cc.indexOf(event.target);
			rows = Array.prototype.slice.call(
				event.target.parentElement.parentElement.children
			);
		}
		rows.shift();
		let map = [];
		rows.forEach(row => {
			map.push({
				r: {
					c0: row.children[0].innerText,
					c1: row.children[1].innerText,
					c2: parseInt(row.children[2].innerText),
					c3: row.children[3].innerText
				}
			});
		});
		if (sorted) {
			map.sort((a, b) => {
				return a.r[ci] > b.r[ci];
			});
		} else {
			map.sort((a, b) => {
				return a.r[ci] < b.r[ci];
			});
		}
		sorted = !sorted;
		chevron.className =
			chevron.className == 'fa fa-chevron-up'
				? 'fa fa-chevron-down'
				: 'fa fa-chevron-up';
		map.forEach((row, index) => {
			rows[index].children[0].innerText = row.r.c0;
			rows[index].children[1].innerText = row.r.c1;
			rows[index].children[2].innerText = row.r.c2;
			rows[index].children[3].innerText = row.r.c3;
		});
	});
});
let accInfo = document.querySelectorAll('.accInfo');
accInfo.forEach(e => {
	let accNum = e.innerText;
	e.addEventListener('click', event => {
		let url = new URL(window.location).origin + '/api/accounts/' + accNum;
		let xhr = new XMLHttpRequest();
		let response;

		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				response = JSON.parse(this.responseText);
				let content = `Address: ${response.address} ${response.city}, ${
					response.country
				}<br>
                        Phone: ${response.phone}`;
				let title = `Name: ${response.firstName} ${response.lastName}`;
				let popup = new Popup(content, title, event.target).render();
			}
		};
		xhr.open('get', url, true);
		xhr.send(null);
	});
});
class Popup {
	constructor(content, title, parent) {
		this.parent = parent;
		this.content = content;
		this.title = title;
		this.popup;
		this.y = parent.offsetTop;
		this.x = parent.offsetLeft;
	}
	hide() {
		return this.parent.parentElement.removeChild(this.popup);
	}
	render() {
		//fix the height glitch
		this.parent.parentElement.style.height =
			this.parent.parentElement.offsetHeight + 'px';
		this.popup = document.createElement('div');
		this.popup.setAttribute('class', 'popover');

		let body = document.createElement('div');
		body.innerHTML = this.content;
		body.setAttribute('class', 'popover-body');

		let header = document.createElement('div');
		header.innerHTML = this.title;
		header.setAttribute('class', 'popover-header');

		this.popup.appendChild(header);
		this.popup.appendChild(body);
		this.popup.style.top = this.y + this.parent.offsetHeight + 'px';
		this.popup.style.left = this.x + 'px';
		setTimeout(() => {
			this.hide();
		}, 3000);
		return this.parent.parentElement.appendChild(this.popup);
	}
}
