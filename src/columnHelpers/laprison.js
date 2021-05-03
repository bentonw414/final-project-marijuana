const usPercentColumn = "percent LA in prison";

const lambdaByLAPrison = function (d) {
    return 1 - d[usPercentColumn]
};

// const labelsLAPrison =
//     [
//         {
//             hashValue: 1,
//             meaning: "Not In Prison"
//         },
//         {
//             hashValue: 0,
//             meaning: "In Prison"
//         }
//     ];

const labelsLAPrison = [
    {
        hashValue: 0,
        meaning: 'In prisonNEW',
        color: "teal"
    },
    {
        hashValue: 1,
        meaning: 'Not in prisonNEW',
        color: "grey"
    }
];

// const mapping = new Map();
// for (let i = 0; i < labelsLAPrison.length; i++){
//     mapping.set(labelsLAPrison[i].hashValue, labelsLAPrison[i].meaning);
// }

const laPrisonMapFunc = function (d) {
    const hashValue = lambdaByLAPrison(d);

    // if (d[usPercentColumn] === 1) {
    //     return "Not In PrisonA";
    // } else if (d[usPercentColumn] === 0) {
    //     return "In PrisonA";
    // } else {
    //     console.log(d[genderColumn]);
    // }
    return labelsLAPrison[hashValue].meaning;
};

export {lambdaByLAPrison, labelsLAPrison, laPrisonMapFunc};