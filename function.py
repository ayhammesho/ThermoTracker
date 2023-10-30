import pandas as pd 
import sqlite3


from datetime import datetime
from pytz import timezone ,FixedOffset
off = 0
def getTime(offset):
    format = "%Y-%m-%d %H:%M:%S"
    return datetime.now(timezone('UTC')).astimezone(FixedOffset(offset)).strftime(format)


def insertdata(date1:float, data2:float):
    conn = sqlite3.connect("temp.db")
    cur = conn.cursor()
    cur.execute(f"insert into temp (sensor1,sensor2,date) values({date1},{data2},'{getTime(off)}')")
    conn.commit()
    conn.close()
# print(df.loc[(df['date'].dt.year == 2022) & (df['date'].dt.month ==11 ) & (df['date'].dt.day ==29 )])

def filter_by_years():
    conn = sqlite3.connect("temp.db")
    sql_query = pd.read_sql('select * from temp' , conn)
    df = pd.DataFrame(sql_query)
    df['date'] = pd.to_datetime(df['date'] ,  format='%Y-%m-%d')
    conn.close()
    data=[]
    for year in df['date'].dt.year.unique():
        sensor1 =float(df.loc[ df['date'].dt.year==year]['sensor1'].mean(0))
        sensor2 =float(df.loc[ df['date'].dt.year==year]['sensor2'].mean(0))
        data.append({'time':int(year) , 'sensor1':float(sensor1) ,'sensor2':float(sensor2)})
    
    return data
def filter_by_months(year:int):
    conn = sqlite3.connect("temp.db")
    sql_query = pd.read_sql('select * from temp' , conn)
    df = pd.DataFrame(sql_query)
    df['date'] = pd.to_datetime(df['date'] ,  format='%Y-%m-%d')
    conn.close()
    data=[]
    d = df.loc[(df['date'].dt.year ==year)]
    for month in d['date'].dt.month.unique():
        sensor1 =d.loc[ d['date'].dt.month==month]['sensor1'].mean(0)
        sensor2 =d.loc[ d['date'].dt.month==month]['sensor2'].mean(0)
        data.append({'time':int(month) , 'sensor1':float(sensor1) ,'sensor2':float(sensor2)})
    return data
def filter_by_day_month(year:int ,month:int):
    conn = sqlite3.connect("temp.db")
    sql_query = pd.read_sql('select * from temp' , conn)
    df = pd.DataFrame(sql_query)
    df['date'] = pd.to_datetime(df['date'] ,  format='%Y-%m-%d')
    conn.close()
    data =[]
    d =df.loc[(df['date'].dt.year == year) & (df['date'].dt.month == month )]
    for day in d['date'].dt.day.unique():
        print(day)
        sensor1 =d.loc[ d['date'].dt.day==day]['sensor1'].mean(0)
        sensor2 =d.loc[ d['date'].dt.day==day]['sensor2'].mean(0)
        data.append({'time':int(day) , 'sensor1':float(sensor1) ,'sensor2':float(sensor2)})

    return data
def filter_by_hour(year:int ,month:int,day:int ):
    conn = sqlite3.connect("temp.db")
    sql_query = pd.read_sql('select * from temp' , conn)
    df = pd.DataFrame(sql_query)
    df['date'] = pd.to_datetime(df['date'] ,  format='%Y-%m-%d')
    conn.close()
    data =[]
    d =df.loc[(df['date'].dt.year == year) & (df['date'].dt.month ==month ) & (df['date'].dt.day ==day )]
    for hour in d['date'].dt.hour.unique():
        sensor1 =d.loc[ d['date'].dt.hour==hour]['sensor1'].mean(0)
        sensor2 =d.loc[ d['date'].dt.hour==hour]['sensor2'].mean(0)
        data.append({'time':int(hour) , 'sensor1':float(sensor1) ,'sensor2':float(sensor2)})
    return data
def filter_by_lasthour():
    format = "%Y-%m-%d %H"
    time = datetime.now(timezone('UTC')).astimezone(FixedOffset(0)).strftime(format)
    conn = sqlite3.connect("temp.db")
    sql_query = pd.read_sql('select * from temp' , conn)
    df = pd.DataFrame(sql_query)
    df['date'] = pd.to_datetime(df['date'] ,  format='%Y-%m-%d')
    conn.close()
    d =df.loc[(df['date'].dt.year == int(time.split(' ')[0].split('-')[0])) & (df['date'].dt.month ==int(time.split(' ')[0].split('-')[1])) & (df['date'].dt.day ==int(time.split(' ')[0].split('-')[2]))]
    d = d.loc[d['date'].dt.hour== int(time.split(' ')[1])]
    data = []
    for i,j,k in zip(d['sensor1'] , d['sensor2'] ,d['date']):
        data.append({'time':str(k) , 'sensor1':float(i) ,'sensor2':float(j)})
    return data
def get_all_data(): 
    conn = sqlite3.connect("temp.db")
    cur = conn.cursor()
    cur.execute('select * from temp ORDER by date DESC')
    data = cur.fetchall()
    conn.close()
    return data
def get_all_data_json(): 
    format = "%Y-%m-%d %H"
    time = datetime.now(timezone('UTC')).astimezone(FixedOffset(0)).strftime(format)
    conn = sqlite3.connect("temp.db")
    sql_query = pd.read_sql('select * from temp ORDER by date DESC' , conn)
    df = pd.DataFrame(sql_query)
    df['date'] = pd.to_datetime(df['date'] ,  format='%Y-%m-%d')
    conn.close()
    data = []
    for i,j,k in zip(df['sensor1'] , df['sensor2'] ,df['date']):
        data.append({'time':str(k) , 'sensor1':float(i) ,'sensor2':float(j)})
    return data


def filter(old , new):
    conn = sqlite3.connect("temp.db")
    sql_query = pd.read_sql('select * from temp ORDER by date DESC' , conn)
    df = pd.DataFrame(sql_query)
    df['date'] = pd.to_datetime(df['date'] ,  format='%Y-%m-%d')
    d = df.loc[(df['date']>= old) & (df['date']< new)] 
    data = []
    for i,j,k in zip(d['sensor1'] , d['sensor2'] ,d['date']):
        data.append({'time':str(k) , 'sensor1':float(i) ,'sensor2':float(j)})
    return data

