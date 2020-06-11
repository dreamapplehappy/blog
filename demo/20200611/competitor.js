self.onmessage = ({ data }) => {
	const arr = new Uint8Array(data);
	setInterval(() => {
		arr[0] = Math.floor(Math.random() * 3) + 1;
	});
};
