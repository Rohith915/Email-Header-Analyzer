import re

def analyze_headers(headers):
    analysis = {}

    analysis["SPF"] = headers.get("Received-SPF", "No SPF record found")
    
    dkim_record = headers.get("Authentication-Results", "No DKIM record found")
    analysis["DKIM"] = "pass" if "dkim=pass" in dkim_record else "fail"

    dmarc_record = headers.get("Authentication-Results", "No DMARC record found")
    analysis["DMARC"] = "pass" if "dmarc=pass" in dmarc_record else "fail"

    received_headers = headers.get("Received", "")
    ip_match = re.findall(r"\[([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)\]", received_headers)
    analysis["IP"] = ip_match[0] if ip_match else "Unknown"

    return analysis
