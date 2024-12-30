#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Dec 30 18:30:01 2024

@author: anson
"""
# import libraries
import pandas as pd
import joblib

# load model
model = joblib.load('model.pkl')

# load input csv data
data = pd.read_csv('eg_data.csv')

# predict with model
pred = model.predict(data)

# convert predicted array to dataframe
pred_df = pd.DataFrame(pred)

# save predicted array as csv
pred_df.to_csv('pred.csv', header=False, index=False)