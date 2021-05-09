import csv
import os
import pandas as pd

read_file = pd.read_csv("./statesData.csv", thousands=',')
selected = read_file[["State", "Federal prison rate", "State prison rate", "Local jails rate", "Youth facilities rate"]]
selected["incarcerated rate"] = (selected["Federal prison rate"] + selected["State prison rate"] + selected["Local jails rate"] + selected["Youth facilities rate"])/100000
# selected.columns = list(mydict.values())
# populations = pd.read_csv("./PEP_2016_PEPANNRES_with_ann.csv")
# populations = populations[["GEO.display-label", "respop72016"]]
# result = selected.merge(populations, left_on="jurisdiction", right_on="GEO.display-label")
# print(result.head)
# result = result[["jurisdiction", "2016", "respop72016"]]
# result["percent"] = (result["2016"]/result["respop72016"].astype(int))*100
# selected.to_csv("./states.csv", mode = "w", index=False)
selected.to_csv("./states.csv", mode = "w", index=False)
