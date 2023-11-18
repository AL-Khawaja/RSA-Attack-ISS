
def generate_prime_number(length):


    
 
def mod_inverse(key,phi):
     publickey = pow(key, -1, phi)
     return publickey
 
    
def encrypte(plain_text,public_key,n):
    cipher_text=plain_text + public_key % n
    return cipher_text

def decripte(cipher_text,public_key,n):
    kprime=n-public_key
    plain_text=cipher_text-public_key % n
    return plain_text


A = generate_prime_number(1000)
B = generate_prime_number(1000)

def generatekey(p,q,key):
    n=p*q #two prime number 
    phi=(p-1)*(q-1) 
    return key,n,phi

    

