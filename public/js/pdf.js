let buttons = document.querySelectorAll('.btn-pdf');
buttons.forEach(button => {
	button.addEventListener('click', event => {
		let id = event.target.attributes['data-transaction'].value;
		let rows = document.querySelectorAll(
			'#transactions' + id + ' .transaction'
		);
		let content = [
			'Transactions:',
			{
				columns: [
					{
						width: '25%',
						text: 'Sender account number:'
					},
					{
						width: '25%',
						text: 'Receiver account number:'
					},
					{
						width: '25%',
						text: 'Sent funds:'
					},
					{
						width: '25%',
						text: 'Transaction date'
					}
				]
			}
		];
		rows.forEach(row => {
			let r = {
				columns: [
					{
						width: '25%',
						text: row.children[0].innerText
					},
					{
						width: '25%',
						text: row.children[1].innerText
					},
					{
						width: '25%',
						text: row.children[2].innerText
					},
					{
						width: '25%',
						text: row.children[3].innerText
					}
				],
				columnGap: 10
			};
			content.push(r);
		});
		let docDef = {
			content: content,
			pageSize: 'A4',
			pageOrientation: 'landscape'
		};
		pdfMake.createPdf(docDef).download(id + '.pdf');
	});
});
