"""Module that acts as a backend service for the Dashboard"""
import platform
import os
from flask import Flask, jsonify, request
from gpuinfo import GPUInfo
import psutil
import pyshark
from flask_cors import CORS

# Google
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

app = Flask(__name__)
CORS(app, supports_credentials=True)


DEFAULT_PACKETS_TO_SNIFF = 100
SCOPES = ["https://www.googleapis.com/auth/tasks.readonly"]

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

@app.route('/tasks', methods = ['GET'])
def get_tasks():
    """End Point For Getting Google Tasks"""
    creds = None
    # Setup credientials
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server()
            print(creds.to_json())
    with open("token.json", "w", encoding = "utf-8") as token:
        token.write(creds.to_json())

    try:
        service = build("tasks", "v1", credentials=creds)

        # Get task list
        tasklists = service.tasklists().list(maxResults=10).execute() # pylint: disable=no-member
        items = tasklists.get("items", [])

        tuples = []
        for t in items:
            tasks = service.tasks().list(tasklist=t['id']).execute() # pylint: disable=no-member
            tuples.append((t, tasks['items']))
    except HttpError as err:
        return err



    response = jsonify(tuples)
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
