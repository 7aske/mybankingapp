let buttons = document.querySelectorAll('.btn-pdf');
buttons.forEach(button => {
	button.addEventListener('click', event => {
		let id = event.target.attributes['data-transaction'].value;
		let rows = document.querySelectorAll(
			'#transactions' + id + ' .transaction'
		);
		let content = [
			{
				text: 'Transactions:',
				style: {
					alignment: 'center'
				}
			},
			{
				columns: [
					{
						width: '25%',
						text: 'Sender account number:',
						style: {
							alignment: 'center'
						}
					},
					{
						width: '25%',
						text: 'Receiver account number:',
						style: {
							alignment: 'center'
						}
					},
					{
						width: '25%',
						text: 'Sent funds:',
						style: {
							alignment: 'center'
						}
					},
					{
						width: '25%',
						text: 'Transaction date',
						style: {
							alignment: 'center'
						}
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
						text: row.children[2].innerText,
						style: {
							alignment: 'right'
						}
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
