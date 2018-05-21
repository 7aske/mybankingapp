document.querySelectorAll('.nav-item')[0].classList.add('active');
document.querySelectorAll('.toFormat').forEach(field => {
	field.innerText = new FormatDate(field.innerText).short();
});
document.querySelectorAll('.toFormatPrecise').forEach(field => {
	field.innerText = new FormatDate(field.innerText).long();
});
let accInfo = document.querySelectorAll('.accInfo');
accInfo.forEach(e => {
	e.addEventListener('click', event => {
		let url = new URL(window.location).origin + '/api/accounts/' + e.innerText;
		let request = new Request('get', url, null, true);
		request.send().then(r => {
			let result = JSON.parse(r.response);
			let content = `Address: ${result.address} ${result.city}, ${result.country}<br>Phone: ${result.phone}`;
			let title = `Name: ${result.firstName} ${result.lastName}`;
			let popup = new Popup(content, title, event.target).render()
		}).catch(err => console.log(err))
	});
});
let btns = document.querySelectorAll('[data-btn-type="request"]');
btns.forEach(btn => {
	btn.addEventListener('click', e => {
		if (confirm('Are you sure?')){
		let method = e.target.attributes['data-method'].value;
		let id =
			e.target.parentElement.parentElement.parentElement.parentElement.id;
		let url = new URL(window.location).origin + '/accounts/' + id;
		let request = new Request(method, url, null, true);
		request.send().then(result => {
			if (result.status == 200) {
				location.reload();
			}
		}).catch(err => console.log(err))
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
			chevron.className == 'fa fa-chevron-up' ?
			'fa fa-chevron-down' :
			'fa fa-chevron-up';
		map.forEach((row, index) => {
			rows[index].children[0].innerText = row.r.c0;
			rows[index].children[1].innerText = row.r.c1;
			rows[index].children[2].innerText = row.r.c2;
			rows[index].children[3].innerText = row.r.c3;
		});
	});
});