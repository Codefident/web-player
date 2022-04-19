console.log("wczytano plik Music.js")

class Music {

    constructor() {
    }

    play(src) {

        $("#audio_src").attr("src", src)
        console.log("src", src)
        $("#audio").trigger("load") //pojawia się GET
        ui.toPause() //zmiana img na pause
        this.isLoaded()
        $("#audio").trigger("play") //odpala utwór
        $("#audio").on("ended", function () {
            console.log("%ckoniec " + src,"color: red;font-weight: bold;")
            ui.toNext() //następny utwór z albumu
        })

    }

    pause() {
        $("#audio").trigger("pause")
    }

    resume() {
        $("#audio").trigger("play")
    }

    end() {
        $("#audio_src").attr("src", "")
        $("#audio").off()    //usunięcie eventu, zostanie dodany na nowo po wywołaniu music.play() przez ui
    }

    isLoaded() {
        $("#audio").on("loadeddata", function () {
            ui.musicLoaded = true
            console.log("załadowano")
        })
    }

}