"""Module that acts as a backend service for the Dashboard"""
import platform
from flask import Flask, jsonify, request
from gpuinfo import GPUInfo
import psutil
import pyshark

DEFAULT_PACKETS_TO_SNIFF = 100

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


@app.route('/test', methods = ['GET'])
def testMethod():
    return jsonify({'a':1})
@app.route('/tasks', methods = ['GET'])
def get_tasks():
    """End Point For Getting Google Tasks"""
    response = jsonify('tasks', [])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/computer-stats', methods = ['GET'])
def get_computer_stats():
    """End Point For Getting Computer Stats"""
    data = {}
    # Static
    data['platform'] = platform.platform()
    data['system'] = platform.system()

    # GPU
    gpu_info = GPUInfo.get_info()
    data['gpu_total'] = sum(gpu_info[2])
    data['gpu_used'] = sum(gpu_info[1])
    data['gpu_percent'] = sum(gpu_info[1])/sum(gpu_info[2])

    # CPU
    data['cpu_percent'] = psutil.cpu_percent()
    data['cpu_count'] = psutil.cpu_count()
    data['cpu'] = platform.processor()

    # RAM
    ram = psutil.virtual_memory()
    data['ram_total'] = ram.total
    data['ram_used'] = ram.used
    data['ram_percent'] = ram.percent

    return jsonify(data)

@app.route('/network-stats', methods = ['GET'])
def get_network_stats():
    """End Point For Getting Network Stats"""
    num_packets = request.args.get('numPackets')
    if num_packets is None:
        num_packets = DEFAULT_PACKETS_TO_SNIFF
    else:
        num_packets = int(num_packets)
    packet_info = get_packets(num_packets)
    return jsonify(packet_info)


if __name__ == '__main__':
    app.run(debug=True)
