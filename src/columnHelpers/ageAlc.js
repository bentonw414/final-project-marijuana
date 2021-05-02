const alcColumn = "V1264: Age at First Drink";

const lambdaByAgeAlc = function (d) {
    let alcValue = d[alcColumn];
    if (alcValue > 0 && alcValue < 100) {
        return Math.floor(alcValue / 10);
    } else {
        return 11;
    }
};

const alcMapFunc = function (d) {
    let alcValue = d[alcColumn];
    if (alcValue > 0 && alcValue < 100) {
        return "Age:" + Math.floor(alcValue / 10) * 10 + "-" + Math.floor(alcValue / 10) + 9;
    } else {
        return "Did not answer/Never?";
    }
}

export {lambdaByAgeAlc, alcMapFunc};