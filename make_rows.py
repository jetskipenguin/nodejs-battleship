sample = '''<tr>
            
            <td id="10"></td>
            <td id="20"></td>
            <td id="30"></td>
            <td id="40"></td>
            <td id="50"></td>
            <td id="60"></td>
            <td id="70"></td>
            <td id="80"></td>
            <td id="90"></td>
        </tr>'''

for i in range(0, 10):
    print("<tr>")
    for j in range(0, 10):
        print(f"    <td id=\"E{j}{i}\"></td>")
    print("</tr>")