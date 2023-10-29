import { parentPort, threadId } from 'node:worker_threads'

parentPort.once('message', ({ from, to }) => {
    console.time(`bench-${threadId}`)

    let count = 0

    for (let i = from; i <= to; i++) { count++ }

    console.timeEnd(`bench-${threadId}`)
    parentPort.postMessage(`I'm ${threadId} done! with ${count} items`)
})