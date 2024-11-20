function fetchData() {
    return new Promise((res, rej) => {
        setTimeout(() => res(1), 1000)
    })
}

test("test async", async () => {
    const data = await fetchData()
    expect(data).toBe(1)
})

describe('test', () => {
    
    test("color", () => {
        const chalk = require('chalk')
        console.log(chalk.blue('test'));
    })

})
// const { describe } = require('node:test')