import pandas as pd
import random

# Generate more comprehensive test data
data = []

customers = ['Customer A', 'Customer B', 'Customer C', 'Customer D', 'Customer E']
carriers = ['Carrier X', 'Carrier Y', 'Carrier Z']
zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4']
managers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown']

for i in range(20):
    customer = random.choice(customers)
    carrier = random.choice(carriers)
    zone = random.choice(zones)
    manager = random.choice(managers)
    
    # Generate base values for month 1
    minutes_m1 = random.randint(500, 2000)
    margin_m1 = random.randint(50, 200)
    revenue_m1 = random.randint(250, 1000)
    
    # Generate month 2 values with some variation
    minutes_change = random.randint(-300, 400)
    margin_change = random.randint(-50, 60)
    revenue_change = random.randint(-100, 150)
    
    minutes_m2 = max(0, minutes_m1 + minutes_change)
    margin_m2 = max(0, margin_m1 + margin_change)
    revenue_m2 = max(0, revenue_m1 + revenue_change)
    
    data.append({
        'Account Manager Name': manager,
        'Customer': customer,
        'Carrier': carrier,
        'Routing Zone': zone,
        'Minutes_Month1': minutes_m1,
        'Margin_Month1': margin_m1,
        'Revenue_Month1': revenue_m1,
        'Minutes_Month2': minutes_m2,
        'Margin_Month2': margin_m2,
        'Revenue_Month2': revenue_m2
    })

df = pd.DataFrame(data)
df.to_excel('cdr_test_data.xlsx', index=False)
print('cdr_test_data.xlsx generated successfully with', len(data), 'records.')

