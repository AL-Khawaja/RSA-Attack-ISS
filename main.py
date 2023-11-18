from flask import Flask, render_template, request, jsonify
import RSA

app = Flask(__name__)

public_key = None
private_key = None


@app.route("/")
def index():
    return render_template("index.html")


@app.route('/generate', methods=['POST'])
def generate_keys():
    global public_key
    global private_key
    p = int(request.form['p'])
    q = int(request.form['q'])
    e = int(request.form['e'])

    public_key, private_key = RSA.generate_keys(p, q, e)

    return jsonify({'public_key': public_key, 'private_key': private_key})


@app.route('/encrypt', methods=['POST'])
def encrypt():
    text = request.form['text']

    encrypted_text = RSA.encrypt(text, public_key)

    return jsonify({'encrypted_text': encrypted_text})


@app.route('/decrypt', methods=['POST'])
def decrypt():
    encrypted_text = request.form['encrypted_text']

    decrypted_text = RSA.decrypt(encrypted_text, private_key, public_key)

    return jsonify({'decrypted_text': decrypted_text})

#local
if __name__ == "__main__":
    app.run(debug=True)
#online
# if __name__ == "__main__":
#     app.run(debug=False,host='0.0.0.0')
