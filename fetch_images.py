import urllib.request
import json
import re

url = "https://jaigurudev-website.vercel.app/en/about/santmat"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # Find next data struct
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', html)
    if match:
        data = json.loads(match.group(1))
        # dump beautifully to see what we have
        with open("next_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print("Wrote next_data.json")
    else:
        print("No NEXT_DATA found")
except Exception as e:
    print("Error:", e)
