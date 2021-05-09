import csv
import os
import pandas as pd
import random
import math

num_people = 2048
us_prison_per = 0.007
louisianna_per = 0.024
extra_r = [us_prison_per]
extra_names = ["percent us in prison"]
state_name = "percent {} in prison"

def add_states(df_big):
    df = pd.read_csv("./states.csv")
    for row in df.iterrows():
        print(row)
        print(row[0])
        print(row[1]["State"])
        state = row[1]["State"]
        percent = row[1]["incarcerated rate"]
        new_column = []
        print(percent)
        values = [1, 0]
        percentages = [percent, 1-percent]
        for index in range(len(percentages)):
            people = round(2048*percentages[index])
            new_column += [values[index] for i in range(people)]
        random.shuffle(new_column)
        df_big[state_name.format(state)] = new_column
    return df_big


#-55 is my special value for other
def convert_to_column(df, df2, name, column_dict, total):
    new_column = []
    values = []
    percentages = []
    for value in column_dict:
        values.append(value)
        people = math.floor(num_people*column_dict[value]/total)
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

def extra_rows(df, df2):
    values = [0, 1]
    for outer in range(len(extra_r)):
        percent = extra_r[outer]
        new_column = []
        percentages = []
        percentages = [1-percent, percent]
        for index in range(len(percentages)):
            people = round(2048*percentages[index])
            new_column += [values[index] for i in range(people)]
        random.shuffle(new_column)
        df[extra_names[outer]] = new_column
        values = pd.Series(values)
        percentages = pd.Series(percentages)
        df2[extra_names[outer] + ": values"] = values
        df2[extra_names[outer] + ":percentages"] = percentages
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
df, df2 = extra_rows(df, df2)
df = add_states(df)


df.to_csv("./compileddata.csv", mode = "w", index=False)
df2.to_csv("./percentagedata.csv", mode = "w", index=False)
