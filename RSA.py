def generate_keys(p, q, e):
    n = p * q
    On = (p - 1) * (q - 1)
    d = pow(e, -1, On)
    return (hex(e), hex(n)), (hex(d), hex(On))


def encrypt(text, public_key):
    p1 = int(public_key[0], base=16)
    p2 = int(public_key[1], base=16)

    unicode_values = []
    for char in text:
        unicode_values.append(hex(pow(ord(char), p1, p2)))

    encrypted_text = ''.join(str(v) for v in unicode_values)

    return encrypted_text


def decrypt(text, private_key, public_key):
    p1 = int(private_key[0], base=16)
    p2 = int(public_key[1], base=16)

    decrypted_text = text.split("0x")
    decrypted_text = decrypted_text[1:]

    final_text = ""
    for char in decrypted_text:
        char = int(char, base=16)
        char = pow(int(char), p1, p2)
        char = chr(char)
        final_text += char

    return final_text