const c = "AZERTYUIOPQSDFGHJKLMWXCVBN1234567890azertyuiopqsdfghjklmwxcvbn?./+=:;,-)!(&";

function generatePassword(event) {
    event.preventDefault();
    let password = "";
    const longueur = Math.floor(Math.random() * (32 - 12 + 1)) + 12;
    for (let i = 0; i < longueur; i++) {
        password += c[Math.floor(Math.random() * c.length)];
    }
    //input.value = password;
    console.log(password);
    document.querySelector("#password").value = password;
}

function changePasswordVisibility() {
    let passwordInput = document.getElementById('password');
    let icon = document.querySelector('.password-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = 'visibility';
    } else {
        passwordInput.type = 'password';
        icon.textContent = 'visibility_off';
    }
}

function copyToClipboard() {
    let passwordInput = document.getElementById('password');
    // Select the content
    passwordInput.select();
    // Set the selection range to ensure all text is selected
    passwordInput.setSelectionRange(0, 99999);

    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(passwordInput.value)
        .then(() => {
            console.log('Password copied to clipboard');
        })
        .catch(err => {
            console.error('Error in copying text: ', err);
        });
}
