#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Nov 23 16:42:53 2024

@author: anson
"""

'''
Multiple Linear Regression - Charging Duration
'''

# import libraries
import pandas as pd
import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

'''
from sklearn.model_selection import KFold
from sklearn.model_selection import cross_val_score
from numpy import mean
from numpy import absolute
'''

# load dataset
dataset = pd.read_csv('ev_charging_patterns.csv')

# add corrected calculated charging duration column
dataset['Charging Start Time'] = pd.to_datetime(dataset['Charging Start Time'])
dataset['Charging End Time'] = pd.to_datetime(dataset['Charging End Time'])
dataset['Charging Duration (calculated)'] = (dataset['Charging End Time'] - dataset['Charging Start Time']).dt.total_seconds() / 3600

# drop na rows
dataset = dataset.dropna()

# define independent and dependent variables
X = dataset[ ['Battery Capacity (kWh)',
              'State of Charge (Start %)',
              'State of Charge (End %)',
              'Temperature (°C)',
              'Vehicle Age (years)'
              ] ]
#y = dataset['Charging Duration (hours)']
y = dataset['Charging Duration (calculated)']

# split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
'''
# apply standard scaler
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.fit_transform(X_test)

# fit PCA model
pca = PCA(n_components = 5)
X_train = pca.fit_transform(X_train)
X_test = pca.fit_transform(X_test)
'''
# train linear regresion model
model = LinearRegression()
model.fit(X_train, y_train)

# predict for test set
y_pred = model.predict(X_test)

# Evaluate model
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("Mean Squared Error:", mse)
print("Root Mean Squared Error:", rmse)
print("R-squared Score:", r2)

'''
# define k-fold cross validation
k_fold_cv = KFold(n_splits=5, random_state=1, shuffle=True)

# create linear regression model
model = LinearRegression()

# define score
score = cross_val_score(model, X, y, scoring='neg_mean_absolute_error', cv=k_fold_cv, n_jobs=-1)

#view mean absolute error
mean(absolute(score))
'''


