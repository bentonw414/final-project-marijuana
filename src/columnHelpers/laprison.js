const usPercentColumn = "percent LA in prison";

const lambdaByLAPrison = function (d) {
    return d[usPercentColumn]
};

const labelsLAPrison =
    [
        {
            hashValue: 0,
            meaning: "Not In Prison"
        },
        {
            hashValue: 1,
            meaning: "In Prison"
        }
    ];

const laPrisonMapFunc = function (d) {
    if (d[usPercentColumn] === 0) {
        return "Not In Prison";
    } else if (d[usPercentColumn] === 1) {
        return "In Prison";
    } else {
        console.log(d[genderColumn]);
    }
};

export {lambdaByLAPrison, labelsLAPrison, laPrisonMapFunc};