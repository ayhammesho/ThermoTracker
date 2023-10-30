from flask import Flask , request ,Response ,jsonify,render_template
from datetime import datetime
from pytz import timezone ,FixedOffset
import function as f 
import json
off = 0
def getTime(offset):
    format = "%Y-%m-%d %H:%M:%S"
    return datetime.now(timezone('UTC')).astimezone(FixedOffset(offset)).strftime(format)

app = Flask(__name__)

@app.get("/")
def site():
    return render_template("index.html")

data = {} 
@app.route("/api/liveData" ,methods =['POST' ,'GET'])
def postData():
    if request.method == 'POST':
        print(request.args)
        data1 = request.args.get('data1','')
        data2 = request.args.get('data2','')
        data['time']=getTime(off)
        data['sensor1'] = data1
        data['sensor2'] = data2
        print(data1 , data2)
        if data1 and data2: 
            f.insertdata(float(data1) , float(data2))
            return "done"
        else:
            return "error"
    elif request.method =='GET':
            return Response(json.dumps(data),  mimetype='application/json')


@app.get("/api/get")
def getdatanow():
    date= request.args.get('date','')
    filter = request.args.get('filter','')

    if date and filter: 
        
        filter = int(filter)
        if filter == 0 : 
            data = f.filter_by_years()
            return Response(json.dumps(data),  mimetype='application/json')
        elif filter ==1:
            data = f.filter_by_months(int(date.split('-')[0])) 
            return Response(json.dumps(data),  mimetype='application/json')
        elif filter ==2:
            data = f.filter_by_day_month(int(date.split('-')[0]) ,int(date.split('-')[1])) 
            return Response(json.dumps(data),  mimetype='application/json')
        elif filter ==3:
            print('hello world')
            data = f.filter_by_hour(int(date.split('-')[0]),int(date.split('-')[1]),int(date.split('-')[2])) 
            print(data)
            return Response(json.dumps(data),  mimetype='application/json')
        else: 
            return jsonify(error ='parameter error')
    
    elif int(filter) == 4:
        data = f.filter_by_lasthour()
        return Response(json.dumps(data),  mimetype='application/json')

    else: 
        return jsonify(error ='invalid parameter')
   # return jsonify(tst='2')
@app.get("/api/filter")
def filt():
    
    old = request.args.get('old','')
    new = request.args.get('new' ,'')
    print(old , new)
    if old and new:
        try:
            data = f.filter(old , new)
            return Response(json.dumps(data),  mimetype='application/json')
        except:
            return Response(json.dumps({'error':'invalid parameter'}),  mimetype='application/json')
    elif not old and not new:
            return Response(json.dumps(f.get_all_data_json()),  mimetype='application/json')

    else: 
        return Response(json.dumps({'error':'invalid parameter'}),  mimetype='application/json')


    



@app.get("/data")
def data1():
    return render_template("data.html" ,array =f.get_all_data())
if '__main__' ==__name__:
    app.run(host='0.0.0.0' , port=5001)