const usPercentColumn = "percent us in prison";

const lambdaByUSPrison = function (d) {
    return d[usPercentColumn]
};

const labelsUSPrison =
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

const usPrisonMapFunc = function (d) {
    if (d[usPercentColumn] === 0) {
        return "Not In Prison";
    } else if (d[usPercentColumn] === 1) {
        return "In Prison";
    } else {
        console.log(d[genderColumn]);
    }
};

export {lambdaByUSPrison, labelsUSPrison, usPrisonMapFunc};