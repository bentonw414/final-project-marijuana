import csv
import os
import pandas as pd

read_file = pd.read_csv("./statesData.csv", thousands=',')
selected = read_file[["State", "Federal prison rate", "State prison rate", "Local jails rate", "Youth facilities rate"]]
selected["incarcerated rate"] = (selected["Federal prison rate"] + selected["State prison rate"] + selected["Local jails rate"] + selected["Youth facilities rate"])/100000
selected.to_csv("./states.csv", mode = "w", index=False)
