const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/


function isEmailValid(email) {
  return new Promise((resolve, reject) => {


    // Check if the email is defined and not too long
    if (!email || email.length > 254) reject(false);

    // Use a single regex check for the standard email parts
    if (!emailRegex.test(email)) reject(false);

    // Split once and perform length checks on the parts
    const parts = email.split("@");
    if (parts[0].length > 64) reject(false);

    // Perform length checks on domain parts
    const domainParts = parts[1].split(".");
    if (domainParts.some(part => part.length > 63)) reject(false);

    // If all checks pass, the email is valid
    resolve(true);
  })
}
module.exports = isEmailValid;