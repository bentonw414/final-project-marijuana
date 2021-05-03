const marijuanaColumn = "V0676: Involved Marijuana";

const lambdaByMarijuana = function (d) {
    var value = d[marijuanaColumn];
    if (value === 1 || value === 2){
        return value - 1;
    }
    return 2;
};

const labelsMarijuana =
    [
        {
            hashValue: 0,
            meaning: "Involved Marijuana"
        },
        {
            hashValue: 1,
            meaning: "Did Not Involve Marijuana"
        },
        {
            hashValue: 2, 
            meaning: "Other"
        }
    ];

const marijuanaMapFunc = function (d) {
    const hashValue = lambdaByMarijuana(d);
    return labelsMarijuana[hashValue].meaning;
};

export {lambdaByMarijuana, labelsMarijuana, marijuanaMapFunc};