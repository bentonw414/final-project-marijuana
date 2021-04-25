import csv
import os
import pandas as pd


columns = ["V0001B", "V0056Y", "V0062", "V0064","V0065","V0066","V0067","V0068",
"V0069","V0104","V0107","V0405","V0406","V0407","V0408","V0409","V0410","V0459",
"V0460","V0472","V0675","V0676","V0677","V0678","V0679","V0680","V0681","V0682",
"V0683","V0684","V0685","V0686","V0721", "V0722", "V0761","V0762",
"V0763","V0764","V0765","V0766","V0767","V0772","V0788","V0899","V0906",
"V0918","V0917","V0935","V0942","V1185","V1186","V1187","V1188","V1189","V1190",
"V1191","V1211","V1212","V1213", "V1264","V1267","V1268",
"V1291","V1292","V1293","V1294","V1295","V1296","V1297","V1298","V1299","RV0001",
"RV0003","RV0005", "RV0036", "RV0037"
]
name = ["Respondent ID", "Date Admitted - Year", "Controlling Offense", "Offense 1",
"Offense 2", "Offense 3", "Offense 4", "Offense 5", "Violent Type", "Year Arrested",
"Year Admitted Prison", "Minimum Years Sentenced", "Maximum Years Sentenced",
"Minimum Months Sentenced", "Maximum Months Sentenced", "Minimum Days Sentenced",
"Maximum Days Sentenced", "Mandatory Drug Testing", "Mandatory Treatment", "Year Expected Release"
"Any Offense Possesion", "Possession with Intent to Distribute", "Involved Marijuana",
"Involved Cocaine", "Involved Crack", "Involved Heroin", "Involved PCP", "Involved Ecstacy",
"Involved MDMA", "Involved Hallucinogens", "Involved Meth", "Involved Prescription",
"Involved Other Drugs", "Amount of Marijuana - Units", "Amount of Marijuana",
"Importing Drugs", "Manufacturing/Growing", "Laundering Drug Money", "Distributing to Dealers",
"Selling Drugs", "Using/Possessing Drugs", "Part of Drug Organizatin", "State",
"Weapon Carried", "Age at First Arrest", "Been Arrested for Drugs", "First Admitted to State/Federal",
"First Admission to Prison - Year", "Highest Education", "ADD/ADHD", "Diagnosed Manic/Bipolar",
"Diagnosed Depressive Disorder", "Diagnosed Schizophrenia/Psychotic", "Diagnosed PTSD",
"Diagnosed Anxiety", "Diagnosed Personality Disorder", "Diagnosed Other", "Sex Assigned at Birth",
"Self Described Sex", "Sexual Orientation", "Age at First Drink", "Drinking Alcohol at Time of Offense",
"Binge Drinking", "Used Marijuana", "Used Cocaine", "Used Crack", "Used Heroin", "Used PCP",
"Used Ecstacy/Molly", "Used Hallucinogens", "Used Meth", "Used Inhalents",
"Current Age", "Race", "Sex", "Controlling Offense Category - 13", "Controlling Offense Category - 5"]

mydict = {}
for index in range(len(columns)):
  mydict[columns[index]] = columns[index] + ": " + name[index]

print(list(mydict.values()))
read_file = pd.read_csv("./37692-0001-Data.tsv", sep="\t")
selected = read_file[columns]
selected.columns = list(mydict.values())
selected.to_csv("./filtereddata.csv", mode = "w", index=False)
