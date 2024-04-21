import json
import requests
import time
from datetime import datetime

URL = "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-btvgcwh/endpoint/data/v1/action/"
API_KEY = "mV4bQZ2LOYgXzDA2hen1BOvw4lzUsxPcnqrHTP6a3rPpnWJGZPIgamCG3Rmeb8vg"

def insertOne(key, template, timeIn):
    try:
        headers = { "api-key": API_KEY }
        documentToAdd = {"key": key,
                         "template": template,
                         "timeIn": timeIn,
                         "timeOut": ""}
        insertPayload = {
            "dataSource": "Cluster0",
            "database": "smartParking",
            "collection": "transports",
            "document": documentToAdd,
        }
        response = requests.post(URL + "insertOne", headers=headers, json=insertPayload)
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


def findOne(filter_dictionary):
    try:
        headers = { "api-key": API_KEY }
        searchPayload = {
            "dataSource": "Cluster0",
            "database": "smartParking",
            "collection": "transports",
            "filter": filter_dictionary,
        }
        response = requests.post(URL + "find", headers=headers, json=searchPayload)
        #print("Response: (" + str(response.status_code) + "), msg = " + str(response.text))
        if response.status_code >= 200 and response.status_code < 300:
            result = response.json()
            records = result.get('documents')
            sorted_records = sorted(records, key=lambda x: x.get('timeIn'), reverse=True)
            return sorted_records[0] if sorted_records else None
        else:
            print(response.status_code)
            print("Error")
        response.close()
    except Exception as e:
        print(e)

def updateOne(filter_dictionary, update_dict):
    try:
        headers = { "api-key": API_KEY }
        update = {"$set": update_dict}
        searchPayload = {
            "dataSource": "Cluster0",
            "database": "smartParking",
            "collection": "transports",
            "filter": filter_dictionary,
            "update": update,
        }
        response = requests.post(URL + "updateOne", headers=headers, json=searchPayload)
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

