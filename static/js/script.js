function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    var sqrtNum = Math.floor(Math.sqrt(num));
    for (var i = 3; i <= sqrtNum; i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}

function areCoprime(a, b) {
    return gcd(a, b) === 1;
}

//function that transfer every character to hex in its own
function textToHex(text) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
        result += "0x" + text.charCodeAt(i).toString(16);
        if (i < text.length - 1) {
            result += "0x";
        }
    }
    return result;
}

function createLabelAndInput() {
    $('#generate-button').hide();
    var p = parseInt($('#p').val());
    var q = parseInt($('#q').val());
    
    // Check if there is a val for p and q
    if (isNaN(p) || isNaN(q)) {
        alert("P and Q must be set");
        $('#generate-button').show();
        return;
    } else if (p == q) {
        alert("P and Q cannot be equal to each other");
        $('#generate-button').show();
        return;
    } else if (p < 43 || q < 43 ) {
        alert("Choose larger prime numbers");
        $('#generate-button').show();
        return;
    } else if (!isPrime(p) || !isPrime(q)) {
        alert("P, Q must be prime numbers");
        $('#generate-button').show();
        return;
    }

    var phi = (p - 1) * (q - 1);
    var e;

    // randomly chose e between 1 and phi
    do {
        e = Math.floor(Math.random() * phi) + 1;
    } while (!areCoprime(e, phi));
    console.log(e);


    $.ajax({
        type: 'POST',
        url: '/generate',
        data: $('form').serialize() + '&e=' + e,
        success: function(data) {
            // Create a container div
            var containerDiv = $("<div>", { class: "container" });
    
            // Make a form for encryption
            var encryptionForm = $("<form>", { class: "encryption-form" });
            var label_for_e = $("<label>", { text: "E value is:", class: "label" });
            var span_for_e = $("<span>", { text: e, class: "result-value" });
            var label_for_phi = $("<label>", { text: "φ(n):", class: "label" });
            var span_for_phi = $("<span>", { text: (p-1)*(q-1), class: "result-value" });
            var public_key_label = $("<label>", { text: "Public Key:", class: "label" });
            var public_key_value = $("<span>", { text: data.public_key, class: "result-value" });
            var private_key_label = $("<label>", { text: "Private Key:", class: "label" });
            var private_key_value = $("<span>", { text: data.private_key, class: "result-value" });
            var inputLabel = $("<label>", { text: "Text to Encrypt:" });
            var inputField = $("<textarea>", { name: "text" });
    
            // Append elements to form
            encryptionForm.append(label_for_phi,span_for_phi,$("<br>"));
            encryptionForm.append(label_for_e,span_for_e,$("<br>"),$("<br>"),public_key_label, public_key_value, $("<br>"));
            encryptionForm.append(private_key_label, private_key_value, $("<br>"),$("<br>"),$("<br>"));
            encryptionForm.append(inputLabel,$("<br>"),$("<br>"),inputField,$("<br>"));
    
            // Encrypt button
            var encryptButton = $("<button>", { type: "button", text: "Encrypt", class: "encrypt-button", id: "encrypt-button" });
            encryptionForm.append(encryptButton);
    
            // Encrypt button click event
            encryptButton.on("click", function() {
                $("#encrypt-button").prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: '/encrypt',
                    data: encryptionForm.serialize(),
                    success: function(data) {
                        //transfer inputField to unicode in hex
                        var textv = textToHex(inputField.val());
                        var textLabel = $("<label>", { text: "Text in Hex:", class: "result-label" });
                        var textValue = $("<span>", { text: textv, class: "result-value" });
                        var resultLabel = $("<label>", { text: "Encrypted Text:", class: "result-label" });
                        var resultValue = $("<textarea>", { text: data.encrypted_text, class: "result-value" });
                        var lineBreak = $("<br>");
    
                        containerDiv.append(textLabel,textValue,$("<br>"),$("<br>"),resultLabel,$("<br>"),$("<br>"),resultValue, lineBreak,$("<br>"),$("<br>"));
    
                        // Form for decryption
                        var decryptionForm = $("<form>",{ class: "decryption-form" });
                        var decryptionLabel = $("<label>", { text: "Encrypted Text to Decrypt:" });
                        var decryptionField = $("<textarea>", { name: "encrypted_text" });
                        decryptionForm.append(decryptionLabel, $("<br>"),$("<br>"),decryptionField);
    
                        // Decrypt button
                        var decryptButton = $("<button>", { type: "button", text: "Decrypt", class: "decrypt-button", id: "decrypt-button" });
                        decryptionForm.append(decryptButton);
    
                        // Decrypt button click event
                        decryptButton.on("click", function() {
                            $("#decrypt-button").prop("disabled", true);
                            $.ajax({
                                type: 'POST',
                                url: '/decrypt',
                                data: decryptionForm.serialize(),
                                success: function(data) {
                                    var decryptedLabel = $("<label>", { text: "Decrypted Text:", class: "result-label" });
                                    var decryptedValue = $("<textarea>", { text: data.decrypted_text, class: "result-value",disabled: true });
                                    var lineBreak2 = $("<br>");
    
                                    containerDiv.append($("<br>"),$("<br>"),decryptedLabel,$("<br>"),$("<br>"), decryptedValue, lineBreak2);
                                }
                            });
                        });
    
                        var lineBreak3 = $("<br>");
                        containerDiv.append(decryptionForm, decryptButton, lineBreak3);
                    }
                });
            });
    
            containerDiv.append(encryptionForm, $("<br>"));

            var refreshButton = $("<button>", {text: "Refresh Page",class: "refresh-button",id: "refresh-button",
                click: function() {
                    location.reload();
                }
            });

            $("body").append(containerDiv,$("<br>"),refreshButton,$("<br>"));
        }
    });
}