var net;
var ui;
var music;

$(document).ready(function () {

    net = new Net() // utworzenie obiektu klasy Net
    ui = new Ui() // utworzenie obiektu klasy Ui
    music = new Music() //utworzenie obiektu klasy Music

    net.sendData(0) //odpowiada za wysłanie Ajaxa zaraz po załadowaniu strony
    ui.musicButtons()
})