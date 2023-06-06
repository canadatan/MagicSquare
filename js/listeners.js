const fullscreenButton = document.getElementById("fullscreenButton");
const labelsComplexityRadioButtons = document.querySelectorAll("#complexity-level label")

// Fullscreen logic
fullscreenButton.addEventListener("click", () => {
    if (fullscreenButton.children[0].innerHTML === "fullscreen") {
        document.documentElement.requestFullscreen()
        fullscreenButton.children[0].innerHTML = "fullscreen_exit"
        changeWidthDependFullscreenMode("on")
    } else {
        document.exitFullscreen()
        fullscreenButton.children[0].innerHTML = "fullscreen"
        changeWidthDependFullscreenMode("off")
    }
})

document.addEventListener('fullscreenchange', exitFullscreen, false)

function exitFullscreen() {
    if (document.fullscreenElement === null) {
        fullscreenButton.children[0].innerHTML = "fullscreen"
        changeWidthDependFullscreenMode("off")
    }
}

function changeWidthDependFullscreenMode(mode) {
    if (mode === "on")
        document.body.setAttribute("style", "max-width: 100%;")
    if (mode === "off")
        document.body.setAttribute("style", "max-width: 776px;")
}

labelsComplexityRadioButtons.forEach(label => {
    label.onfocus = (event) =>
        event.target.querySelector(".inner").style.setProperty("--change-opacity", "1")
    label.onblur = (event) =>
        event.target.querySelector(".inner").style.setProperty("--change-opacity", "0")
    label.onclick = () => { COMPLEXITY_TYPE = label.children[0].value }
})