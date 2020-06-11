self.onmessage = ({ data }) => {
	const arr = new Uint8Array(data);
	Reflect.defineProperty(self, 'a', {
		get() {
			return arr[0];
		},
	});
	let count = 0;
	while (!(a === 1 && a === 2 && a === 3)) {
		count++;
		if (count % 1e8 === 0) console.log('running...');
	}
	console.log(`After ${count} times, a === 1 && a === 2 && a === 3 is true!`);
};
