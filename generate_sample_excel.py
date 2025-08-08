
import pandas as pd

data = {
    'Account Manager Name': ['John Doe', 'Jane Smith', 'John Doe', 'Jane Smith', 'John Doe'],
    'Customer': ['Customer A', 'Customer B', 'Customer A', 'Customer C', 'Customer B'],
    'Carrier': ['Carrier X', 'Carrier Y', 'Carrier X', 'Carrier Z', 'Carrier Y'],
    'Routing Zone': ['Zone 1', 'Zone 2', 'Zone 1', 'Zone 3', 'Zone 2'],
    'Minutes_Month1': [1000, 1500, 1200, 800, 1300],
    'Margin_Month1': [100, 150, 120, 80, 130],
    'Revenue_Month1': [500, 750, 600, 400, 650],
    'Minutes_Month2': [1100, 1400, 1300, 900, 1250],
    'Margin_Month2': [110, 140, 130, 90, 125],
    'Revenue_Month2': [550, 700, 650, 450, 625]
}

df = pd.DataFrame(data)
df.to_excel('cdr_sample_data.xlsx', index=False)
print('cdr_sample_data.xlsx generated successfully.')


