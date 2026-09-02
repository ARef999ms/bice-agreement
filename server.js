const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const ROOT = __dirname;

// پوشه ذخیره تعهدنامه‌ها
const RECORDS_DIR = path.join(
    ROOT,
    "Agreement Records on Servers"
);

// ساخت خودکار پوشه در صورت نبودن
if (!fs.existsSync(RECORDS_DIR)) {
    fs.mkdirSync(RECORDS_DIR, {
        recursive: true
    });
}

const server = http.createServer((req, res) => {

    // ==============================
    // SAVE AGREEMENT RECORD
    // ==============================

    if (
        req.method === "POST" &&
        req.url === "/save-record"
    ) {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const record = JSON.parse(body);

                if (!record.recordId) {
                    throw new Error("Missing recordId");
                }

                const filename =
                    record.recordId + ".json";

                const filepath =
                    path.join(
                        RECORDS_DIR,
                        filename
                    );

                fs.writeFileSync(
                    filepath,
                    JSON.stringify(
                        record,
                        null,
                        2
                    ),
                    "utf8"
                );

                res.writeHead(201, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(
                    JSON.stringify({
                        ok: true,
                        recordId:
                            record.recordId
                    })
                );

            } catch (error) {

                console.error(error);

                res.writeHead(400, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(
                    JSON.stringify({
                        ok: false,
                        error:
                            "Invalid record"
                    })
                );
            }
        });

        return;
    }


    // ==============================
    // SERVE WEBSITE
    // ==============================

    let requestedPath =
        req.url === "/"
            ? "index.html"
            : req.url.substring(1);

    // جلوگیری از دسترسی به مسیرهای خارج
    requestedPath =
        path.normalize(requestedPath);

    if (
        requestedPath.startsWith("..") ||
        path.isAbsolute(requestedPath)
    ) {

        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    const filePath =
        path.join(
            ROOT,
            requestedPath
        );

    fs.readFile(
        filePath,
        (error, data) => {

            if (error) {

                res.writeHead(404);
                res.end("Not Found");
                return;
            }

            let contentType =
                "text/html; charset=utf-8";

            if (
                filePath.endsWith(".png")
            ) {
                contentType =
                    "image/png";
            }

            if (
                filePath.endsWith(".jpg") ||
                filePath.endsWith(".jpeg")
            ) {
                contentType =
                    "image/jpeg";
            }

            if (
                filePath.endsWith(".css")
            ) {
                contentType =
                    "text/css; charset=utf-8";
            }

            if (
                filePath.endsWith(".js")
            ) {
                contentType =
                    "application/javascript; charset=utf-8";
            }

            res.writeHead(200, {
                "Content-Type":
                    contentType
            });

            res.end(data);
        }
    );

});


// ==============================
// START SERVER
// ==============================

server.listen(
    PORT,
    "127.0.0.1",
    () => {

        console.log("");
        console.log(
            "=============================="
        );
        console.log(
            "       BICE AGREEMENT"
        );
        console.log(
            "=============================="
        );
        console.log("");

        console.log(
            "Website:"
        );

        console.log(
            "http://127.0.0.1:" +
            PORT
        );

        console.log("");

        console.log(
            "Records folder:"
        );

        console.log(
            RECORDS_DIR
        );

        console.log("");

        console.log(
            "Server is running..."
        );

        console.log("");
    }
);
