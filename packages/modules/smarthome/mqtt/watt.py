#!/usr/bin/python3
import sys
import os
import time
import json
import paho.mqtt.client as mqtt
import re

numberOfSupportedDevices = 9  # limit number of smart home devices


def on_connect(client, userdata, flags, rc):
    global devicenumber
    client.subscribe("openWB/LegacySmartHome/set/Devices/"+devicenumber + "/#", 2)


def on_message(client, userdata, msg):
    global numberOfSupportedDevices
    global aktpower
    global powerc
    if (("openWB/LegacySmartHome/set/Device" in msg.topic) and ("Aktpower" in msg.topic)):
        devicenumb = re.sub(r'\D', '', msg.topic)
        if (1 <= int(devicenumb) <= numberOfSupportedDevices):
            aktpower = int(msg.payload)
    if (("openWB/LegacySmartHome/set/Device" in msg.topic) and ("Powerc" in msg.topic)):
        devicenumb = re.sub(r'\D', '', msg.topic)
        if (1 <= int(devicenumb) <= numberOfSupportedDevices):
            powerc = int(msg.payload)


aktpower = 0
powerc = 0
devicenumber = str(sys.argv[1])
ipadr = str(sys.argv[2])
uberschuss = int(sys.argv[3])
file_string = '/var/www/html/openWB/ramdisk/smarthome_device_' + str(devicenumber) + '_mqtt.log'
if os.path.isfile(file_string):
    fx = open(file_string, 'a')
else:
    fx = open(file_string, 'w')
named_tuple = time.localtime()  # getstruct_time
time_string = time.strftime("%m/%d/%Y, %H:%M:%S mqtt watt.py", named_tuple)
client = mqtt.Client("openWB-mqttsmarthomecust" + devicenumber)
client.on_connect = on_connect
client.on_message = on_message
startTime = time.time()
waitTime = 5
client.connect("localhost")
while True:
    client.loop()
    elapsedTime = time.time() - startTime
    if elapsedTime > waitTime:
        break
client.publish("openWB/LegacySmartHome/set/Devices/"+str(devicenumber) +
               "/Ueberschuss", payload=str(uberschuss), qos=0, retain=True)
client.loop(timeout=2.0)
client.disconnect()
file_stringpv = '/var/www/html/openWB/ramdisk/smarthome_device_' + str(devicenumber) + '_pv'
# PV-Modus
pvmodus = 0
if os.path.isfile(file_stringpv):
    f = open(file_stringpv, 'r')
    pvmodus = int(f.read())
    f.close()
answer = '{"power":' + str(aktpower) + ',"powerc":' + str(powerc) + ',"on":' + str(pvmodus) + '} '
f1 = open('/var/www/html/openWB/ramdisk/smarthome_device_ret' + str(devicenumber), 'w')
json.dump(answer, f1)
f1.close()
fx.close()
