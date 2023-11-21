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



# # Path: decimal
# def generate_keys(p, q, e):
#     # n = p × q:
#     n = p * q
#     # φ(n) = (p−1) × (q−1):
#     phi_n = (p - 1) * (q - 1)
#     # d × e ≡ 1 (modφ(n)):
#     d = pow(e, -1, phi_n)
#     # return public,private key
#     return (e, n), (d, phi_n)

# def encrypt(text, public_key):
#     #unpacks the public key into two variables,
#     p1, p2 = public_key

    
#     # Encrypting Each Character:
#     #     The for loop iterates over each character in the input text.
#     #     For each character, ord(char) converts the character to its Unicode code point.
#     #     pow(ord(char), p1, p2) raises the Unicode value to the power of p1 (the public exponent e) and takes the result modulo p2 (the modulus n).
#     #     make it to each character!
    
#     unicode_values = []
#     for char in text:
#         unicode_values.append(pow(ord(char), p1, p2))

#     #make them text
#     encrypted_text = ' '.join(str(v) for v in unicode_values)

#     return encrypted_text

# def decrypt(text, private_key, public_key):
#     # This line unpacks the private exponent d from private_key into p1 and the modulus n from public_key into p2. 
#     p1, p2 = private_key[0], public_key[1]

#     # The next line split it into a list of Unicode values.
#     decrypted_text = text.split()

#     final_text = ""
#     #  Each encrypted character is first converted to an integer, then raised to the power of p1 (the private exponent d) 
#     #  and reduced modulo p2 (the modulus n). This is the RSA decryption step.
#     #  Finally, the integer is converted back to a character and added to the final text.
#     for i in decrypted_text:
#         i = pow(int(i), p1, p2)
#         i = chr(i)
#         final_text += i
        
#     return final_text
