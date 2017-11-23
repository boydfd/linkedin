const fs = require("fs");
const text = fs.readFileSync("tmp", "utf-8");
const linkedins = text.split("\n");
function write_oneline(url, text) {
    fs.appendFile("./out", url + ',' + text + '\n', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
// const out = fs.readFileSync("out", "utf-8");
// let outs = out.split("\n");
//
// console.log(outs.length)
// outs = outs.map(o => o.split(",")).filter(o => {
//     return (o[1] || '') !== 'fail'
// }).map(o => o.join(','));
// const result = outs.join('\n')
// fs.writeFile("./out1", result)
// console.log(result)
// console.log(result.length)
module.exports = {
    linkedins,
    write_oneline,
};



