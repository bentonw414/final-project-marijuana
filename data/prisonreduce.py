import csv
import os
import pandas as pd

read_file = pd.read_csv("./prisonpopbyyear.csv", thousands=',')
selected = read_file[["year", "count"]]
selected.to_csv("./popbyyear.csv", mode = "w", index=False)
