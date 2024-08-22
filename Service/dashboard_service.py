"""Module that acts as a backend service for the Dashboard"""
from flask import Flask, jsonify, request
import pyshark

def get_packets(num_packets: int):
    """Gets the IP Addresses For Incoming Packets"""
    capture = pyshark.LiveCapture(interface='enp42s0')
    capture.sniff(num_packets)

    num_packets = 0
    ip_addresses = {}
    for packet in capture:
        try:
            num_packets+=1
            ip = packet.ip.src
            if ip not in ip_addresses:
                ip_addresses[ip] = 1
            else:
                ip_addresses[ip] += 1
        except AttributeError:
            pass
    return {
        'ips': ip_addresses,
        'numPackets': num_packets
    }

app = Flask(__name__)


@app.route('/tasks', methods = ['GET'])
def get_tasks():
    """End Point For Getting Google Tasks"""
    return jsonify('tasks', [])

@app.route('/computer-stats', methods = ['GET'])
def get_computer_stats():
    """End Point For Getting Computer Stats"""
    return jsonify('computer-stats', [])

@app.route('/network-stats', methods = ['GET'])
def get_network_stats():
    """End Point For Getting Network Stats"""
    num_packets: int = int(request.args.get('numPackets'))
    packet_info = get_packets(num_packets)
    return jsonify('network-stats', packet_info)


if __name__ == '__main__':
    app.run(debug=True)
