const genderColumn = "RV0005: Sex";
const genderMaleValue = 1;
const genderFemaleValue = 2;

const lambdaByGender = function (d) {
    if (d[genderColumn] === genderMaleValue) {
        return 0;
    } else if (d[genderColumn] === genderFemaleValue) {
        return 1;
    } else {
        return 2
        console.log(d[genderColumn]);
    }
};

const labelsGender =
    [
        {
            hashValue: 0,
            meaning: "Male"
        },
        {
            hashValue: 1,
            meaning: "Female"
        },
        {
            hashValue: 2, 
            meaning: "Other"
        }
    ];

const genderMapFunc = function (d) {
    if (d[genderColumn] === genderMaleValue) {
        return "Male";
    } else if (d[genderColumn] === genderFemaleValue) {
        return "Female";
    } else {
        return "Other";
    }
};

export {lambdaByGender, labelsGender, genderMapFunc};