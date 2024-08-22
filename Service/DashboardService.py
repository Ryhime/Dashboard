from flask import Flask, jsonify, request
import pyshark

def getPackets(numPackets: int):
    capture = pyshark.LiveCapture(interface='enp42s0')
    capture.sniff(numPackets)

    numPackets = 0
    ipAddresses = {}
    for packet in capture:
        numPackets+=1
        try:
            ip = packet.ip.src
            if (ip not in ipAddresses):
                ipAddresses[ip] = 1
            else:
                ipAddresses[ip] += 1
        except:
            pass

    return {
        'ips': ipAddresses,
        'numPackets': numPackets
    }

app = Flask(__name__)


@app.route('/tasks', methods = ['GET'])
def getTasks():
    return jsonify('tasks', [])

@app.route('/computer-stats', methods = ['GET'])
def getComputerStats():
    return jsonify('computer-stats', [])

@app.route('/network-stats', methods = ['GET'])
def getNetworkStats():
    numPackets: int = int(request.args.get('numPackets'))
    packetInfo = getPackets(numPackets)
    return jsonify('network-stats', packetInfo)


if (__name__ == '__main__'):
    app.run(debug=True)

