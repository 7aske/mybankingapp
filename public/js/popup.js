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