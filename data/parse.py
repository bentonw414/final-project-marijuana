import csv
import os
import pandas as pd

base = "../names/"
index = 0
# d = {"name": [], "sex": [], "count":[], "year":[], "rank":[], "index":[]}
# df = pd.DataFrame(data=d)
# df.to_csv("./allnames.csv", mode="w", header=True, index = False)
columns = ["V0001B", "V1951", "V1952", "V1953", "V1954", "V1955", "V1956", "V1957", "V0056Y", "V0062", "V0064","V0065","V0066","V0067","V0068","V0069","V0104","V0107","V0405","V0406","V0407","V0408","V0409","V0410","V0459","V0460","V0472","V0475","V0476","V0477","V0478","V0479","V0480","V0481","V0482","V0483","V0484","V0485","V0486","V0487","V0488","V0721","V0761","V0762","V0763","V0764","V0765","V0766","V0767","V0722","V0788","V0899","V0906","V0913","V0918","V0917","V0935","V0942","V1185","V1186","V1187","V1188","V1189","V1190","V1191","V1211","V1212","V1213", "V1263","V1264","V1265","V1266","V1267","V1268","V1291","V1292","V1293","V1294","V1295","V1296","V1297","V1298","V1299","RV0001","RV0003","RV0005", "RV0036", "RV0037"
]

read_file = pd.read_csv("./37692-0001-Data.tsv", sep="\t")
selected = read_file[columns]
selected.to_csv("./filtereddata.csv", mode = "w", index=False)
