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

function createLabelAndInput() {
    $('#generate-button').hide();
    var p = parseInt($('#p').val());
    var q = parseInt($('#q').val());
    var e = parseInt($('#e').val());

    if (!p || !q || !e) {
        alert("P, Q, and E must be set");
        $('#generate-button').show();
        return;
    } else if (p == q) {
        alert("P and Q cannot be equal to each other");
        $('#generate-button').show();
        return;
    } else if (p < 43 || q < 43 || e < 43) {
        alert("Choose larger prime numbers");
        $('#generate-button').show();
        return;
    } else if (!isPrime(p) || !isPrime(q) || !isPrime(e)) {
        alert("P, Q, and E must be prime numbers");
        $('#generate-button').show();
        return;
    } else if (gcd(e, (p - 1) * (q - 1)) !== 1) {
        alert("E must be coprime with (P - 1) * (Q - 1)");
        $('#generate-button').show();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/generate',
        data: $('form').serialize(),
        success: function(data) {
            // Create a container div
            var containerDiv = $("<div>", { class: "container" });
    
            // Make a form for encryption
            var encryptionForm = $("<form>", { class: "encryption-form" });
            var public_key_label = $("<label>", { text: "Public Key:", class: "label" });
            var public_key_value = $("<span>", { text: data.public_key, class: "result-value" });
            var private_key_label = $("<label>", { text: "Private Key:", class: "label" });
            var private_key_value = $("<span>", { text: data.private_key, class: "result-value" });
            var inputLabel = $("<label>", { text: "Text to Encrypt:" });
            var inputField = $("<textarea>", { name: "text" });
    
            // Append elements to form
            encryptionForm.append(public_key_label, public_key_value, $("<br>"));
            encryptionForm.append(private_key_label, private_key_value, $("<br>"),$("<br>"),$("<br>"));
            encryptionForm.append(inputLabel, inputField,$("<br>"));
    
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
                        var resultLabel = $("<label>", { text: "Encrypted Text:", class: "result-label" });
                        var resultValue = $("<textarea>", { text: data.encrypted_text, class: "result-value" });
                        var lineBreak = $("<br>");
    
                        containerDiv.append(resultLabel, resultValue, lineBreak,$("<br>"),$("<br>"));
    
                        // Form for decryption
                        var decryptionForm = $("<form>");
                        var decryptionLabel = $("<label>", { text: "Encrypted Text to Decrypt:" });
                        var decryptionField = $("<textarea>", { name: "encrypted_text" });
                        decryptionForm.append(decryptionLabel, decryptionField);
    
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
    
                                    containerDiv.append($("<br>"),$("<br>"),decryptedLabel, decryptedValue, lineBreak2);
                                }
                            });
                        });
    
                        var lineBreak3 = $("<br>");
                        containerDiv.append(decryptionForm, decryptButton, lineBreak3);
                    }
                });
            });
    
            containerDiv.append(encryptionForm, $("<br>"));

            var refreshButton = $("<button>", {text: "Refresh Page",class: "refresh-button",
                click: function() {
                    location.reload();
                }
            });

            $("body").append(containerDiv,$("<br>"),refreshButton,$("<br>"));
        }
    });
}