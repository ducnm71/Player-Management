import database
from datetime import datetime

dataArray = []

while True:
    dataArray.append({
        "key": "29B12345",
        "template": "29B-12345"
    })
    if len(dataArray) == 5:
        lastItem = dataArray[4]
        database.insertOne(lastItem)
        dataArray = []
        break