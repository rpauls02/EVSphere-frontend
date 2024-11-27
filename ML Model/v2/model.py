#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Nov 27 19:35:19 2024

@author: anson
"""

# import libraries
import pandas as pd
import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, r2_score

# load dataset
dataset = pd.read_csv('ev_charging_patterns.csv')

###

# correct / add variables

# change format of chaging start and end time
dataset['Charging Start Time'] = pd.to_datetime(dataset['Charging Start Time'])
dataset['Charging End Time'] = pd.to_datetime(dataset['Charging End Time'])
# correct charging duration
dataset['Charging Duration (hours)'] = (dataset['Charging End Time'] - dataset['Charging Start Time']).dt.total_seconds() / 3600

# correct charging rate
dataset['Charging Rate (kW)'] = dataset['Energy Consumed (kWh)'] / dataset['Charging Duration (hours)']

# add feature of multiplication of battery capacity and vehicle age
#dataset['Battery Capacity (kWh) * Vehicle Age (years)'] = dataset['Battery Capacity (kWh)'] * dataset['Vehicle Age (years)']

# add feature of multiplication of temperature and charging rate
#dataset['Temperature (°C) * Charging Rate (kW)'] = dataset['Temperature (°C)'] * dataset ['Charging Rate (kW)']

###

# drop na rows
dataset = dataset.dropna()

# remove invalid data

# start / end charging % must be between 0 and 100 inclusively
dataset = dataset[dataset['State of Charge (Start %)'] >= 0]
dataset = dataset[dataset['State of Charge (Start %)'] <= 100]
dataset = dataset[dataset['State of Charge (End %)'] >= 0]
dataset = dataset[dataset['State of Charge (End %)'] <= 100]

# start charging % must be smaller than or equal to end charging %
dataset = dataset[dataset['State of Charge (Start %)'] <= dataset['State of Charge (End %)']]

# charging duration must be at least 0
dataset = dataset[dataset['Charging Duration (hours)'] >= 0]

###

# model

# independent variables
X = dataset[ ['Battery Capacity (kWh)',
              'State of Charge (Start %)',
              'State of Charge (End %)',
              'Temperature (°C)',
              'Vehicle Age (years)',
              'Charging Rate (kW)'
              #'Battery Capacity (kWh) * Vehicle Age (years)',
              #'Temperature (°C) * Charging Rate (kW)'
              ] ]

# dependent variable
y = dataset['Charging Duration (hours)']

# split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# train linear / support vector regression model
#model = LinearRegression()
model = SVR(kernel='rbf', C=10, epsilon=0.001)
model.fit(X_train, y_train)

# predict for test set
y_pred = model.predict(X_test)

# evaluate model
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("Mean Squared Error:", mse)
print("Root Mean Squared Error:", rmse)
print("R-squared Score:", r2)

###

# predict for 1 example set of car data
eg_data = pd.read_csv('eg_data.csv')
eg_pred = model.predict(eg_data)
print('Predicted charging time 1 example car =', eg_pred)
