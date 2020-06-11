const worker = new Worker('./worker.js');
const competitors = [
    new Worker('./competitor.js'),
    new Worker('./competitor.js'),
];
const sab = new SharedArrayBuffer(1);
worker.postMessage(sab);
competitors.forEach(w => {
    w.postMessage(sab);
});
