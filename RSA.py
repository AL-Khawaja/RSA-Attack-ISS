def generate_keys(p, q, e):
    n = p * q
    phi = (p - 1) * (q - 1)
    d = e ** -1 % phi 
    return (hex(e), hex(n)), (hex(d), hex(phi))


def encrypt(plain_text, public_key):
    p1 = int(public_key[0], base=16)
    p2 = int(public_key[1], base=16)

    unicode_values = []
    for char in plain_text:
        unicode_values.append(hex(ord(char) ** p1% p2))

    encrypted_text = ''.join(str(v) for v in unicode_values)

    return encrypted_text


def decrypt(cipher_text, private_key, public_key):
    p1 = int(private_key[0], base=16)
    p2 = int(public_key[1], base=16)

    decrypted_text = text.split("0x")
    decrypted_text = decrypted_text[1:]

    text = ""
    for char in decrypted_text:
        char = int(char, base=16)
        char = int(char) ** p1%p2
        char = chr(char)
        text += char

    return text



