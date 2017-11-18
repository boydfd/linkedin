const fs = require("fs");
const text = fs.readFileSync("tmp", "utf-8");
const linkedins = text.split("\n");
function write_oneline(text) {
    fs.appendFile("./out", text + '\n', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
module.exports = {
    linkedins,
    write_oneline,
};



