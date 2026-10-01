// 1. Get the user's selected color
// 2. Get the user's selected scheme

// 3. User clicks "Get color scheme"

// 4. Fetch the color scheme from the API
//       ↓
// 5. Convert the response to JavaScript data
//       ↓
// 6. Get the five returned colors
//       ↓
// 7. Match each returned color with:
//       its color strip
//       its hex label
//       ↓
// 8. Update the DOM

let startIndex = 3;
let hexColors = [];
const sliderSymbol = document.querySelector('.slider-symbol')

function positionSliderSymbol() {
    const sliderPosition = (startIndex / 6) * 100
    sliderSymbol.style.left = `calc(${sliderPosition}% + ${1.5 - (sliderPosition / 100) * 3}rem)`
}

function renderColorScheme() {
    const visibleColors = hexColors.slice(startIndex, startIndex + 5)
    const colorTitle = document.getElementById('color-title')
    if (colorTitle) {
        const colorTitleText = colorTitle.textContent
        const colorTitleLetters = colorTitleText.split('')
        const refactoredColorTitleLetters = colorTitleLetters.map((letter, index) => `<span style="color: ${visibleColors[index]};">${letter}</span>`).join('')
        colorTitle.innerHTML = refactoredColorTitleLetters
        const colorTrack = visibleColors.map(hex => `
            <div class="color-card">
                <div class="color-strip" style="background-color: ${hex};"></div>
                <div class="hex-label" data-hex="${hex}">${hex}</div>
            </div>
        `)
        
        document.getElementById('color-track').innerHTML = colorTrack.join('')
    }

}

function getColors() {
        
        const seedColor = document.getElementById('seed-color').value.replaceAll('#', '')
        const colorSchemes = document.getElementById('color-schemes').value

        fetch(`https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${colorSchemes}&count=11`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                hexColors = data.colors.map(color => color.hex.value)
                renderColorScheme()
            })
        }

    document.getElementById('color-track').addEventListener('click', function(e) {
        if (e.target.classList.contains('hex-label')) {
            const hexValue = e.target.getAttribute('data-hex')
            navigator.clipboard.writeText(hexValue)
            e.target.textContent = 'Copied!'
            setTimeout(() => {
                e.target.textContent = e.target.getAttribute('data-hex')
            }, 2000)
        }
        })

    document.getElementById('dark-mode').addEventListener('change', function(e) {
        document.body.classList.toggle('dark-mode', e.target.checked)
    })
    document.getElementById('color-slider').addEventListener('input', function(e) {
        startIndex = Number(e.target.value)
        renderColorScheme()
        positionSliderSymbol()
    })


document.getElementById('get-color').addEventListener('click', function(){
    startIndex = 3
    document.getElementById('color-slider').value = startIndex
    positionSliderSymbol()
    getColors()
})
getColors()
positionSliderSymbol()


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
}