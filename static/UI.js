console.log("wczytano plik Ui.js")

class Ui {

    constructor() {
        this.play = false
        this.musicLoaded = false
        this.serverData = {}    //musimy dać wąsy sugerujące obiekt
        this.currentTrackNum = 0
    }

    //obsługa kliknięć w Ui

    displayData(data) {

        console.log("dane z neta do ui:", data)

        this.serverData = data

        //directories:  album1, album2, ...
        //files:        costam.mp3, ...

        //tytuł albumu na górze strony

        $("#header").text(data.selectedDir)

        //okładki albumów i interakcja

        $("#sideBar").empty()

        for (let key in data.directories) {

            let img = $("<img>")
            img.on("click", function () {
                net.sendData(parseInt(key)) //odwołanie do indeksu pożądanego albumu
            })
            img.attr("src", `mp3/${data.directories[key]}/cover.png`)
            img.attr("width", "200px")
            $("#sideBar").append(img)

        }

        //lista utworów

        $("#trackList").empty()

        for (let key in data.files) {

            let file = data.files[key].file
            let size = data.files[key].size
            let album = data.selectedDir

            if (file.endsWith(".mp3")) {

                let tr = $("<tr>")
                let td = $("<td>")

                td.text(file)

                if (file == this.getCurrentTrackTitle()) {
                    console.log(this.getCurrentTrackTitle())
                    tr.attr("id", "currentTrack")
                }

                let pKey = parseInt(key) + 1
                let nKey = parseInt(key) - 1

                if (pKey > data.files.length - 1) {
                    pKey = 0
                }

                if (nKey < 0) {
                    nKey = data.files.length - 1
                }

                if (data.files[pKey].file == this.getCurrentTrackTitle())
                    tr.attr("id", "prevTrack")  //poprzedni utwór

                if (data.files[nKey].file == this.getCurrentTrackTitle())
                    tr.attr("id", "nextTrack")  //następny utwór

                $("#trackList").append(tr)
                tr.append(td)

                td = $("<td>")

                td.text(size + "MB")

                tr.append(td)
                tr.addClass("title")

                tr.on("click", function () {
                    $("#currentTrack").attr("id", "")
                    $(this).attr("id", "currentTrack")
                    let src = "mp3/" + album + "/" + file
                    ui.currentTrackNum = key
                    ui.displayTitle(file)
                    ui.displayData(ui.serverData)
                    music.end()
                    music.play(src) //granie po kliknięciu w utwór na liście
                })

            }

        }

    }

    musicButtons() {

        $("#playstop").on("click", function () {

            if (ui.musicLoaded)
                if (ui.play) {
                    ui.toPlay()
                    music.pause()
                }
                else {
                    ui.toPause()
                    music.resume()
                }

        })

        $("#prev").on("click", function () {
            if (ui.musicLoaded)
                ui.toPrev()
        })

        $("#next").on("click", function () {
            if (ui.musicLoaded)
                ui.toNext()
        })

    }

    toPlay() {
        $("#playstop").attr("src", "player/play.png")
        this.play = false
    }

    toPause() {
        $("#playstop").attr("src", "player/pause.png")
        this.play = true
    }

    toPrev() {

        this.currentTrackNum = parseInt(this.currentTrackNum) - 1

        if (this.currentTrackNum < 0)
            this.currentTrackNum = this.serverData.files.length - 1

        if (this.serverData.files[this.currentTrackNum].file.endsWith(".png")) {
            return this.toPrev()
        }
        else {
            let src = "mp3/" + this.serverData.selectedDir + "/" + this.serverData.files[this.currentTrackNum].file
            this.displayTitle(this.serverData.files[this.currentTrackNum].file)
            this.changeTrack("prevTrack")
            music.end()
            music.play(src)
        }

    }

    toNext() {

        this.currentTrackNum = parseInt(this.currentTrackNum) + 1

        if (this.currentTrackNum > this.serverData.files.length - 1)
            this.currentTrackNum = 0

        console.log("file: ", this.serverData.files[this.currentTrackNum].file)
        console.log("trackNum: ", this.currentTrackNum)

        if (this.serverData.files[this.currentTrackNum].file.endsWith(".png"))   //w plikach są też okładki, jeśli na nią trafimy - wykonujemy funkcję ponownie dla innego indeksu tablicy plików
            return this.toNext()

        else {
            let src = "mp3/" + this.serverData.selectedDir + "/" + this.serverData.files[this.currentTrackNum].file
            this.displayTitle(this.serverData.files[this.currentTrackNum].file)
            this.changeTrack("nextTrack")
            music.end()
            music.play(src)
        }

    }

    changeTrack(which) {
        $("#currentTrack").attr("id", "")
        $(`#${which}`).attr("id", "currentTrack")
        $("#prevTrack").attr("id", "")
        $("#nextTrack").attr("id", "")
        this.displayData(this.serverData)
    }

    displayTitle(title) {
        $("#trackTitle").text(title)
    }

    getCurrentTrackTitle() {
        return $("#trackTitle").text()
    }

}
