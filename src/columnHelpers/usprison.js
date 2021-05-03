const usPercentColumn = "percent us in prison";

const lambdaByUSPrison = function (d) {
    return 1 - d[usPercentColumn]
};


const labelsUSPrison =
    [
        
        {
            hashValue: 0,
            meaning: "In Prison",
            color: "#f4c95d"
        },
        {
            hashValue: 1,
            meaning: "Not In Prison",
            color: "#7465a4"
        }
    ];

const usPrisonMapFunc = function (d) {
    const hashValue = lambdaByUSPrison(d);
    return labelsUSPrison[hashValue].meaning;
};

export {lambdaByUSPrison, labelsUSPrison, usPrisonMapFunc};