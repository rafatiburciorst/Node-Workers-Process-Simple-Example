import { execSync } from 'node:child_process'
import { Worker } from 'node:worker_threads'

// UV_THREADPOOL_SIZE=100 node src/index.js 
function getCurrentThreadCount() {
    //obtem quantidade de threads do processo e conta
    return parseInt(execSync(`ps -M ${process.pid} | wc -l`).toString())
}

function createThread(data) {
    const worker = new Worker('./src/thread.js')
    const promise = new Promise((resolve, reject) => {
        worker.once('message', (message) => {
            return resolve(message)
        })
        worker.once('error', reject)
    })
    worker.postMessage(data)
    return promise
}

const nodeDefaultThreadNumber = getCurrentThreadCount() - 1 //ignora o processo

console.log(
    `I'm running`,
    process.pid,
    `default threads ${nodeDefaultThreadNumber}`
);


let nodejsThreadsCount = 0
const intervalId = setInterval(() => {
    // console.log(`running at every sec: ${new Date().toISOString()}`)
    //ver as threads que criamos manualmente
    const currentThreads = getCurrentThreadCount() - nodeDefaultThreadNumber
    if(currentThreads === nodejsThreadsCount) return
    nodejsThreadsCount = currentThreads
    console.log(`Threads`, nodejsThreadsCount)
})

await Promise.all([
    createThread({
        from: 0,
        to: 1e9,
    }),
    createThread({
        from: 0,
        to: 1e9,
    }),
    createThread({
        to: 1e8,
        from: 0
    }),
    createThread({
        to: 1e10,
        from: 0
    }),
    createThread({
        to: 1e3,
        from: 0
    }),
]).then((result) => console.log(result))

clearInterval(intervalId)