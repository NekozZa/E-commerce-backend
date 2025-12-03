const authClient = require("../clients/authClient");
const emailClient = require("../clients/emailClient");

const register = async (email, callbackURL, password) => {
  try {
    // Use provided password or fetch from auth service
    const finalPassword = password || (await authClient.getPassword(email));

    await emailClient.sendEmail(
      email,
      `
                <h2>Hello,</h2>
                <p>Your temporary password is: <b>${finalPassword}</b></p>
                <p>Click this link to verify your registration: <a href="${callbackURL}">${callbackURL}</a></p>
            `
    );

    return { status: 201, data: "Password is sent" };
  } catch (err) {
    if (err.response) {
      return { status: err.response.status, data: err.response.data.error };
    }

    return {
      status: 500,
      data: "Registration Manager: Can't communicate with clients",
    };
  }
};

const reset = async (email, callbackURL) => {
  try {
    const token = await authClient.getResetPasswordToken(email);
    await emailClient.sendEmail(
      email,
      `
                <h2>Hello,</h2>
                <p>Click this <a href="${callbackURL}?token=${token}">link</a> to reset your password</p>
            `
    );

    return { status: 201, data: "Token is sent" };
  } catch (err) {
    if (err.response) {
      return { status: err.response.status, data: err.response.data.error };
    }

    return {
      status: 500,
      data: "Registration Manager: Can't communicate with clients",
    };
  }
};

module.exports = {
  register,
  reset,
};
