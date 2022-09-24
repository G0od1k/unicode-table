const types = [
    null,
    null,
    {
        Cc: `#808080`,
        Cf: `#606060`,
        Co: `#404040`,
        Cs: `#202020`,
        Ll: `#918a52`,
        Lm: `#998c26`,
        Lo: `#746c31`,
        Lt: `#9b903e`,
        Lu: `#5f5c36`,
        Mc: `#779950`,
        Me: `#75a463`,
        Mn: `#799455`,
        Nd: `#609d9f`,
        Nl: `#285758`,
        No: `#4c8385`,
        Pc: `#602215`,
        Pd: `#601821`,
        Pe: `#570c09`,
        Pf: `#504830`,
        Pi: `#503523`,
        Po: `#501715`,
        Ps: `#552928`,
        Sc: `#155015`,
        Sk: `#2d5015`,
        Sm: `#155046`,
        So: `#1f7241`,
        Zl: `#2e2e2e`,
        Zp: `#2e2e2e`,
        Zs: `#1e356f`,
    },
    null,
    {
        AL: "#727714",
        AN: "#785412",
        B: "#7D6C16",
        BN: "#126567",
        CS: "#635623",
        EN: "#124378",
        ES: "#7445a4",
        ET: "#427768",
        FSI: 1,
        L: "#8d7654",
        LRE: 1,
        LRI: 1,
        LRO: 1,
        NSM: "#327624",
        ON: "#126634",
        PDF: 1,
        PDI: 1,
        R: "#662332",
        RLE: 1,
        RLI: 1,
        RLO: 1,
        S: "#133536",
        WS: "#341abb",
    },
]

function rend(page = 0, type = 2) {
    if (Object.values(document.querySelector(`main`).children).length > 256) {
        clearChildren(document.querySelector(`main`))
    }

    new Array(256).fill(0).forEach((x, i) => {
        const button = letterButton(page + i, type)

        prev.before(button)
    })

    new Array(3).fill(0).forEach((x, i) => {
        const button = document.querySelector(`main>.color#c${i}`)
        button.onclick = (e) => rend(page, [2, 4, 5][i])
    })

    const pageIndicator = document.querySelector(`main > input`)
    pageIndicator.value = (page / 256).toString(16).toUpperCase()

    prev.onclick = (e) =>
        rend(Math.max(page - 256 * 16 ** e.shiftKey * 16 ** e.ctrlKey, 0), type)
    pageIndicator.onkeypress = (key) => {
        if (key.code != `Enter`) return 0
        rend(parseInt(pageIndicator.value, 16) * 256, type)
    }
    next.onclick = (e) =>
        rend(page + 256 * 16 ** e.shiftKey * 16 ** e.ctrlKey, type)
}

function clearChildren(el) {
    Object.values(el.children).forEach((e, i) => {
        if (i < 256) el.removeChild(e)
    })
}

function letterButton(x, type = 2) {
    const button = document.createElement(`button`)
    const data = uni[x]

    button.innerText = String.fromCodePoint(x)
    if (type == 5) {
        button.style.backgroundColor = `hsl(${
            data?.[5].split(` `).filter((x) => x).length * 20
        }, 40%, 30%)`
    } else {
        button.style.backgroundColor = types[type]?.[data?.[type]]
    }

    button.onclick = () => {
        document.querySelector(`#symbol`).innerText = String.fromCodePoint(x)

        document.querySelector(`#name`).innerText = data?.[1] || ``
        document.querySelector(`#adr`).innerText =
            `0x` + (data?.[0] || x.toString(16).padStart(4, 0).toUpperCase())
        document.querySelector(`#desc`).innerText = data?.[10] || ``
        document.querySelector(`#group`).innerText = data?.[2] || ``
        clearChildren(document.querySelector(`#child`))
        data?.[5]
            .split(` `)
            .map((x) => {
                if (!isNaN(parseInt(x, 16))) {
                    return letterButton(parseInt(x, 16), type)
                }
                const button = document.createElement(`button`)
                button.innerText = x
                return button
            })
            .forEach((x) => {
                document.querySelector(`#child`).appendChild(x)
            })
        clearChildren(document.querySelector(`#letter`))
        data?.slice(12)
            .map((x) => {
                if (!isNaN(parseInt(x, 16))) {
                    return letterButton(parseInt(x, 16), type)
                }
                const button = document.createElement(`button`)
                button.innerText = x
                return button
            })
            .forEach((x) => {
                document.querySelector(`#letter`).appendChild(x)
            })

        // document.querySelector(`#data`).innerText = data || ``
    }

    if (!data) {
        button.classList.add(`nosymb`)
    }

    return button
}

rend()

document.querySelector("main > button:nth-child(72)").click()
