const usPercentColumn = "percent us in prison";

var colors = ["#5081B9", "#F58B51", "#60815F", "#54F2F2", "#0B847A","#ffc800","#4B5C6C","#e84855", "#5b5f97","#e6e18f"];


const lambdaByUSPrison = function (d) {
    return 1 - d[usPercentColumn]
};


const labelsUSPrison =
    [
        
        {
            hashValue: 0,
            meaning: "In Prison",
            color: colors[3]
        },
        {
            hashValue: 1,
            meaning: "Not In Prison",
            color: colors[2]
        }
    ];

const usPrisonMapFunc = function (d) {
    const hashValue = lambdaByUSPrison(d);
    return labelsUSPrison[hashValue].meaning;
};

export {lambdaByUSPrison, labelsUSPrison, usPrisonMapFunc};