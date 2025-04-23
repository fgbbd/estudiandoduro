from flask import flask, request
from github import Github

app = __name__

@app.route('/pr', methods=['POST'])
def pr():
    """Json: {"frase": frase}"""
    data = request.get_json()
    frase = data['frase']

    



