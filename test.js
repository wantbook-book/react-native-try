const axios = require('./node_modules/axios/lib/axios');
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
async function initAxios() {
  const service = axios.create({
    baseURL: 'http://localhost:9000/api',
    timeout: 1000 * 5,
  });
  sleep(1000);
  return service;
}
async function doget(request, time) {
  sleep(time);
  const res = request.get('/ping');
  return res;
}
async function req1(request) {
  const res = await doget(request, 400);
  console.log('req1: ', res.data);
}
async function req2(request) {
  const res = await doget(request, 700);
  console.log('req2: ', res.data);
}
async function req3(request) {
  const res = await doget(request, 200);
  console.log('req3: ', res.data);
}
async function req1and2(request) {
  console.log('req1and2');
  await req1(request);
  await req2(request);
}

async function part1(request) {
  await req1and2(request);
}

async function part2(request) {
  await req3(request);
}

async function main() {
  console.log('init start');
  const request = await initAxios();
  await part1(request);
  await part2(request);
}

main();
