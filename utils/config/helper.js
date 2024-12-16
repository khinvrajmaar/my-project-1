// Function to generate a 6-digit OTP
const generateOTP = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (otp, number) => {
  const myHeaders = new Headers();
  myHeaders.append(
    "authorization",
    "XmLx6bkt9Qz7WrvnBoKYdsOhpPU4SiA0u2Mc3DVjaZGCHyewNF0mJCOaohMfHqENbdI9FQsZjVW1z6Xp"
  );
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    route: "otp",
    variables_values: otp,
    numbers: number,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://www.fast2sms.com/dev/bulkV2",
      requestOptions
    );
    const result = await response.text();
  } catch (error) {
    console.error("Error Sending OTP:", error);
  }
};

module.exports = { generateOTP, sendOtp };
