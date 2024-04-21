import database
from datetime import datetime

dataArray = []

while True:
    dataArray.append({
        "key": "30A156789",
        "template": "30A1 - 56789",
        "timeIn": datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    })
    if len(dataArray) == 5:
        lastItem = dataArray[4]
        checkTemplate = database.findOne({"template": lastItem["template"]})
        if checkTemplate == None:
            database.insertOne(lastItem["key"], lastItem["template"], lastItem["timeIn"])
        else:
            if checkTemplate['timeOut'] == "":
                timeOut = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
                database.updateOne({"template": checkTemplate["template"], "timeIn": checkTemplate["timeIn"]}, {"timeOut": timeOut})
            else:
                database.insertOne(lastItem["key"], lastItem["template"], lastItem["timeIn"])
        dataArray = []
        break