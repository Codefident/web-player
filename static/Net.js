console.log("wczytano plik Net.js")

class Net {

    constructor() {
    }

    sendData(album) {
        // tutaj wysłanie danych ajaxem na serwer
        console.log("sendData album:", album)
        $.ajax({

            url: "/",

            data: { album },

            type: "POST",

            success: function (data) {

                //dane z serwera - foldery oraz pliki
                //przekazanie do UI.js, aby wyświetlił
                ui.displayData(data)

            },

            error: function (xhr, status, error) {
                console.log("xhr", xhr)
            }

        })

    }
}

