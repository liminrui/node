function fetchData() {
    return new Promise((res, rej) => {
        setTimeout(() => res(1), 1000)
    })
}

test("test async", async () => {
    const data = await fetchData()
    expect(data).toBe(1)
})