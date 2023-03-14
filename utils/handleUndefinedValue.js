
const avoidUndefined = (params) => {
    //avoid undefined value
    for (i = 0; i < params.length; i++) {
        params[i] = params[i] == undefined ? null : params[i]
    }
}
module.exports = avoidUndefined;
