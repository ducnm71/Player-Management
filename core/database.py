import requests
from datetime import datetime


def insertOne(data):
    try:
        response = requests.post("http://localhost:5000/transport", json=data)
        #print(response)
        #print("Response: (" + str(response.status_code) + "), msg = " + str(response.text))
        if response.status_code >= 200 and response.status_code < 300:
            #print("Success Response")
            return response.json()
        else:
            print(response.status_code)
            print("Error")
        response.close()
    except Exception as e:
        print(e)



