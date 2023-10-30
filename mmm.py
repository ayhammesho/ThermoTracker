
import requests

requests.post("http://161.97.92.12:5001/api/liveData?data1=35&data2=32")
# requests.post("http://192.168.1.103:5001/api/liveData?data1=33&data2=43")

# import function 


# print(function.get_all_data())

from datetime import datetime
from pytz import timezone ,FixedOffset
def getTime(offset):
    format = "%Y-%m-%d %H:%M:%S"
    return datetime.now(timezone('UTC')).astimezone(FixedOffset(offset)).strftime(format)

