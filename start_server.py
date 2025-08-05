#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# ポート番号
PORT = 8888

# 現在のディレクトリに移動
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.json'):
            return 'application/json'
        return mimetype

try:
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 サーバーが起動しました！")
        print(f"📍 URL: http://localhost:{PORT}")
        print(f"📁 ディレクトリ: {os.getcwd()}")
        print("🛑 停止するには Ctrl+C を押してください")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 サーバーを停止しました")
    sys.exit(0)
except Exception as e:
    print(f"❌ エラー: {e}")
    sys.exit(1)