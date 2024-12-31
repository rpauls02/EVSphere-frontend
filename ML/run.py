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

# load input data
input_0 = pd.read_csv('./input_data/input_0.csv')
input_1 = pd.read_csv('input_data/input_1.csv')
input_2 = pd.read_csv('input_data/input_2.csv')
input_3 = pd.read_csv('input_data/input_3.csv')
input_4 = pd.read_csv('input_data/input_4.csv')
input_5 = pd.read_csv('input_data/input_5.csv')
'''input_6 = pd.read_csv('input_data/input_6.csv')
input_7 = pd.read_csv('input_data/input_7.csv')
input_8 = pd.read_csv('input_data/input_8.csv')
input_9 = pd.read_csv('input_data/input_9.csv')
input_10 = pd.read_csv('input_data/input_10.csv')'''

# predict with model
pred_0 = model.predict(input_0)
pred_1 = model.predict(input_1)
pred_2 = model.predict(input_2)
pred_3 = model.predict(input_3)
pred_4 = model.predict(input_4)
pred_5 = model.predict(input_5)
'''pred_6 = model.predict(input_6)
pred_7 = model.predict(input_7)
pred_8 = model.predict(input_8)
pred_9 = model.predict(input_9)
pred_10 = model.predict(input_10)'''

# convert predicted array to dataframe
pred_df_0 = pd.DataFrame(pred_0)
pred_df_1 = pd.DataFrame(pred_1)
pred_df_2 = pd.DataFrame(pred_2)
pred_df_3 = pd.DataFrame(pred_3)
pred_df_4 = pd.DataFrame(pred_4)
pred_df_5 = pd.DataFrame(pred_5)
'''pred_df_6 = pd.DataFrame(pred_6)
pred_df_7 = pd.DataFrame(pred_7)
pred_df_8 = pd.DataFrame(pred_8)
pred_df_9 = pd.DataFrame(pred_9)
pred_df_10 = pd.DataFrame(pred_10)'''

# save predicted array as csv
pred_df_0.to_csv('output_data/output_0.csv', header=False, index=False)
pred_df_1.to_csv('output_data/output_1.csv', header=False, index=False)
pred_df_2.to_csv('output_data/output_2.csv', header=False, index=False)
pred_df_3.to_csv('output_data/output_3.csv', header=False, index=False)
pred_df_4.to_csv('output_data/output_4.csv', header=False, index=False)
pred_df_5.to_csv('output_data/output_5.csv', header=False, index=False)
'''pred_df_6.to_csv('output_data/output_6.csv', header=False, index=False)
pred_df_7.to_csv('output_data/output_7.csv', header=False, index=False)
pred_df_8.to_csv('output_data/output_8.csv', header=False, index=False)
pred_df_9.to_csv('output_data/output_9.csv', header=False, index=False)
pred_df_10.to_csv('output_data/output_10.csv', header=False, index=False)'''
