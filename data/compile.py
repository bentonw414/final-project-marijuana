import csv
import os
import pandas as pd
import random
import math

num_people = 2048

#-55 is my special value for other
def convert_to_column(df, df2, name, column_dict, total):
    new_column = []
    values = []
    percentages = []
    for value in column_dict:
        values.append(value)
        people = math.floor(num_people*column_dict[value]/total)
        print(people)
        print(people/num_people)
        percentage = people/num_people
        percentages.append(percentage)
        new_column += [value for i in range(0, people)]
    extra = num_people - len(new_column)
    new_column += [-55 for i in range(0, extra)]
    values.append(-55)
    percentages.append(extra//total)
    values = pd.Series(values)
    percentages = pd.Series(percentages)
    df2[name + ": values"] = values
    df2[name + ":percentages"] = percentages
    random.shuffle(new_column)
    df[name] = new_column
    return df, df2



read_file = pd.read_csv("./filtereddata.csv")
index = 0
count = 0
df = pd.DataFrame([i for i in range(1, num_people + 1)], columns=["V0001B: Respondent ID"])
df2 = pd.DataFrame()
for name in read_file.columns:
    if index == 0:
        index += 1
        continue

    column_dict = {}
    for value in read_file[name]:
        if index == 1:
            count+= 1
        if value in column_dict:
            column_dict[value] += 1
        else:
            column_dict[value] = 1
    index += 1
    df, df2 = convert_to_column(df, df2, name, column_dict, count)

df.to_csv("./compileddata.csv", mode = "w", index=False)
df2.to_csv("./percentagedata.csv", mode = "w", index=False)
