var http = require('http')
var fs = require('fs')
var qs = require('querystring')

var server = http.createServer(function (req, res) {
    console.log(req.method, " - ", req.url)

    switch (req.method) {

        case "GET":

            if (req.url == "/") {
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write(data);
                    res.end();
                })
            }

            else {

                let url = req.url.replace(/%20/g, " ")

                url = url.replace(/%C4%84/g, "Ą")
                url = url.replace(/%C4%86/g, "Ć")
                url = url.replace(/%C4%98/g, "Ę")
                url = url.replace(/%C5%81/g, "Ł")
                url = url.replace(/%C5%83/g, "Ń")
                url = url.replace(/%C3%93/g, "Ó")
                url = url.replace(/%C5%9A/g, "Ś")
                url = url.replace(/%C5%B9/g, "Ź")
                url = url.replace(/%C5%BB/g, "Ż")
                url = url.replace(/%C4%85/g, "ą")
                url = url.replace(/%C4%87/g, "ć")
                url = url.replace(/%C4%99/g, "ę")
                url = url.replace(/%C5%82/g, "ł")
                url = url.replace(/%C5%84/g, "ń")
                url = url.replace(/%C3%B3/g, "ó")
                url = url.replace(/%C5%9B/g, "ś")
                url = url.replace(/%C5%BA/g, "ź")
                url = url.replace(/%C5%BC/g, "ż")

                fs.readFile(`static${url}`, function (error, data) {

                    if (error) {
                        return console.log(error)
                    }

                    else if (url.endsWith(".js")) {
                        res.writeHead(200, {
                            'Content-Type': `application/javascript;charset=utf-8`
                        })
                    }

                    else if (url.endsWith(".css")) {
                        res.writeHead(200, {
                            'Content-Type': `text/css`
                        })
                    }

                    else if (url.endsWith(".ico")) {
                        res.writeHead(200, {
                            'Content-Type': `image/x-icon`
                        })
                    }

                    else if (url.endsWith(".png")) {
                        res.writeHead(200, {
                            'Content-Type': `image/png`
                        })
                    }

                    else if (url.endsWith(".jpg") || url.endsWith(".jpeg")) {
                        res.writeHead(200, {
                            'Content-Type': `image/jpeg`
                        })
                    }

                    else if (url.endsWith(".mp3")) {
                        res.writeHead(200, {
                            'Content-Type': 'audio/mpeg'
                        })
                    }

                    res.write(data)
                    res.end()

                })
            }
            break

        case "POST":

            let dataFromAjax = ""
            let dataObj

            req.on("data", function (data) {
                dataFromAjax += data
            })

            req.on("end", function (data) {
                dataObj = qs.parse(dataFromAjax) //dane -> obiekt
            })

            //tutaj trafią zczytane nazwy folderów w formie JSON-a

            fs.readdir(__dirname + "\\static\\mp3", function (err, dirs) {

                let context = {
                    directories: [],
                    files: []
                }

                if (err) {
                    return console.log(err);
                }

                dirs.forEach(function (fileName) {
                    //tu dodaj foldery do wcześniej utworzonej tablicy
                    context.directories.push(fileName)
                });

                // tu można od razu wywołać taką samą funkcję, która przeczyta pliki z pierwszego katalogu w tablicy

                fs.readdir(__dirname + `\\static\\mp3\\${context.directories[dataObj.album]}`, function (err2, files) {

                    if (err2) {
                        return console.log(err2)
                    }


                    files.forEach(function (fileName) {

                        let stats = fs.statSync(__dirname + `\\static\\mp3\\${context.directories[dataObj.album]}\\` + fileName);
                        let fileSize = ((Math.floor((parseFloat(stats.size) / (1024 * 1024)) * 100)) / 100).toFixed(2)

                        let obj = { file: fileName, size: fileSize }

                        context.files.push(obj)

                    })

                    context.selectedDir = context.directories[dataObj.album]

                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
                    res.end(JSON.stringify(context))

                })
            })

            break;


    }
})

server.listen(3000, function () {
    console.log("MP3 Webplayer, Piotr Klęp 3ID2, port 3000")
})