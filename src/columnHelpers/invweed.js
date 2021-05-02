const marijuanaColumn = "V0676: Involved Marijuana";

const lambdaByMarijuana = function (d) {
    var value = d[marijuanaColumn];
    if (value === 1 || value === 2){
        return value;
    }
    return 0;
};

const labelsMarijuana =
    [
        {
            hashValue: 1,
            meaning: "Involved Marijuana"
        },
        {
            hashValue: 2,
            meaning: "Did Not Involve Marijuana"
        },
        {
            hashValue: 0, 
            meaning: "Other"
        }
    ];

const marijuanaMapFunc = function (d) {
    if (d[marijuanaColumn] === 1) {
        return "Involved Marijuana";
    } else if (d[marijuanaColumn] === 2) {
        return "Did Not Involve Marijuana";
    } else {
        console.log(d[marijuanaColumn]);
        return "Other";
    }
};

export {lambdaByMarijuana, labelsMarijuana, marijuanaMapFunc};