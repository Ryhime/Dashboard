import pyshark
import requests

capture = pyshark.LiveCapture(interface='enp42s0')
capture.sniff(10)

numPackets = 0
ipAddresses = {}
for packet in capture:
    numPackets+=1
    try:
        ip = packet.ip.src
        if (ip not in ipAddresses):
            ipAddresses[ip] = 0
        else:
            ipAddresses[ip] += 1
    except:
        pass

# ALSO MAY WANT TO PASS THE IP ADDRESS THROUGH NSLOOKUP FIRST TO ACTUALLY GET THE NAME
print(ipAddresses)
print(numPackets)